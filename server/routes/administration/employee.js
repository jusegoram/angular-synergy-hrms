var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var Client = require('../../models/administration/administration-company');
var Department = require('../../models/administration/administration-department');
var mongoose = require('mongoose');
var Shift = require('../../models/employee/employee-shift');
let async = require('async');
var Employee = require('../../models/employee/employee-main');
let EmployeeCompany = require('../../models/employee/employee-company');
let EmployeePosition = require('../../models/employee/employee-position');
let EmployeePayroll = require('../../models/employee/employee-payroll');
let EmployeePersonal = require('../../models/employee/employee-personal');
let EmployeeFamily = require('../../models/employee/employee-family');
let EmployeeComments = require('../../models/employee/employee-comment');

router.post('/client', function (req, res, next) {
  let campaigns = req.body.campaigns;
  for (let i = 0; i < campaigns.length; i++) {
    campaigns[i]._id = new mongoose.Types.ObjectId();
  }
    var client = new Client({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        campaigns: req.body.campaigns
    });
    client.save(function (err, result) {
        if (err) {
            return res.status(500).json({
                title: 'An error occurred',
                error: err
            });
        }
        res.status(200).json(result);
        });
});

router.get('/client', function (req, res, next) {
    Client.find(
        function (err, result) {
        if (err) {
            return res.status(500).json({
                title: 'An error occurred',
                error: err
            });
        }if (req.query.token === '') {
            return res.status(500).json({
                title: 'Not Found',
                message: 'authentication not found'
            });
        }if (result === null) {
            return res.status(500).json({
                title: 'Not found',
                message: 'Positions are empty or not found'
            });
        }
        res.status(200).json(result);
    });
});

router.put('/client', function ( req, res, next) {
  let campaigns = req.body.campaigns
    for (let i = 0; i < campaigns.length; i++) {
      if (!campaigns[i]._id){
        campaigns[i]._id = new mongoose.Types.ObjectId();
      }
    }
    Client.findById(req.query.id, function(err, doc) {
        doc.name = req.body.name;
        doc.campaigns = req.body.campaigns;
        doc.save();
        if (err) {
            return res.status(500).json({
                title: 'An error occurred',
                error: err
            });
        }
        res.status(200).json(doc);
    });
});

// router.post('/shift', function(req, res){
//   var token = jwt.decode(req.query.token);

//   var shift = new Shift.shift({
//       _id: new mongoose.Types.ObjectId(),
//       name: req.body.name,
//       shift: req.body.shift
//   });
//   if(parseInt(token.user.role) === 4) {
//   shift.save(function (err, result) {
//       if (err) {
//           return res.status(500).json({
//               title: 'An error occurred',
//               error: err
//           });
//       }
//       res.status(200).json(result);
//       });
//   }else {
//       res.status(400)
//   }
// });
router.post('/shift', function(req, res, next){
  let shifts = req.body;
    async.each(shifts, function(shift, callback){
      if (shift.state === 'new') {
        delete shift['state'];
        shift._id = new mongoose.Types.ObjectId();
        let newShift = new Shift.shift(shift);
        newShift.save(function(error, result){
          console.log(result);
          callback(error);
        });
       }else if (typeof shift.state === 'undefined') {
         Shift.shift.update({_id: shift._id}, {
           $set: {
             name: shift.name,
            shift: shift.shift}},
            function(err, doc) {
              console.log(doc);
              callback(err)
            });
       }
    }, function(err){
      if(err){
        console.log(err)
      }else{
        console.log('all done');
        res.status(200).json({message: 'done'});
      }
    });
//  shifts.forEach(element => {

//   });
});

router.get('/shift', function (req, res, next) {
  Shift.shift.find(
      function (err, result) {
      if (err) {
          return res.status(500).json({
              title: 'An error occurred',
              error: err
          });
      }if (req.query.token === '') {
          return res.status(500).json({
              title: 'Not Found',
              message: 'authentication not found'
          });
      }if (result === null) {
          return res.status(500).json({
              title: 'Not found',
              message: 'shifts are empty or not found'
          });
      }
      res.status(200).json(result);
  });
});

// router.put('/shift', function ( req, res, next) {
//   Shift.shift.findById(req.query.id, function(err, doc) {
//       doc.name = req.body.name;
//       doc.shift = req.body.shift;
//       doc.save();
//       if (err) {
//           return res.status(500).json({
//               title: 'An error occurred',
//               error: err
//           });
//       }
//       res.status(200).json(doc);
//   });
// });

router.get('/employee', function (req, res, next) {
  console.log(req);
  Employee.find({status: 'active'},
      function (err, result) {
      if (err) {
          console.log(err);
          return res.status(500).json({
              title: 'An error occurred',
              error: err
          });
      }if (result === null) {
          return res.status(500).json({
              title: 'Not found',
              message: 'Employees are not active or not found'
          });
      }
      console.log(result);
      res.status(200).json(result);
  });
});

router.put('/update', (req, res) => {
  Employee.findOne({_id: req.query._id,}, function(err, doc) {
    console.log(doc);
    if(doc){
      doc.employeeId = req.body.employeeId;
    doc.firstName = req.body.firstName;
    doc.middleName = req.body.middleName;
    doc.lastName = req.body.lastName;
    doc.gender = req.body.gender;
    doc.socialSecurity = req.body.socialSecurity;
    doc.save();
    }
    if (err) {
        return res.status(500).json({
            title: 'An error occurred',
            error: err
        });
    }
    res.status(200).json(doc);
});
});

router.delete('/delete', (req, res) => {
  let employeeId = req.query.employeeId + '';
    EmployeeCompany.deleteMany({employeeId: employeeId}, function(err, resp){
    if(err){ res.status(500);
    }else{
      Shift.employeeShift.deleteMany({employeeId: employeeId}, function(err, resp){
        if(err){ res.status(500);
        }else{
          EmployeePosition.deleteMany({employeeId: employeeId}, function(err, resp){
            if(err){ res.status(500);
            }else{
              EmployeePayroll.EmployeePayroll.deleteMany({employeeId: employeeId}, function(err, resp){
                if(err){ res.status(500);
                }else{
                  EmployeePersonal.deleteMany({employeeId: employeeId}, function(err, resp){
                    if(err){ res.status(500);
                    }else{
                      EmployeeFamily.deleteMany({employeeId: employeeId}, function(err, resp){
                        if(err){ res.status(500);
                        }else{
                          EmployeeComments.deleteMany({employeeId: employeeId}, function(err, resp){
                            if(err){ res.status(500);
                            }else{
                              Employee.deleteOne({_id: req.query._id}, function(err, resp){
                                if(err){ res.status(500);
                                }else{
                                  res.status(200).json({res: resp});
                                }});
                            }});
                        }});
                    }});
                }});
            }});
        }});
    }});
});

function deleteEmployee(employee) {









}
module.exports = router;
