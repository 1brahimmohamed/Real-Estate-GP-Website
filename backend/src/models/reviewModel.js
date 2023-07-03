const moongose = require('mongoose');

const reviewSchema = new moongose.Schema({
    review: {
        type: String,
        required: true
    },

    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
    },

    user: {
        type: moongose.Schema.ObjectId,
        required: [true, 'Review must belong to a user'],
        ref: 'User'
    },

    property: {
        type: moongose.Schema.ObjectId,
        required: [true, 'Review must belong to a property'],
        ref: 'Property'
    },

    createdAt: {
        type: Date,
        default: Date.now
    },

},{
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

reviewSchema.pre(/^find/, function(next) {
    this.populate({
        path: 'property',
        select: 'name'
    }).populate({
        path: 'user',
        select: 'name'
    })

    next();
});

const Review = moongose.model('Review', reviewSchema);

module.exports = Review;