import { EntitySchema } from 'typeorm';

const Client = new EntitySchema({
    name: 'Client', // Entity name
    tableName: 'clients', // Table name in the database
    columns: {
        id: {
            primary: true,
            type: 'int',
            generated: 'increment',
        },
        name: {
            type: 'varchar',
            length: 255,
        },
        alias: {
            type: 'varchar',
            length: 255,
        },
        is_admin: {
            type: 'int',
            default: 0,
        },
        extension_limit: {
            type: 'int',
            default: 0,
        },
        user_limit: {
            type: 'int',
            default: 0,
        }

    },
});


export default Client;
