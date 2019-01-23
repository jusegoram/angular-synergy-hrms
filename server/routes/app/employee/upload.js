let express = require('express');
let fs = require('fs');
let async = require('async');
//require the express router
let router = express.Router();
//require multer for the file uploads & fast-csv for parsing csv
let multer = require('multer');
let mongoose = require('mongoose');
let csv = require('fast-csv');
let Department = require('../../../models/administration/administration-department');
let EmployeeSchema = require ('../../../models/app/employee/employee-main');
let EmployeeHours = require ('../../../models/app/employee/employee-hour');
let Position = require ('../../../models/app/employee/employee-position');
let Personal = require ('../../../models/app/employee/employee-personal');
let Payroll = require ('../../../models/app/employee/employee-payroll');
let Family = require ('../../../models/app/employee/employee-family');
let Education = require ('../../../models/app/employee/employee-education');
let Comment = require('../../../models/app/employee/employee-comment');
let Company = require('../../../models/app/employee/employee-company');
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
          let maxEmployeeId = null;
            if (err) {
            // An error occurred when uploading
                return res.status(422).send("an Error occured");
            }
             if( employeeFile.mimetype !== 'application/vnd.ms-excel' && employeeFile.mimetype !== 'text/csv'){
               return res.status(400).send("Sorry only CSV files can be processed for upload");
            }
            EmployeeSchema.findMax((maxErr, max) => {
              if(maxErr){
                console.log(maxErr);
              }else {
                maxEmployeeId = parseInt(max[0].employeeId, 10)
                console.log(max);
              }
            });
            csv.fromPath(req.file.path,{headers: true, ignoreEmpty: true})
            .on('data', (data) => {
              console.log('onDataHook')
                data['_id'] = new mongoose.Types.ObjectId();
                data['company'] = null;
                data['payroll'] = null;
                data['personal'] = null;
                employees.push(data);
            })
            .on('end', (result) => {
              console.log('onEndHook');
                let counter = 0;
                let duplicate = 0;
                // for ( i = 0; i < employees.length; i++){

                // }
                async.each(employees, function(employee, callback) {
                  maxEmployeeId++;
                  if(employee.employeeId === ''){
                    employee.employeeId = maxEmployeeId;
                  }
                   EmployeeSchema.create(employee, (err, created) =>{
                    if(err) {
                      duplicate++
                      console.log('err: '+ duplicate);
                      callback();
                    }else{
                      counter++;
                    console.log('created: ' + counter);
                      callback();
                    }
                  });
                });
                console.log('--EMPLOYEE CREATION-- Employees created: '+counter+' Duplicates found: '+duplicate);
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
        if(positionFile.mimetype !== 'application/vnd.ms-excel' && positionFile.mimetype !== 'text/csv'){
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
        if(personalFile.mimetype !== 'application/vnd.ms-excel' && personalFile.mimetype !== 'text/csv'){
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

router.post('/company', function (req, res) {
  upload(req, res, function (err) {
    let company = [];
    let companyFile = req.file;
      if (err) {
      // An error occurred when uploading
      console.log(err);
      return res.status(422).send("an Error occured");
      }
      if(companyFile.mimetype !== 'application/vnd.ms-excel' && companyFile.mimetype !== 'text/csv'){
          return res.status(400).send("Sorry only CSV files can be processed for upload");
      }
      csv.fromPath(req.file.path,{headers: true, ignoreEmpty: true})
      .on('data', function(data){
          data['_id'] = new mongoose.Types.ObjectId();
          data['employee'] = null;
          company.push(data);

      })
      .on('end', function(){
        let counter = 0;
        let duplicate = 0;
          async.each(company, function(comp, callback){
            EmployeeSchema.findOne({'employeeId': comp.employeeId}, function(err, res){
                  if(err){
                    console.log(err);
                      duplicate++
                  }else{
                    counter++;
                    if(res !== null){
                      res.company = comp._id;
                      comp.employee = res._id;
                      res.save();
                      callback();
                    }else{
                      console.log('not found id: '+ comp.employeeId);
                      callback();
                    }
                  }
              })
          }, function(err){
              if(err){
                  console.log(err);
              }else{
                  Company.create(company);
              }
          });
          console.log('upload finished');
          return res.status(200).send( counter + ' Registries of company information of employees was uploaded');
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
        if(payrollFile.mimetype !== 'application/vnd.ms-excel' && payrollFile.mimetype !== 'text/csv'){
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
                    Payroll.EmployeePayroll.create(payroll);
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
        if(familyFile.mimetype !== 'application/vnd.ms-excel' && familyFile.mimetype !== 'text/csv'){
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
                      if(res !== null){
                        EmployeeSchema.update({_id: res._id},{
                          $push: { family: fam._id}}, function(err, raw){
                            console.log(raw||err);
                          });
                          fam.employee = res._id;
                          res.save();
                          callback();
                      }
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
        if(educationFile.mimetype !== 'application/vnd.ms-excel' && educationFile.mimetype !== 'text/csv'){
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
      if(commentFile.mimetype !== 'application/vnd.ms-excel' && commentFile.mimetype !== 'text/csv'){
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

router.post('/hours', function (req, res) {
  upload(req, res, function (err) {
    let hours = [];
    let hoursFile = req.file;
      if (err) {
      // An error occurred when uploading
      console.log(err);
      return res.status(422).send("an Error occured");
      }
      if(hoursFile.mimetype !== 'application/vnd.ms-excel' && hoursFile.mimetype !== 'text/csv'){
          return res.status(400).send("Sorry only CSV files can be processed for upload");
      }
      csv.fromPath(req.file.path,{headers: true, ignoreEmpty: true})
      .on('data', function(data){
          data['_id'] = new mongoose.Types.ObjectId();
          data['employee'] = null;
          hours.push(data);

      })
      .on('end', function(){
        let counter = 0;
        let duplicate = 0;
          async.each(hours, function(hour, callback){
            EmployeeSchema.findOne({'employeeId': hour.employeeId}, function(err, res){
                  if(err){
                    console.log(err);
                      duplicate++
                  }else{
                    counter++;
                    if(res !== null){
                      res.hours = hour._id;
                      hour.employee = res._id;
                      res.save();
                      callback();
                    }else{
                      console.log('not found id: '+ hour.employeeId);
                      callback();
                    }
                  }
              })
          }, function(err){
              if(err){
                  console.log(err);
              }else{
                  EmployeeHours.create(hours).then(res => console.log(res)).catch(err => console.log(err));
              }
          });
          console.log('upload finished');
          return res.status(200).send( counter + ' Registries of hours information of employees was uploaded and' + duplicate + 'were for some reason not uploaded');
      });
  });
});

router.post('/avatars', function(req, res){
  let avatarStorage = multer.diskStorage({
        destination:'uploads/avatars',
        filename: function (req, file, cb) {
          cb(null,req.query.id + '.jpg');
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
        fs.readFile('uploads/avatars/' + req.query.id + '.jpg', function(err, content){
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
});



module.exports = router;
