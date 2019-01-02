var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var fastcsv = require('fast-csv');
var Employee = require('../../../models/app/employee/employee-main');
var Company = require('../../../models/app/employee/employee-company');

router.post('/', function(req, res, next){
  let query = req.body;
  delete query['status'];
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
  // Company.find(query).populate({
  //     path:'employee',
  //     model:'employee-main',
  //       populate: {
  //       path:'shift',
  //       model: 'Employee-Shift',
  //       populate: { path: 'shift', model: 'Administration-Shift'},
  //       options: { sort: { 'startDate': 1 } }
  //     },
  //     populate: {
  //       path:'position',
  //       model: 'Employee-Position',
  //       populate: { path: 'position', model: 'Administration-Position'},
  //       options: { sort: { 'startDate': 1 } }
  //     }
  //   }).exec(function(err, doc){
  //   res.status(200).json(doc);
  //   console.log(err);
  // });

  Company.find(query).populate('employee').exec(function (err, doc){
    res.status(200).json(doc);
    console.log(err);
  })
});

module.exports = router;
