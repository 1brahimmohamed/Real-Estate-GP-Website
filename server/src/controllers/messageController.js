const Message = require('../models/messageModel');
const asyncErrorCatching = require('../utils/asyncErrorCatching');
const ErrorHandler = require('../utils/errorHandler');

exports.getAllMessages = asyncErrorCatching(async (req, res, next) => {

    const messages = await Message.find();

    res.status(200).json({
        status: 'success',
        results: messages.length,
        data: {
            messages
        }
    });
});

exports.getMessage = asyncErrorCatching(async (req, res, next) => {

    const message = await Message.findById(req.params.id);

    if (!message) {
        return next(new ErrorHandler('No Message found with that ID', 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            message
        }
    });

});

exports.createMessage = asyncErrorCatching(async (req, res, next) => {

    const message = await Message.create(req.body);

    res.status(201).json({
        status: 'success',
        data: {
            message
        }
    });
});

exports.updateMessage = asyncErrorCatching(async (req, res, next) => {


    const message = await Message.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    if (!message) {
        return next(new ErrorHandler('No Message found with that ID', 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            message
        }
    });
});

