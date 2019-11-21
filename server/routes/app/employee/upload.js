let express = require("express");
let fs = require("fs");
let async = require("async");
//require the express router
let router = express.Router();
//require multer for the file uploads & fast-csv for parsing csv
let multer = require("multer");
let mongoose = require("mongoose");
let csv = require("fast-csv");
let Department = require("../../../models/administration/administration-department");
let EmployeeSchema = require("../../../models/app/employee/employee-main");
let Position = require("../../../models/app/employee/employee-position");
let EmployeeShift = require("../../../models/app/employee/employee-shift");
// set the directory for the uploads to the uploaded to
let DIR = "uploads/employeeFiles";

let path = require("path");
//define the type of upload multer would be doing and pass in its destination, in our case, its a single file with the name photo
let storage = multer.diskStorage({
  destination: "uploads/employeeFiles",
  filename: function(req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  }
});
let upload = multer({ storage: storage }).single("file");

//our file upload function.
router.post("/", function(req, res) {
  upload(req, res, function(err) {
    let employees = [];
    let employeeFile = req.file;
    let maxEmployeeId = null;
    if (err) res.status(422).send("an Error occured");
    if (
      employeeFile.mimetype !== "application/vnd.ms-excel" &&
      employeeFile.mimetype !== "text/csv"
    ) {
      res.status(400).send("Sorry only CSV files can be processed for upload");
    }
    EmployeeSchema.findMax((maxErr, max) => {
      if (maxErr) console.log(maxErr);
      else {
        maxEmployeeId = parseInt(max[0].employeeId, 10);
        csv
          .fromPath(req.file.path, { headers: true, ignoreEmpty: true })
          .on("data", data => {
            data["_id"] = new mongoose.Types.ObjectId();
            data["company"] = null;
            data["payroll"] = null;
            data["personal"] = null;
            employees.push(data);
          })
          .on("end", result => {
            let counter = 0;
            let duplicate = 0;
            async.each(employees, (employee, callback) => {
              maxEmployeeId++;
              if (employee.employeeId === "")
                employee.employeeId = maxEmployeeId;
              EmployeeSchema.create(employee, (err, created) => {
                if (err) {
                  duplicate++;
                  callback();
                } else {
                  counter++;
                  callback();
                }
              });
            });
            return res.sendStatus(200);
          });
      }
    });
  });
});

router.post("/position", function(req, res) {
  upload(req, res, function(err) {
    let position = [];
    let positionFile = req.file;
    if (err) {
      // An error occurred when uploading
      console.log(err);
      return res.status(422).send("an Error occured");
    }
    if (
      positionFile.mimetype !== "application/vnd.ms-excel" &&
      positionFile.mimetype !== "text/csv"
    ) {
      return res
        .status(400)
        .send("Sorry only CSV files can be processed for upload");
    }
    csv
      .fromPath(req.file.path, { headers: true, ignoreEmpty: true })
      .on("data", function(data) {
        data["_id"] = new mongoose.Types.ObjectId();
        data["employee"] = null;
        position.push(data);
      })
      .on("end", function() {
        async.each(
          position,
          function(pos, callback) {
            EmployeeSchema.findOne({ employeeId: pos.employeeId }, function(
              err,
              res
            ) {
              if (err) {
                callback(err);
              } else {
                pos.employee = res._id;
                res.save();
                Department.position.findOne(
                  { positionId: pos.position },
                  function(err, result) {
                    if (err) console.log(err);
                    else {
                      pos.position = result._id;
                      callback();
                    }
                  }
                );
              }
              EmployeeSchema.update(
                { _id: pos.employee },
                {
                  $push: { position: pos._id }
                },
                function(err, raw) {
                  console.log(raw || err);
                }
              );
            });
          },
          function(err) {
            if (err) {
              console.log(err);
            } else {
              Position.create(position, function(err, res) {});
            }
          }
        );

        console.log("upload finished");
        return res
          .status(200)
          .send(
            position.length +
              " lines of position information for employees was uploaded"
          );
      });
  });
});

