import Client from '../models/clientModel.js';
import User from '../models/userModel.js';
import Extension from '../models/extensionModel.js';
import {
    writeDialplan
} from '../controllers/dialplanController.js';

import {
    AppDataSource,
} from '../config/database.js';

export const getClients = async (req, res) => {
    try {
        const organization_id = parseInt(req.query.organization_id)
        const isAdmin = parseInt(req.query.isAdmin) // Wait for the Promise to resolve
        const page = parseInt(req.query.page, 10) || 1; // Default to page 1
        const limit = parseInt(req.query.limit, 10) || 10; // Default to 10 items per page
        const offset = (page - 1) * limit; // Calculate the offset for the query
        const clientRepository = AppDataSource.getRepository('Client'); // Get repository by entity name\
        // Fetch clients with pagination

        const whereCondition = !isAdmin ? {
            id: organization_id
        } : {};
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
            const result = await AppDataSource
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

            if (result && result.identifiers.length > 0) {
                try {
                    await createInternalTable(alias);
                    await createExternalTable(alias);
                    if(req.hostname!='localhost'){
                        await createRecordingFolder(alias);
                        writeDialplan()
                    }
                 
                    res.status(201).send({
                        data: req.body,
                        message: "Client added"
                    })
                } catch (tableError) {
                    console.error('Error creating table:', tableError);
                    res.status(500).send({
                        message: 'Client added, but table creation failed',
                    });
                }
            } else {
                res.status(500).send({
                    message: 'Failed to add client',
                });
            }
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

            const result = await AppDataSource
                .createQueryBuilder()
                .delete()
                .from(Client)
                .where("id = :id", {
                    id: id
                })
                .execute()
            if (result && result.affected > 0) {
                try {
                    await deleteUsersAndExtension(id);
                    await dropTable(client.alias);
                    if(req.hostname!='localhost'){
                        writeDialplan()
                    }

                    res.status(200).send({
                        message: "Client deleted successfully"
                    })
                } catch (tableError) {
                    console.error('Error deleting  client:', tableError);
                    res.status(500).send({
                        message: 'Client deletion failed',
                    });
                }
            } else {
                res.status(500).send({
                    message: 'Failed to delete client',
                });
            }


        } catch (err) {
            console.log(err);
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


async function createInternalTable(aliasName) {
    const sqlInternal = `
        CREATE TABLE IF NOT EXISTS \`${aliasName}_internal_call_logs\` (
            \`id\` int(11) NOT NULL AUTO_INCREMENT,
            \`call_type\` varchar(10) DEFAULT NULL,
            \`caller_id\` varchar(20) DEFAULT NULL,
            \`destination\` varchar(20) DEFAULT NULL,
            \`disposition\` varchar(255) DEFAULT NULL,
            \`recording\` varchar(255) DEFAULT NULL,
            \`start_time\` datetime DEFAULT NULL,
            \`end_time\` datetime DEFAULT NULL,
            \`duration\` int(11) DEFAULT NULL,
            PRIMARY KEY (\`id\`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
    `;

    try {
        await AppDataSource.query(sqlInternal);
    } catch (error) {
        console.error('Error creating table:', error);
    }

}

async function createExternalTable(aliasName) {
    const sqlExternal = `
        CREATE TABLE IF NOT EXISTS \`${aliasName}_call_logs\` (
            \`id\` int(11) NOT NULL AUTO_INCREMENT,
            \`call_type\` varchar(10) DEFAULT NULL,
            \`caller_id\` varchar(20) DEFAULT NULL,
            \`destination\` varchar(20) DEFAULT NULL,
            \`disposition\` varchar(255) DEFAULT NULL,
            \`recording\` varchar(255) DEFAULT NULL,
            \`start_time\` datetime DEFAULT NULL,
            \`end_time\` datetime DEFAULT NULL,
            \`duration\` int(11) DEFAULT NULL,
            PRIMARY KEY (\`id\`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
    `;

    try {
        await AppDataSource.query(sqlExternal);
    } catch (error) {
        console.error('Error creating table:', error);
    }
}

async function dropTable(alias) {
    const tableName = `${alias}_call_logs`;
    const tableNameInt = `${alias}_internal_call_logs`;

    const sql = `DROP TABLE IF EXISTS \`${tableName}\``;
    const sqlInt = `DROP TABLE IF EXISTS \`${tableNameInt}\``;

    try {
        console.log(`Dropping table: ${tableName}`);
        await AppDataSource.query(sql);
        console.log(`Dropping table: ${tableNameInt}`);
        await AppDataSource.query(sqlInt);
        console.log(`Tables ${tableName} and ${tableNameInt} dropped successfully`);
    } catch (error) {
        console.error('Error dropping tables:', error);
    }
}


async function createRecordingFolder(folder) {
    const folderPath = path.join('/var/spool/asterisk/monitor/', folder);
    
    try {
        // Check if the folder exists using fs.promises.access
        await fs.access(folderPath);
    } catch (error) {
        // If folder does not exist, create it
        await fs.mkdir(folderPath, { mode: 0o777, recursive: true });
    }
}
