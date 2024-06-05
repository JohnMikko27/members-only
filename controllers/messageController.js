const User = require('../models/user')
const Message = require('../models/message')
const asyncHandler = require('express-async-handler')
const { body, validationResult } = require("express-validator");
const bcrypt = require('bcryptjs')

exports.postCreateMessage = [
    body('messageTitle', 'title must not be empty').trim().isLength({ min: 1 }).escape(),
    body('messageText', 'text must not be empty').trim().isLength({ min: 1 }).escape(),

    asyncHandler(async(req, res, next) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            res.render('createMessage', {
                errors: errors.array(),
            })
            return;
        }

        const message = new Message({
            title: req.body.messageTitle,
            text: req.body.messageText,
            user: req.user
        })

        await message.save()
        res.redirect('/')
    })
]

exports.postDeleteForm = asyncHandler(async(req, res, next) => {
    await Message.findByIdAndDelete(req.params.id)
    res.redirect('/')
})