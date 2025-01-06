//users add edit delete is done here
import {
    AppDataSource
} from '../config/database.js';
import 'dotenv/config';
import Extension from '../models/extensionModel.js';
import Client from '../models/clientModel.js';



export const writeDialplan = async (req, res) => {
    return res.status(402).send({
        message: "Dialplan created"
    });

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