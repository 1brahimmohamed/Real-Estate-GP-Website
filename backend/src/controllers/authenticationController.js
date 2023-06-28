const User = require('../models/userModel');
const asyncErrorCatching = require('../utils/asyncErrorCatching');

exports.signup = asyncErrorCatching(async (req, res) => {
    const newUser = await User.create(req.body);

    res.status(201).json({
        status: 'success',
        data: {
            user: newUser
        }
    });
});