let express = require('express');
let router = express.Router();
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var fs = require('fs');
var path = require('path');
let userLogs = require('../routes/services/userLogs');
let UserLogs = userLogs.UserLogs;
const RSA_KEY = fs.readFileSync(path.join(__dirname, './priv.key'));

var User = require('../models/administration/administration-user');

router.get('/', function (req, res, next) {
    res.render('index.html');
});


router.post('/login', function(req, res, next) {
  User.findOneAndUpdate({username: req.body.user}, {$set: {lastLogin: new Date()}}, {new: true}).select('+password').exec(function(err, user) {
    if (err) {
        return res.status(500).json({
            title: 'An error occurred',
            error: err
        });
    }else if (!user) {
        return res.status(401).json({
            title: 'Login failed',
            error: {message: 'Invalid login credentials'}
        });
    }else if (!bcrypt.compareSync(req.body.password, user.password)) {
        return res.status(401).json({
            title: 'Login failed',
            error: {message: 'Invalid login credentials'}
        });
    }else {
      var token = jwt.sign({
        userId: user._id.toString(),
        name: user.firstName + (user.middleName? ' ' + user.middleName: '') + ' ' + user.lastName,
        role: user.role,
        pages: user.pages,
        clients: user.clients,
        rights: user.rights,
      }, RSA_KEY, {
        algorithm: 'RS256',
        expiresIn: '1h',
      });
      res.status(200).json({
          idToken: token,
      });
    }
});
  function setRights(){

  }
});
module.exports = router;
