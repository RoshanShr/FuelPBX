import { EntitySchema } from 'typeorm';

const Report =  new EntitySchema({
    name: 'Reports', // Entity name
    tableName: 'report', // Table name in the database
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
        }
    },
});

export default Report;
