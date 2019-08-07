var express = require("express");
var router = express.Router();
var jwt = require("jsonwebtoken");
var fastcsv = require("fast-csv");
var Employee = require("../../../models/app/employee/employee-main");
var fs = require("fs");

router.post("/", function(req, res, next) {
  let query = req.body;
  for (let propName in query) {
    if (
      query[propName] === null ||
      query[propName] === undefined ||
      query[propName] === ""
    ) {
      delete query[propName];
    }
  }
  if (
    query["company.hireDate"].$gte === null ||
    query["company.hireDate"].$gte === undefined ||
    query["company.hireDate"].$gte === ""
  ) {
    delete query["company.hireDate"];
  }
  if (
    query["company.terminationDate"].$gte === null ||
    query["company.terminationDate"].$gte === undefined ||
    query["company.terminationDate"].$gte === ""
  ) {
    delete query["company.terminationDate"];
  }
  let employees = [];
  let cursor = Employee.find(query).cursor();
  cursor.on("data", item => employees.push(item));
  cursor.on("end", () => res.status(200).json(employees));
});

router.post("/information", (req, res) => {
  switch (req.body.reportType) {
    case "avatar":
      avatarMissing().then(
        result => {
          res.status(200).json(result);
        },
        rejected => {
          res.status(500).json(rejected);
        }
      );
      break;
    case "main":
      mainMissing().then(
        result => {
          res.status(200).json(result);
        },
        rejected => {
          res.status(500).json(rejected);
        }
      );
      break;
    case "company":
      companyMissing().then(
        result => {
          res.status(200).json(result);
        },
        rejected => {
          res.status(500).json(rejected);
        }
      );
      break;
    case "shift":
      shiftMissing().then(
        result => {
          res.status(200).json(result);
        },
        rejected => {
          res.status(500).json(rejected);
        }
      );
      break;
    case "position":
      positionMissing().then(
        result => {
          res.status(200).json(result);
        },
        rejected => {
          res.status(500).json(rejected);
        }
      );
      break;
    case "payroll":
      payrollMissing().then(
        result => {
          res.status(200).json(result);
        },
        rejected => {
          res.status(500).json(rejected);
        }
      );
      break;
    case "personal":
      personalMissing().then(
        result => {
          res.status(200).json(result);
        },
        rejected => {
          res.status(500).json(rejected);
        }
      );
      break;
    case "family":
      emergencyContactMissing().then(
        result => {
          res.status(200).json(result);
        },
        rejected => {
          res.status(500).json(rejected);
        }
      );
      break;
    default:
      res.status(500).json({ error: "No report available" });
      break;
  }
});

let avatarMissing = () => {
  return new Promise((resolve, reject) => {
    let check = employees => {
      let checkedEmployees = [];
      for (let index = 0; index < employees.length; index++) {
        fs.exists(`uploads/avatars/${employees[index]._id}.jpg`, exists => {
          if (!exists) {
            checkedEmployees.push(employees[index]);
          }
          if (index === employees.length - 1) {
            resolve(checkedEmployees);
          }
        });
      }
    };
    getEmployees()
      .then(result => {
        check(result);
      })
      .catch(err => {
        reject(err);
      });
  });
};

let getEmployees = () => {
  return new Promise((resolve, reject) => {
    let employees = [];
    let cursor = Employee.find({ status: "active" })
      .lean()
      .cursor();
    cursor.on("data", item => {
      employees.push(item);
    });
    cursor.on("error", err => {
      reject(err);
    });
    cursor.on("end", () => {
      resolve(employees);
    });
  });
};

let mainMissing = () => {
  return new Promise((resolve, reject) => {
    let check = employees => {
      let checkedEmployees = [];
      let employeesLength = employees.length;
      for (let i = 0; i < employeesLength; i++) {
        let firstnameLength = employees[i].firstName.length;
        let middlenameLength = employees[i].middleName.length;
        let lastnameLength = employees[i].lastName.length;
        let employeeIdLength = employees[i].employeeId.toString().length;
        if (firstnameLength === 1) {
          checkedEmployees.push(employees[i]);
        } else if (middlenameLength === 1) {
          checkedEmployees.push(employees[i]);
        } else if (lastnameLength === 1) {
          checkedEmployees.push(employees[i]);
        } else if (employeeIdLength > 5) {
          checkedEmployees.push(employees[i]);
        }
        if (i === employees.length - 1) {
          resolve(checkedEmployees);
        }
      }
    };
    getEmployees()
      .then(result => {
        check(result);
      })
      .catch(err => {
        reject(err);
      });
  });
};

