import 'dotenv/config';

import {
    DataSource
} from 'typeorm';
import User from '../models/userModel.js';
import Client from '../models/clientModel.js';
import Reports from '../models/reportsModel.js';
import Extension from '../models/extensionModel.js';

export const AppDataSource = new DataSource({
    type: 'mysql', // or your preferred database type
    host: process.env.DB_HOST, // Database host
    port: 3306, // MySQL port
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: true, // Automatically sync schema (use false in production)
    //  logging: true, // Enable logging (optional)
    entities: [User, Client,Reports,Extension], // Register your entity here
});

// export const AppDataSource2 = new DataSource({
//     type: 'mysql', // or your preferred database type
//     host: process.env.DB2_HOST, // Database host
//     port: 3306, // MySQL port
//     username: process.env.DB2_USER,
//     password: process.env.DB2_PASSWORD,
//     database: process.env.DB2_NAME,
//     synchronize: true, // Automatically sync schema (use false in production)
//     //  logging: true, // Enable logging (optional)
//     entities: [Reports], // Register your entity here
// });

AppDataSource.initialize()
    .then(() => {
        console.log('Data Source initialized successfully');
    })
    .catch((err) => {
        console.error('Error during Data Source initialization:', err);
    });

    
// AppDataSource2.initialize()
// .then(() => {
//     console.log('Database 2 initialized successfully');
// })
// .catch((err) => {
//     console.error('Error during Database 2 initialization:', err);
// });