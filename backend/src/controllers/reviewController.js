const Review = require('../models/reviewModel');
const asyncErrorCatching = require('../utils/asyncErrorCatching');
const errorHandler = require('../utils/errorHandler');

exports.getAllReviews = asyncErrorCatching(async (req, res, next) => {
    const reviews = await Review.find();

    res.status(200).json({
        status: 'success',
        results: reviews.length,
        data: {
            reviews
        }
    });
});

exports.createReview = asyncErrorCatching(async (req, res, next) => {
    const newReview = await Review.create(req.body);

    res.status(201).json({
        status: 'success',
        data: {
            review: newReview
        }
    });
});

exports.getReview = asyncErrorCatching(async (req, res, next) => {
    const review = await Review.findById(req.params.id);

    if (!review) {
        return next(
            errorHandler(
                'No review found with that ID',
                404
            )
        );
    }

    res.status(200).json({
        status: 'success',
        data: {
            review
        }
    });
});

exports.deleteReview = asyncErrorCatching(async (req, res, next) => {
    const review = await Review.findByIdAndDelete(req.params.id);

    if (!review) {
        return next(
            errorHandler(
                'No review found with that ID',
                404
            )
        );
    }
    res.status(204).json({
        status: 'success',
        data: null
    });
});

exports.getUserReviews = asyncErrorCatching(async (req, res, next) => {

    console.log(req.user.id)
    const reviews = await Review.find({ user: req.user.id });

    res.status(200).json({
        status: 'success',
        results: reviews.length,
        data: {
            reviews
        }
    });
});


exports.getPropertyReviews = asyncErrorCatching(async (req, res, next) => {
    const reviews = await Review.find({ property: req.params.id });

    res.status(200).json({
        status: 'success',
        results: reviews.length,
        data: {
            reviews
        }
    });
});