//users add edit delete is done here
import {
    AppDataSource
} from '../config/database.js';
import 'dotenv/config';
import Extension from '../models/extensionModel.js';
import Client from '../models/clientModel.js';
import {
    writeDialplan
} from '../controllers/dialplanController.js';
import { exec } from 'child_process';


import {
    getCurrentDateTime
} from '../utils/timeUtils.js'

export const getExtensions = async (req, res) => {
    try {
        const organization_id = parseInt(req.query.organization_id)
        const alias = req.query.alias;
        const page = parseInt(req.query.page, 10) || 1; // Default to page 1
        const limit = parseInt(req.query.limit, 10) || 10; // Default to 10 items per page
        const offset = (page - 1) * limit; // Calculate the offset for the query

        const extensionRepository = AppDataSource.getRepository('Extension'); // Get repository by entity name
        const [extensions, totalItems] = await extensionRepository.findAndCount({
            where: {
                organization_id: organization_id, // Filter extensions by client_id
            },
            skip: offset, // Skip the records before the current page
            take: limit, // Limit the number of records to fetch
        });


        for (let key = 0; key < extensions.length; key++) {
            if (req.hostname == 'localhost') {
                extensions[key].status = 'Offline'; // Default to 'Offline' if error occurs
            } else {
                const ext = extensions[key];
                const agent = `${ext.extension}_${alias}`;
                const command = `sudo /usr/sbin/asterisk -rx 'sip show peer ${agent}'`;
                try {
                    // Use a promise-based approach to exec the command
                    const output = await executeCommand(command);
                    const checkStatus = output[56] ?.split(':');

                    // Check if the status is '(null)' and set status accordingly
                    if (checkStatus && checkStatus[1] && checkStatus[1].trim() === '(null)') {
                        extensions[key].status = 'Offline';
                    } else {
                        extensions[key].status = 'Online';
                    }
                } catch (error) {
                    console.error('Error checking SIP peer status:', error);
                    extensions[key].status = 'Offliness'+ error; // Default to 'Offline' if error occurs
                }
            }
        }
        // Return paginated response
        res.json({
            data: extensions, // The clients for the current page
            currentPage: page, // The current page number
            totalItems, // Total number of items
            totalPages: Math.ceil(totalItems / limit), // Total number of pages
        });
    } catch (err) {
        console.error('Error fetching extensions:', err);
        res.status(500).send('Database error');
    }
};

// Function to execute command and return output as an array of strings
function executeCommand(command) {
    return new Promise((resolve, reject) => {
        exec(command, {
            shell: '/bin/bash'
        }, (error, stdout, stderr) => {
            if (error) {
                reject(error);
                return;
            }
            if (stderr) {
                console.error(stderr);
            }
            resolve(stdout.split('\n')); // Split output by newlines and return as an array
        });
    });
}


export const addExtension = async (req, res) => {
    let {
        organization_id,
        agent,
        extension,
        password
    } = req.body; // Get user data from request body
    if (organization_id && agent && extension && password) {
        try {
            const checkLimit = await AppDataSource
                .getRepository(Client)
                .findOne({
                    where: {
                        id: organization_id
                    },
                    select: ["extension_limit"],
                });

            const countExtension = await AppDataSource
                .getRepository(Extension)
                .count({
                    where: {
                        organization_id: organization_id // Add your condition here
                    }
                });


            if (countExtension >= checkLimit.extension_limit) {
                return res.status(402).send({
                    message: "Extension limit exceeded"
                });
            }


            await AppDataSource
                .createQueryBuilder()
                .insert()
                .into(Extension)
                .values([{
                    organization_id: organization_id,
                    agent: agent,
                    extension: extension,
                    password: password,
                    created_at: getCurrentDateTime
                }, ])
                .execute()
            if (req.hostname != 'localhost') {
                writeDialplan()
            }
            res.status(201).send({
                message: "Extension added"
            })
        } catch (err) {
            console.log(err);
            res.status(500).send({
                message: "Some Problem"
            })
        }
    } else {
        res.status(500).send('Fields are missing'); // Handle errors appropriately

    }
}



export const updateExtension = async (req, res) => {
    let {
        id,
        organization_id,
        agent,
        extension,
        password
    } = req.body; // Get user data from request body
    if (id) {
        try {
            const existingExtension = await AppDataSource
                .getRepository(Extension)
                .findOne({
                    where: {
                        id: id
                    }
                });

            if (!existingExtension) {
                return res.status(404).send({
                    message: "Extension not found"
                });
            }

            // Update fields
            existingExtension.organization_id = organization_id || existingExtension.organization_id;
            existingExtension.agent = agent || existingExtension.agent;
            existingExtension.extension = extension || existingExtension.extension;
            existingExtension.password = password || existingExtension.password;

            try {
                await AppDataSource.getRepository(Extension).save(existingExtension);
                if (req.hostname != 'localhost') {
                    writeDialplan()
                }
                res.status(200).send({
                    message: "Extension updated successfully"
                });
            } catch (err) {
                console.error(err);
                res.status(500).send({
                    message: "Some Problem"
                });
            }
        } catch (err) {
            console.error('Error in updateUser:', err);
            res.status(500).send('Database error');
        }
    } else {
        res.status(400).send('Extension ID is required');
    }
};

export const deleteExtension = async (req, res) => {
    let {
        id
    } = req.body; // Get user data from request body
    if (id) {
        try {

            // Check if the user exists
            const user = await AppDataSource
                .createQueryBuilder()
                .select("extension")
                .from(Extension, "extension")
                .where("extension.id = :id", {
                    id: id
                })
                .getOne();

            if (!user) {
                return res.status(404).send({
                    message: 'Extension not found'
                }); // Return 404 if user does not exist
            }

            await AppDataSource
                .createQueryBuilder()
                .delete()
                .from(Extension)
                .where("id = :id", {
                    id: id
                })
                .execute()
            if (req.hostname != 'localhost') {
                writeDialplan()
            }
            res.status(200).send({
                message: "404 deleted successfully"
            })
        } catch (err) {
            res.status(500).send({
                message: "Some Problem"
            })
        }
    } else {
        res.status(500).send('Id is missing'); // Handle errors appropriately

    }
}