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


// get all properties, create a property
router
    .route('/')
    .get(propertyController.getAllProperties)
    .post(propertyController.createProperty);

// get property stats
router
    .route('/propertyStats')
    .get(propertyController.getPropertyStats);

// get property, update property, delete property
router
    .route('/:id')
    .get(propertyController.getProperty)
    .patch(propertyController.updateProperty)
    .delete(propertyController.deleteProperty);


// export the router
module.exports = router;