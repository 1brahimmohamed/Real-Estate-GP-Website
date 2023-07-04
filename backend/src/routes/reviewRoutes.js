const express = require('express');

const reviewController = require('../controllers/reviewController');
const authenticationController = require('../controllers/authenticationController');

const router = express.Router();


router.get(
    '/getUserReviews',
    authenticationController.protect,
    reviewController.getUserReviews
);

router.get(
    '/getPropertyReviews/:id',
    reviewController.getPropertyReviews
)


router
    .route('/')
    .get(reviewController.getAllReviews)
    .post(
        authenticationController.protect,
        authenticationController.restrictTo('user'),
        reviewController.createReview
    );

router
    .route('/:id')
    .get(reviewController.getReview)
    .delete(
        authenticationController.protect,
        authenticationController.restrictTo('user', 'admin'),
        reviewController.deleteReview
    );




module.exports = router;