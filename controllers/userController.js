const User = require('../models/user')
const asyncHandler = require('express-async-handler')
const { body, validationResult } = require("express-validator");
const bcrypt = require('bcryptjs')

exports.createUser = [

    body('firstName', 'first name must not be empty').trim().isLength({min: 1}).escape(),
    body('lastName', 'last name must not be empty').trim().isLength({min: 1}).escape(),
    body('username', 'username must not be empty and must not be taken').trim().isLength({min: 1}).escape(),
    body('username', 'username is taken already').custom(async(value) => {
        const user = await User.findOne({ username: value })
        if (user) {
            throw new Error('username already in use');
        }
    }),
    body('password', 'password must not be empty').trim().isLength({min: 1}).escape(),
    body('confirmPassword', 'passwords do not match').custom((value, { req }) => {
        return value === req.body.password;
    }),

    asyncHandler(async(req, res, next) => {

        const errors = validationResult(req)
    
        if (!errors.isEmpty()) {
            res.render('signup', {
                errors: errors.array(),
                firstName: req.body.firstName,
                lastName: req.body.lastName, 
                username: req.body.username, 
            })
            return;
        }

        bcrypt.hash(req.body.password, 10, async(err, hashedPassword) => {
            // add an error handler?
            try {
                const user = new User({
                    firstName: req.body.firstName, 
                    lastName: req.body.lastName, 
                    username: req.body.username, 
                    password: hashedPassword,
                    membershipStatus: false,
                    isAdmin: (req.body.admin ? true : false)
                })
                await user.save()
                res.redirect('/login')
            } catch (e) {
                console.log(e)
            }
        });
    })
]

exports.postMemberForm = asyncHandler(async(req, res, next) => {
    body('secret', 'stop trying to hack').trim().isLength({min: 1}).escape()

    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        res.render('memberForm', {
            errors: errors.array(),
        })
        return;
    }
    if (req.body.secret === process.env.SECRET) {
        const user = new User({
            firstName: req.user.firstName,
            lastName: req.user.lastName,
            username: req.user.username,
            password: req.user.password,
            membershipStatus: true,
            _id: req.user._id
        })
        const updatedUser = await User.findByIdAndUpdate(req.user._id, user, {})
    }
    res.redirect('/')
})