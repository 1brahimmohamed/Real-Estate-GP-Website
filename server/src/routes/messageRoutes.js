const express = require('express');
const messageController = require('./../controllers/messageController');
const authenticationController = require('./../controllers/authenticationController');
const router = express.Router();

router.route('/')
    .get(
        authenticationController.protect,
        authenticationController.restrictTo('admin'),
        messageController.getAllMessages
    )
    .post(
        messageController.createMessage
    );

router.route('/:id')
    .get(
        authenticationController.protect,
        authenticationController.restrictTo('admin'),
        messageController.getMessage
    )
    .patch(
        authenticationController.protect,
        authenticationController.restrictTo('admin'),
        messageController.updateMessage,
    )

module.exports = router;