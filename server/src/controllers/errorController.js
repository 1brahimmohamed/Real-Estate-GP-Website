/************************************************************************************
 *
 * File Name  : errorController.js
 * Description: This file contains the error handling middleware functions
 * Author     : Ibrahim Mohamed
 *
 ************************************************************************************/

const ErrorHandler = require('../utils/errorHandler');
const fs = require('fs');
const path = require('path');

/**
 * function: handleCastErrorDB
 * @param err
 * @returns {ErrorHandler}
 * @description: This function handles the cast error
 **/
const handleCastErrorDB = err => {
    const message = `Invalid ${err.path}: ${err.value}.`;
    return new ErrorHandler(message, 400);
};


/**
 * function: handleDuplicateFieldsDB
 * @param err
 * @returns {ErrorHandler}
 * @description: This function handles the duplicate fields error
 */
const handleDuplicateFieldsDB = err => {
    const value = err.keyValue.name;
    const message = `Duplicate field value: ${value}. Please use another value!`;
    return new ErrorHandler(message, 400);
};


/**
 * function: handleValidationErrorDB
 * @param err
 * @returns {ErrorHandler}
 * @description: This function handles the validation error
 */
const handleValidationErrorDB = err => {
    const errors = Object.values(err.errors).map(el => el.message);
    const message = `Invalid input data. ${errors.join('. ')}`;
    return new ErrorHandler(message, 400);
};


/**
* function: handleJWTError
* @returns {ErrorHandler}
* @description: This function handles the invalidJWT error
*/
const handleJWTError = __ => new ErrorHandler("Invalid token, please log in again!", 401);


/**
 * function: handleJWTExpiredError
 * @returns {ErrorHandler}
 * @description: This function handles the expired JWT error
 */
const handleJWTExpiredError = __ => new ErrorHandler("Your session has expired, please log in again!", 401);


/**
 * function: sendErrorDev
 * @param err
 * @param req
 * @param res
 * @description: This function sends the error in development mode
 */
const sendErrorDev = (err, req, res) => {
    if (req.originalUrl.startsWith('/api')) {
        return res.status(err.statusCode).json({
            status: err.status,
            error: err,
            stack: err.stack,
            message: err.message
        });
    }
    else {
        return res.status(err.statusCode).render('website/404', {
            title: 'Something went wrong!',
            msg: err.message
        });
    }
};

/**
 * function: sendErrorProd
 * @param err
 * @param req
 * @param res
 * @description: This function sends the error in production mode
 */
const sendErrorProd = (err, req, res) => {
    if (req.originalUrl.startsWith('/api'))
    {    // Operational, trusted error: send message to client
        if (err.isOperational) {
            return res.status(err.statusCode).json({
                status: err.status,
                message: err.message
            });
        }
        // Programming or other unknown error: don't leak error details
        else {
            return res.status(500).json({
                status: 'error',
                message: 'Something went wrong!'
            });
        }
    }
    else {
        return res.status(err.statusCode).render('website/404', {
            title: 'Something went wrong!',
            msg: err.message
        });
    }
};


/**
 * function: globalErrorHandler
 * @param err
 * @param req
 * @param res
 * @param next
 * @description: This function is the global error handler
 */
module.exports = (err, req, res, next) => {

    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if (process.env.NODE_ENV === 'development') sendErrorDev(err, req, res);

    else if (process.env.NODE_ENV === 'production'){
        let error = {...err};

        if (error.kind === 'ObjectId')              error = handleCastErrorDB(error);
        if (error.code === 11000)                   error = handleDuplicateFieldsDB(error);
        if (error._message === 'Validation failed') error = handleValidationErrorDB(error);
        if (error.name === 'JsonWebTokenError')     error = handleJWTError(error);
        if (error.name === 'TokenExpiredError')     error = handleJWTExpiredError();

        sendErrorProd(error, req, res)
    }
};
