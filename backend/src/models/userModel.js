import { EntitySchema } from 'typeorm';

const User = new EntitySchema({
    name: 'User', // Entity name
    tableName: 'users', // Table name in the database
    columns: {
        id: {
            primary: true,
            type: 'int',
            generated: 'increment',
        },
        fullname: {
            type: 'varchar',
            length: 255,
        },
        login_name: {
            type: 'varchar',
            length: 255,
        },
        username: {
            type: 'varchar',
            length: 255,
        },
        
        email: {
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

export default User;

// const db = require('../config/database');

// module.exports = class User {

//     constructor(id, username, email, password) {
//         this.id = id;
//         this.username = username;
//         this.email = email;
//         this.password = password;

//     }

//      register() {
//         return new Promise((resolve, reject) => {
//             db.query(`INSERT INTO pbx_users (username,email, password) values ('${this.username}','${this.email}','${this.password}')`, (err, results) => {
//                 if (err) {
//                     console.error('Error executing query:', err);
//                     return reject(err); // Reject the promise with the error
//                 }
//                 resolve(results); // Resolve the promise with the results
//             });
//         });

//     }

//     static fetchAll() {
//         return new Promise((resolve, reject) => {
//             db.query('SELECT * FROM pbx_users', (err, results) => {
//                 if (err) {
//                     console.error('Error executing query:', err);
//                     return reject(err); // Reject the promise with the error
//                 }
//                 resolve(results); // Resolve the promise with the results
//             });
//         });
//     }

// }