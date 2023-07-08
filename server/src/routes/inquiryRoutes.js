const express = require('express');
const inquiryController = require('../controllers/inquiryController');
const authenticationController = require('./../controllers/authenticationController');
const router = express.Router();


router.get('/userInquiries',
    authenticationController.protect,
    authenticationController.restrictTo('user'),
    inquiryController.getUserInquiries
);

router.get('/propertyInquiries/:id',
    authenticationController.protect,
    authenticationController.restrictTo('admin'),
    inquiryController.getPropertyInquiries
);

router.route('/')
    .get(
        authenticationController.protect,
        authenticationController.restrictTo('admin'),
        inquiryController.getAllInquiries
    )
    .post(
        authenticationController.protect,
        authenticationController.restrictTo('user'),
        inquiryController.createInquiry
    );

router.route('/:id')
    .get(
        authenticationController.protect,
        authenticationController.restrictTo('admin'),
        inquiryController.getInquiry
    )

module.exports = router;