/************************************************************************************
 *
 * File Name  : server.js
 * Description: This file contains the server configuration and the connection to the database
 * Author     : Ibrahim Mohamed
 *
 ************************************************************************************/

// ------------------------------------------   App  ------------------------------------------//
const app = require('./app');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

// ------------------------------------------   Uncaught Exceptions  ------------------------------------------//
process.on('uncaughtException', err => {
    console.log(err.name, err.message);
    console.log('UNCAUGHT EXCEPTION! Shutting down...');
    process.exit(1);

});


dotenv.config({path: './config.env'});

// ------------------------------------------   Database Connection  ------------------------------------------//
const DB = process.env.DATABASE.replace(
    '<PASSWORD>',
    process.env.DATABASE_PASSWORD,
);

mongoose.connect(DB, {}).then(con => {
    console.log('DB connection successful');
});

// ------------------------------------------   Server  ------------------------------------------//
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    console.log(`You are operating on ${process.env.NODE_ENV} enviroment`)
});

// ------------------------------------------   Unhandled Rejections  ------------------------------------------//
process.on('unhandledRejection', err => {
    console.log(err.name, err.message);
    console.log('UNHANDLED REJECTION! Shutting down...');
    server.close(() => {
        process.exit(1);
    });
});


