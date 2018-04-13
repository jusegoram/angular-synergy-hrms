var express = require('express');
var fs         = require('fs');
//require the express router
var router = express.Router();
//require multer for the file uploads & fast-csv for parsing csv
var multer = require('multer');
var mongoose = require('mongoose');
var csv = require('fast-csv');
var Employee = require ('../models/employee/employee');
var Position = require ('../models/employee/employee-position');
var Personal = require ('../models/employee/employee-personal');
var Payroll = require ('../models/employee/employee-payroll');
var Family = require ('../models/employee/employee-family');
var Education = require ('../models/employee/employee-education');
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
                employees.push(data);
            })
            .on('end', function(){
                
                for(i = 0; i < employees.length; i++){
                    Employee.create(employees[i]);
                }
                return res.status(200).send("Employees without duplicates were added");
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
        if(employeeFile.mimetype != "text/csv"){
            return res.status(400).send("Sorry only CSV files can be processed for upload");    
        }
        csv.fromPath(req.file.path,{headers: true, ignoreEmpty: true})
        .on('data', function(data){
            data['_id'] = new mongoose.Types.ObjectId();
            position.push(data);
            console.log(position);
        })
        .on('end', function(){
            Position.create(position,function(err, documents){
                if (err){
                    console.log(err);
                } 
            });
            console.log('upload finished');
        });
        return res.status(200).send('the job position information of employees was uploaded');
        
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
            personal.push(data);
            console.log(personal);
        })
        .on('end', function(){
            Personal.create(personal,function(err, documents){
                if (err){
                    console.log(err);
                } 
            });
            console.log('upload finished');
        });
        return res.status(200).send('the personal information of employees was uploaded');
        
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
            payroll.push(data);
            console.log(payroll);
        })
        .on('end', function(){
            Payroll.create(payroll,function(err, documents){
                if (err){
                    console.log(err);
                } 
            });
            console.log('upload finished');
        });
        return res.status(200).send('the payroll information of employees was uploaded');
        
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
            family.push(data);
            console.log(family);
        })
        .on('end', function(){
            Family.create(family,function(err, documents){
                if (err){
                    console.log(err);
                } 
            });
            console.log('upload finished');
        });
        return res.status(200).send('the family information of employees was uploaded');
        
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
            education.push(data);
            console.log(education);
        })
        .on('end', function(){
            Education.create(education,function(err, documents){
                if (err){
                    console.log(err);
                } 
            });
            console.log('upload finished');
        });
        return res.status(200).send('the education information of employees was uploaded');
        
    });

});
module.exports = router;