var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var fastcsv = require('fast-csv');
var Employee = require('../../../models/employee/employee-main');
var Company = require('../../../models/employee/employee-company');

router.post('/', function(req, res, next){
  let query = req.body;
  for (let propName in query) {
    if (query[propName] === null || query[propName] === undefined || query[propName] === '') {
      delete query[propName];
    }
  }
  if( query['hireDate'].$gte === null ||
  query['hireDate'].$gte === undefined ||
  query['hireDate'].$gte === '') {
    delete query['hireDate']
  }
  if( query['terminationDate'].$gte === null ||
  query['terminationDate'].$gte === undefined ||
  query['terminationDate'].$gte === '') {
    delete query['terminationDate']
  }
  console.log(query);
  Company.find(query).populate({path:'employee', model:'employee-main'}).exec(function(err, doc){
    res.status(200).json(doc)
  });
});

module.exports = router;