router.post("/personal", (req, res) => {
  upload(req, res, err => {
    let personal = [];
    let personalFile = req.file;
    if (err) res.status(422).send("an Error occured");
    if (
      personalFile.mimetype !== "application/vnd.ms-excel" &&
      personalFile.mimetype !== "text/csv"
    )
      res.status(400).send("Sorry only CSV files can be processed for upload");

    csv
      .fromPath(req.file.path, { headers: true, ignoreEmpty: true })
      .on("data", data => {
        data["_id"] = new mongoose.Types.ObjectId();
        data["employee"] = null;
        personal.push(data);
      })
      .on("end", () => {
        async.each(
          personal,
          (per, callback) => {
            EmployeeSchema.updateOne(
              { employeeId: per.employeeId },
              { $set: { personal: per } },
              (err, res) => {
                callback();
              }
            );
          },
          err => {
            if (err) console.log(err);
          }
        );
        return res
          .status(200)
          .send(
            personal.length +
              " Registries of personal information of employees was uploaded"
          );
      });
  });
});

router.post("/personal/hobbies", (req, res) => {
  upload(req, res, err => {
    let hobbies = [];
    let hobbiesFile = req.file;
    if (err) res.status(422).send("an Error occured");
    if (
      hobbiesFile.mimetype !== "application/vnd.ms-excel" &&
      hobbiesFile.mimetype !== "text/csv"
    )
      res.status(400).send("Sorry only CSV files can be processed for upload");

    csv
      .fromPath(req.file.path, { headers: true, ignoreEmpty: true })
      .on("data", data => {
        data["_id"] = new mongoose.Types.ObjectId();
        data["employee"] = null;
        hobbies.push(data);
      })
      .on("end", () => {
        async.each(
          hobbies,
          (hob, callback) => {
            EmployeeSchema.updateOne(
              { employeeId: hob.employeeId },
              { $push: { "personal.hobbies": hob } },
              (err, res) => {
                callback();
              }
            );
          },
          err => {
            if (err) console.log(err);
          }
        );
        return res
          .status(200)
          .send(
            hobbies.length +
              " Registries of hobbies information of employees was uploaded"
          );
      });
  });
});

router.post("/company", (req, res) => {
  upload(req, res, err => {
    let company = [];
    let companyFile = req.file;
    if (err) {
      console.log(err);
      return res.status(422).send("an Error occured");
    }
    if (
      companyFile.mimetype !== "application/vnd.ms-excel" &&
      companyFile.mimetype !== "text/csv"
    ) {
      return res
        .status(400)
        .send("Sorry only CSV files can be processed for upload");
    }
    csv
      .fromPath(req.file.path, { headers: true, ignoreEmpty: true })
      .on("data", function(data) {
        data["_id"] = new mongoose.Types.ObjectId();
        data["employee"] = null;
        company.push(data);
      })
      .on("end", () => {
        let counter = 0;
        let duplicate = 0;
        async.each(
          company,
          (comp, callback) => {
            comp.reapplicant =
              comp.reapplicant.toLowerCase() === "true" ? true : false;
            comp.bilingual =
              comp.bilingual.toLowerCase() === "true" ? true : false;
            EmployeeSchema.updateOne(
              { employeeId: comp.employeeId },
              { $set: { company: comp } },
              (err, raw) => {
                if (err) {
                  console.log(err);
                  callback();
                } else {
                  callback();
                }
              }
            );
          },
          err => {
            if (err) {
              console.log(err);
            } else {
              res.status(200).send("OK");
            }
          }
        );
      });
  });
});

router.post("/payroll", function(req, res) {
  upload(req, res, function(err) {
    let payroll = [];
    let payrollFile = req.file;
    if (err) {
      // An error occurred when uploading
      console.log(err);
      return res.status(422).send("an Error occured");
    }
    if (
      payrollFile.mimetype !== "application/vnd.ms-excel" &&
      payrollFile.mimetype !== "text/csv"
    ) {
      return res
        .status(400)
        .send("Sorry only CSV files can be processed for upload");
    }
    csv
      .fromPath(req.file.path, { headers: true, ignoreEmpty: true })
      .on("data", function(data) {
        data["_id"] = new mongoose.Types.ObjectId();
        data["employee"] = null;
        payroll.push(data);
      })
      .on("end", function() {
        async.each(
          payroll,
          function(pay, callback) {
            if (pay.billable.toLowerCase() === "true") {
              pay.billable = true;
            } else if (pay.billable.toLowerCase() === "false") {
              pay.billable = false;
            }
            EmployeeSchema.updateOne(
              { employeeId: payroll.employeeId },
              { $set: { payroll: pay } },
              (err, doc) => {
                if (err) callback(err);
                else callback();
              }
            );
          },
          function(err) {
            if (err) {
              console.log(err);
            }
          }
        );
        console.log("upload finished");
        return res
          .status(200)
          .send(
            payroll.lenght +
              " Registries of payroll information of employees was uploaded"
          );
      });
  });
});

