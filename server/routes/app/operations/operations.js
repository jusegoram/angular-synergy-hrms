let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');
var json2csv = require('json2csv');
let OperationHours = require('../../../models/app/operations/operations-hour')
let OperationsKpi = require('../../../models/app/operations/operations-kpi')
let EmployeeShifts = require('../../../models/app/employee/employee-shift')
let Shifts = EmployeeShifts.shift;
let moment = require(moment);
router.post('/hour', (req, res, next) => {
  let query = req.body;
  for (let propName in query) {
    if (query[propName] === null || query[propName] === undefined || query[propName] === '') {
      delete query[propName];
    }
  }
  if(query.date.$gte === '' || query.date.$gte === undefined || query.date.$gte === null) {
    delete query.date;
  }
  let AllHours = [];
  const cursor = OperationHours.find(query).sort({  date: -1, client: 1, campaign: 1 , employeeName: 1}).lean().cursor();
  cursor.on('data', item => AllHours.push(item));
  cursor.on('end', () => {
    if(!AllHours) {
      res.status(404);
    }else {
      res.status(200).json(AllHours);
    }
  });
});

router.post('/kpi', (req, res) => {
  let query = req.body;
  let AllKpis = [];
  for (let propName in query) {
    if (query[propName] === null || query[propName] === undefined || query[propName] === '') {
      delete query[propName];
    }
  }
  if(query.date.$gte === '' || query.date.$gte === undefined || query.date.$gte === null) {
    delete query.date;
  }
  const cursor = OperationsKpi.find(query).lean().cursor();
  cursor.on('data', kpi => AllKpis.push(kpi));
  cursor.on('end', () => {
      if(!AllKpis) {
        res.status(404);
      }else {
        res.status(200).json(AllKpis);
      }
  })
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

router.get('/attendance', (req, res) => {
  const now = moment()
  const currentDay = now.day();
    Shifts.aggregate([
      {$unwind: '$shift'}

    ]).exec((err, doc) => {
      if(err) res.status(400).json(err);
      else res.status(200).json(doc)
    })
})
module.exports = router;
