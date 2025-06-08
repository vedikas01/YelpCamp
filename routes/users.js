const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const User = require('../models/user');
const passport = require('passport');
const {storeReturnTo} = require('../middleware');
const users = require('../controllers/users')

//register
router.route('/register')
.get(users.renderRegister)
.post(catchAsync(users.Register))

//login
router.route('/login')
.get(users.renderLogin)
.post(storeReturnTo, passport.authenticate('local', {failureFlash : true, failureRedirect : '/login'}),users.login)

//logout
router.route('/logout')
.get(users.logout); 

module.exports = router;