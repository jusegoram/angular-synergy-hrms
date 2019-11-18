var express = require('express');
var router = express.Router();
var json2csv = require('json2csv');
router.get('/', function (req, res, next) {
    var fields = [
        'employeeId',
        'firstName',
        'middleName',
        'lastName',
        'gender',
        'socialSecurity',
        'status'
    ];

    var csv = json2csv({ data: '', fields: fields });

    res.set("Content-Disposition", "attachment;filename=employee-upload.csv");
    res.set("Content-Type", "application/octet-stream");

    res.send(csv);
});

router.get('/position', function (req, res, next) {
    var fields = [
        'employeeId',
        'client',
        'department',
        'position',
        'startDate',
        'endDate'
    ];

    var csv = json2csv({ data: '', fields: fields });

    res.set("Content-Disposition", "attachment;filename=employee-position-upload.csv");
    res.set("Content-Type", "application/octet-stream");

    res.send(csv);
});

router.get('/personal', function (req, res, next) {
    var fields = [
        'employeeId',
        'maritalStatus',
        'amountOfChildren',
        'address',
        'town',
        'district',
        'addressDate',
        'celNumber',
        'telNumber',
        'birthDate',
        'birthPlaceDis',
        'birthPlaceTow',
        'emailAddress',
        'emailDate'
    ];

    var csv = json2csv({ data: '', fields: fields });

    res.set("Content-Disposition", "attachment;filename=employee-personal-upload.csv");
    res.set("Content-Type", "application/octet-stream");

    res.send(csv);
});

router.get('/personal/hobbies', (req, res) => {
    var fields = [
        'employeeId',
        'hobbyTitle',
        'hobbyComment',
    ];

    var csv = json2csv({ data: '', fields: fields });

    res.set("Content-Disposition", "attachment;filename=employee-personal-upload.csv");
    res.set("Content-Type", "application/octet-stream");

    res.send(csv);
});

router.get('/payroll', function (req, res, next) {
    var fields = [
        'employeeId',
        'TIN',
        'payrollType',
        'bankName',
        'bankAccount',
        'billable',
        'paymentType'
    ];

    var csv = json2csv({ data: '', fields: fields });

    res.set("Content-Disposition", "attachment;filename=employee-payroll-upload.csv");
    res.set("Content-Type", "application/octet-stream");

    res.send(csv);
});

router.get('/family', function (req, res, next) {
    var fields = [
        'employeeId',
        'referenceName',
        'age',
        'relationship',
        'celNumber',
        'telNumber',
        'emailAddress',
        'address',
        'comment',
    ];

    var csv = json2csv({ data: '', fields: fields });

    res.set("Content-Disposition", "attachment;filename=employee-family-upload.csv");
    res.set("Content-Type", "application/octet-stream");

    res.send(csv);
});

router.get('/education', function (req, res, next) {
    var fields = [
        'employeeId',
        'institution',
        'levelOfEducation',
        'numberOfYears',
        'mayor',
        'description',
        'startDate',
        'endDate'
    ];

    var csv = json2csv({ data: '', fields: fields });

    res.set("Content-Disposition", "attachment;filename=employee-education-upload.csv");
    res.set("Content-Type", "application/octet-stream");

    res.send(csv);
});

router.get('/company', function (req, res, next) {
    var fields = [
        'employeeId',
        'client',
        'campaign',
        'hireDate',
        'supervisor',
        'manager',
        'trainer',
        'trainingGroupRef',
        'trainingGroupNum',
        'terminationDate',
        'reapplicant',
        'reapplicantTimes',
        'bilingual'
    ];

    var csv = json2csv({ data: '', fields: fields });

    res.set("Content-Disposition", "attachment;filename=employee-company-upload.csv");
    res.set("Content-Type", "application/octet-stream");

    res.send(csv);
});


router.get('/shift', function (req, res, next) {
  var fields = [
      'employeeId',
      'shiftName',
      'monday-in',
      'monday-out',
      'tuesday-in',
      'tuesday-out',
      'wednesday-in',
      'wednesday-out',
      'thursday-in',
      'thursday-out',
      'friday-in',
      'friday-out',
      'saturday-in',
      'saturday-out',
      'sunday-in',
      'sunday-out',
      'startDate',
  ];

  var csv = json2csv({ data: '', fields: fields });

  res.set("Content-Disposition", "attachment;filename=employee-shift-upload.csv");
  res.set("Content-Type", "application/octet-stream");

  res.send(csv);
});

module.exports = router;
