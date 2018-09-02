const express = require('express');
const passport = require('passport');

const register = require('./register');
const login = require('./login');

const router = express.Router();

// Manual Registration
router.post('/register', (req, res) => {
    register(req.body)
        .then((response) => {
            res.status(200).send(response);
        })
        .catch((err) => {
            res.status(400).send(err);
        });
});

//Manual login
router.post('/login', (req, res) => {
    login(req.body)
        .then((response) => {
            res.status(200).send(response);
        })
        .catch((err) => {
            res.status(400).send(err);
        });
});

//Facebook login
router.get('/facebook', passport.authenticate('facebook', {
    scope : ['email', 'public_profile']
}));

router.get('/facebook/callback', passport.authenticate('facebook', {
    failureRedirect : '/accounts/failure',
    session: false
}), (req, res) => {
    res.send(req.data);
});

//Google login
router.get('/google', passport.authenticate('google', {
    scope : ['email', 'profile']
}));

router.get('/google/callback', passport.authenticate('google', {
    failureRedirect : '/accounts/failure',
    session: false
}), (req, res) => {
    res.send(req.data);
});


//Redirect route in case of social login failure.
router.get('/failure', (req, res) => {
    res.send('Failed to login. Please try again.');
});

module.exports = router;