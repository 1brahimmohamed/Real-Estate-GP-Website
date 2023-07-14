const User = require('../models/userModel');
const asyncErrorCatching = require('../utils/asyncErrorCatching');
const jwt = require('jsonwebtoken');
const ErrorHandler = require('../utils/errorHandler');
const sendEmail = require('../utils/email');
const crypto = require('crypto');

/**
 * @name signToken
 * @param id
 * @returns {jwt signed token}
 * @description This function signs a jwt token
 */
const signToken = id => {
    return jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
}


/**
 * @name createSendToken
 * @param user
 * @param statusCode
 * @param res
 * @returns {jwt token}
 * @description This function creates and sends a jwt token
 */
const createSendToken = (user, statusCode, res) => {
    const token = signToken(user._id);

    const cookieOptions = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
        httpOnly: true,
    };

    // if we are in production mode, we need to set the cookie to be secure
    if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

    res.cookie('jwt', token, cookieOptions);

    // Remove password from output
    user.password = undefined;

    res.status(statusCode).json({
        status: 'success',
        token,
        data: {
            user
        }
    });
};

/**
 * @name signup
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void>}
 * @description This function signs up a user
 * @type {(function(*, *, *): void)|*}
 */
exports.signup = asyncErrorCatching(async (req, res) => {
    // const newUser = await User.create({
    //     name: req.body.name,
    //     email: req.body.email,
    //     password: req.body.password,
    //     passwordConfirm: req.body.passwordConfirm
    // });

    const newUser = await User.create(req.body);
    createSendToken(newUser, 201, res);
});

/**
 * @name login
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void>}
 * @description This function logs in a user
 * @type {(function(*, *, *): void)|*}
 */
exports.login = asyncErrorCatching(async (req, res, next) => {
    const {email, password} = req.body;

    // 1) Check if email and password exist
    if (!email || !password) {
        return next(new ErrorHandler('Please provide email and password', 400));
    }

    // 2) Check if user exists && password is correct
    const user = await User.findOne({email}).select('+password');

    if (!user || !(await user.correctPassword(password, user.password))) {
        return next(new ErrorHandler('Incorrect email or password', 401));
    }

    // 3) If everything ok, send token to client
    if (!user.active === false)
        createSendToken(user, 200, res);
    else
        return next(new ErrorHandler('Your account is deactivated please contact admin!', 401));
});

/**
 * @name protect
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void>}
 * @description This function protects a route ensuring that only logged in users can access it
 * @type {(function(*, *, *): void)|*}
 */
exports.protect = asyncErrorCatching(async (req, res, next) => {
    let token;

    // Read the token and check if it exists
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.jwt) {
        token = req.cookies.jwt;
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
    if (newUser.changedPasswordAfter(decoded.iat)) {
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


exports.isLoggedIn = asyncErrorCatching(async (req, res, next) => {

    if (req.cookies.jwt) {
        // Verify the token
        const decoded = jwt.verify(
            req.cookies.jwt,
            process.env.JWT_SECRET
        );

        console.log(decoded);

        // Check if user still exists
        const newUser = await User.findById(decoded.id);

        if (!newUser)
            return next();

        // Check if user changed password after the token was issued
        if (newUser.changedPasswordAfter(decoded.iat))
            return next();

        // There is logged-in user
        res.locals.user = newUser;

        return next();
    }
    next();
})


exports.logout = asyncErrorCatching(async (req, res) => {
    res.cookie('jwt', 'loggedout', {
        expires: new Date(Date.now() - 10 * 1000),
        httpOnly: true
    });

    res.status(200).json({status: 'success'});
});

/**
 * @name restrictTo
 * @param roles
 * @returns {(function(*, *, *): (*|undefined))|*}
 * @description This function restricts access to a route based on the user's role
 */
exports.restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(
                new ErrorHandler(
                    'You do not have permission to perform this action',
                    403
                )
            );
        }

        next();
    }
};

/**
 * @name forgotPassword
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void>}
 * @description This function sends a reset token to a user's email
 * @type {(function(*, *, *): void)|*}
 */
exports.forgotPassword = asyncErrorCatching(async (req, res, next) => {
    const user = await User.findOne({email: req.body.email});

    if (!user) return next(new ErrorHandler('There is no user with email address.', 404));

    const resetToken = user.createPasswordResetToken();

    await user.save({validateBeforeSave: false});

    const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`;

    const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: 
    ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;


    console.log(resetToken)

    res.status(200).json({
        status: 'success',
        message: 'Token sent to email!',
        token: resetToken
    });

    // try {
    //     await sendEmail({
    //         email: user.email,
    //         subject: 'Your password reset token (valid for 10 min)',
    //         message: message
    //     });
    //
    //     res.status(200).json({
    //         status: 'success',
    //         message: 'Token sent to email!'
    //     });
    //
    // } catch (err) {
    //     user.passwordResetToken = undefined;
    //     user.passwordResetExpires = undefined;
    //     await user.save({ validateBeforeSave: false });
    //     return next(
    //         new ErrorHandler(
    //             'There was an error sending the email. Try again later!',
    //             500
    //         )
    //     );
    // }
});

/**
 * @name resetPassword
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void>}
 * @description This function resets a user's password
 * @type {(function(*, *, *): void)|*}
 */
exports.resetPassword = asyncErrorCatching(async (req, res, next) => {
    // 1) Get user based on the token
    const hashedToken = crypto
        .createHash('sha256')
        .update(req.params.token)
        .digest('hex');

    const user = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: {$gt: Date.now()}
    });


    if (!user) return next(new ErrorHandler('Token is invalid or has expired', 400));

    // 3) Update changedPasswordAt property for the user
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await user.save();

    // 4) Log the user in, send JWT
    createSendToken(user, 200, res);
});

/**
 * @name updatePassword
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void>}
 * @description This function updates a user's password
 * @type {(function(*, *, *): void)|*}
 */
exports.updatePassword = asyncErrorCatching(async (req, res, next) => {

    // Get user from collection
    const user = await User.findById(req.user.id).select('+password');

    // Check if POSTed current password is correct
    if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
        return next(new ErrorHandler('Your current password is wrong.', 401));
    }

    // If so, update password
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    await user.save();

    // Log user in, send JWT
    createSendToken(user, 200, res);
});