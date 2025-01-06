
require('dotenv').config();

const mysql = require("mysql");
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

// Connection for Database 2
const db2 = mysql.createConnection({
    host: process.env.DB2_HOST,
    user: process.env.DB2_USER,
    password: process.env.DB2_PASSWORD,
    database: process.env.DB2_NAME,
});


db.connect((err) => {
    if (err) {
        console.error('Error connecting to the Database 1:', err);
        process.exit(1); // Exit the process if unable to connect
    }
    console.log('Connected to the MySQL Database 1.');
});

// Connect to Database 2
db2.connect((err) => {
    if (err) {
        console.error('Error connecting to Database 2:', err);
        process.exit(1); // Exit the process if unable to connect
    }
    console.log('Connected to Database 2.');
});


module.exports = { db1, db2 };
//globally defining db connection to use in every file with importing the m
// global.db = db;
