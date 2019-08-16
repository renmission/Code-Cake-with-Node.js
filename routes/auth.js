var express = require('express');
var router = express.Router();
var passport = require('passport');
var { check, validationResult, body } = require('express-validator');

var bcrypt = require('bcryptjs');


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
        check('confirmPassword', 'Passwords do not match').custom((value, { req }) => (value === req.body.password))


    ], async (req, res) => {

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            res.render('register', {
                name: req.body.name,
                email: req.body.email,
                errorMessages: errors.array()
            });
        } else {

            const { name, email, password, confirmPassword } = req.body;

            user = new User({
                name,
                email,
                password,
                confirmPassword
            });

            //encrypt password
            const salt = await bcrypt.genSalt(10);

            user.password = await bcrypt.hash(password, salt);

            await user.save();

            res.redirect('/login');

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