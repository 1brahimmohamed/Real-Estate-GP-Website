/************************************************************************************
 *
 * File Name  : errorHandler.js
 * Description: This file contains the ErrorHandler class which is used to handle custom errors
 * Author     : Ibrahim Mohamed
 *
 ************************************************************************************/

/**
 * @name ErrorHandler
 * @description This class is used to handle custom errors
 * @param message
 * @param statusCode
 * @description This class is used to handle custom errors
 */
class ErrorHandler extends Error {
    constructor(message, statusCode) {

        // call the parent constructor
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.isOperational = true;

        // capture the stack trace
        Error.captureStackTrace(this, this.constructor);
    }
}

// export the ErrorHandler class
module.exports = ErrorHandler;