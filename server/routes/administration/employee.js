var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var Client = require('../../models/administration/administration-company');
var Department = require('../../models/administration/administration-department');
var mongoose = require('mongoose');
var Shift = require('../../models/app/employee/employee-shift');
let async = require('async');
var Employee = require('../../models/app/employee/employee-main');
let EmployeeCompany = require('../../models/app/employee/employee-company');
let EmployeePosition = require('../../models/app/employee/employee-position');
let EmployeePayroll = require('../../models/app/employee/employee-payroll');
let EmployeePersonal = require('../../models/app/employee/employee-personal');
let EmployeeFamily = require('../../models/app/employee/employee-family');
let EmployeeComments = require('../../models/app/employee/employee-comment');

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


router.post('/shift', function(req, res, next){

  let shift = req.body;
  shift._id = new mongoose.Types.ObjectId();
  let newShift = new Shift.shift(shift);
  newShift.save((err, doc) => {
    if(err) res.status(500).json(err);
    else res.status(200).json(doc)
  });
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

router.put('/shift', function ( req, res, next) {
  let edit = req.body;
  Shift.shift.findById(req.query.id, function(err, doc) {
      doc.name = edit.name;
      doc.shift = edit.shift;
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

router.delete('/shift', (req, res, next) => {
  Shift.shift.deleteOne({_id: req.query._id}, (err, doc) =>{
    if(err) res.status(500).json(err);
    else res.status(200).json(doc);
  })
})

router.get('/employee', function (req, res, next) {
  console.log(req);
  Employee.find({status: 'active'})
  .select('-personal -company -payroll -comments -education -family -position -shift')
  .exec((err, result) => {
    if (err) {
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


router.get('/companyMig', (req, res) => {
  Employee.updateMany({}, {$rename : {'company': 'companyOld'}}, (err, raw) => {

    let finish = (item) => {
      res.status(200).json(item);
    }

    finish(raw);
  })
});

router.get('/companyMig2', (req, res) => {
  Employee.find().populate({path: 'companyOld', model: 'Employee-Company'}).exec((err, doc) => {
      doc.forEach((item, index) => {
        const docToObj = JSON.parse(JSON.stringify(item))
          item.companyNew = docToObj.companyOld;
          item.companyNew._id = new mongoose.Types.ObjectId();
          item.companyNew.manager = '';
          console.log(index);
          item.save(() => {
            if(index === doc.length - 1) res.status(200).json(doc);
          })

      });
  });
});

router.get('/companyMig3', (req, res) => {
  Employee.updateMany({}, {$rename : {'companyNew': 'company'}}, (err, raw) => {

    let finish = (item) => {
      res.status(200).json(item);
    }

    finish(raw);
  })
});

router.get('/personalMig', (req, res) => {
  Employee.updateMany({}, {$rename : {'personal': 'personalOld'}}, (err, raw) => {

    let finish = (item) => {
      res.status(200).json(item);
    }

    finish(raw);
  })
});

router.get('/personalMig2', (req, res) => {
  Employee.find().populate({path: 'personalOld', model: 'Employee-Personal'}).exec((err, doc) => {
      doc.forEach((item, index) => {
        const docToObj = JSON.parse(JSON.stringify(item))
          item.personalNew = docToObj.personalOld;
          item.personalNew._id = new mongoose.Types.ObjectId();
          console.log(index);
          item.save(() => {
            if(index === doc.length - 1) res.status(200).json(doc);
          })

      });
  });
});

router.get('/personalMig3', (req, res) => {
  Employee.updateMany({}, {$rename : {'personalNew': 'personal'}}, (err, raw) => {

    let finish = (item) => {
      res.status(200).json(item);
    }

    finish(raw);
  })
});
function deleteEmployee(employee) {









}
module.exports = router;
