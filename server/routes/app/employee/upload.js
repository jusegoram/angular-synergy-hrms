let express = require("express");
let moment = require("moment");
let jwt = require("jsonwebtoken");
let fs = require("fs");
let path = require("path");
let crypto = require("crypto");
const RSA_KEY = fs.readFileSync(path.join(__dirname, "../../pub.key"));

let async = require("async");
//require the express router
let router = express.Router();
//require multer for the file uploads & fast-csv for parsing csv
let multer = require("multer");
let mongoose = require("mongoose");
let csv = require("fast-csv");
let OperationsHours = require("../../../models/app/operations/operations-hour");
let FileUploads = require("../../../models/back-end/file-upload");
let Department = require("../../../models/administration/administration-department");
let EmployeeSchema = require("../../../models/app/employee/employee-main");
let Position = require("../../../models/app/employee/employee-position");
let EmployeeShift = require("../../../models/app/employee/employee-shift");
let HolidayTable = require("../../../models/administration/administration-payroll").HolidayTable;
// set the directory for the uploads to the uploaded to
let DIR = "uploads/employeeFiles";

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
          .parseFile(req.file.path, { headers: true, ignoreEmpty: true })
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
      .parseFile(req.file.path, { headers: true, ignoreEmpty: true })
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
      .parseFile(req.file.path, { headers: true, ignoreEmpty: true })
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
      .parseFile(req.file.path, { headers: true, ignoreEmpty: true })
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
      .parseFile(req.file.path, { headers: true, ignoreEmpty: true })
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
      .parseFile(req.file.path, { headers: true, ignoreEmpty: true })
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
//         csv.parseFile(req.file.path,{headers: true, ignoreEmpty: true})
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
//         csv.parseFile(req.file.path,{headers: true, ignoreEmpty: true})
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
//       csv.parseFile(req.file.path,{headers: true, ignoreEmpty: true})
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
    const header = req.headers.authorization;
    let token;
    if (header) {
      token = header.split(" ");
      token = token[1];
    }

    let hoursFile = req.file;
    let fileId = mongoose.Types.ObjectId();
    let file = new FileUploads({
      user: jwt.decode(token, RSA_KEY),
      apiPath: req.url,
      fileName: hoursFile.filename,
      fileId: fileId,
      date: new Date()
    });
    file.save().then(res => {});
    if (err) res.status(422).send("an Error occured");
    if (
      req.file.mimetype !== "application/vnd.ms-excel" &&
      req.file.mimetype !== "text/csv"
    )
      res.status(400).json({message: 'not the correct document format'});
    csv
      .parseFile(req.file.path, {
        headers: true,
        ignoreEmpty: true,
        strictColumnHandling: true
      })
      .on("data", data => {
        shifts.push(data);
      })
      .on("end", () => {
        async.each(
          shifts,
          (item, callback) => {
            parseShift(item)
              .then(parsed => {
                OperationsHours.insertMany(parsed, (error, docs) => {
                 callback();
                });
              })
              .catch(err => {
                callback(err);
              });
          },
          err => {
            if (err) res.status(400).json(err);
            else
              res
                .status(200)
                .json({ message: "Upload Completed without errors" });
          }
        );
      });
  });
});


