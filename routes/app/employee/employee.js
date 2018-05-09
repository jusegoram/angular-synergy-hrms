var express = require('express');
var router = express.Router()

var jwt = require('jsonwebtoken');
var fs = require('fs');
var mongoose = require('mongoose');

var Employee = require('../../../models/employee/employee');
var EmployeePosition = require("../../../models/employee/employee-position");
var EmployeePersonal = require("../../../models/employee/employee-personal");
var EmployeePayroll = require("../../../models/employee/employee-payroll");
var EmployeeFamily = require("../../../models/employee/employee-family");
var EmployeeCompany = require("../../../models/employee/employee-company");
var EmployeeEducation = require("../../../models/employee/employee-education");

var positions = [
    { id: '1001', name:'ED 1' },
    { id: '1002', name:'Rep 2: A' },
    { id: '1003', name:'Rep 3: Silver' },
    { id: '1004', name:'Rep 4: Gold' },
    { id: '1005', name:'Rep 5: Platinum' },
    { id: '1006', name:'Rep 6: Emerald' },
    { id: '1007', name:'Rep 7: ' },
    { id: '1008', name:'Rep 8' },
    { id: '1009', name:'Cleaner I' },
    { id: '1010', name:'Security' },
    { id: '1011', name:'Trainee' },
    { id: '1002', name:'ED 1 - old' },
    { id: '1002', name:'Rep 2: A - old' },
    { id: '1003', name:'Rep 3: Silver - old' },
    { id: '1004', name:'Rep 4: Gold - old' },
    { id: '1005', name:'Rep 5: Platinum - old' },
    { id: '1006', name:'Rep 6: Emerald - old' },
    { id: '1007', name:'Rep 7:  - old' },
    { id: '1008', name:'Rep 8 - old' },
    { id: '1122', name:'Cleaner I - old' },
    { id: '1010', name:'Security - old' },
    { id: '1011', name:'Trainee - old' }

];
router.get('/populateTable', function(req, res, next) {
    var token = jwt.decode(req.query.token);
    Employee.find(
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
        res.status(200).json({
            message: 'Employee request succesfull',
            obj: result
        });
    });
});

//get and update main detail component
router.get('/main', function(req, res, next){
    Employee.findById(req.query.id, function(err, result){
        if (err) {
            return res.status(500).json({
                title: 'An error occurred',
                error: err
            });
        }
        res.status(200).json({
            message: 'Employee request succesfull',
            obj: result
        });
    });
});

router.put('/main', function (req, res, next) {
    Employee.findById(req.query.id, function(err, doc){
        doc.employeeId = req.body.employeeId;
        doc.firstName = req.body.firstName;
        doc.middleName = req.body.middleName;
        doc.lastName = req.body.lastName;
        doc.socialSecurity = req.body.socialSecurity;
        doc.status = req.body.status;
        doc.gender = req.body.gender;
        doc.save();
        if (err) {
            return res.status(500).json({
                title: 'An error occurred',
                error: err
            });
        }
        res.status(200).json({
            message: 'Employee update request succesfull',
            obj: doc
        });
    });
   });

   router.post('/main', function(req, res, next){
    var employee = new Employee({
        _id: new mongoose.Types.ObjectId(),
            employeeId: this.generateId() + "",
            idasnum: this.generateId(),
            firstName: req.body.firstName,
            middleName: req.body.middleName,
            lastName: req.body.lastName,
            gender: req.body.gender,
            socialSecurity: req.body.socialSecurity,
            status: req.body.status,
    });
    employee.save(function(err, result) {
        if (err) {
            return res.status(500).json({
                title: 'An error occurred',
                error: err
            });
        }
        res.status(201).json({
            message: 'new employee created',
            obj: result
        });
    });
});

// get and update position page
router.get('/company', function(req, res, next){
    EmployeeCompany.find({ employeeId: req.query.employeeId}, function(err, result){
    if (err) {
        return res.status(500).json({
            title: 'An error occurred',
            error: err
        });
    }
    res.status(200).json({
        message: 'Employee company request succesfull',
        obj: result
    });
});
});

router.put('/company', function (req, res, next) {
    EmployeeCompany.findById(req.query.id, function(err, doc){
        doc.employeeId = req.body.employeeId;
        doc.client = req.body.client
        doc.campaign = req.body.campaign;
        doc.supervisor = req.body.supervisor;
        doc.trainer = req.body.trainer;
        doc.trainingGroupRef = req.body.trainingGroupRef;
        doc.trainingGroupNum = req.body.trainingGroupNum;
        doc.hireDate = req.body.hireDate;
        doc.terminationDate = req.body.terminationDate;
        doc.reapplicant = req.body.reapplicant;
        doc.reapplicantTimes = req.body.reapplicantTimes;
        doc.save();
        if (err) {
            res.status(400).send("error")
        }
        res.status(200).json({
            message: 'Employee company info update request succesfull',
            obj: doc
        });
    });
});

