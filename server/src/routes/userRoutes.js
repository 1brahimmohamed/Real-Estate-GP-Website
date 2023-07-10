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
const authenticationController = require('./../controllers/authenticationController');



// ------------------------------------------   User Operations done by user ------------------------------ //


router.post('/signup', authenticationController.signup);
router.post('/login', authenticationController.login);
router.post('/logout', authenticationController.logout);

router.post('/forgotPassword', authenticationController.forgotPassword);
router.patch('/resetPassword/:token', authenticationController.resetPassword);


// update user data
router.patch(
    '/updateMe',
    authenticationController.protect,
    userController.updateMe
);

// delete user account
router.delete(
    '/deleteMe',
    authenticationController.protect,
    userController.deleteMe
);

// update user password
router.patch(
    '/updatePassword',
    authenticationController.protect,
    authenticationController.updatePassword
);

router.patch(
    '/addToWishlist/:id',
    authenticationController.protect,
    userController.addToWishlist
);

router.patch(
    '/removeFromWishlist/:id',
    authenticationController.protect,
    userController.removeFromWishlist
);
// ------------------------------------------   User Operations done by admin ------------------------------ //

// get all users, create a user
router
    .route('/')
    .get(
        authenticationController.protect,
        authenticationController.restrictTo('admin'),
        userController.getAllUsers
    )
    .post(userController.createUser);

// get user, update user, delete user
router
    .route('/:id')
    .get(
        authenticationController.protect,
        authenticationController.restrictTo('admin'),
        userController.getUser
    )
    .patch(
        authenticationController.protect,
        authenticationController.restrictTo('admin'),
        userController.updateUser
    )
    .delete(
        authenticationController.protect,
        authenticationController.restrictTo('admin'),
        userController.deleteUser
    );



// export the router
module.exports = router;
