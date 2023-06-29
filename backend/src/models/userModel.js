const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'A user must have a name'],
        trim: true,
        maxlength: [40, 'A user name must have less or equal than 40 characters'],
        minlength: [10, 'A user name must have more or equal than 10 characters']
    },
    email: {
        type: String,
        required: [true, 'A user must have an email'],
        unique: true,
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
        required: [true, 'A user must have a phone number'],
        validate: validator.isMobilePhone
    },

    nationality: {
        type: String,
        enum: ['Egyptian', 'Non-Egyptian']
    },

    nationalID: {
        type: String,
        required: [true, 'A user must have a national ID'],
        validate: validator.isNumeric
    },

    job: {
        type: String,
        required: [true, 'A user must have a job'],
    },

    salary: Number,

    maritalStatus: {
        type: String,
        required: [true, 'A user must have a marital status'],
        enum: {
            values: ['single', 'married', 'divorced', 'widowed'],
            message: 'Marital status is either: single, married, divorced, widowed',
        }
    },

},{
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

userSchema.virtual('age').get(function() {
    return Date.now() - this.dateOfBirth;
});

userSchema.pre('save', function(next) {
    if (!this.isModified('password')) return next();
    // hash the password with cost of 12
    this.password = bcrypt.hashSync(this.password, 12);
    // delete the passwordConfirm field
    this.passwordConfirm = undefined;
    next();
});

userSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);
}

const User = mongoose.model('User', userSchema);

module.exports = User;