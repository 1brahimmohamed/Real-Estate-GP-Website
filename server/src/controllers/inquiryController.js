const Inquiry = require('../models/inquiryModel');
const asyncErrorCatching = require('../utils/asyncErrorCatching');
const ErrorHandler = require('../utils/errorHandler');

exports.getAllInquiries = asyncErrorCatching(async (req, res, next) => {

    const inquiries = await Inquiry.find().sort({ createdAt: 'desc' });

    res.status(200).json({
        status: 'success',
        results: inquiries.length,
        data: {
            inquiries
        }
    });
});

exports.getInquiry = asyncErrorCatching(async (req, res, next) => {

    const inquiry = await Inquiry.findById(req.params.id);

    if (!inquiry) {
        return next(new ErrorHandler('No inquiry found with that ID', 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            inquiry
        }
    });

});

exports.createInquiry = asyncErrorCatching(async (req, res, next) => {

    const inquiry = await Inquiry.create(req.body);

    res.status(201).json({
        status: 'success',
        data: {
            inquiry
        }
    });
});

exports.getUserInquiries = asyncErrorCatching(async (req, res, next) => {

    const inquiries = await Inquiry.find({user: req.user.id});

    res.status(200).json({
        status: 'success',
        results: inquiries.length,
        data: {
            inquiries
        }
    });
});



exports.getPropertyInquiries = asyncErrorCatching(async (req, res, next) => {

    const inquiries = await Inquiry.find({property: req.params.id});

    res.status(200).json({
        status: 'success',
        results: inquiries.length,
        data: {
            inquiries
        }
    });
});