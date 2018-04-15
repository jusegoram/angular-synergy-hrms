var express = require('express');
var router = express.Router();
var Employee = require('../models/employee/employee');
var EmployeePosition = require("../models/employee/employee-position");
var EmployeePersonal = require("../models/employee/employee-personal");
var jwt = require('jsonwebtoken');
var fs = require('fs');
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
router.get('/getall', function(req, res, next) {
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

//get and update main detail page
router.get('/getDetail', function(req, res, next){
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

router.put('/update', function (req, res, next) {
    Employee.findById(req.query.id, function(err, doc){
        doc.employeeId = req.body.employeeId;
        doc.firstName = req.body.firstName;
        doc.middleName = req.body.middleName;
        doc.lastName = req.body.lastName;
        doc.birthDate = req.body.birthDate;
        doc.socialSecurity = req.body.socialSecurity;
        doc.client = req.body.client;
        doc.campaign = req.body.campaign;
        doc.supervisorid = req.body.supervisorid;
        doc.status = req.body.status;
        doc.hireDate = req.body.hireDate;
        doc.terminationDate = req.body.terminationDate;
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

// get and update personal page
router.get('/getDetail/personal', function(req, res, next){
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
router.put('/update/personal', function (req, res, next) {
    EmployeePersonal.findById(req.query.id, function(err, doc){
        doc.address = req.body.address;
        doc.addressDate = req.body.addressDate;
        doc.celNumber = req.body.celNumber;
        doc.telNumber = req.body.telNumber;
        doc.emailAddress = doc.emailAddress;
        doc.emailDate = req.body.emailDate;
        doc.save();
        if (err) {
            return res.status(500).json({
                title: 'An error occurred',
                error: err
            });
        }
        res.status(200).json({
            message: 'Employee personal info update request succesfull',
            obj: doc
        });
    });
});


// get and update position page
router.get('/getDetail/position', function(req, res, next){
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

router.get('/getDetail/avatar', function(req, res, next){
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

module.exports = router;