// router.post('/family', function (req, res) {
//     upload(req, res, function (err) {
//       let family = [];
//       let familyFile = req.file;
//         if (err) {
//         // An error occurred when uploading
//         console.log(err);
//         return res.status(422).send("an Error occured");
//         }
//         if(familyFile.mimetype !== 'application/vnd.ms-excel' && familyFile.mimetype !== 'text/csv'){
//             return res.status(400).send("Sorry only CSV files can be processed for upload");
//         }
//         csv.fromPath(req.file.path,{headers: true, ignoreEmpty: true})
//         .on('data', function(data){
//             data['_id'] = new mongoose.Types.ObjectId();
//             data['employee'] = null;
//             family.push(data);

//         })
//         .on('end', function(){
//             async.each(family, function(fam, callback){
//               EmployeeSchema.findOne({'employeeId': fam.employeeId}, function(err, res){
//                     if(err){
//                         callback(err)
//                     }else{
//                       if(res !== null){
//                         EmployeeSchema.update({_id: res._id},{
//                           $push: { family: fam._id}}, function(err, raw){
//                             console.log(raw||err);
//                           });
//                           fam.employee = res._id;
//                           res.save();
//                           callback();
//                       }
//                     }
//                 })
//             }, function(err){
//                 if(err){
//                     console.log(err);
//                 }else{
//                     Family.create(family);
//                 }
//             });
//             console.log('upload finished');
//             return res.status(200).send( family.lenght + ' Registries of payroll information of employees was uploaded');
//         });
//     });
// });

// router.post('/education', function (req, res) {
//     upload(req, res, function (err) {
//       let education = [];
//       let educationFile = req.file;
//         if (err) {
//         // An error occurred when uploading
//         console.log(err);
//         return res.status(422).send("an Error occured");
//         }
//         if(educationFile.mimetype !== 'application/vnd.ms-excel' && educationFile.mimetype !== 'text/csv'){
//             return res.status(400).send("Sorry only CSV files can be processed for upload");
//         }
//         csv.fromPath(req.file.path,{headers: true, ignoreEmpty: true})
//         .on('data', function(data){
//             data['_id'] = new mongoose.Types.ObjectId();
//             data['employee'] = null;
//             education.push(data);
//         })
//         .on('end', function(){
//             async.each(education, function(edu, callback){
//               EmployeeSchema.findOne({'employeeId': edu.employeeId}, function(err, res){
//                     if(err){
//                         callback(err)
//                     }else{
//                       EmployeeSchema.update({_id: res._id},{
//                         $push: { education: edu._id}}, function(err, raw){
//                           console.log(raw||err);
//                         });
//                         edu.employee = res._id;
//                         res.save();
//                         callback();
//                     }
//                 })
//             }, function(err){
//                 if(err){
//                     console.log(err);
//                 }else{
//                     Education.create(education);
//                 }
//             });
//             console.log('upload finished');
//             return res.status(200).send( education.lenght + ' Registries of payroll information of employees was uploaded');
//         });
//     });

// });

// router.post('/comment', function (req, res) {
//   upload(req, res, function (err) {
//     let comment = [];
//     let commentFile = req.file;
//       if (err) {
//       // An error occurred when uploading
//       console.log(err);
//       return res.status(422).send("an Error occured");
//       }
//       if(commentFile.mimetype !== 'application/vnd.ms-excel' && commentFile.mimetype !== 'text/csv'){
//           return res.status(400).send("Sorry only CSV files can be processed for upload");
//       }
//       csv.fromPath(req.file.path,{headers: true, ignoreEmpty: true})
//       .on('data', function(data){
//           data['_id'] = new mongoose.Types.ObjectId();
//           data['employee'] = null;
//           comment.push(data);
//       })
//       .on('end', function(){
//           async.each(comment, function(com, callback){
//             EmployeeSchema.findOne({'employeeId': com.employeeId}, function(err, res){
//                   if(err){
//                       callback(err)
//                   }else{
//                     EmployeeSchema.update({_id: res._id},{
//                       $push: { comments: com._id}}, function(err, raw){
//                         console.log(raw||err);
//                       });
//                       edu.employee = res._id;
//                       res.save();
//                       callback();
//                   }
//               })
//           }, function(err){
//               if(err){
//                   console.log(err);
//               }else{
//                   Comment.create(comment);
//               }
//           });
//           console.log('upload finished');
//           return res.status(200).send( education.lenght + ' Registries of payroll information of employees was uploaded');
//       });
//   });

