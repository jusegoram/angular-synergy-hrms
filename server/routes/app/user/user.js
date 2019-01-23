let express = require('express');
let router = express.Router()
let jwt = require('jsonwebtoken');
let fs = require('fs');
let mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

let User = require('../../../models/administration/administration-user');


router.get('/', (req, res, next)=>{
  let id = mongoose.mongo.ObjectId(req.query._id);
  User.findById(id, (err, doc) => {
      if (err) res.status(500);
      else res.status(200).json(doc);
  });
});

router.put('/password', (req, res, next)=>{
  let query = req.body;
  let id = mongoose.mongo.ObjectId(req.body._id);
  User.findById(req.body._id).select('+password').exec((err, doc) =>{
    if (err) res.status(500).json(err);
    else if (bcrypt.compareSync(query.password, doc.password)) {
        doc.set({password: bcrypt.hashSync(query.newPassword, 10)});
        console.log(doc.password);
        doc.save((error, updated) =>{
          if (error) res.status(500).json(error);
          else (res.status(200).json('updated'))
        })
    }else{
      res.status(500).json({message: 'password incorrect'})
    }
  });
});

router.post('/claim', (req, res, next) => {
//TODO: send an email with the claim to the administrator.
});

module.exports = router;
