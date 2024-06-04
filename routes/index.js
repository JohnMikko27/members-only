const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController')

router.get('/', function(req, res, next) {
  res.render('index', { title: 'lol' });
});

router.get('/sign-up', (req, res, next) => {
  res.render('signup')
})

router.post('/sign-up', userController.createUser)

router.get('/login', (req, res, next) => res.render('login'))

module.exports = router;
