const User = require('../models/user');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const config = require('../config/config');

exports.index = async (req, res, next) => {
    const data = await User.find().sort({ name: 1 });

    res.status(200).json({
        data: data,
    });
}

exports.show = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id).catch(err => {
            const error = new Error('User not found');
            error.statusCode = 404;
            throw error;
        });

        res.status(200).json({
            data: user,
        });

    } catch (error) {
        next(error);
    }
}

exports.register = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;

        // check if there is any validation error
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            // feture of nodejs to throw error and pass it to next middleware
            const error = new Error('Validation failed');
            error.statusCode = 422;
            error.validation = errors.array();
            throw error;
        }

        // cheack if user exists
        const exists = await User.findOne({ email: email });
        if (exists) {
            // feture of nodejs to throw error and pass it to next middleware
            const error = new Error('User already exists');
            error.statusCode = 400;
            throw error;
        }

        let newUser = new User();
        newUser.name = name;
        newUser.email = email;
        newUser.password = await newUser.encryptPassword(password);

        await newUser.save().then;

        res.status(201).json({
            data: { message: 'User created' },
        });
    } catch (error) {
        next(error);
    }
}

exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // cheack if user user
        const user = await User.findOne({ email: email });
        if (!user) {
            // feture of nodejs to throw error and pass it to next middleware
            const error = new Error('User not found');
            error.statusCode = 404;
            throw error;
        }

        // check if password is correct
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            // feture of nodejs to throw error and pass it to next middleware
            const error = new Error('Password is incorrect');
            error.statusCode = 401;
            throw error;
        }

        // create token
        const token = await jwt.sign({
            id: user._id,
            role: user.role
        }, config.JWT_SECRET, { expiresIn: '5 days' });

        // decode the token to get the expiration date
        const expires_in = await jwt.decode(token);

        res.status(200).json({
            access_token: token,
            expires_in: expires_in.exp,
            token_type: 'Bearer',
        });

    } catch (error) {
        next(error);
    }
}

exports.profile = (req, res, next) => {
    const { _id, name, email, role } = req.user;

    const user = new User({
        _id: _id,
        name: name,
        email: email,
        role: role,
    });

    res.status(200).json({
        data: user,
    });
}