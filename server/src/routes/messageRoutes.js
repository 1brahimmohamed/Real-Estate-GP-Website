const express = require('express');
const messageController = require('./../controllers/messageController');
const authenticationController = require('./../controllers/authenticationController');
const router = express.Router();

router.route('/')
    .get(
        messageController.getAllMessages
    )
    .post(
        messageController.createMessage
    );

router.route('/:id')
    .get(
        messageController.getMessage
    )

module.exports = router;