import Client from '../models/clientModel.js';
import User from '../models/userModel.js';
import Extension from '../models/extensionModel.js';

import {
    AppDataSource,
} from '../config/database.js';

export const getClients = async (req, res) => {
    try {
        const organization_id = parseInt(req.query.organization_id)
        const isAdmin =  parseInt(req.query.isAdmin)  // Wait for the Promise to resolve
        const page = parseInt(req.query.page, 10) || 1; // Default to page 1
        const limit = parseInt(req.query.limit, 10) || 10; // Default to 10 items per page
        const offset = (page - 1) * limit; // Calculate the offset for the query
        const clientRepository = AppDataSource.getRepository('Client'); // Get repository by entity name\
        // Fetch clients with pagination

        const whereCondition = !isAdmin ? { id: organization_id } : {};
        const [clients, totalItems] = await clientRepository.findAndCount({
            skip: offset, // Skip the records before the current page
            take: limit, // Limit the number of records to fetch
            where: whereCondition, // Apply the flag condition dynamically
        });

        // Return paginated response
        res.json({
            data: clients, // The clients for the current page
            currentPage: page, // The current page number
            totalItems, // Total number of items
            totalPages: Math.ceil(totalItems / limit), // Total number of pages
        });
    } catch (err) {
        console.error('Error fetching clients:', err);
        res.status(500).send('Database error');
    }
};




export const addClient = async (req, res) => {
    let {
        name,
        alias,
        user_limit,
        extension_limit,
    } = req.body; // Get user data from request body
    if (name && alias && user_limit && extension_limit) {
        try {
            await AppDataSource
                .createQueryBuilder()
                .insert()
                .into(Client)
                .values([{
                    name: name,
                    alias: alias,
                    user_limit: user_limit,
                    extension_limit: extension_limit,
                }, ])
                .execute()
            res.status(201).send({
                data: req.body,
                message: "Client added"
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


export const deleteClient = async (req, res) => {
    let {
        id
    } = req.body; // Get user data from request body
    if (id) {
        try {

            // Check if the user exists
            const client = await AppDataSource
                .createQueryBuilder()
                .select("client")
                .from(Client, "client")
                .where("client.id = :id", {
                    id: id
                })
                .getOne();

            if (!client) {
                return res.status(404).send({
                    message: 'Client not found'
                }); // Return 404 if user does not exist
            }


            await AppDataSource
                .createQueryBuilder()
                .delete()
                .from(Client)
                .where("id = :id", {
                    id: id
                })
                .execute()

            deleteUsersAndExtension(id)
            res.status(200).send({
                message: "Client deleted successfully"
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


async function deleteUsersAndExtension(id) {
    // Delete related users
    await AppDataSource
        .createQueryBuilder()
        .delete()
        .from(User)
        .where("organization_id = :id", {
            id
        }) // Adjust the foreign key field if different
        .execute();

    // Delete related extensions
    await AppDataSource
        .createQueryBuilder()
        .delete()
        .from(Extension)
        .where("organization_id = :id", {
            id
        }) // Adjust the foreign key field if different
        .execute();

}