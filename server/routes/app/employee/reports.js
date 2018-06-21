var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var fastcsv = require('fast-csv');
var Employee = require('../../../models/employee/employee-main');
var Company = require('../../../models/employee/employee-company');
router.get('/', function(req, res, next){
  Company.find({campaign: 'Icon', supervisor:'Nubia Ramirez'}).populate({path:'employee', model:'employee-main'}).exec(function(err, doc){
    console.log(err || doc);
    res.status(200).json(doc)
  });
});

module.exports = router;
