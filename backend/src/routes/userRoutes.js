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



// ------------------------------------------   User Operations done by user ------------------------------ //


router.post('/signup', authController.signup);
router.post('/login', authController.login);

router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);


// update user data
router.patch(
    '/updateMe',
    authController.protect,
    userController.updateMe
);

// delete user account
router.delete(
    '/deleteMe',
    authController.protect,
    userController.deleteMe
);

// update user password
router.patch(
    '/updatePassword',
    authController.protect,
    authController.updatePassword
);

router.patch(
    '/addToWishlist/:id',
    authController.protect,
    userController.addToWishlist
);

router.patch(
    '/removeFromWishlist/:id',
    authController.protect,
    userController.removeFromWishlist
);
// ------------------------------------------   User Operations done by admin ------------------------------ //

// get all users, create a user
router
    .route('/')
    .get(
        authController.protect,
        authController.restrictTo('admin'),
        userController.getAllUsers
    )
    .post(userController.createUser);

// get user, update user, delete user
router
    .route('/:id')
    .get(
        authController.protect,
        authController.restrictTo('admin'),
        userController.getUser
    )
    .patch(
        authController.protect,
        authController.restrictTo('admin'),
        userController.updateUser
    )
    .delete(
        authController.protect,
        authController.restrictTo('admin'),
        userController.deleteUser
    );



// export the router
module.exports = router;
