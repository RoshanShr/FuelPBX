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
    relations: {
        organization: {
            target: 'Client', // Name of the related entity
            type: 'many-to-one', // Relationship type
            joinColumn: { name: 'organization_id' }, // Column used for the join
        },
    },
});

export default Extension;