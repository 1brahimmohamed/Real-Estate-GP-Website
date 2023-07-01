/************************************************************************************
 *
 * File Name  : app.js
 * Description: This file contains the main application file
 * Author     : Ibrahim Mohamed
 *
 ************************************************************************************/

// ------------------------------------------   Imports  ------------------------------------------//
const express = require('express');
const morgan = require('morgan');

const propertyRouter = require('./routes/propertyRoutes');
const userRouter = require('./routes/userRoutes');

const globalErrorHandler = require('./controllers/errorController');
const ErrorHandler = require('./utils/errorHandler');

// ------------------------------------------   App  ------------------------------------------//
const app = express();


if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// ------------------------------------------   Middlewares  ------------------------------------------//

app.use(express.json());
app.use(express.static(`${__dirname}/public`));


// ------------------------------------------   Routes  ------------------------------------------//
app.use('/api/v1/properties', propertyRouter);
app.use('/api/v1/users', userRouter);

// error handling for unhandled routes
app.all('*', (req, res, next) => {
    next( new ErrorHandler(`Can't find ${req.originalUrl} on this server!`, 404) );
});

app.use(globalErrorHandler);

// export app
module.exports = app;