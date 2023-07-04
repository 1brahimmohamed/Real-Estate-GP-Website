const moongose = require('mongoose');

const InquirySchema = new moongose.Schema({
    property: {
        type: moongose.Schema.ObjectId,
        ref: 'property',
        required: [true, 'Inquiry must belong to a property']
    },
    user: {
        type: moongose.Schema.ObjectId,
        ref: 'user',
        required: [true, 'Inquiry must belong to a user']
    },

    message: {
        type: String,
    },

    status: {
        type: String,
        enum: ['pending', 'resolved', 'rejected'],
    },

    createdAt: {
        type: Date,
        default: Date.now()
    },

},{
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

InquirySchema.pre(/^find/, function(next) {
    this.populate({
        path: 'property',
        select: 'name'
    }).populate({
        path: 'user',
        select: 'name'
    })

    next();
});

const Inquiry = moongose.model('Inquiry', InquirySchema);

module.exports = Inquiry;