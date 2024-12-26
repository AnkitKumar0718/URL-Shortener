const express = require('express');
const passport = require('passport');
const { loginCallback, protectedRoute, logOutUser } = require('../Controllers/authController');
const { verifyToken } = require('../Middlewares/auth');

const router = express.Router();

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/' }), loginCallback);
router.get('/protected', verifyToken, protectedRoute);
router.post('/logout',logOutUser)

module.exports = router;


