import { EntitySchema } from 'typeorm';

const Extension = new EntitySchema({
    name: 'Extension', // Entity name
    tableName: 'extensions', // Table name in the database
    columns: {
        id: {
            primary: true,
            type: 'int',
            generated: 'increment',
        },
        agent: {
            type: 'varchar',
            length: 255,
        },
        extension: {
            type: 'varchar',
            length: 255,
        },
        password: {
            type: 'varchar',
            length: 255,
        },
        organization_id: {
            type: 'int',
        },
        created_at: {
            type: 'datetime',
        },
    },
});

export default Extension;