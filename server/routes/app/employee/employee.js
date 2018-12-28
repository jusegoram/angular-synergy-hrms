let express = require('express');
let router = express.Router()

let jwt = require('jsonwebtoken');
let fs = require('fs');
let mongoose = require('mongoose');

let Employee = require('../../../models/employee/employee-main');
let EmployeePosition = require("../../../models/employee/employee-position");
let EmployeePersonal = require("../../../models/employee/employee-personal");
let EmployeePayroll = require("../../../models/employee/employee-payroll");
let EmployeeFamily = require("../../../models/employee/employee-family");
let EmployeeCompany = require("../../../models/employee/employee-company");
let EmployeeEducation = require("../../../models/employee/employee-education");
let EmployeeComment = require("../../../models/employee/employee-comment");
let EmployeeShift = require("../../../models/employee/employee-shift")



router.get('/populateTable', function(req, res, next) {
    var token = jwt.decode(req.query.token);
    Employee.find().sort({status: 1, employeeId: 1}).exec(
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
    Employee.find({ _id: req.query.id}, )
      .populate('company')
      .populate('payroll')
      .populate('personal')
      .populate({
        path: 'position',
        model: 'Employee-Position',
        populate: {path: 'position', model: 'Administration-Position'},
      })
      .populate({
        path:'shift',
        model: 'Employee-Shift',
        populate: { path: 'shift', model: 'Administration-Shift' },
      })
      .populate({
        path: 'family',
        model: 'Employee-Family'
      })
      .populate({
        path: 'education',
        model: 'Employee-Education',
      })
      .populate({
        path: 'comments',
        model: 'Employee-Comment',
        populate: { path:'submittedBy', select:'firstName lastName', model:'Administration-User'},
      })
      .exec((err, result) => {
        if (err) res.status(500);
         res.status(200).json(result);
      });
});

//Deprecated: this will be removed if not used in the next month June 13/2018
router.get('/company', function(req, res, next){
  EmployeeCompany.findOne({ employeeId: req.query.employeeId}, function(err, result){
    if (err) {
      return res.status(500).json({
        title: 'An error occurred',
        error: err
      });
    }
    res.status(200).json(result);
  });
});
router.get('/position', function(req, res, next){
  EmployeePosition.find({ employeeId: req.query.employeeId}, function(err, result){
    if (err) {
      return res.status(500).json({
        title: 'An error occurred',
        error: err
      });
    }
    res.status(200).json(result);
  });
});
router.get('/personal', function(req, res, next){
  EmployeePersonal.find({ employeeId: req.query.employeeId}, function(err, result){
    if (err) {
      return res.status(500).json({
        title: 'An error occurred',
        error: err
      });
    }
    res.status(200).json(result);
  });
});
router.get('/family', function(req, res, next){
  EmployeeFamily.find({ employeeId: req.query.employeeId}, function(err, result){
    if (err) {
      return res.status(500).json({
        title: 'An error occurred',
        error: err
      });
    }
    res.status(200).json(result);
  });
});
router.get('/education', function(req, res, next){
  EmployeeEducation.find({ employeeId: req.query.employeeId}, function(err, result){
    if (err) {
      return res.status(500).json({
        title: 'An error occurred',
        error: err
      });
    }
    res.status(200).json(result);
  });
});
router.get('/payroll', function(req, res, next){
  EmployeePayroll.findById(req.query.id, function(err, result){
    if (err) {
      return res.status(500).json({
        title: 'An error occurred',
        error: err
      });
    }
    res.status(200).json(result);
  });
});


router.put('/main', function (req, res, next) {
  Employee.findById(req.query.id, function (err, result) {
    if (!result)
      return next(new Error('Could not load Document'));
    else {
      result.employeeId = req.body.employeeId;
      result.firstName = req.body.firstName;
      result.middleName = req.body.middleName;
      result.lastName = req.body.lastName;
      result.socialSecurity = req.body.socialSecurity;
      result.status = req.body.status.toLowerCase();
      result.gender = req.body.gender;
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
  EmployeeShift.findById(req.query.id, function (err, result){
    if (!result) {
      return next(new Error('could not load doc'));
    } else {
    //TODO: finish update for shifts
    }
  });
});
router.put('/company', function (req, res, next) {
  EmployeeCompany.findById(req.query.id, function (err, result) {
    if (!result)
      return next(new Error('Could not load Document'));
    else {
    result.employeeId = req.body.employeeId;
    result.client = req.body.client;
    result.campaign = req.body.campaign;
    result.supervisor = req.body.supervisor;
    result.trainer = req.body.trainer;
    result.trainingGroupRef = req.body.trainingGroupRef;
    result.trainingGroupNum = req.body.trainingGroupNum;
    result.hireDate = req.body.hireDate;
    result.terminationDate = req.body.terminationDate;
    result.reapplicant = req.body.reapplicant;
    result.reapplicantTimes = req.body.reapplicantTimes;
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
  EmployeePersonal.findById(req.query.id, function(err, result){
    if (!result)
      return next(new Error('Could not load Document'));
    else {
    result.maritalStatus = req.body.maritalStatus;
    result.address = req.body.address;
    result.town = req.body.town;
    result.district = req.body.district;
    result.addressDate = req.body.addressDate;
    result.celNumber = req.body.celNumber;
    result.telNumber = req.body.telNumber;
    result.birthDate = req.body.birthDate;
    result.birthPlaceDis = req.body.birthPlaceDis;
    result.birthPlaceTow = req.body.birthPlaceTow;
    result.emailAddress = req.body.emailAddress;
    result.emailDate = req.body.emailDate;
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
router.put('/payroll', function (req, res, next) {
  EmployeePayroll.findById(req.query.id, function(err, result){
    if (!result)
      return next(new Error('Could not load Document'));
    else {
    result.TIN = req.body.TIN;
    result.positionId = req.body.positionId;
    result.payrollType = req.body.payrollType;
    result.baseWage = req.body.baseWage;
    result.bankName = req.body.bankName;
    result.bankAccount = req.body.bankAccount;
    result.billable = req.body.billable;
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
        res.status(200).json(raw);
      });
    });
  });
});
router.post('/company', function(req, res){
  Employee.findById(req.body.employee, (err, employee) => {
    let id = new mongoose.Types.ObjectId();
    let current = new EmployeeCompany({
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
    });
    employee.company = id;
    employee.save();
    current.save(function(err, result) {
      if (err) {
        return res.status(500).json({
          title: 'An error occurred',
          error: err
        });
      }
      return res.status(201).json(result);
    });
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
router.post('/personal', function(req, res, next){
  Employee.findById(req.body.employee, (err, employee) => {
    let id = new mongoose.Types.ObjectId();
    let personal = new EmployeePersonal({
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
  });
    employee.personal = id;
    employee.save();
  personal.save(function(err, result) {
    if (err) {
      return res.status(500).json({
        title: 'An error occurred',
        error: err
      });
    }
    return res.status(201).json(result);
  });
  });
});
router.post('/family', function(req, res, next){
  if (req.body.employeeId){
    let id = new mongoose.Types.ObjectId();
    let newFamily = new EmployeeFamily({
      _id: id,
      employeeId: req.body.employeeId,
      referenceName: req.body.referenceName,
      relationship: req.body.relationship,
      celNumber: req.body.celNumber,
      telNumber: req.body.telNumber,
      emailAddress: req.body.emailAddress,
      address: req.body.address,
      employee: req.body.employee
    });
    newFamily.save(function (err, result){
      if (err) {
        return res.status(500).json({
          title: 'An error occurred',
          error: err
        });
      }
      Employee.update({_id: newFamily.employee}, {$push: { family: newFamily }}, function(err){
      });
      return res.status(200).json(result);
    });
  } else {
    return res.status(400).message('sorry, the request was either empty or invalid');
  }
});
router.post('/education', function(req, res, next){
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
    newEducation.save(function (err, result){
      if (err) {
        return res.status(500).json({
          title: 'An error occurred',
          error: err
        });
      }
      Employee.update({_id: newEducation.employee}, {$push: { education: newEducation }}, function(err){
      });
      return res.status(200).json(result);
    });
  } else {
    return res.status(400).message('sorry, the request was either empty or invalid');
  }
});
router.post('/payroll', function(req, res, next){
  Employee.findById(req.body.employee, (err, employee) => {
    let id = new mongoose.Types.ObjectId();
    var payroll = new EmployeePayroll({
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
    });
    employee.payroll = id;
    employee.save();
    payroll.save(function (err, result) {
      if (err) {
        return res.status(500).json({
          title: 'An error occurred',
          error: err
        });
      }
      return res.status(201).json(result);
    });
  });
});
router.post('/comment', function(req, res, next){
  if (req.body.employeeId){
    let id = new mongoose.Types.ObjectId();
    let newComment = new EmployeeComment({
      _id: id,
      employeeId: req.body.employeeId,
      comment: req.body.comment,
      commentDate: req.body.commentDate,
      submittedBy: req.body.submittedBy,
      employee: req.body.employee
    });
    newComment.save(function (err, result){
      if (err) {
        return res.status(500).json({
          title: 'An error occurred',
          error: err
        });
      }
      Employee.update({_id: newComment.employee}, {$push: { comments: newComment }}, function(err){
      });
      return res.status(200).json(result);
    });
  } else {
    return res.status(400).message('sorry, the request was either empty or invalid');
  }
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



module.exports = router;
