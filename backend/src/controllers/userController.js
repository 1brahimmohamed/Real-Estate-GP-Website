const User = require('../models/userModel');
const asyncErrorCatching = require('../utils/asyncErrorCatching');
const ErrorHandler = require('../utils/errorHandler');
const Property = require("../models/propertyModel");


/**
 * @name  filterRequestObject
 * @param obj
 * @param allowedFields
 * @description Filter out unwanted fields names that are not allowed to be updated
 * @returns {Object}
 */
const filterRequestObject = (obj, ...allowedFields) => {
    const newObj = {};
    Object.keys(obj).forEach(el => {
        if (allowedFields.includes(el)) {
            newObj[el] = obj[el];
        }
    });
    return newObj;
};

/**
 * @desc    Get all users (admin)
 * @route   GET /api/v1/users
 * @access  private
 * @type {(function(*, *, *): void)|*}
 */
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

/**
 * @desc    Get user by ID (admin)
 * @route   GET /api/v1/users/:id
 * @access  private
 * @type {(function(*, *, *): void)|*}
 */
exports.getUser = asyncErrorCatching(async (req, res, next) => {
    // Find the user by ID
    const user = await User.findById(req.params.id);

    // Check if the user exists
    if (!user) {
        return next(new ErrorHandler('No user found with that ID', 404));
    }

    // Send response
    res.status(200).json({
        status: 'success',
        data: {
            user
        }
    });
});

/**
 * @desc    Update user by ID (admin)
 * @route   PATCH /api/v1/users/:id
 * @access  private
 * @type {(function(*, *, *): void)|*}
 */
exports.updateUser = asyncErrorCatching(async (req, res, next) => {

    // Find the user by ID and update it
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    })

    // Check if the user exists
    if (!user) {
        return next(
            new ErrorHandler(
                'No user found with that ID',
                404
            )
        );
    }

    // Send response
    res.status(200).json({
        status: 'success',
        data: {
            user
        }
    });
});

/**
 * @desc    Delete user by ID (admin)
 * @route   DELETE /api/v1/users/:id
 * @access  private
 * @type {(function(*, *, *): void)|*}
 */
exports.deleteUser = asyncErrorCatching(async (req, res, next) => {
    // Find the user by ID and delete it
    const user = await User.findByIdAndDelete(req.params.id);

    // Check if the user exists
    if (!user) {
        return  next(
            new ErrorHandler(
                'No property found with that ID',
                404
            )
        );
    }

    // Send response
    res.status(204).json({
        status: 'success',
        data: null
    });
});


/**
 * @desc create user
 * @route POST /api/v1/users
 * @access private
 * @type {(function(*, *, *): void)|*}
 */
exports.createUser = asyncErrorCatching(async (req, res, next) => {
    // Create new user
    const newUser = await User.create(req.body);

    // Send response
    res.status(201).json({
        status: 'success',
        data: {
            user: newUser
        }
    });
});

/**
 * @desc    update user by user
 * @route   PATCH /api/v1/users/updateMe
 * @access  private
 * @type {(function(*, *, *): void)|*}
 */
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
        'name', 'email', 'image', 'address', 'phoneNumber', 'job', 'salary', 'maritalStatus');

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

/**
 * @desc    delete user by user
 * @route   DELETE /api/v1/users/deleteMe
 * @access  private
 * @type {(function(*, *, *): void)|*}
 */
exports.deleteMe = asyncErrorCatching(async (req, res, next) => {
    await User.findByIdAndUpdate(req.user.id, {
        active: false
    });

    res.status(204).json({
        status: 'success',
        data: null
    });
});