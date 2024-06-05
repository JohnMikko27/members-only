const User = require('../models/user')
const asyncHandler = require('express-async-handler')
const { body, validationResult } = require("express-validator");
const bcrypt = require('bcryptjs')


exports.createUser = [
    body('firstName', 'first name must not be empty').trim().isLength({min: 1}).escape(),
    body('lastName', 'last name must not be empty').trim().isLength({min: 1}).escape(),
    body('username', 'username must not be empty').trim().isLength({min: 1}).escape(),
    body('password', 'password must not be empty').trim().isLength({min: 1}).escape(),
    body('confirmPassword', 'confirm password must not be empty').trim().isLength({min: 1}).escape(),

    asyncHandler(async(req, res, next) => {
        const errors = validationResult(req)
    
        if (!errors.isEmpty()) {
            res.render('signup', {
                errors: errors.array()
            })
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
                })
                await user.save()
                res.redirect('/login')
            } catch (e) {
                console.log(e)
            }
        });
    })
]

