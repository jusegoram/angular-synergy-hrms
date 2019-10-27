var express = require('express');
var router = express.Router();
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var mongoose = require('mongoose');

const https = require('https');

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
        });
    });
});



router.get('/usersInfoById', (req, res, next) => {
  let idList = req.body;
  idList.map(mongoose.Types.ObjectID);
  User.find({id: {$in: idList}}, (err, res)=> {
    if(err){
      res.status(500).json(err);
    }else {
      res.status(200).json(res);
    }
  });
});

router.get('/allUsers', (req, res, next) => {
  User.find()
  .populate({path: 'employee', select: '-personal -payroll -comments -education -family -position -shift', model: 'employee-main'})
  .exec((err, doc)=> {
    if(err){
      res.status(500).json(err);
    }else {
      res.status(200).json(doc);
    }
  });
});

router.put('/user', (req, res, next) => {
  let _id = req.body._id;
  let query = req.body;
  for (let propName in query) {
    if (query[propName] === null || query[propName] === undefined || query[propName] === '') {
      delete query[propName];
    }
  }
  delete query._id;
  if('password' in query) {
    query.password = bcrypt.hashSync(query.password, 10);
  }
console.log(_id);
  User.findOneAndUpdate({_id: _id}, {$set: query}, {new: true}, (err, doc) => {
    if(err){
      res.status(500).json(err);
    }else {
      res.status(200).json(doc);
    }
  });
});

router.delete('/user', (req, res, next) => {
  let id = req.query._id;
  User.remove({_id: id}, (err, doc) => {
    if(err){
      res.status(500).json(err);
    }else{

      res.status(200).json(doc);
    }
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

router.get('/weather', (req, res) => {

  https.get('https://api.openweathermap.org/data/2.5/weather?id=3582677&appid=8034784ce4c51bf0ab36b2cde7dda225', (resp) => {
  let data;
  // A chunk of data has been recieved.
  resp.on('data', (chunk) => {
    data = JSON.parse(chunk);
  });

  // The whole response has been received. Print out the result.
  resp.on('end', () => {
    res.status(200).json(data)
  });

}).on("error", (err) => {
    res.status(500).json(err)
});
});
module.exports = router;
