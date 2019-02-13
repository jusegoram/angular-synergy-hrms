var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var fastcsv = require('fast-csv');
var Employee = require('../../../models/app/employee/employee-main');
var Company = require('../../../models/app/employee/employee-company');

router.post('/', function(req, res, next){
  let query = req.body;
  for (let propName in query) {
    if (query[propName] === null || query[propName] === undefined || query[propName] === '') {
      delete query[propName];
    }
  }
  if( query['company.hireDate'].$gte === null ||
  query['company.hireDate'].$gte === undefined ||
  query['company.hireDate'].$gte === '') {
    delete query['company.hireDate']
  }
  if( query['company.terminationDate'].$gte === null ||
  query['company.terminationDate'].$gte === undefined ||
  query['company.terminationDate'].$gte === '') {
    delete query['company.terminationDate']
  }
  let employees = [];
  let cursor = Employee.find(query).cursor();
  cursor.on('data', item => employees.push(item));
  cursor.on('end', ()=> res.status(200).json(employees));
});

module.exports = router;
