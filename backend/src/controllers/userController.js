const User = require('../models/userModel');
const asyncErrorCatching = require('../utils/asyncErrorCatching');
const ErrorHandler = require('../utils/errorHandler');


const filterRequestObject = (obj, ...allowedFields) => {
    const newObj = {};
    Object.keys(obj).forEach(el => {
        if (allowedFields.includes(el)) {
            newObj[el] = obj[el];
        }
    });
    return newObj;
};

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

exports.updateMe = asyncErrorCatching(async (req, res, next) => {
    // 1) Create error if user POSTs password data
    if (req.body.password || req.body.passwordConfirm) {
        return next(
            new ErrorHandler(
                'This route is not for password updates. Please use /updateMyPassword.',
                400
            )
        );
    }

    // 2) Filter out unwanted fields names that are not allowed to be updated
    const filteredBody = filterRequestObject(req.body,
        'name', 'email', 'image','address', 'phoneNumber', 'job', 'salary', 'maritalStatus');

    // 3) Update user document
    const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
        new: true,
        runValidators: true
    });

    // 4) Send response
    res.status(200).json({
        status: 'success',
        data: {
            user: updatedUser
        }
    });
});

exports.deleteMe = asyncErrorCatching(async (req, res, next) => {
    await User.findByIdAndUpdate(req.user.id, {
        active: false
    });

    res.status(204).json({
        status: 'success',
        data: null
    });
});