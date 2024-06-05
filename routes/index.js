const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController')
const passport = require("passport");
const isAuth = require('./auth').isAuth

router.get('/', function(req, res, next) {
  res.render('index', { user: req.user });
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

router.get('/protected', isAuth, (req, res, next) => {
  res.send('you made it to protected')
})

module.exports = router;
