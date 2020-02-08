let express = require("express");
let jwt = require("jsonwebtoken");
let _ = require("lodash");
let fs = require("fs");
let async = require("async");
//require the express router
let router = express.Router();
//require multer for the file uploads & fast-csv for parsing csv
let multer = require("multer");
let mongoose = require("mongoose");
let csv = require("fast-csv");
let path = require("path");
let OperationsHours = require("../../../models/app/operations/operations-hour");
let FileUploads = require("../../../models/back-end/file-upload");
let OperationsKpi = require("../../../models/app/operations/operations-kpi");
let EmployeeSchema = require("../../../models/app/employee/employee-main");
const RSA_KEY = fs.readFileSync(path.join(__dirname, "../../pub.key"));

//define the type of upload multer would be doing and pass in its destination, in our case, its a single file with the name photo
let storage = multer.diskStorage({
  destination: "uploads/kpiFiles",
  filename: function(req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  }
});
let upload = multer({ storage: storage }).single("file");

router.post("/hours", (req, res) => {
  upload(req, res, err => {
    const header = req.headers.authorization;
    let token;
    if (header) {
      token = header.split(" ");
      token = token[1];
    }

    let hours = [];
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
      hoursFile.mimetype !== "application/vnd.ms-excel" &&
      hoursFile.mimetype !== "text/csv"
    )
      res.status(400).send("Sorry only CSV files can be processed for upload");

    csv
      .fromPath(req.file.path, { headers: true, ignoreEmpty: true })
      .on("data", data => {
        data["_id"] = new mongoose.Types.ObjectId();
        data["employee"] = null;
        hours.push(data);
      })
      .on("end", () => {
        hours.map(hour => {
          if (hour["employeeId;dialerId;date;systemHours;tosHours;timeIn"]) {
            const valueArr = hour[
              "employeeId;dialerId;date;systemHours;tosHours;timeIn"
            ].split(";");
            hour["employeeId"] = valueArr[0];
            hour["dialerId"] = valueArr[1];
            hour["date"] = valueArr[2];
            hour["systemHours"] = valueArr[3];
            hour["breakHours"] = valueArr[4];
            hour["lunchHours"] = valueArr[5];
            hour["trainingHours"] = valueArr[6];
            hour["tosHours"] = valueArr[7];
            hour["timeIn"] = valueArr[8];
            delete hour["employeeId;dialerId;date;systemHours;tosHours;timeIn"];
          }
          hour.fileId = fileId;
          hour.systemHours = splitTimetoHours(hour.systemHours);
          hour.breakHours = splitTimetoHours(hour.breakHours);
          hour.lunchHours = splitTimetoHours(hour.lunchHours);
          hour.trainingHours = splitTimetoHours(hours.trainingHours);
          hour.tosHours = splitTimetoHours(hour.tosHours);
          hour.timeIn = splitTimetoHours(hour.timeIn);
          return hour;
        });
        let correctedHours = [];
        let incorrectHours = [];
        let dups = duplicateInArray(hours, "employeeId", "date");
        if (dups.length > 0) {
          incorrectHours.push(...dups);
          res.status(400).json({ error: 'There are duplicates within the same file', incorrectHours: incorrectHours });
        } else {
          async.each(
            hours,
            (hour, cb) => {
              EmployeeSchema.findOne(
                { employeeId: hour.employeeId },
                (error, emp) => {
                  if (error) console.log(error);
                  if (emp !== null) {
                    // OperationsHours.findOne(
                    //   { employeeId: hour.employeeId, date: hour.date },
                    //   (error, doc) => {
                    //     if (error) {
                    //       console.log(error);
                    //       cb();
                    //     }
                    //     if (doc === null) {
                    //       incorrectHours.push(hour);
                    //       cb();
                    //     } else {
                    //       doc.employee = emp._id;
                    //       doc.employeeName =
                    //         emp.firstName + " " + emp.lastName;
                    //       doc.client = emp.company.client;
                    //       doc.campaign = emp.company.campaign;
                    //       doc.billable = emp.payroll
                    //         ? emp.payroll.billable
                    //         : null;
                    //       correctedHours.push(hour);
                    //       cb();
                    //     }
                    //   }
                    // );

                    OperationsHours.updateOne({ employeeId: hour.employeeId, date: hour.date }, {$set: {
                      employeeId: hour.employeeId,
                      employee: emp._id,
                      employeeName: emp.firstName + " " + emp.lastName,
                      client: emp.company.client,
                      campaign: emp.company.campaign,
                      billable: emp.payroll? emp.payroll.billable: null,
                      dialerId: hour.dialerId,
                      date: hour.date,
                      systemHours: hour.systemHours,
                      breakHours: hour.breakHours,
                      lunchHours: hour.lunchHours,
                      trainingHours: hour.trainingHours,
                      tosHours: hour.tosHours,
                      timeIn: hour.timeIn,
                      hasHours: true
                    }}, (err, raw)=> {
                      if(err){
                      console.log(err);
                      cb();
                    }
                      else {
                        correctedHours.push(hour);
                        cb();
                      }
                    })
                  } else {
                    incorrectHours.push(hour);
                    cb();
                  }
                }
              );
            },
            err => {
              if (correctedHours.length > 0)
               res.status(200).json({correctedHours: correctedHours})
              if (correctedHours.length === 0)
                res.status(400).json({ incorrectHours: incorrectHours });
            }
          );
        }
      });
  });
});

