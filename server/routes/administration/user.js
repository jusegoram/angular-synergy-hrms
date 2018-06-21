var express = require('express');
var router = express.Router();
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

var User = require('../../models/administration/administration-user');
router.get('/role', function(req, res, next) {
    var token = jwt.decode(req.query.token);
    var user = token.user;
        res.status(200).json({
            message: 'role succesfull',
            userRole: user.role
    });
});



router.post('/', function (req, res, next) {
    var user = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        password: bcrypt.hashSync(req.body.password, 10),
        username: req.body.username,
        role: +req.body.role,
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

router.post('/signin', function(req, res, next) {
    User.findOne({username: req.body.username}, function(err, user) {
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
        var token = jwt.sign({user: user}, 'R34dy1c0n2016**', {expiresIn: 3600});
        res.status(200).json({
            message: 'Successfully logged in',
            token: token,
            userId: user._id
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
