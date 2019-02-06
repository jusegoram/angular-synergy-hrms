let express = require('express');
let router = express.Router()

let jwt = require('jsonwebtoken');
let fs = require('fs');
let mongoose = require('mongoose');

let Employee = require('../../../models/app/employee/employee-main');
let EmployeePosition = require("../../../models/app/employee/employee-position");
let EmployeePersonal = require("../../../models/app/employee/employee-personal");
let EmployeePayroll = require("../../../models/app/employee/employee-payroll");
let EmployeeFamily = require("../../../models/app/employee/employee-family");
let EmployeeCompany = require("../../../models/app/employee/employee-company");
let EmployeeEducation = require("../../../models/app/employee/employee-education");
let EmployeeComment = require("../../../models/app/employee/employee-comment");
let EmployeeShift = require("../../../models/app/employee/employee-shift");
let EmployeeHours = require("../../../models/app/employee/employee-hour");
let EmployeeAttrition = require("../../../models/app/employee/employee-attrition");

router.get('/populateTable', function(req, res, next) {
    var token = jwt.decode(req.query.token);
    Employee.find({},'_id employeeId firstName middleName lastName socialSecurity status').lean().sort({status: 1, employeeId: 1}).exec(
        function (err, result) {
        if (err) {
            return res.status(500).json({
                title: 'An error occurred',
                error: err
            });
        }if (req.query.token === '') {
            return res.status(500).json({
                title: 'Employees',
                message: 'Employees not found'
            });
        }if (result === null) {
            return res.status(500).json({
              title: 'Employees',
              message: 'Employees are empty or not found'
            });
          }
        res.status(200).json(result);
    });
});


router.get('/main', function(req, res){
    Employee.findById(req.query.id, (err, result) => {
        if (err) res.status(500);
        else res.status(200).json(result);
      });
});

router.put('/main', function (req, res, next) {
  Employee.findById(req.query.id, function (err, result) {
    if (!result)
      return next(new Error('Could not load Document'));
    else {
      result.status = req.body.status.toLowerCase();
      result.save();
      if (err) {
        return res.status(500).json({
          title: 'An error occurred',
          error: err
        });
      }
    }
    res.status(200).json(result);
  });
});

router.put('/shift', function(req,res, next){
  Employee.findById(req.query.id, function (err, result){
    if (!result) {
      return next(new Error('could not load doc'));
    } else {
    //TODO: finish update for shifts
    }
  });
});

router.put('/company', function (req, res) {
  let companyInfo = req.body;
  let employee = req.body.employee;
  if (employee) {
    Employee.findByIdAndUpdate(companyInfo.employee, {$set: {company: companyInfo}}, (err, result) => {
      if(err) res.status(500).json(err);
      else res.status(200).json(result);
    });
  }

});
router.put('/position', function (req, res) {
  EmployeePosition.findById(req.query.id, function(err, result){
    if (!result)
      return next(new Error('Could not load Document'));
    else {
    result.endDate = req.body.endDate;
    console.log(result);
    result.save(function(err, doc){
      console.log(err||doc);
    });
      if (err) {
        return res.status(500).json({
          title: 'An error occurred',
          error: err
        });
      }
    }
    res.status(200).json(result);
  });
});
router.put('/personal', function (req, res, next) {
  let personalInfo = req.body;
  let employee = req.body.employee;
  if (employee) {
    Employee.findByIdAndUpdate(personalInfo.employee, {$set: {personal: personalInfo}}, (err, result) => {
      if(err) res.status(500).json(err);
      else res.status(200).json(result);
    });
  }
});
router.put('/family', function (req, res, next) {
  EmployeeFamily.findById(req.query.id, function(err, result){
    if (!result)
      return next(new Error('Could not load Document'));
    else {
    result.referenceName = req.body.referenceName;
    result.relationship = req.body.relationship;
    result.celNumber = req.body.celNumber;
    result.telNumber = req.body.telNumber;
    result.emailAddress = req.body.emailAddress;
    result.address = req.body.address;
      result.save();
      if (err) {
        return res.status(500).json({
          title: 'An error occurred',
          error: err
        });
      }
    }
    res.status(200).json(result);
  });
});
router.put('/education', function (req, res, next) {
  EmployeeEducation.findById(req.query.id, function(err, result){
    if (!result)
      return next(new Error('Could not load Document'));
    else {
    result.institution = req.body.institution;
    result.description = req.body.description;
    result.startDate = doc.startDate;
    result.endDate = req.body.endDate;
      result.save();
      if (err) {
        return res.status(500).json({
          title: 'An error occurred',
          error: err
        });
      }
    }
    res.status(200).json(result);
  });
});
router.put('/payroll', (req, res) => {
  let payrollInfo = req.body;
  let employee = req.body.employee
  Employee.findByIdAndUpdate(employee, {$set: {payroll: payrollInfo}}, (err, doc) => {
    if(err) res.status(500).json(err);
    else res.status(200).json(doc);
  });
});
router.put('/comment', function(req, res, next) {
  EmployeeComment.findById(req.query.id, function(err, result){
    if (!result)
      return next(new Error('Could not load Document'));
    else {
    result.comment = req.body.comment;
    result.commentDate = req.body.commentDate;
    result.submittedBy = doc.submittedBy;
      result.save();
      if (err) {
        return res.status(500).json({
          title: 'An error occurred',
          error: err
        });
      }
    }
    res.status(200).json(result);
  });
});
router.post('/main', function(req, res){
var employee = new Employee({
    _id: new mongoose.Types.ObjectId(),
        employeeId: this.generateId() + "",
        firstName: req.body.firstName,
        middleName: req.body.middleName,
        lastName: req.body.lastName,
        gender: req.body.gender,
        socialSecurity: req.body.socialSecurity,
        status: req.body.status.toLowerCase(),
});

employee.save(function(err, result) {
    if (err) {
        return res.status(500).json({
            title: 'An error occurred',
            error: err
        });
    }
    return res.status(201).json(result) });
});

