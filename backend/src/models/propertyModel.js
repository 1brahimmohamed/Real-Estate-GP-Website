/************************************************************************************
 *
 * File Name  : propertyModel.js
 * Description: This file contains the mongoose schema and model for the property
 * Author     : Ibrahim Mohamed
 *
 ************************************************************************************/

const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');

/**
 * @module mongoose
 * @class propertySchema
 * @description This is the mongoose database schema for the property entity
 */
const propertySchema = new mongoose.Schema({

    name: {
        type: String,
        required: [true, 'A property must have a name'],
        unique: true,
        trim: true,
        maxlength: [40, 'A property name must have less or equal then 40 characters'],
        minlength: [10, 'A property name must have more or equal then 10 characters'],
    },

    slug: String,

    price: {
        type: Number,
        required: [true, 'A property must have a price'],
    },

    offer: {
        type: Number,
        validate: {
            validator: function (val) {
                // this only points to current doc on NEW document creation
                return val < this.price;
            },
            message: 'Offer price ({VALUE}) should be below regular price',
        }

    },

    city: {
        type: String,
        required: [true, 'A property must have a city'],
    },

    area: {
        type: String,
        required: [true, 'A property must have a area'],
    },

    address: {
        type: String,
        required: [true, 'A property must have an address'],
    },

    type: {
        type: String,
        required: [true, 'A property must have a type'],
        trim: true,
        enum : {
            values: ['apartment', 'house', 'office', 'villa'],
            message: 'Property type is either: apartment, house, office, villa',
        }
    },

    rooms: {
        type: Number,
        required: [true, 'A property must have a number of rooms'],
    },

    floor: {
        type: Number,
    },

    duplex: {
        type: Boolean,
    },
    description: {
        type: String,
        trim: true,
    },

    ratingAverage: {
        type: Number,
        default: 0,
        min: [1, 'Rating must be above 1.0'],
        max: [5, 'Rating must be below 5.0'],
    },

    ratingQuantity: {
        type: Number,
        default: 0,
    },

    createdAt: {
        type: Date,
        default: Date.now(),
        select: false,
    },

    specialProperty: {
        type: Boolean,
        default: false,
    },

    images: {
        type: [String],
        required: [true, 'A property must have at least one image'],
    },

},{
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});

/**
 * @module mongoose
 * @class propertySchema
 * @description vitual property to get the property's price in millions
 */
propertySchema.virtual('priceMillions').get(function () {
    return this.price / 1000000;
});


// DOCUMENT MIDDLEWARE: runs before .save() and .create()
propertySchema.pre('save', function (next) {
    this.slug = slugify(this.name, { lower: true });
    next();
});

// QUERY MIDDLEWARE: runs before any .find() query
propertySchema.pre(/^find/, function (next) {
    this.find({ specialProperty: { $ne: true } });
    next();
});

// AGGREGATION MIDDLEWARE: runs before any .aggregate() query
propertySchema.pre('aggregate', function (next) {
    this.pipeline().unshift({ $match: { specialProperty: { $ne: true } } });
    next();
});

// create the property model
const Property = mongoose.model('Property', propertySchema);

// export the property model
module.exports = Property;
