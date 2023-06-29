const User = require('../models/userModel');
const asyncErrorCatching = require('../utils/asyncErrorCatching');
const ErrorHandler = require('../utils/errorHandler');

exports.getAllUsers = asyncErrorCatching(async (req, res, next) => {
    // Execute the query
    const users = await User.find();

    // Send response
    res.status(200).json({
        status: 'success',
        results: users.length,
        data: {
            users
        }
    });
});

exports.getUser = asyncErrorCatching(async (req, res, next) => {
    const id = parseInt(req.params.id);
    const user = usersData.find(user => user.id === id);

    res.status(200).json({
        status: 'success',
        data: {
            user
        }
    });
});

exports.updateUser = asyncErrorCatching(async (req, res, next) => {
    res.status(200).json({
        status: 'success',
        data: {
            user: '<Updated user>'
        }
    });
});

exports.deleteUser = asyncErrorCatching(async (req, res, next) => {
    res.status(204).json({
        status: 'success',
        data: null
    });
});

exports.createUser = asyncErrorCatching(async (req, res, next) => {
    console.log(req.body);
    res.send('Done');
});
