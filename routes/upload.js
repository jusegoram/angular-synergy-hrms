var express = require('express');
var fs         = require('fs');
//require the express router
var router = express.Router();
//require multer for the file uploads & fast-csv for parsing csv
var multer = require('multer');
var mongoose = require('mongoose');
var csv = require('fast-csv');
var Employee = require ('../models/employee/employee');
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
            console.log(err);
            return res.status(422).send("an Error occured");
            }  
            csv.fromPath(req.file.path,{headers: true, ignoreEmpty: true})
            .on('data', function(data){
                data['_id'] = new mongoose.Types.ObjectId();
                employees.push(data);
                console.log(employees);
            })
            .on('end', function(){
                Employee.create(employees,function(err, documents){
                    if (err){
                        console.log(err);
                    } 
                });
                console.log('upload finished');
            });
            return res.send(employees.length + ' employees were uploaded');
            
        });

});

module.exports = router;