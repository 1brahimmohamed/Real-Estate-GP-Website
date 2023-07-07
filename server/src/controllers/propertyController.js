/************************************************************************************
 *
 * File Name  : propertyController.js
 * Description: This file contains the controller functions for the property model
 * Author     : Ibrahim Mohamed
 *
 ************************************************************************************/


const Property = require('../models/propertyModel');
const APIOperations = require('../utils/APIOperations');
const asyncErrorCatching = require('../utils/asyncErrorCatching');
const ErrorHandler = require('../utils/errorHandler');

/**
 * @desc    Get all properties
 * @type {(function(*, *, *): void)|*}
 * @route   GET /api/v1/properties
 * @access  Public
 */
exports.getAllProperties = asyncErrorCatching(async (req, res, next) => {

    // Do the filtering, sorting, limiting and pagination
    const operations = new APIOperations(Property.find(), req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate();

    // Execute the query
    const properties = await operations.query;

    // Send response
    res.status(200).json({
        status: 'success',
        results: properties.length,
        data: {
            properties
        }
    });
});

/**
 * @desc    Get property by ID
 * @type {(function(*, *, *): void)|*}
 * @route   GET /api/v1/properties/:id
 * @access  Public
 */
exports.getProperty = asyncErrorCatching(async (req, res, next) => {

    // Find the property by ID
    const property = await Property.findById(req.params.id);

    // Check if the property exists
    if (!property) {
        return  next(new ErrorHandler('No property found with that ID', 404));
    }

    // Send response
    res.status(200).json({
        status: 'success',
        data: {
            property
        }
    });

});

/**
 * @desc    Update property by ID
 * @type {(function(*, *, *): void)|*}
 * @route   PATCH /api/v1/properties/:id
 * @access  Private
 */
exports.updateProperty = asyncErrorCatching(async (req, res, next) => {

    // Find the property by ID and update it
    const property = await Property.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    })

    // Check if the property exists
    if (!property) {
        return  next(new ErrorHandler('No property found with that ID', 404));
    }

    // Send response
    res.status(200).json({
        status: 'success',
        data: {
            property
        }
    });

});

/**
 * @desc    Delete property by ID
 * @type {(function(*, *, *): void)|*}
 * @route   DELETE /api/v1/properties/:id
 * @access  Private
 */
exports.deleteProperty = asyncErrorCatching(async (req, res, next) => {

    // Find the property by ID and delete it
    const property = await Property.findByIdAndDelete(req.params.id);

    // Check if the property exists
    if (!property) {
        return  next(new ErrorHandler('No property found with that ID', 404));
    }

    // Send response
    res.status(204).json({
        status: 'success',
        data: null
    });

});

/**
 * @desc    Create new property
 * @type {(function(*, *, *): void)|*}
 * @route   POST /api/v1/properties
 * @access  Private
 */
exports.createProperty = asyncErrorCatching(async (req, res, next) => {

    // Create new property
    const newProperty = await Property.create(req.body);

    // Send response
    res.status(201).json({
        status: 'success',
        data: {
            property: newProperty
        }
    });

});


/**
 * @desc    Get property stats
 * @type {(function(*, *, *): void)|*}
 * @route   GET /api/v1/properties/stats
 * @access  private
 */
exports.getPropertyStats = asyncErrorCatching(async (req, res, next) => {

    // Get the stats
    const stats = await Property.aggregate([
        {
            $match: {ratingAverage: {$gte: 4.0}}
        },
        {
            $group: {
                _id: '$city',
                numProperties: {$sum: 1},
                numRatings: {$sum: '$ratingAverage'},
                avgRating: {$avg: '$ratingAverage'},
                avgPrice: {$avg: '$price'},
                minPrice: {$min: '$price'},
                maxPrice: {$max: '$price'},
            }
        },
    ]);

    // Send response
    res.status(201).json({
        status: 'success',
        data: {
            stats
        }
    });

});
