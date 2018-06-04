let express = require('express');
let fs = require('fs');
let async = require('async');
//require the express router
var router = express.Router();
//require multer for the file uploads & fast-csv for parsing csv
var multer = require('multer');
var mongoose = require('mongoose');
var csv = require('fast-csv');
var Employee = require ('../../../models/employee/employee-main');
var Position = require ('../../../models/employee/employee-position');
var Personal = require ('../../../models/employee/employee-personal');
var Payroll = require ('../../../models/employee/employee-payroll');
var Family = require ('../../../models/employee/employee-family');
var Education = require ('../../../models/employee/employee-education');
// set the directory for the uploads to the uploaded to
var DIR = 'uploads/';

var path = require('path')
//define the type of upload multer would be doing and pass in its destination, in our case, its a single file with the name photo
var storage = multer.diskStorage({
    destination:'uploads/',
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
  });
var upload = multer({storage: storage}).single('file');



//our file upload function.
router.post('/', function (req, res) {
        upload(req, res, function (err) {
            var employees = [];
            var employeeFile = req.file;
            if (err) {
            // An error occurred when uploading
                return res.status(422).send("an Error occured");
            } if( employeeFile.mimetype != "text/csv" ){
                return res.status(400).send("Sorry only CSV files can be processed for upload");
            }
            csv.fromPath(req.file.path,{headers: true, ignoreEmpty: true})
            .on('data', function(data){
                data['_id'] = new mongoose.Types.ObjectId();
                data['idasnum'] = parseInt(data['employeeId']+"");
                employees.push(data);
            })
            .on('end', function(){
                let counter = 0;
                for(i = 0; i < employees.length; i++){
                    Employee.create(employees[i]);
                    counter++
                }
                return res.status(200).send(counter + "Employees without duplicates were added");
            });
        });

});

router.post('/position', function (req, res) {
    upload(req, res, function (err) {
        var position = [];
        var positionFile = req.file;
        if (err) {
        // An error occurred when uploading
        console.log(err);
        return res.status(422).send("an Error occured");
        }
        if(positionFile.mimetype != "text/csv"){
            return res.status(400).send("Sorry only CSV files can be processed for upload");
        }
        csv.fromPath(req.file.path,{headers: true, ignoreEmpty: true})
        .on('data', function(data){
            data['_id'] = new mongoose.Types.ObjectId();
            data['employee'] = null;
            position.push(data);
        })
        .on('end', function(){
            async.each(position, function(pos, callback){
                Employee.findOne({'employeeId': pos.employeeId}, function(err, res){
                    if(err){
                        callback(err)
                    }else{
                        pos.employee = res._id;
                        callback();
                    }
                })
            }, function(err){
                if(err){
                    console.log(err);
                }else{
                    Position.create(position);
                }
            });

            console.log('upload finished');
            return res.status(200).send(position.length + ' lines of position information for employees was uploaded');
        });
    });

});

router.post('/personal', function (req, res) {
    upload(req, res, function (err) {
        var personal = [];
        var personalFile = req.file;
        if (err) {
        // An error occurred when uploading
        console.log(err);
        return res.status(422).send("an Error occured");
        }
        if(employeeFile.mimetype != "text/csv"){
            return res.status(400).send("Sorry only CSV files can be processed for upload");
        }
        csv.fromPath(req.file.path,{headers: true, ignoreEmpty: true})
        .on('data', function(data){
            data['_id'] = new mongoose.Types.ObjectId();
            data['employee'] = null;
            personal.push(data);

        })
        .on('end', function(){
            async.each(personal, function(per, callback){
                Employee.findOne({'employeeId': per.employeeId}, function(err, res){
                    if(err){
                        callback(err)
                    }else{
                        per.employee = res._id;
                        callback();
                    }
                })
            }, function(err){
                if(err){
                    console.log(err);
                }else{
                    Personal.create(personal);
                }
            });
            console.log('upload finished');
            return res.status(200).send( personal.lenght + ' Registries of personal information of employees was uploaded');
        });
    });
});


