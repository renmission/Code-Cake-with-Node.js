var express = require('express');
var router = express.Router();
var passport = require('passport');
var { check, validationResult } = require('express-validator');
var User = require('../models/Users');

//LOGIN
router.route('/login')
    .get((req, res, next) => {
        res.render('login', { title: 'login your account' });
    })
    .post(passport.authenticate('local', {
        failureRedirect: '/login'
    }), (req, res) => {
        res.redirect('/');
    })


//REGISTER
router.route('/register')
    .get((req, res, next) => {
        res.render('register', { title: 'Register new account' });
    })

.post([
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Email is required').isEmail(),
    check('password', 'Password is required').not().isEmpty(),
    check('password', 'Password does not match').custom((value, { req }) => (value === req.body.confirmPassword)).not().isEmpty()

], (req, res, next) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        res.render('register', {
            name: req.body.name,
            email: req.body.email,
            errorMessages: errors.array()
        });
    } else {
        const user = new User();
        user.name = req.body.name;
        user.email = req.body.email;
        user.setPassword(req.body.password);
        user.save(err => {
            if (err) return res.render('register', { errorMessages: err });
            res.redirect('/login');
        });
    }
});

router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

router.get('/auth/facebook', passport.authenticate('facebook', { scope: 'email' }));

router.get('/auth/facebook/callback',
    passport.authenticate('facebook', {
        failureRedirect: '/',
        successRedirect: '/'
    }))



module.exports = router;