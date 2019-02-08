let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');
var json2csv = require('json2csv');
let OperationHours = require('../../../models/app/operations/operations-hour')
let OperationsKpi = require('../../../models/app/operations/operations-kpi')


router.get('/allHours', (req, res, next) => {
  OperationHours.find({}, (error, result) => {
    if(!result) {
      res.status(404);
    }else if(error) {
      res.status(500);
    }else {
      res.status(200).json(result);
    }
  });
});

router.post('/kpi', (req, res) => {
  let query = req.body;
  for (let propName in query) {
    if (query[propName] === null || query[propName] === undefined || query[propName] === '') {
      delete query[propName];
    }
  }
  if(query.date.$gte === '' || query.date.$gte === undefined || query.date.$gte === null) {
    delete query.date;
  }
console.log(query);
  OperationsKpi.find(query, (error, result) => {
    if(!result) {
      res.status(404);
    }else if(error) {
      res.status(500);
    }else {
      res.status(200).json(result);
    }
  });
});

router.get('/hourTemplate', function (req, res, next) {
  var fields = [
      'employeeId',
      'dialerId',
      'date',
      'systemHours',
      'tosHours',
      'timeIn'
  ];

  var csv = json2csv({ data: '', fields: fields });

  res.set("Content-Disposition", "attachment;filename=employee-hours-upload.csv");
  res.set("Content-Type", "application/octet-stream");

  res.send(csv);
});

router.get('/kpiTemplate', function (req, res, next) {
  var fields = [
      'employeeId',
      'teamId',
      'kpiName',
      'date',
      'score',
      'scoreInTime',
  ];

  var csv = json2csv({ data: '', fields: fields });

  res.set("Content-Disposition", "attachment;filename=employee-kpi-upload.csv");
  res.set("Content-Type", "application/octet-stream");

  res.send(csv);
});
module.exports = router;
