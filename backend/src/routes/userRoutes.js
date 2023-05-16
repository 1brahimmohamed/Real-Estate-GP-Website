/************************************************************************************
 *
 * File Name  : userRoutes.js
 * Description: This file contains the router for the users' data
 * Author     : Ibrahim Mohamed
 *
 ************************************************************************************/

const express = require("express");
const router = express.Router();
const userController = require('./../controllers/userController');

router.param('id', userController.checkID);

// get all users, create a user
router
    .route('/')
    .get(userController.getAllUsers)
    .post(userController.checkBody, userController.createUser);

// get user, update user, delete user
router
    .route('/:id')
    .get(userController.getUser)
    .patch(userController.updateUser)
    .delete(userController.deleteUser);

// export the router
module.exports = router;