router.post('/shift', function (req, res) {
  Employee.findById(req.body.employee, (err, employee) => {
    let id = new mongoose.Types.ObjectId();
    let current = new EmployeeShift.employeeShift({
      _id: id,
      employeeId: req.body.employeeId,
      employee: req.body.employee,
      createdDate: req.body.createdDate,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      shift: req.body.shift
    });
    current.save(function (err, result) {
      if (err) {
        return res.status(500).json({
          title: 'An error occurred',
          error: err
        });
      }
      Employee.update({ _id: current.employee }, { $push: { shift: id } }, function (err, raw) {
        res.status(200).json(result);
      });
    });
  });
});
router.post('/company', function(req, res){
  let id = new mongoose.Types.ObjectId();
      let current = {
        _id: id,
        employeeId: req.body.employeeId,
        client: req.body.client,
        campaign: req.body.campaign,
        supervisor: req.body.supervisor,
        trainer: req.body.trainer,
        trainingGroupRef: req.body.trainingGroupRef,
        trainingGroupNum: req.body.trainingGroupNum,
        hireDate: req.body.hireDate,
        terminationDate: req.body.terminationDate,
        reapplicant: req.body.reapplicant,
        reapplicantTimes: req.body.reapplicantTimes,
        employee: req.body.employee
      };
  Employee.findByIdAndUpdate(req.body.employee,{$set: {company: current}},(error, result) => {
    if(error) res.status(500).json(error);
    else res.status(200).json({});
  });
});
router.post('/position', function(req, res){
    if (req.body.employeeId) {
      let id = new mongoose.Types.ObjectId();
      let newPosition = new EmployeePosition({
        _id: id,
        employeeId: req.body.employeeId,
        client: req.body.client,
        department: req.body.department,
        position: req.body.position,
        startDate: req.body.startDate,
        endDate: req.body.endDate,
        employee: req.body.employee
      });
      newPosition.save(function (err, result) {
        if (err) {
          return res.status(500).json({
            title: 'An error occurred',
            error: err
          });
        }
        Employee.update({_id: newPosition.employee}, {$push: { position: newPosition }}, function(err){
        });
        result.populate({path: 'position', model: 'Administration-Position'}, function(err, pop){
          return res.status(201).json(pop);
        })

      });
    } else {
      return res.status(400).message('sorry, the request was either empty or invalid');
    }
  });

router.post('/personal', (req, res) => {
  let id = new mongoose.Types.ObjectId();
  let personal = {
  _id: id,
  employeeId: req.body.employeeId,
  maritalStatus: req.body.maritalStatus,
  address: req.body.address,
  town: req.body.town,
  district: req.body.district,
  birthPlaceDis:req.body.birthPlaceDis,
  birthPlaceTow: req.body.birthPlaceTow,
  addressDate: req.body.addressDate,
  celNumber: req.body.celNumber,
  telNumber: req.body.telNumber,
  birthDate: req.body.birthDate,
  emailAddress: req.body.emailAddress,
  emailDate: req.body.emailDate,
  employee: req.body.employee
};
  Employee.findByIdAndUpdate(req.body.employee, {$set: {personal: personal}}, (err, doc) => {
    if (err) res.status(500).json(err);
    else res.status(200).json({});
  });
});

