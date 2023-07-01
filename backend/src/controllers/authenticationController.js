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

exports.protect = asyncErrorCatching(async (req, res, next) => {
    let token;

    // Read the token and check if it exists
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ){
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token)
        return next(new ErrorHandler('You are not logged in! Please log in to get access.', 401));

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded);

    // Check if user still exists
    const newUser = await User.findById(decoded.id);

    if (!newUser)
        return next(
            new ErrorHandler(
                'The user belonging to this token does no longer exist.',
                401
            )
        );

    // Check if user changed password after the token was issued
    if (newUser.changedPasswordAfter(decoded.iat)){
        return next(
            new ErrorHandler(
                'User recently changed password! Please log in again.',
                401
            )
        );
    }

    // Grant accesses to protected route
    req.user = newUser;

    next();
})