router.post('/company', function(req, res, next){
    var position = new EmployeeCompany({
        _id: new mongoose.Types.ObjectId(),
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
    position.save(function(err, result) {
        if (err) {
            return res.status(500).json({
                title: 'An error occurred',
                error: err
            });
        }
        res.status(201).json({
            message: 'company info created',
            obj: result
        });
    });
});
// get and update position page
router.get('/position', function(req, res, next){
    EmployeePosition.find({ employeeId: req.query.employeeId}, function(err, result){
    if (err) {
        return res.status(500).json({
            title: 'An error occurred',
            error: err
        });
    }
    res.status(200).json({
        message: 'Employee position request succesfull',
        obj: result
    });
});
});

router.get('/latestPosition', function(req, response, next){
   let latest = EmployeePosition.latestPosition(req.query.id, function(err, res){
        if(err){
            response.status(400).send(err);
            return 
        }
            response.status(200).json({
                message: "successful",
                obj: res
            });
            return
    });

});

router.put('/position', function (req, res, next) {
    EmployeePosition.findById(req.query.id, function(err, doc){
        doc.employeeId = req.body.employeeId;
        doc.positionid = req.body.positionid;
        doc.position = req.body.position;
        doc.startDate = doc.startDate;
        doc.endDate = req.body.endDate;
        doc.save();
        if (err) {
            res.status(400).send("error")
        }
        res.status(200).json({
            message: 'Employee position info update request succesfull',
            obj: doc
        });
    });
});

router.post('/position', function(req, res, next){
    if(req.body.employeeId){
    var position = new EmployeePosition({
        _id: new mongoose.Types.ObjectId(),
        employeeId: req.body.employeeId,
        positionid: req.body.positionid,
        position: req.body.position,
        startDate: req.body.startDate,
        endDate: req.body.endDate,
        employee: req.body.employee
    });
    position.save(function(err, result) {
        if (err) {
            return res.status(500).json({
                title: 'An error occurred',
                error: err
            });
        }
        res.status(201).json({
            message: 'position created',
            obj: result
        });
    });
    }else{
        console.log(req.body);
        res.status(400).message('sorry, the request was either empty or invalid');
    }    
});
// get, update, and save personal component
router.get('/personal', function(req, res, next){
    EmployeePersonal.find({ employeeId: req.query.employeeId}, function(err, result){
    if (err) {
        return res.status(500).json({
            title: 'An error occurred',
            error: err
        });
    }
    res.status(200).json({
        message: 'Employee personal info request succesfull',
        obj: result
    });
});
});
router.put('/personal', function (req, res, next) {
    EmployeePersonal.findById(req.query.id, function(err, doc){
        doc.maritalStatus = req.body.maritalStatus;
        doc.address = req.body.address;
        doc.town = req.body.town;
        doc.district = req.body.district;
        doc.addressDate = req.body.addressDate;
        doc.celNumber = req.body.celNumber;
        doc.telNumber = req.body.telNumber;
        doc.birthDate = req.body.birthDate;
        doc.birthPlaceDis = req.body.birthPlaceDis
        doc.birthPlaceTow = req.body.birthPlaceTow
        doc.emailAddress = doc.emailAddress;
        doc.emailDate = req.body.emailDate;
        doc.save();
        if (err) {
            res.status(400).send("error")
        }
        res.status(200).json({
            message: 'Employee personal info update request succesfull',
            obj: doc
        });
    });
});

router.post('/personal', function(req, res, next){
    var personal = new EmployeePersonal({
        _id: new mongoose.Types.ObjectId(),
        employeeId: req.body.employeeId,
        maritalStatus: req.body.maritalStatus,
        address: req.body.address,
        town: req.body.town,
        district: req.body.district,
        addressDate: req.body.addressDate,
        celNumber: req.body.celNumber,
        telNumber: req.body.telNumber,
        birthDate: req.body.birthDate,
        emailAddress: req.body.emailAddress,
        emailDate: req.body.emailDate,
        employee: req.body.employee
    });
    personal.save(function(err, result) {
        if (err) {
            return res.status(500).json({
                title: 'An error occurred',
                error: err
            });
        }
        res.status(201).json({
            message: 'personal info created',
            obj: result
        });
    });
});

// get and update for family info component

router.get('/family', function(req, res, next){
    EmployeeFamily.find({ employeeId: req.query.employeeId}, function(err, result){
    if (err) {
        return res.status(500).json({
            title: 'An error occurred',
            error: err
        });
    }
    res.status(200).json({
        message: 'Employee family info request succesfull',
        obj: result
    });
});
});
router.put('/family', function (req, res, next) {
    EmployeeFamily.findById(req.query.id, function(err, doc){
        doc.referenceName = req.body.referenceName;
        doc.relationship = req.body.relationship;
        doc.celNumber = req.body.celNumber;
        doc.telNumber = req.body.telNumber;
        doc.emailAddress = doc.emailAddress;
        doc.address = req.body.address;
        doc.save();
        if (err) {
            res.status(400).send("error")
        }
        res.status(200).json({
            message: 'Employee family info update request succesfull',
            obj: doc
        });
    });
});
router.post('/family', function(req, res, next){
    var family = new EmployeeFamily({
        _id: new mongoose.Types.ObjectId(),
        referenceName: req.body.referenceName,
        relationship: req.body.relationship,
        celNumber: req.body.celNumber,
        telNumber: req.body.telNumber,
        emailAddress: req.body.emailAddress,
        addressDate: req.body.addressDate,
        celNumber: req.body.celNumber,
        telNumber: req.body.telNumber,
        address: req.body.address,
        employee: req.body.employee
    });
    family.save(function(err, result) {
        if (err) {
            return res.status(500).json({
                title: 'An error occurred',
                error: err
            });
        }
        res.status(201).json({
            message: 'family info created',
            obj: result
        });
    });
});

// get details for employee education
router.get('/education', function(req, res, next){
    EmployeeEducation.find({ employeeId: req.query.employeeId}, function(err, result){
    if (err) {
        return res.status(500).json({
            title: 'An error occurred',
            error: err
        });
    }
    res.status(200).json({
        message: 'Employee family info request succesfull',
        obj: result
    });
});
});
router.put('/education', function (req, res, next) {
    EmployeeEducation.findById(req.query.id, function(err, doc){
        doc.institution = req.body.institution;
        doc.description = req.body.description;
        doc.startDate = doc.startDate;
        doc.endDate = req.body.endDate;
        doc.save();
        if (err) {
            res.status(400).send("error")
        }
        res.status(200).json({
            message: 'Employee education info update request succesfull',
            obj: doc
        });
    });
});
router.post('/education', function(req, res, next){
    var education = new EmployeeEducation({
        _id: new mongoose.Types.ObjectId(),
        institution: req.body.institution,
        description: req.body.description,
        startDate: req.body.startDate,
        endDate: req.body.endDate,
        employee: req.body.employee
    });
    education.save(function(err, result) {
        if (err) {
            return res.status(500).json({
                title: 'An error occurred',
                error: err
            });
        }
        res.status(201).json({
            message: 'education info created',
            obj: result
        });
    });
});
// get and update payroll info
router.get('/payroll', function(req, res, next){
    EmployeePayroll.find({ employeeId: req.query.employeeId}, function(err, result){
    if (err) {
        return res.status(500).json({
            title: 'An error occurred',
            error: err
        });
    }
    res.status(200).json({
        message: 'Employee payroll info request succesfull',
        obj: result
    });
});
});
router.put('/payroll', function (req, res, next) {
    EmployeePayroll.findById(req.query.id, function(err, doc){
        doc.TIN = req.body.TIN;
        doc.positionid = req.body.positionid;
        doc.payrollType = req.body.payrollType;
        doc.baseWage = req.body.baseWage;
        doc.bankName = doc.bankName;
        doc.bankAccount = req.body.bankAccount;
        doc.billable = req.body.billable;
        doc.save();
        if (err) {
            res.status(400).send("error")
        }
        res.status(200).json({
            message: 'Employee payroll info update request succesfull',
            obj: doc
        });
    });
});
router.post('/payroll', function(req, res, next){
    var payroll = new EmployeePayroll({
        _id: new mongoose.Types.ObjectId(),
        employeeId: req.body.employeeId,
        TIN: req.body.TIN,
        positionid: req.body.positionid,
        payrollType: req.body.payrollType,
        baseWage: req.body.baseWage,
        bankName: req.body.bankName,
        bankAccount: req.body.bankAccount,
        billable: req.body.billable,
        employee: req.body.employee
    });
    payroll.save(function(err, result) {
        if (err) {
            return res.status(500).json({
                title: 'An error occurred',
                error: err
            });
        }
        res.status(201).json({
            message: 'payroll info created',
            obj: result
        });
    });
});

// get and update avatar, no need for put function as this get will replace image on call
router.get('/avatar', function(req, res, next){
    var avatar = req.query.id + ".jpg";
    fs.readFile('uploads/avatars/'+ avatar , function (err, content) { 
        if (err) {
            fs.readFile('uploads/avatars/default-avatar.jpg' , function (err, content){
                res.writeHead(200,{'Content-type':'image/jpg'});
                res.end(content);
            });
        } else {
            //specify the content type in the response will be an image
            res.writeHead(200,{'Content-type':'image/jpg'});
            res.end(content);
        }
    });

});

function generateId(){
    Employee.findMax(function(err, doc){
        if(err){
            return null;
        } else {
            let newId;
            newId = doc[0].employeeId + 1;
            return newId;
        }
    });
}


module.exports = router;