let companyMissing = () => {
  return new Promise((resolve, reject) => {
    let check = employees => {
      let checkedEmployees = [];
      let employeesLength = employees.length;
      for (let i = 0; i < employeesLength; i++) {
        const element = employees[i].company;
        let client =
          element.client.length !== undefined && element.client !== null
            ? element.client.length
            : 0;
        let campaign =
          element.campaign.length !== undefined && element.campaign !== null
            ? element.campaign.length
            : 0;
        let manager =
          element.manager !== undefined && element.manager !== null
            ? element.manager.length
            : 0;
        let supervisor =
          element.supervisor.length !== undefined
            ? element.supervisor.length
            : 0;
        let hireDate =
          element.hireDate.toString().length !== undefined
            ? element.hireDate.toString().length
            : 0;
        if (client < 1) checkedEmployees.push(employees[i]);
        else if (campaign < 1) checkedEmployees.push(employees[i]);
        else if (manager < 4) checkedEmployees.push(employees[i]);
        else if (supervisor < 4) checkedEmployees.push(employees[i]);
        else if (hireDate < 1) checkedEmployees.push(employees[i]);

        if (i === employees.length - 1) {
          console.log(checkedEmployees);
          resolve(checkedEmployees);
        }
      }
    };
    getEmployees()
      .then(result => {
        check(result);
      })
      .catch(err => {
        console.log(err);
        reject(err);
      });
  });
};

let shiftMissing = () => {
  return new Promise((resolve, reject) => {
    let check = employees => {
      let checkedEmployees = [];
      let employeesLength = employees.length;
      for (let i = 0; i < employeesLength; i++) {
        const element = employees[i];
        let shifts =
          element.shift !== undefined && element.shift !== null
            ? element.shift.length
            : 0;
        if (shifts === 0) checkedEmployees.push(element);
        if (i === employees.length - 1) {
          resolve(checkedEmployees);
        }
      }
    };
    getEmployees()
      .then(result => {
        check(result);
      })
      .catch(err => {
        reject(err);
      });
  });
};

let positionMissing = () => {
  return new Promise((resolve, reject) => {
    let check = employees => {
      let checkedEmployees = [];
      let employeesLength = employees.length;
      for (let i = 0; i < employeesLength; i++) {
        const element = employees[i];
        let positions =
          element.position !== undefined && element.position !== null
            ? element.position.length
            : 0;
        if (positions === 0) checkedEmployees.push(element);
        if (i === employees.length - 1) {
          resolve(checkedEmployees);
        }
      }
    };
    getEmployees()
      .then(result => {
        check(result);
      })
      .catch(err => {
        reject(err);
      });
  });
};

let payrollMissing = () => {
  return new Promise((resolve, reject) => {
    let employees = [];
    let cursor = Employee.find({
      $and: [
        {
          $or: [
            { payroll: { $exists: false } },
            { "payroll.TIN": { $exists: false } },
            { "payroll.payrollType": { $exists: false } },
            { "payroll.bankName": { $exists: false } },
            { "payroll.bankAccount": { $exists: false } },
            { "payroll.billable": { $exists: false } }
          ]
        },
        { status: "active" }
      ]
    })
      .lean()
      .cursor();
    cursor.on("data", item => {
      employees.push(item);
    });
    cursor.on("error", err => {
      reject(err);
    });
    cursor.on("end", () => {
      resolve(employees);
    });
  });
};

let personalMissing = () => {
  return new Promise((resolve, reject) => {
    let employees = [];
    let cursor = Employee.find({
      $and: [
        {
          $or: [
            { "personal.maritalStatus": { $exists: false } },
            { "personal.address": { $exists: false } },
            { "personal.town": { $exists: false } },
            { "personal.district": { $exists: false } },
            { "personal.addressDate": { $exists: false } },
            { "personal.celNumber": { $exists: false } },
            { "personal.telNumber": { $exists: false } },
            { "personal.birthDate": { $exists: false } },
            { "personal.birthPlace": { $exists: false } },
            { "personal.birthPlaceDis": { $exists: false } },
            { "personal.birthPlaceTow": { $exists: false } },
            { "personal.emailAddress": { $exists: false } },
            { "personal.emailDate": { $exists: false } }
          ]
        },
        { status: "active" }
      ]
    })
      .lean()
      .cursor();
    cursor.on("data", item => {
      employees.push(item);
    });
    cursor.on("error", err => {
      reject(err);
    });
    cursor.on("end", () => {
      resolve(employees);
    });
  });
};

let emergencyContactMissing = () => {
  return new Promise((resolve, reject) => {
    let employees = [];
    let cursor = Employee.find({ $and: [ {family: { $exists: false }}, { status: "active" }] })
      .lean()
      .cursor();
    cursor.on("data", item => {
      employees.push(item);
    });
    cursor.on("error", err => {
      reject(err);
    });
    cursor.on("end", () => {
      resolve(employees);
    });
  });
};

module.exports = router;