function duplicateInArray(arr, ...args) {
  var returnArray = [];
  var dupArr = [];
  var keys = args;
  var mapped = arr.map(i => {
    i.search = "";
    keys.forEach(key => {
      i.search += i[key] + ";";
    });
    return i.search;
  });
  dupArr = _.filter(mapped, (value, index, iteratee) => {
    return _.includes(iteratee, value, index + 1);
  });
  let mappedReturn = dupArr.map(item => {
    item = { array: item };
    let splitted = item.array.split(";");
    args.forEach((key, index) => {
      item[key] = splitted[index];
    });
    delete item.array;
    return item;
  });
  return mappedReturn;
}

router.post("/kpi", (req, res) => {
  upload(req, res, err => {
    let kpis = [];
    let kpisFile = req.file;
    if (err) res.status(422).send("an Error occured");

    if (
      kpisFile.mimetype !== "application/vnd.ms-excel" &&
      kpisFile.mimetype !== "text/csv"
    )
      return res
        .status(400)
        .send("Sorry only CSV files can be processed for upload");
    csv
      .fromPath(req.file.path, { headers: true, ignoreEmpty: true })
      .on("data", data => {
        data["_id"] = new mongoose.Types.ObjectId();
        data["employee"] = null;
        data["supervisor"] = null;
        kpis.push(data);
      })
      .on("end", () => {
        let counter = 0;
        let duplicate = 0;
        kpis.map(kpi => {
          if (
            kpi.scoreInTime === "" ||
            kpi.scoreInTime === null ||
            kpi.scoreInTime === undefined
          ) {
            delete kpi.scoreInTime;
          } else {
            delete kpi.score;
            kpi.scoreInTime = splitTimetoHours(kpi.scoreInTime);
          }
        });
        async.each(
          kpis,
          (kpi, callback) => {
            let employeeIdArr = [];
            employeeIdArr.push(kpi.employeeId);
            employeeIdArr.push(kpi.teamId);
            EmployeeSchema.find(
              { employeeId: { $in: employeeIdArr } },
              (error, res) => {
                if (error) duplicate++;
                else {
                  counter++;
                  if (res !== null) {
                    if (
                      parseInt(employeeIdArr[0], 10) ===
                      parseInt(res[0].employeeId, 10)
                    ) {
                      kpi.employee = res[0]._id;
                      kpi.employeeName =
                        res[0].firstName + " " + res[0].lastName;
                      kpi.client = res[0].company.client;
                      kpi.campaign = res[0].company.campaign;
                      kpi.supervisor = res[1]._id;
                      res[0].supervisor = res[1]._id;
                      res[0].save();
                    } else {
                      kpi.employee = res[1]._id;
                      kpi.employeeName =
                        res[1].firstName + " " + res[1].lastName;
                      kpi.client = res[1].company.client;
                      kpi.campaign = res[1].company.campaign;
                      kpi.supervisor = res[0]._id;
                      res[1].supervisor = res[0]._id;
                      res[1].save();
                    }

                    callback();
                  } else callback();
                }
              }
            );
          },
          err => {
            if (err) console.log(err);
            OperationsKpi.create(kpis)
              .then(res => {})
              .catch(err => console.log(err));
          }
        );

        return res
          .status(200)
          .send(
            counter +
              " Registries of kpi information of employees was uploaded and" +
              duplicate +
              "were for some reason not uploaded"
          );
      });
  });
});

function splitTimetoHours(item) {
  let hhmmss = {};
  if (item !== undefined && item !== null && item !== "") {
    let split = item.split(":");
    hhmmss = {
      value: item,
      hh: parseInt(split[0], 10),
      mm: parseInt(split[1], 10),
      ss: parseInt(split[2], 10)
    };
  } else {
    hhmmss = {
      value: "00:00:00",
      hh: 0,
      mm: 0,
      ss: 0
    };
  }

  return hhmmss;
}
module.exports = router;
