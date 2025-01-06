//users add edit delete is done here
import {
    AppDataSource
} from '../config/database.js';
import 'dotenv/config';
import Extension from '../models/extensionModel.js';
import Client from '../models/clientModel.js';

import {
    getCurrentDateTime
} from '../utils/timeUtils.js'

export const getExtensions = async (req, res) => {
    try {
        const organization_id = parseInt(req.query.organization_id)
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