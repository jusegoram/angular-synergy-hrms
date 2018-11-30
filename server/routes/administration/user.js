var express = require('express');
var router = express.Router();
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var fs = require('fs');
var path = require('path');
const RSA_PUBLIC_KEY = fs.readFileSync(path.join(__dirname, './RS256.key'));

var User = require('../../models/administration/administration-user');
router.get('/role', function(req, res, next) {
    var token = jwt.decode(req.query.token);
    var user = token.role;
        res.status(200).json({
            message: 'role succesfull',
            userRole: user
    });
});



router.post('/signup', function (req, res, next) {
    var user = new User({
        firstName: req.body.firstName,
        middleName: req.body.middleName,
        lastName: req.body.lastName,
        password: bcrypt.hashSync(req.body.password, 10),
        username: req.body.username,
        role: +req.body.role,
        creationDate: req.body.creationDate,
        employee: req.body.employee
    });
    user.save(function(err, result) {
        if (err) {
            return res.status(500).json({
                title: 'An error occurred',
                error: err
            });
        }
        res.status(201).json({
            message: 'User created',
            obj: result
        });
    });
});

router.post('/login', function(req, res, next) {
    User.findOne({username: req.body.user}, function(err, user) {
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
          role: user.role
        }, RSA_PUBLIC_KEY, {
          algorithm: 'RS256',
          expiresIn: 600
        });
        res.status(200).json({
            idToken: token,
        });
    });

});

router.get('/verify', function(req, res, next){
    var token = jwt.decode(req.query.token);

    var isExpiredToken = false;

    var dateNow = new Date();

    if(token.exp < dateNow.getTime()){
           isExpiredToken = true;
    }

    res.status(200).json(isExpiredToken);

});

module.exports = router;
