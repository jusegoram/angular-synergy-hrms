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

  Employee.find(query).exec(function (err, doc){
    res.status(200).json(doc);
  //   let mapped = (element) => {
  //     const employee = element.employee;
  //       element['id'] = employee._id;
  //       element['firstName'] = employee.firstName;
  //       element['middleName'] = employee.middleName;
  //       element['lastName'] = employee.lastName;
  //       element['gender'] = employee.gender;
  //       element.socialSecurity = employee.socialSecurity;
  //       element.status = employee.status;
  //       element.position = employee.position[employee.position.length - 1];
  //       element.shift = employee.shift[employee.shift.length - 1];
  //       element.personal = employee.personal;
  //       element.education = employee.education;
  //       element.comments = employee.comments;
  //       element.family = employee.family;
  //       element.payroll = employee.payroll;
  //       element.comments = employee.comments;
  //       element.attrition = employee.attrition;
  //       delete element.employee;
  //       delete element.__v
  //       return element;
  //   };
  //   let filtered = (element) => element.employee.status === statusQ;

  //   let finish = (element) => {
  //     res.status(200).json(element);
  //   }
  //   if(err) res.status(500).json(err);
  //   if(statusQ !== undefined && statusQ !== '' && statusQ !== null) {
  //     const responce = JSON.parse(JSON.stringify(doc))
  //    let result = responce.filter(filtered).map(mapped);
  //     finish(result);
  //   }else {
  //     const responce = JSON.parse(JSON.stringify(doc))
  //     let result = responce.map(mapped);
  //     finish(result);
  //   }


  })
});

module.exports = router;
