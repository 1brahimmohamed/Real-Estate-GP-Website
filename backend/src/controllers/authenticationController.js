const User = require('../models/userModel');
const asyncErrorCatching = require('../utils/asyncErrorCatching');
const jwt = require('jsonwebtoken');
const ErrorHandler = require('../utils/errorHandler');


const signToken = id => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
}

exports.signup = asyncErrorCatching(async (req, res) => {
    // const newUser = await User.create({
    //     name: req.body.name,
    //     email: req.body.email,
    //     password: req.body.password,
    //     passwordConfirm: req.body.passwordConfirm
    // });

    const newUser = await User.create(req.body);
    const token = signToken(newUser._id);

    res.status(201).json({
        status: 'success',
        token,
        data: {
            user: newUser
        }
    });
});

exports.login = asyncErrorCatching(async (req, res, next) => {
    const { email, password } = req.body;

    // 1) Check if email and password exist
    if (!email || !password) {
        return next(new ErrorHandler('Please provide email and password', 400));
    }

    // 2) Check if user exists && password is correct
    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.correctPassword(password, user.password))) {
        return next(new ErrorHandler('Incorrect email or password', 401));
    }

   // 3) If everything ok, send token to client
   //  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
   //      expiresIn: process.env.JWT_EXPIRES_IN
   //  });

    const token = signToken(user._id);

    res.status(200).json({
        status: 'success',
        token
    });
});