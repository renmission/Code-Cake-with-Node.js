var express = require('express');
var router = express.Router();
var { check, validationResult } = require('express-validator');

//nodemailer
var nodemailer = require('nodemailer');
var config = require('../config');
var transporter = nodemailer.createTransport(config.mailer);

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index', { title: 'Code4Share' });
});

router.get('/about', (req, res, next) => {
  res.render('about', { title: 'About Code4Share' })
});

router.route('/contact')
  .get((req, res, next) => {
    res.render('contact', { title: 'Contact page' });
  })


  .post([
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Email is required').isEmail(),
    check('message', 'Message is required').not().isEmpty()
  ], (req, res, next) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      // return res.status(422).json({ errors: errors.array() });
      return res.render('contact', {
        title: 'Code4Share',
        name: req.body.name,
        email: req.body.email,
        message: req.body.message,
        errorMessages: errors.array()
      });
    }

    var mailOptions = {
      from: 'Code4Share <no-reply@gmail.com>',
      to: 'missionrenjr@gmail.com',
      subject: 'You got new message from visitor',
      text: req.body.message
    };

    transporter.sendMail(mailOptions, (err, info) => {
      console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
      res.render('thank', { title: 'thank you' });
    });
  });





module.exports = router;