router.post('/family', (req, res) => {
  if (req.body.employeeId){
    let id = new mongoose.Types.ObjectId();
    let newFamily = {
      _id: id,
      employeeId: req.body.employeeId,
      referenceName: req.body.referenceName,
      relationship: req.body.relationship,
      celNumber: req.body.celNumber,
      telNumber: req.body.telNumber,
      emailAddress: req.body.emailAddress,
      address: req.body.address,
      employee: req.body.employee
    };
    Employee.findByIdAndUpdate(newFamily.employee, {$push:{family: newFamily }}, (err, doc) => {
      if(err) res.status(500).json(err)
      else res.status(200).json(newFamily);
    })
  }else res.status(500);

});

router.post('/education',  (req, res) => {
  if (req.body.employeeId){
    let id = new mongoose.Types.ObjectId();
    let newEducation = new EmployeeEducation({
      _id: id,
      employeeId: req.body.employeeId,
      institution: req.body.institution,
      description: req.body.description,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      employee: req.body.employee
    });
    Employee.findOneAndUpdate(newEducation.employee, {$push:{education: newEducation}}, (err, doc) => {
      if(err) res.status(500).json(err)
      else res.status(200).json({});
    })
  }else res.status(500);
});

router.post('/payroll', (req, res) => {
  let id = new mongoose.Types.ObjectId();
  var payroll = {
    _id: id,
    employeeId: req.body.employeeId,
    TIN: req.body.TIN,
    positionId: req.body.positionId,
    payrollType: req.body.payrollType,
    baseWage: req.body.baseWage,
    bankName: req.body.bankName,
    bankAccount: req.body.bankAccount,
    billable: req.body.billable,
    employee: req.body.employee
  };
  Employee.findByIdAndUpdate(req.body.employee,{$set: {payroll: payroll}}, (err, employee) => {
    if(err) res.status(500).json(err);
    else res.status(200).json({});
  });
});

router.post('/comment', (req, res) => {
  if (req.body.employeeId){
    let id = new mongoose.Types.ObjectId();
    let newComment = new EmployeeComment({
      _id: id,
      employeeId: req.body.employeeId,
      reason: req.body.reason,
      comment: req.body.comment,
      commentDate: req.body.commentDate,
      submittedBy: req.body.submittedBy,
      employee: req.body.employee
    });
    Employee.findByIdAndUpdate(req.body.employee, {$push: {comments: newComment}}, (err, doc) => {
      if(err) res.status(500).json(err);
      else res.status(200).json(newComment);
    })
  }else res.status(500);
});

router.post('/attrition', function(req, res, next){
  if (req.body.employeeId){
    let id = new mongoose.Types.ObjectId();
    let newAttrition = new EmployeeAttrition({
      _id: id,
      employeeId: req.body.employeeId,
      reason1: req.body.reason1,
      reason2: req.body.reason2,
      comment: req.body.comment,
      commentDate: req.body.commentDate,
      submittedBy: req.body.submittedBy,
      employee: req.body.employee
    });
    Employee.findByIdAndUpdate(req.body.employee, {$push: {attrition: newAttrition}}, (err, doc) => {
      if (err) res.status(500).json(err)
      else res.status(200).json(newAttrition);
    });
  } else res.status(500);
});

router.get('/latestPosition', function(req, response ){
   let latest = EmployeePosition.latestPosition(req.query.id, function(err, res){
        if(err){
            response.status(400).send(err);
            return
        }
            response.status(200).json(res);
            return
    });

});
router.get('/avatar', function(req, res, next){
  var avatar = req.query.id + ".jpg";
  fs.readFile('uploads/avatars/'+ avatar , function (err, content) {
    if (err) {
      fs.readFile('uploads/avatars/default-avatar.png' , function (err, content){
        res.writeHead(200,{'Content-type':'image/png'});
        res.end(content);
      });
    } else {
      //specify the content type in the response will be an image
      res.writeHead(200,{'Content-type':'image/jpg'});
      res.end(content);
    }
  });

});
router.post('/new', function(req, res, next){
  let newEmployeeId = null;
  Employee.findMax(function(err, doc){
    if(err){
      res.status(400);
    }else {
      newEmployeeId = req.body.employeeId? req.body.employeeId : doc[0].employeeId + 1;
      let newEmployee = new Employee({
        _id: new mongoose.Types.ObjectId(),
        employeeId: newEmployeeId,
        firstName: req.body.firstName,
        middleName: req.body.middleName,
        lastName: req.body.lastName,
        socialSecurity: req.body.socialSecurity,
        gender: req.body.gender,
        status: req.body.status.toLowerCase()
      });
      newEmployee.save(function (err, result){
        if (err) {
          return res.status(500).json({
            title: 'An error occurred',
            error: err
          });
        } else {
          res.status(200).json(result);
        }
      });
    }
   });
});


//TODO: move to correct place
router.get('/allHours', (req, res, next) => {
  EmployeeHours.find({}, (error, result) => {
    if(!result) {
      res.status(404);
    }else if(error) {
      res.status(500);
    }else {
      res.status(200).json(result);
    }
  });
});


module.exports = router;
