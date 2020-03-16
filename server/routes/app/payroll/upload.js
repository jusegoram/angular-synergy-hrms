let express = require('express');
let fs         = require('fs');
let async = require('async');
//require the express router
let router = express.Router();
//require multer for the file uploads & fast-csv for parsing csv
let multer = require('multer');
let mongoose = require('mongoose');
let csv = require('fast-csv');

// set the directory for the uploads to the uploaded to
var DIR = 'uploads/payroll';

var path = require('path');
// define the type of upload multer would be doing and pass in its destination, in our case, its a single file with the name photo
var storage = multer.diskStorage({
  destination:'uploads/',
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});
var upload = multer({storage: storage}).single('file');

// File upload function

// router.post('/', function (req, res) {
//   upload(req, res, function (err) {
//     var registry = [];
//     var uploadFile = req.file;
//     if (err) {
//       // An error occurred when uploading
//       return res.status(422).send("an Error occured");
//     } if( uploadFile.mimetype != "text/csv" ){
//       return res.status(400).send("Sorry only CSV files can be processed for upload");
//     }
//     csv.parseFile(req.file.path,{headers: true, ignoreEmpty: true})
//       .on('data', function(data){
//         data['_id'] = new mongoose.Types.ObjectId();
//         data['idasnum'] = parseInt(data['employeeId']+"");
//         registry.push(data);
//       })
//       .on('end', function(){
//         let counter = 0;
//         for(i = 0; i < registry.length; i++){
//           Employee.create(registry[i]);
//           counter++
//         }
//         return res.status(200).send(counter + "Employees without duplicates were added");
//       });
//   });

// });

// router.get('/', function (req, res, next) {
//   var fields = [
//     'employeeId',
//     'dialerId',
//     'date',
//     'hours'
//   ];

//   var csv = json2csv({ data: '', fields: fields });

//   res.set("Content-Disposition", "attachment;filename=payroll-hours-upload.csv");
//   res.set("Content-Type", "application/octet-stream");

//   res.send(csv);
// });