// });

router.post("/shift", (req, res) => {
  let shifts = [];
  upload(req, res, err => {
    if (err) res.status(422).send("an Error occured");
    if (
      req.file.mimetype !== "application/vnd.ms-excel" &&
      req.file.mimetype !== "text/csv"
    )
      res.sendStatus(400);
    csv
      .fromPath(req.file.path, { headers: true, ignoreEmpty: true , strictColumnHandling: true})
      .on("data", data => {
        data["_id"] = new mongoose.Types.ObjectId();
        data["employee"] = null;
        data["createdDate"] = new Date();
        data["shift"] = null;
        shifts.push(data);
      })
      .on("end", () => {
        shifts.map(i => {
          if (
            i[
              "employeeId;shiftName;monday-in;monday-out;tuesday-in;tuesday-out;wednesday-in;wednesday-out;thursday-in;thursday-out;friday-in;friday-out;saturday-in;saturday-out;sunday-in;sunday-out;startDate"
            ]
          ) {
            const valueArr = i[
              "employeeId;shiftName;monday-in;monday-out;tuesday-in;tuesday-out;wednesday-in;wednesday-out;thursday-in;thursday-out;friday-in;friday-out;saturday-in;saturday-out;sunday-in;sunday-out;startDate"
            ].split(";");
            i["employeeId"] = valueArr[0];
            i["shiftName"] = valueArr[1];
            i["monday-in"] = valueArr[2];
            i["monday-out"] = valueArr[3];
            i["tuesday-in"] = valueArr[4];
            i["tuesday-out"] = valueArr[5];
            i["wednesday-in"] = valueArr[6];
            i["wednesday-out"] = valueArr[7];
            i["thursday-in"] = valueArr[8];
            i["thursday-out"] = valueArr[9];
            i["friday-in"] = valueArr[10];
            i["friday-out"] = valueArr[11];
            i["saturday-in"] = valueArr[12];
            i["saturday-out"] = valueArr[13];
            i["sunday-in"] = valueArr[14];
            i["sunday-out"] = valueArr[15];
            i["startDate"] = valueArr[16];
            delete i[
              "employeeId;shiftName;monday-in;monday-out;tuesday-in;tuesday-out;wednesday-in;wednesday-out;thursday-in;thursday-out;friday-in;friday-out;saturday-in;saturday-out;sunday-in;sunday-out;startDate"
            ];
          }
          i.shift = {
            name: i["shiftName"],
            shift: [
              {
                day: 0,
                onShift:
                  i["monday-in"] !== null &&
                  i["monday-in"] !== undefined &&
                  !i["monday-in"].includes(":"),
                startTime: timeToMinutes(i["monday-in"]),
                endTime: timeToMinutes(i["monday-out"]),
                scheduledHours: calculateTimeDifference(
                  timeToMinutes(i["monday-in"]),
                  timeToMinutes(i["monday-out"])
                )
              },
              {
                day: 1,
                onShift:
                  i["tuesday-in"] !== null &&
                  i["tuesday-in"] !== undefined &&
                  !i["tuesday-in"].includes(":"),
                startTime: timeToMinutes(i["tuesday-in"]),
                endTime: timeToMinutes(i["tuesday-out"]),
                scheduledHours: calculateTimeDifference(
                  timeToMinutes(i["tuesday-in"]),
                  timeToMinutes(i["tuesday-out"])
                )
              },
              {
                day: 2,
                onShift:
                  i["wednesday-in"] !== null &&
                  i["wednesday-in"] !== undefined &&
                  !i["wednesday-in"].includes(":"),
                startTime: timeToMinutes(i["wednesday-in"]),
                endTime: timeToMinutes(i["wednesday-out"]),
                scheduledHours: calculateTimeDifference(
                  timeToMinutes(i["wednesday-in"]),
                  timeToMinutes(i["wednesday-out"])
                )
              },
              {
                day: 3,
                onShift:
                  i["thursday-in"] !== null &&
                  i["thursday-in"] !== undefined &&
                  !i["thursday-in"].includes(":"),
                startTime: timeToMinutes(i["thursday-in"]),
                endTime: timeToMinutes(i["thursday-out"]),
                scheduledHours: calculateTimeDifference(
                  timeToMinutes(i["thursday-in"]),
                  timeToMinutes(i["thursday-out"])
                )
              },
              {
                day: 4,
                onShift:
                  i["friday-in"] !== null &&
                  i["friday-in"] !== undefined &&
                  !i["friday-in"].includes(":"),
                startTime: timeToMinutes(i["friday-in"]),
                endTime: timeToMinutes(i["friday-out"]),
                scheduledHours: calculateTimeDifference(
                  timeToMinutes(i["friday-in"]),
                  timeToMinutes(i["friday-out"])
                )
              },
              {
                day: 5,
                onShift:
                  i["saturday-in"] !== null &&
                  i["saturday-in"] !== undefined &&
                  !i["saturday-in"].includes(":"),
                startTime: timeToMinutes(i["saturday-in"]),
                endTime: timeToMinutes(i["saturday-out"]),
                scheduledHours: calculateTimeDifference(
                  timeToMinutes(i["saturday-in"]),
                  timeToMinutes(i["saturday-out"])
                )
              },
              {
                day: 6,
                onShift:
                  i["sunday-in"] !== null &&
                  i["sunday-in"] !== undefined &&
                  !i["sunday-in"].includes(":"),
                startTime: timeToMinutes(i["sunday-in"]),
                endTime: timeToMinutes(i["sunday-out"]),
                scheduledHours: calculateTimeDifference(
                  timeToMinutes(i["sunday-in"]),
                  timeToMinutes(i["sunday-out"])
                )
              }
            ]
          };
          i.shift.daysonShift = i.shift.shift.filter(
            item => item.onShift
          ).length;
          i.shift.totalHours = i.shift.shift
            .map(e => e.scheduledHours)
            .reduce((a, b) => a + b);
          return i.shift;
        });
        async.each(
          shifts,
          (item, callback) => {
            let extractedShift = item.shift.shift;
            EmployeeShift.shift.findOne(
              {
                "shift.0.startTime":  extractedShift[0].startTime,
                "shift.0.endTime":  extractedShift[0].endTime,
                "shift.1.startTime":  extractedShift[1].startTime,
                "shift.1.endTime":  extractedShift[1].endTime,
                "shift.2.startTime":  extractedShift[2].startTime,
                "shift.2.endTime":  extractedShift[2].endTime,
                "shift.3.startTime":  extractedShift[3].startTime,
                "shift.3.endTime":  extractedShift[3].endTime,
                "shift.4.startTime":  extractedShift[4].startTime,
                "shift.4.endTime":  extractedShift[4].endTime,
                "shift.5.startTime":  extractedShift[5].startTime,
                "shift.5.endTime":  extractedShift[5].endTime,
                "shift.6.startTime":  extractedShift[6].startTime,
                "shift.6.endTime":  extractedShift[6].endTime
              },
              (err, shiftDoc) => {
                if (err) {
                  callback();
                } else if (shiftDoc !== null) {
                  shiftDoc.shift.map(day => {
                    day.scheduledHours = calculateTimeDifference(
                      day.startTime,
                      day.endTime
                    );
                    return day;
                  });
                  shiftDoc.daysonShift = shiftDoc.shift.filter(
                    item => item.onShift
                  ).length;
                  shiftDoc.totalHours = shiftDoc.shift
                    .map(e => e.scheduledHours)
                    .reduce((a, b) => a + b);
                  item.shift = shiftDoc;
                  item.shift.shiftId = shiftDoc._id;
                  delete item.shift._id;
                  delete item.shiftName;
                  delete item["monday-in"];
                  delete item["monday-out"];
                  delete item["tuesday-in"];
                  delete item["tuesday-out"];
                  delete item["wednesday-in"];
                  delete item["wednesday-out"];
                  delete item["thursday-in"];
                  delete item["thursday-out"];
                  delete item["friday-in"];
                  delete item["friday-out"];
                  delete item["saturday-in"];
                  delete item["saturday-out"];
                  delete item["sunday-in"];
                  delete item["sunday-out"];
                  shiftDoc.save().then(result => {
                    EmployeeSchema.updateOne(
                      { employeeId: item.employeeId },

                      {
                        $push: {
                          shift: { $each: [item] },
                          $sort: { startDate: -1 }
                        }
                      },
                      (err, employee) => {
                        if (err) {
                          console.log(err);
                          callback();
                        } else {
                          console.log(employee);
                          callback();
                          // console.log(employee.shift.length);
                          // EmployeeSchema
                          //   .updateOne(
                          //     { employeeId: item.employeeId },
                          //     { $set: { currentShift: currentShift(employee.shift) } },
                          //     (err, raw) => {
                          //       if (err) {
                          //         console.log(err);
                          //         callback();
                          //       } else {
                          //         callback();
                          //       }
                          //     })
                        }
                      }
                    );
                  });
                } else {
                  let nonExistentShift = item.shift;
                  nonExistentShift._id = new mongoose.Types.ObjectId();
                  let newShift = new EmployeeShift.shift(nonExistentShift);
                  newShift.save((err, doc) => {
                    if (err) {
                      console.log(err);
                      callback();
                    } else {
                      item.shift = doc;
                      item.shift.shiftId = doc._id;
                      delete item.shift._id;
                      delete item.shiftName;
                      EmployeeSchema.updateOne(
                        { employeeId: item.employeeId },

                        {
                          $push: {
                            shift: { $each: [item] },
                            $sort: { startDate: -1 }
                          }
                        },
                        (err, employee) => {
                          if (err) {
                            console.log(err);
                            callback();
                          } else {
                            console.log(employee);
                            callback();
                            // EmployeeSchema
                            // .updateOne(
                            //   { employeeId: employeeId },
                            //   { $set: { currentShift: currentShift(employee.shift) } },
                            //   (err, raw) => {
                            //     if (err) {
                            //       console.log(err);
                            //       callback();
                            //     } else {
                            //       callback();
                            //     }
                            //   })
                          }
                        }
                      );
                    }
                  });
                }
              }
            );
          },
          err => {
            if (err) console.log(err);
            else {
              res.status(200).json({ addedShifts: shifts.length });
            }
          }
        );
      });
  });
});

