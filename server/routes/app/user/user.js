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

router.put('/', (req, res, next)=>{
  let query = req.body.query;
  if('password' in query) {
    let newPassword;
    newPasswordHash = bcrypt.hashSync(query.newPassword, 10);
    query.newPassword = newPasswordHash;
  }
  let id = mongoose.mongo.ObjectId(req.query._id);
  console.log(id);
  User.findById(id).select('+password').exec((err, doc) =>{
    if (err) res.status(500).json(err);
    else if (bcrypt.compareSync(query.password, doc.password)) {
        doc.password = query.newPassword;
    }
  });
});

router.post('/claim', (req, res, next) => {
//TODO: send an email with the claim to the administrator.
});

module.exports = router;
