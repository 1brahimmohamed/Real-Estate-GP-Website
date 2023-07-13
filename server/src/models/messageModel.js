const moongose = require('mongoose');
const validator = require('validator');

const MessageSchema = new moongose.Schema({
    name: {
        type: String,
        required: [true, 'Message must belong to a user']
    },

    email: {
        type: String,
        validate: validator.isEmail,
        required: [true, 'Message must have an email']
    },

    subject: {
        type: String,
        default: 'No subject'
    },

    message: {
        type: String,
        required: [true, 'Message must have a message']
    },

    status: {
        type: String,
        enum: ['pending', 'responded', 'rejected'],
        default: 'pending'
    },

    createdAt: {
        type: Date,
        default: Date.now()
    },

},{
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

const Message = moongose.model('Message', MessageSchema);

module.exports = Message;