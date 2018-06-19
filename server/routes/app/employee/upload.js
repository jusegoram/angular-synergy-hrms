let express = require('express');
let fs = require('fs');
let async = require('async');
//require the express router
let router = express.Router();
//require multer for the file uploads & fast-csv for parsing csv
let multer = require('multer');
let mongoose = require('mongoose');
let csv = require('fast-csv');
let EmployeeSchema = require ('../../../models/employee/employee-main');
let Position = require ('../../../models/employee/employee-position');
let Personal = require ('../../../models/employee/employee-personal');
let Payroll = require ('../../../models/employee/employee-payroll');
let Family = require ('../../../models/employee/employee-family');
let Education = require ('../../../models/employee/employee-education');
let Department = require('../../../models/administration/administration-department');
let Comment = require('../../../models/employee/employee-comment');
// set the directory for the uploads to the uploaded to
let DIR = 'uploads/';

let path = require('path')
//define the type of upload multer would be doing and pass in its destination, in our case, its a single file with the name photo
let storage = multer.diskStorage({
    destination:'uploads/',
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
  });
let upload = multer({storage: storage}).single('file');



//our file upload function.
router.post('/', function (req, res) {
        upload(req, res, function (err) {
          let employees = [];
          let employeeFile = req.file;
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
            .on('end', function(result){
                let counter = 0;
                for ( i = 0; i < employees.length; i++){
                    EmployeeSchema.create(employees[i], (err, created) =>{
                      if(err) return console.log(err);
                      counter++;
                      console.log('created' + counter);
                    });
                }
                console.log(result);
                return res.sendStatus(200);
            });
        });

});

router.post('/position', function (req, res) {
    upload(req, res, function (err) {
      let position = [];
      let positionFile = req.file;
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
              EmployeeSchema.findOne({'employeeId': pos.employeeId}, function(err, res){
                    if(err){
                        callback(err)
                    }else{

                        pos.employee = res._id;
                        res.save();
                      Department.position.findOne({'positionId': pos.position}, function(err, result){
                        if(err) console.log(err);
                        else {
                          pos.position = result._id;
                          callback();
                        }
                      });
                    }
                    EmployeeSchema.update({_id: pos.employee},{
                      $push: { position: pos._id}}, function(err, raw){
                        console.log(raw||err);
                      });
                });
            }, function(err){
                if(err){
                    console.log(err);
                }else{
                    Position.create(position, function (err, res){
                    });
                }
            });

            console.log('upload finished');
            return res.status(200).send(position.length + ' lines of position information for employees was uploaded');
        });
    });

});

router.post('/personal', function (req, res) {
    upload(req, res, function (err) {
      let personal = [];
      let personalFile = req.file;
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
              EmployeeSchema.findOne({'employeeId': per.employeeId}, function(err, res){
                    if(err){
                        callback(err)
                    }else{
                        res.personal = per._id;
                        per.employee = res._id;
                        res.save();
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
      let payroll = [];
      let payrollFile = req.file;
        if (err) {
        // An error occurred when uploading
        console.log(err);
        return res.status(422).send("an Error occured");
        }
        if(payrollFile.mimetype != "text/csv"){
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
              EmployeeSchema.findOne({'employeeId': pay.employeeId}, function(err, res){
                    if(err){
                        callback(err)
                    }else{
                        res.payroll = pay._id;
                        pay.employee = res._id;
                        res.save();
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
      let family = [];
      let familyFile = req.file;
        if (err) {
        // An error occurred when uploading
        console.log(err);
        return res.status(422).send("an Error occured");
        }
        if(familyFile.mimetype != "text/csv"){
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
              EmployeeSchema.findOne({'employeeId': fam.employeeId}, function(err, res){
                    if(err){
                        callback(err)
                    }else{
                      EmployeeSchema.update({_id: res._id},{
                        $push: { family: fam._id}}, function(err, raw){
                          console.log(raw||err);
                        });
                        fam.employee = res._id;
                        res.save();
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
      let education = [];
      let educationFile = req.file;
        if (err) {
        // An error occurred when uploading
        console.log(err);
        return res.status(422).send("an Error occured");
        }
        if(educationFile.mimetype != "text/csv"){
            return res.status(400).send("Sorry only CSV files can be processed for upload");
        }
        csv.fromPath(req.file.path,{headers: true, ignoreEmpty: true})
        .on('data', function(data){
            data['_id'] = new mongoose.Types.ObjectId();
            data['employee'] = null;
            education.push(data);
        })
        .on('end', function(){
            async.each(education, function(edu, callback){
              EmployeeSchema.findOne({'employeeId': edu.employeeId}, function(err, res){
                    if(err){
                        callback(err)
                    }else{
                      EmployeeSchema.update({_id: res._id},{
                        $push: { education: edu._id}}, function(err, raw){
                          console.log(raw||err);
                        });
                        edu.employee = res._id;
                        res.save();
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

router.post('/comment', function (req, res) {
  upload(req, res, function (err) {
    let comment = [];
    let commentFile = req.file;
      if (err) {
      // An error occurred when uploading
      console.log(err);
      return res.status(422).send("an Error occured");
      }
      if(commentFile.mimetype != "text/csv"){
          return res.status(400).send("Sorry only CSV files can be processed for upload");
      }
      csv.fromPath(req.file.path,{headers: true, ignoreEmpty: true})
      .on('data', function(data){
          data['_id'] = new mongoose.Types.ObjectId();
          data['employee'] = null;
          comment.push(data);
      })
      .on('end', function(){
          async.each(comment, function(com, callback){
            EmployeeSchema.findOne({'employeeId': com.employeeId}, function(err, res){
                  if(err){
                      callback(err)
                  }else{
                    EmployeeSchema.update({_id: res._id},{
                      $push: { comments: com._id}}, function(err, raw){
                        console.log(raw||err);
                      });
                      edu.employee = res._id;
                      res.save();
                      callback();
                  }
              })
          }, function(err){
              if(err){
                  console.log(err);
              }else{
                  Comment.create(comment);
              }
          });
          console.log('upload finished');
          return res.status(200).send( education.lenght + ' Registries of payroll information of employees was uploaded');
      });
  });

});

router.post('/avatars', function(req, res){
  let avatarStorage = multer.diskStorage({
        destination:'uploads/avatars',
        filename: function (req, file, cb) {
          cb(null,req.query.employeeId + path.extname(file.originalname));
        }
      });
  let avatarUpload = multer({storage: avatarStorage}).single('file');

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
