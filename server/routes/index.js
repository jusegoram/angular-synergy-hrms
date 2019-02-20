let express = require('express');
let router = express.Router();
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var fs = require('fs');
var path = require('path');
const RSA_KEY = fs.readFileSync(path.join(__dirname, './priv.key'));

var User = require('../models/administration/administration-user');

router.get('/', function (req, res, next) {
    res.render('index.html');
});


router.post('/login', function(req, res, next) {
  User.findOne({username: req.body.user}).select('+password').exec(function(err, user) {
    if (err) {
        return res.status(500).json({
            title: 'An error occurred',
            error: err
        });
    }
    if (!user) {
        return res.status(401).json({
            title: 'Login failed',
            error: {message: 'Invalid login credentials'}
        });
    }
    if (!bcrypt.compareSync(req.body.password, user.password)) {
        return res.status(401).json({
            title: 'Login failed',
            error: {message: 'Invalid login credentials'}
        });
    }
    var token = jwt.sign({
      userId: user._id.toString(),
      name: user.firstName + (user.middleName? ' ' + user.middleName: '') + ' ' + user.lastName,
      role: user.role,
      rights: {
        role: user.role,
        edit: true,
        add: true,
        delete: true,
        view: true,
        upload: true,
      },
    }, RSA_KEY, {
      algorithm: 'RS256',
      expiresIn: 60*20
    });
    res.status(200).json({
        idToken: token,
    });
});

});
module.exports = router;
