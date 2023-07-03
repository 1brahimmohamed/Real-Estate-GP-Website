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
const authController = require('./../controllers/authenticationController');

router.post('/signup', authController.signup);
router.post('/login', authController.login);

router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

router.patch(
    '/updateMe',
    authController.protect,
    userController.updateMe
);

router.delete(
    '/deleteMe',
    authController.protect,
    userController.deleteMe
);

router.patch(
    '/updatePassword',
    authController.protect,
    authController.updatePassword
);

// get all users, create a user
router
    .route('/')
    .get(
        // authController.protect,
        // authController.restrictTo('admin'),
        userController.getAllUsers
    )
    .post(userController.createUser);

// get user, update user, delete user
router
    .route('/:id')
    .get(userController.getUser)
    .patch(
        authController.protect,
        userController.updateUser
    )
    .delete(
        authController.protect,
        authController.restrictTo('admin'),
        userController.deleteUser
    );

// export the router
module.exports = router;