router.post('/payroll', function (req, res) {
    upload(req, res, function (err) {
        var payroll = [];
        var payrollFile = req.file;
        if (err) {
        // An error occurred when uploading
        console.log(err);
        return res.status(422).send("an Error occured");
        }
        if(employeeFile.mimetype != "text/csv"){
            return res.status(400).send("Sorry only CSV files can be processed for upload");
        }
        csv.fromPath(req.file.path,{headers: true, ignoreEmpty: true})
        .on('data', function(data){
            data['_id'] = new mongoose.Types.ObjectId();
            data['employee'] = null;
            payroll.push(data);

        })
        .on('end', function(){
            async.each(payroll, function(pay, callback){
                Employee.findOne({'employeeId': pay.employeeId}, function(err, res){
                    if(err){
                        callback(err)
                    }else{
                        pay.payroll = res._id;
                        callback();
                    }
                })
            }, function(err){
                if(err){
                    console.log(err);
                }else{
                    Payroll.create(payroll);
                }
            });
            console.log('upload finished');
            return res.status(200).send( payroll.lenght + ' Registries of payroll information of employees was uploaded');
        });
    });
});


router.post('/family', function (req, res) {
    upload(req, res, function (err) {
        var family = [];
        var familyFile = req.file;
        if (err) {
        // An error occurred when uploading
        console.log(err);
        return res.status(422).send("an Error occured");
        }
        if(employeeFile.mimetype != "text/csv"){
            return res.status(400).send("Sorry only CSV files can be processed for upload");
        }
        csv.fromPath(req.file.path,{headers: true, ignoreEmpty: true})
        .on('data', function(data){
            data['_id'] = new mongoose.Types.ObjectId();
            data['employee'] = null;
            family.push(data);

        })
        .on('end', function(){
            async.each(family, function(fam, callback){
                Employee.findOne({'employeeId': fam.employeeId}, function(err, res){
                    if(err){
                        callback(err)
                    }else{
                        fam.employee = res._id;
                        callback();
                    }
                })
            }, function(err){
                if(err){
                    console.log(err);
                }else{
                    Family.create(family);
                }
            });
            console.log('upload finished');
            return res.status(200).send( family.lenght + ' Registries of payroll information of employees was uploaded');
        });
    });
});


router.post('/education', function (req, res) {
    upload(req, res, function (err) {
        var education = [];
        var educationFile = req.file;
        if (err) {
        // An error occurred when uploading
        console.log(err);
        return res.status(422).send("an Error occured");
        }
        if(employeeFile.mimetype != "text/csv"){
            return res.status(400).send("Sorry only CSV files can be processed for upload");
        }
        csv.fromPath(req.file.path,{headers: true, ignoreEmpty: true})
        .on('data', function(data){
            data['_id'] = new mongoose.Types.ObjectId();
            data['employee'] = null;
            education.push(data);
            console.log(education);
        })
        .on('end', function(){
            async.each(education, function(edu, callback){
                Employee.findOne({'employeeId': edu.employeeId}, function(err, res){
                    if(err){
                        callback(err)
                    }else{
                        edu.employee = res._id;
                        callback();
                    }
                })
            }, function(err){
                if(err){
                    console.log(err);
                }else{
                    Education.create(education);
                }
            });
            console.log('upload finished');
            return res.status(200).send( education.lenght + ' Registries of payroll information of employees was uploaded');
        });
    });

});

router.post('/avatars', function(req, res){
    var avatarStorage = multer.diskStorage({
        destination:'uploads/avatars',
        filename: function (req, file, cb) {
          cb(null,req.query.employeeId + path.extname(file.originalname));
        }
      });
      var avatarUpload = multer({storage: avatarStorage}).single('file');

      avatarUpload(req, res, function (err) {
        if(err){
            res.status(400).send("error in the upload");
        }
        if(req.file.mimetype != "image/jpeg"){
            res.status(400).send("only jpeg is allowed");
        }
        res.status(200).send("avatar uploaded successfully");
      });
});



module.exports = router;
