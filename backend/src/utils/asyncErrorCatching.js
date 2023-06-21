/************************************************************************************
 *
 * File Name  : asyncErrorCatching.js
 * Description: This file contains the asyncErrorCatching function which is used to catch errors in async functions
 * Author     : Ibrahim Mohamed
 *
 ************************************************************************************/

/**
 * @name asyncErrorCatching
 * @description This function is used to catch errors in async functions
 * @param fn
 * @returns {(function(*, *, *): void)|*}
 */
const asyncErrorCatching = fn => {

    // return the function if no error, else catch the error and pass it to the next middleware
    return (req, res, next) => {
        fn(req, res, next).catch(next);
    };
}

// export the asyncErrorCatching function
module.exports = asyncErrorCatching;