function parseShift(shift) {
  return new Promise((resolve, reject) => {
    let returnShift = [];
    if (shift["employeeId;startDate;1;2;3;4;5;6;7"]) {
        const valueArr = shift[
          "employeeId;startDate;1;2;3;4;5;6;7;breakAndLunchTime"
        ].split(";");
        shift["employeeId"] = valueArr[0];
        shift["startDate"] = valueArr[1];
        shift["1"] = valueArr[2];
        shift["2"] = valueArr[3];
        shift["3"] = valueArr[4];
        shift["4"] = valueArr[5];
        shift["5"] = valueArr[6];
        shift["6"] = valueArr[7];
        shift["7"] = valueArr[8];
        shift["breakAndLunchTime"] = valueArr[9];
        delete shift["employeeId;startDate;1;2;3;4;5;6;7;breakAndLunchTime"];
    }
    // TODO: remove before commiting
    if(shift['employeeId;shiftName;monday-in;monday-out;tuesday-in;tuesday-out;wednesday-in;wednesday-out;thursday-in;thursday-out;friday-in;friday-out;saturday-in;saturday-out;sunday-in;sunday-out;startDate']){
      const valueArr = shift[
          'employeeId;shiftName;monday-in;monday-out;tuesday-in;tuesday-out;wednesday-in;wednesday-out;thursday-in;thursday-out;friday-in;friday-out;saturday-in;saturday-out;sunday-in;sunday-out;startDate'
        ].split(";");
        shift['employeeId'] = valueArr[0];
        shift["startDate"] = valueArr[16];
        shift["1"] = valueArr[2] + '-' + valueArr[3];
        shift["2"] = valueArr[4] + '-' + valueArr[5];
        shift["3"] = valueArr[6] + '-' + valueArr[7];
        shift["4"] = valueArr[8] + '-' + valueArr[9];
        shift["5"] = valueArr[10] + '-' + valueArr[11];
        shift["6"] = valueArr[12] + '-' + valueArr[13];
        shift["7"] = valueArr[14] + '-' + valueArr[15];
        shift["breakAndLunchTime"] = '1:15';
        delete shift['employeeId;shiftName;monday-in;monday-out;tuesday-in;tuesday-out;wednesday-in;wednesday-out;thursday-in;thursday-out;friday-in;friday-out;saturday-in;saturday-out;sunday-in;sunday-out;startDate'];
    }
    if(shift['monday-in']){
      shift = {
        employeeId: shift.employeeId,
        startDate: shift.startDate,
        '1': shift['monday-in'] + '-' + shift['monday-out'],
        '2': shift['tuesday-in'] + '-' + shift['tuesday-out'],
        '3': shift['wednesday-in'] + '-' + shift['wednesday-out'],
        '4': shift['thursday-in'] + '-' + shift['thursday-out'],
        '5': shift['friday-in'] + '-' + shift['friday-out'],
        '6': shift['saturday-in'] + '-' + shift['saturday-out'],
        '7': shift['sunday-in'] + '-' + shift['sunday-out'],
        breakAndLunchTime: '1:15',
      }
    }
    if(shift.employeeId &&
      shift.startDate &&
      shift['1'] && shift['2'] &&
      shift['3'] && shift['4'] &&
      shift['5'] && shift['6'] &&
      shift['7']) {
        EmployeeSchema.findOne({ employeeId: shift.employeeId }).populate({path: 'position', model: 'Employee-Position'})
        .lean({autopopulate: true})
        .exec((err, doc) => {
          if (err) {
            console.log(err);
          }
          if (!doc) {
            console.log(shift);
          }
          if (doc) {
            let matrix =  doc.position.slice(-1)[0]? doc.position.slice(-1)[0].position.positionId: null;
            let hourlyRate =  doc.position.slice(-1)[0]? (parseInt(doc.position.slice(-1)[0].position.baseWage, 10) * 12 / 52 / 45): 0;
            let positionName =  doc.position.slice(-1)[0]? doc.position.slice(-1)[0].position.name: null;

            let shiftDate, start, end;
            shiftDate = moment(shift.startDate, "MM-DD-YYYY");
            start = moment()
              .startOf("week")
              .add(-1, "day");
            end = moment()
              .endOf("week")
              .add(1, "day");
            if (
              // TODO: revert back before comit
              //start.isBefore(shiftDate, "day") && end.isAfter(shiftDate, "day")
              shiftDate
            ) {
              let days = [1, 2, 3, 4, 5, 6, 7];
              async.forEach(days, (day, callback) => {
                const date = moment(shift.startDate, "MM-DD-YYYY").add(
                  day - 1,
                  "day"
                );
                const newEmployeeHour = {};
                HolidayTable.findOne({date: date.toDate()}).limit(1).lean().exec((error, holidays) => {
                  if(error) console.log(error,);
                  if(holidays && holidays.length > 0){
                    let [holiday] = holidays;
                    newEmployeeHour.holiday = true;
                    newEmployeeHour.holidayRate = holiday.holidayRate;
                  }else {
                    newEmployeeHour.holiday = false;
                    newEmployeeHour.holidayRate = 0;
                  }
                  newEmployeeHour.hasShift = true;
                  newEmployeeHour.shiftDay = date.day();
                  newEmployeeHour.date = date.toISOString();
                  newEmployeeHour.employee = doc._id,
                  newEmployeeHour.employeeName = doc.firstName + " " + doc.lastName,
                  newEmployeeHour.client = doc.company.client,
                  newEmployeeHour.campaign = doc.company.campaign,
                  newEmployeeHour.billable = doc.payroll? doc.payroll.billable: null,
                    // Checks if the employee position is to be included in the matrix by comparing
                    // the last item in the positions array for existence within the positionsInMatrix Array.
                  newEmployeeHour.matrix = matrix;
                  newEmployeeHour.hourlyRate = hourlyRate;
                  newEmployeeHour.positionName = positionName;
                  const shiftDay = shift[day].replace(/\s+/g, "");
                  let [startTime, endTime] = shiftDay.split("-");
                  const startTimeInMinutes = timeToMinutes(startTime);
                  const endTimeInMinutes = timeToMinutes(endTime)
                  const shiftScheduledHours = calculateTimeDifference(
                    startTimeInMinutes,
                    endTimeInMinutes
                  );
                    if(  !/[offOFF]/.test(shiftDay) && startTimeInMinutes === null ||
                          !/[offOFF]/.test(shiftDay) && endTimeInMinutes === null) {
                      callback('The time is not in the correct format')
                    } else {
                      if (
                        /[offOFF]/.test(shiftDay)||
                        shiftScheduledHours === 0) {
                        newEmployeeHour.uniqueId = crypto
                          .createHash("sha256")
                          .update(shift.employeeId + "-" + newEmployeeHour.date)
                          .digest("hex");
                        newEmployeeHour.employeeId = shift.employeeId;
                        newEmployeeHour.onShift = false;
                        newEmployeeHour.shiftStartTime = null;
                        newEmployeeHour.shiftEndTime = null;
                        newEmployeeHour.shiftScheduledBreakAndLunch = null;
                        newEmployeeHour.shiftScheduledHours = 0;
                        returnShift.push(newEmployeeHour);
                      callback();
                      } else {
                        newEmployeeHour.uniqueId = crypto
                          .createHash("sha256")
                          .update(shift.employeeId + "-" + newEmployeeHour.date)
                          .digest("hex");
                        newEmployeeHour.employeeId = shift.employeeId;
                        newEmployeeHour.onShift = true;
                        newEmployeeHour.shiftStartTime = startTimeInMinutes;
                        newEmployeeHour.shiftEndTime = endTimeInMinutes;
                        newEmployeeHour.shiftScheduledHours = shiftScheduledHours;
                        newEmployeeHour.shiftScheduledBreakAndLunch = timeToMinutes(
                          shift.breakAndLunchTime
                        );
                        returnShift.push(newEmployeeHour);
                        callback();
                      }
                    }
                })
              }, err => {
                if(err) reject({message: err})
                resolve(returnShift);
              })
            } else {
              reject({
                message: "The shift start date must be within the current week"
              });
            }
          }
        });
      }else {
        reject({message: "the file is not valid"});
      }
  });
}
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
  if (startTime !== null && startTime !== undefined) {
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
