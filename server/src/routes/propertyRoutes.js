/************************************************************************************
 *
 * File Name  : propertyRoutes.js
 * Description: This file contains the router for the property data
 * Author     : Ibrahim Mohamed
 *
 ************************************************************************************/

const express = require("express");
const router = express.Router();
const propertyController = require('./../controllers/propertyController');
const authenticationController = require('./../controllers/authenticationController');

// get all properties, create a property
router
    .route('/')
    .get(propertyController.getAllProperties)
    .post(
        authenticationController.protect,
        authenticationController.restrictTo('admin'),
        propertyController.createProperty
    );

// get property stats
router
    .route('/propertyStats')
    .get(
        authenticationController.protect,
        authenticationController.restrictTo('admin'),
        propertyController.getPropertyStats
    );

// get property, update property, delete property
router
    .route('/:id')
    .get(propertyController.getProperty)
    .patch(
        authenticationController.protect,
        authenticationController.restrictTo('admin'),
        propertyController.updateProperty
    )
    .delete(
        authenticationController.protect,
        authenticationController.restrictTo('admin'),
        propertyController.deleteProperty
    );


// export the router
module.exports = router;