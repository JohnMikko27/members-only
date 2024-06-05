const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController')
const messageController = require('../controllers/messageController')
const passport = require("passport");
const isAuth = require('./auth').isAuth
const Message = require('../models/message')

router.get('/', async(req, res, next) => {
  const allMessages = await Message.find().populate('user').exec()
  res.render('index', { 
    user: req.user,
    messages: allMessages,
  });
});

router.get('/sign-up', (req, res, next) => {
  res.render('signup')
})

router.post('/sign-up', userController.createUser)

router.get('/login', (req, res, next) => res.render('login'))

router.post('/login', 
  passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/login"
}))

router.get('/memberForm', (req, res, next) => res.render('memberForm'))

router.post('/memberForm', userController.postMemberForm)

router.get('/createMessage', (req, res, next) => res.render('createMessage'))

router.post('/createMessage', messageController.postCreateMessage)

router.get('/delete/:id', (req, res, next) => res.render('deleteForm'))

router.post('/delete/:id', messageController.postDeleteForm)

module.exports = router;
