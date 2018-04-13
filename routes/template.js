var express = require('express');
var router = express.Router();
var json2csv = require('json2csv');
router.get('/', function (req, res, next) {
    var fields = [
        'employeeId',
        'firstName',
        'middleName',
        'lastName',
        'birthDate',
        'socialSecurity',
        'client',
        'campaign',
        'status',
        'hireDate',
        'terminationDate'
    ];
 
    var csv = json2csv({ data: '', fields: fields });
 
    res.set("Content-Disposition", "attachment;filename=employee-upload.csv");
    res.set("Content-Type", "application/octet-stream");
 
    res.send(csv);
});

router.get('/position', function (req, res, next) {
    var fields = [
        'employeeId',
        'positionid',
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
        'address',
        'addressDate',
        'celNumber',
        'telNumber',
        'emailAddress',
        'emailDate'

    ];
 
    var csv = json2csv({ data: '', fields: fields });
 
    res.set("Content-Disposition", "attachment;filename=employee-personalinfo-upload.csv");
    res.set("Content-Type", "application/octet-stream");
 
    res.send(csv);
});

router.get('/payroll', function (req, res, next) {
    var fields = [
        'employeeId',
        'payrollType',
        'baseWage',
        'bankAccount',
    ];
 
    var csv = json2csv({ data: '', fields: fields });
 
    res.set("Content-Disposition", "attachment;filename=employee-payrollinfo-upload.csv");
    res.set("Content-Type", "application/octet-stream");
 
    res.send(csv);
});

router.get('/family', function (req, res, next) {
    var fields = [
        'employeeId',
        'reference',
        'relationship',
        'celNumber',
        'telNumber',
        'emailAdress'
    ];
 
    var csv = json2csv({ data: '', fields: fields });
 
    res.set("Content-Disposition", "attachment;filename=employee-familiinfo-upload.csv");
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


module.exports = router;