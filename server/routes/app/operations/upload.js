let express = require('express');

let fs = require('fs');
let async = require('async');
//require the express router
let router = express.Router();
//require multer for the file uploads & fast-csv for parsing csv
let multer = require('multer');
let mongoose = require('mongoose');
let csv = require('fast-csv');
let path = require('path')

let OperationsHours = require('../../../models/app/operations/operations-hour')
let OperationsKpi = require('../../../models/app/operations/operations-kpi')
let EmployeeSchema = require('../../../models/app/employee/employee-main');
//define the type of upload multer would be doing and pass in its destination, in our case, its a single file with the name photo
let storage = multer.diskStorage({
    destination:'uploads/kpiFiles',
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
  });
let upload = multer({storage: storage}).single('file');


router.post('/hours', (req, res) => {
  upload(req, res, (err) => {
    let hours = [];
    let hoursFile = req.file;
      if (err) res.status(422).send("an Error occured");
      if(hoursFile.mimetype !== 'application/vnd.ms-excel' && hoursFile.mimetype !== 'text/csv') res.status(400).send("Sorry only CSV files can be processed for upload");

      csv.fromPath(req.file.path,{headers: true, ignoreEmpty: true})
      .on('data', data => {
          data['_id'] = new mongoose.Types.ObjectId();
          data['employee'] = null;
          hours.push(data);

      })
      .on('end', () => {
        hours.map(hour => {
          hour.tosHours = splitTimetoHours(hour.tosHours);
          hour.timeIn = splitTimetoHours(hour.timeIn);
          hour.systemHours = splitTimetoHours(hour.systemHours);
        });
            let correctedHours = [];
            let incorrectHours = [];
              async.each(hours, (hour, cb) => {
                EmployeeSchema.findOne({'employeeId': hour.employeeId}, (error, emp) => {
                  if(error) console.log(error);
                  if(emp !== null){
                      OperationsHours.findOne({employeeId: hour.employeeId, date: hour.date}, (error, doc) => {
                        if(error) {
                          console.log(error);
                          cb();
                        };
                        if(doc === null) {
                        hour.employee = emp._id;
                        hour.employeeName = emp.firstName + ' ' + emp.lastName;
                        hour.client = emp.company.client;
                        hour.campaign = emp.company.campaign;
                        correctedHours.push(hour);
                        cb();
                        }else{
                          incorrectHours.push(hour);
                          cb();
                        }
                      });
                    }else {
                    incorrectHours.push(hour)
                      cb();
                  };
              });
            },
            (err) => {
              if(correctedHours.length > 0 ) OperationsHours.create(correctedHours).then(h => {
                res.status(200).json({uploaded: h, error: incorrectHours});
              }).catch(err => res.status(400).json({error: err, incorrectHours: incorrectHours}));
              if(correctedHours.length === 0) res.status(400).json({incorrectHours: incorrectHours})
            })
      });
  });
});


router.post('/kpi',  (req, res) => {
  upload(req, res, err => {
    let kpis = [];
    let kpisFile = req.file;
      if (err) res.status(422).send("an Error occured");

      if(kpisFile.mimetype !== 'application/vnd.ms-excel' && kpisFile.mimetype !== 'text/csv') return res.status(400).send("Sorry only CSV files can be processed for upload");
      csv.fromPath(req.file.path,{headers: true, ignoreEmpty: true})
      .on('data', data => {
          data['_id'] = new mongoose.Types.ObjectId();
          data['employee'] = null;
          data['supervisor'] = null;
          kpis.push(data);

      })
      .on('end', () => {
        let counter = 0;
        let duplicate = 0;
        kpis.map(kpi => {
          if(kpi.scoreInTime === '' || kpi.scoreInTime === null || kpi.scoreInTime === undefined) {
            delete kpi.scoreInTime;
          }else {
            delete kpi.score;
            kpi.scoreInTime = splitTimetoHours(kpi.scoreInTime);
          }
        });
          async.each(kpis, (kpi, callback) => {
            let employeeIdArr = [];
            employeeIdArr.push(kpi.employeeId);
            employeeIdArr.push(kpi.teamId);
            EmployeeSchema.find({'employeeId': {$in: employeeIdArr}}, (error, res) => {
                  if(error) duplicate++
                  else{
                    counter++;
                    if(res !== null){

                      if(parseInt(employeeIdArr[0], 10) === parseInt(res[0].employeeId, 10)) {
                        kpi.employee = res[0]._id;
                        kpi.employeeName = res[0].firstName + ' ' + res[0].lastName;
                        kpi.client = res[0].company.client;
                        kpi.campaign = res[0].company.campaign;
                        kpi.supervisor= res[1]._id;
                        res[0].supervisor = res[1]._id
                        res[0].save();
                      }else {
                        kpi.employee = res[1]._id;
                        kpi.employeeName = res[1].firstName + ' ' + res[1].lastName;
                        kpi.client = res[1].company.client;
                        kpi.campaign = res[1].company.campaign;
                        kpi.supervisor= res[0]._id;
                        res[1].supervisor = res[0]._id
                        res[1].save();
                      }

                      callback();
                    }else callback();
                  }
              });
          }, err => {
              if(err) console.log(err);
              OperationsKpi.create(kpis).then(res => {}).catch(err => console.log(err));
          });

          return res.status(200).send( counter + ' Registries of kpi information of employees was uploaded and' + duplicate + 'were for some reason not uploaded');
      });
  });
});


function splitTimetoHours (item) {
  let hhmmss = {};
  if(item !== undefined && item !== null && item !== '') {
    let split = item.split(':');
    hhmmss = {
      value: item,
      hh: parseInt(split[0], 10),
      mm: parseInt(split[1], 10),
      ss: parseInt(split[2], 10)
  }
  }else {
    hhmmss = {
      value: '00:00:00',
      hh: 0,
      mm: 0,
      ss: 0,
    }
  }

  return hhmmss;
}
module.exports = router;
