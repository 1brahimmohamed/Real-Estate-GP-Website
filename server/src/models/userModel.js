const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

/**
 * @module mongoose
 * @class userSchema
 * @description This is the mongoose database schema for the user entity
 */
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'A user must have a name'],
        trim: true,
        maxlength: [40, 'A user name must have less or equal than 40 characters'],
        minlength: [8, 'A user name must have more or equal than 10 characters']
    },

    email: {
        type: String,
        required: [true, 'A user must have an email'],
        unique: [true, 'There is already a user with this email'],
        trim: true,
        lowercase: true,
        validate: validator.isEmail
    },
    password: {
        type: String,
        required: [true, 'A user must have a password'],
        trim: true,
        minlength: [8, 'A user password must have more or equal than 8 characters'],
        select: false
    },
    passwordConfirm: {
        type: String,
        required: [true, 'A user must have a password confirmation'],

        // This only works on CREATE and SAVE!!!
        validate: {
            validator: function (el) {
                return el === this.password;
            },
            message: 'Passwords are not the same!'
        }
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    image: String,
    dateOfBirth: {
        type: Date,
        required: [true, 'A user must have a date of birth'],
    },
    address: {
        type: String,
    },
    phoneNumber: {
        type: String,
        unique: true,
        required: [true, 'A user must have a phone number'],
        validate: validator.isMobilePhone
    },
    nationality: {
        type: String,
        enum: ['Egyptian', 'Non-Egyptian']
    },
    nationalID: {
        unique: true,
        length: [14, 'A user national ID must be 14 numbers'],
        type: String,
        required: [true, 'A user must have a national ID'],
        validate: validator.isNumeric
    },
    job: {
        type: String,
        // required: [true, 'A user must have a job'],
    },
    salary: Number,
    maritalStatus: {
        type: String,
        // required: [true, 'A user must have a marital status'],
        enum: {
            values: ['single', 'married', 'divorced', 'widowed'],
            message: 'Marital status is either: single, married, divorced, widowed',
        }
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    gender: {
        type: String,
        enum: ['male', 'female'],
    },

    active: {
        type: Boolean,
        default: true,
    },

    savedProperties: [
        {
            type: mongoose.Schema.ObjectId,
            ref: 'Property'
        }
    ],

}, {
    toJSON: {virtuals: true},
    toObject: {virtuals: true}
});

/**
 * @module mongoose
 * @class userSchema
 * @description virtual property to get the age of the user
 */
userSchema.virtual('age').get(function () {
    return Date.now() - this.dateOfBirth;
});

// DOCUMENT MIDDLEWARE: runs before .save() and .create()
userSchema.pre('save', function (next) {
    if (!this.isModified('password')) return next();
    // hash the password with cost of 12
    this.password = bcrypt.hashSync(this.password, 12);
    // delete the passwordConfirm field
    this.passwordConfirm = undefined;
    next();
});

userSchema.pre('save', function (next) {
    if (!this.isModified('password') || this.isNew) return next();

    // -1000 is to make sure the token is created after the password is changed
    this.passwordChangedAt = Date.now() - 1000;
    next();
});

userSchema.pre('save', function (next) {
    this.populate({
        path: 'savedProperties',
        select: 'name'
    })
    next();
});

// QUERY MIDDLEWARE: runs before any .find() query
userSchema.pre(/^find/, function (next) {
    // this points to the current query
    // this.find({active: {$ne: false}});
    next();
});

userSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'savedProperties',
        select: 'name'
    })
    next();
});


/**
 * @module mongoose
 * @class userSchema
 * @description instance method to check if the password is correct
 * @param candidatePassword
 * @param userPassword
 * @returns {Promise<*>}
 */
userSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);
}

/**
 * @module mongoose
 * @class userSchema
 * @description instance method to check if the password is changed after the token is issued
 * @param JWTTimestamp
 * @returns {boolean}
 */
userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {

    if (this.passwordChangedAt) {
        const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);

        return JWTTimestamp < changedTimestamp;
    }

    // False means NOT changed
    return false;
}

/**
 * @module mongoose
 * @class userSchema
 * @description instance method to create a password reset token
 * @returns {string}
 */
userSchema.methods.createPasswordResetToken = function () {
    const resetToken = crypto.randomBytes(32).toString('hex');

    this.passwordResetToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');

    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

    return resetToken;
}

// Create the user model
const User = mongoose.model('User', userSchema);

// Export the user model
module.exports = User;