function timeToMinutes(time) {
  if (time !== null && time !== undefined && time.includes(":")) {
    const str = time + "";
    const strArray = str.split(":");
    const hoursStr = parseInt(strArray[0], 10) * 60;
    const minutesStr = parseInt(strArray[1], 10);
    const result = hoursStr + minutesStr;
    return result;
  } else return null;
}
function calculateTimeDifference(startTime, endTime) {
  if (
    startTime !== null &&
    startTime !== undefined) {
    if (startTime < endTime) return endTime - startTime;
    if (startTime > endTime) return 1440 - startTime + endTime;
  } else return 0;
}

function currentShift(shifts) {
  if (shifts.length === 0) return null;
  let current;
  var sortedShifts = shifts.sort((a, b) => a.startDate < b.startDate);
  sortedShifts.forEach((i, index) => {
    if (i.startDate > new Date())
      current =
        sortedShifts[index === sortedShifts.length - 1 ? index : index + 1];
  });
  return current;
}

router.post("/avatars", function(req, res) {
  let avatarStorage = multer.diskStorage({
    destination: "uploads/avatars",
    filename: function(req, file, cb) {
      cb(null, req.query.id + ".jpg");
    }
  });
  let avatarUpload = multer({ storage: avatarStorage }).single("file");

  avatarUpload(req, res, function(err) {
    if (err) {
      res.status(400).send("error in the upload");
    }
    if (req.file.mimetype != "image/jpeg") {
      res.status(400).send("only jpeg is allowed");
    }
    fs.readFile("uploads/avatars/" + req.query.id + ".jpg", function(
      err,
      content
    ) {
      if (err) {
        fs.readFile("uploads/avatars/default-avatar.jpg", function(
          err,
          content
        ) {
          res.writeHead(200, { "Content-type": "image/jpg" });
          res.end(content);
        });
      } else {
        //specify the content type in the response will be an image
        res.writeHead(200, { "Content-type": "image/jpg" });
        res.end(content);
      }
    });
  });
});

module.exports = router;
