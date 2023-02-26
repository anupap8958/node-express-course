const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const userController = require('../controllers/userController');
const passportJWT = require('../middleware/passportJWT');

/* GET user profile with token. */
/* http://localhost:3000/user/profile */
router.get('/profile', [passportJWT.isLoginUser], userController.profile);
// router.get('/me',[passportJWT], userController.me);

/* GET user listing. */
/* http://localhost:3000/user/ */
router.get('/', userController.index);

/* GET user by id. */
/* http://localhost:3000/user/:id */
router.get('/:id', userController.show);

/* POST user login. */
/* http://localhost:3000/user/login */
router.post('/login', userController.login);

/* POST user register. */
/* http://localhost:3000/user/register */
router.post('/register', [
    /* validate user input */
    body('name').not().isEmpty().withMessage('Name is required'),
    body('email').not().isEmpty().withMessage('Email is required').isEmail().withMessage('Email is invalid'),
    body('password').not().isEmpty().withMessage('Password is required').isLength({ min: 3 }).withMessage('Password must be at least 3 characters long'),
], userController.register);

module.exports = router;
