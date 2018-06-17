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
        'address',
        'town',
        'district',
        'addressDate',
        'celNumber',
        'telNumber',
        'birthDate',
        'birthPlace',
        'emailAddress',
        'emailDate'
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
        'positionId',
        'payrollType',
        'baseWage',
        'bankName',
        'bankAccount',
        'billable'
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
        'relationship',
        'celNumber',
        'telNumber',
        'emailAddress',
        'adress',
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
        'trainer',
        'trainingGroupRef',
        'trainingGroupNum',
        'terminationDate',
        'reapplicant',
        'reapplicantTimes'
    ];

    var csv = json2csv({ data: '', fields: fields });

    res.set("Content-Disposition", "attachment;filename=employee-company-upload.csv");
    res.set("Content-Type", "application/octet-stream");

    res.send(csv);
});


module.exports = router;
