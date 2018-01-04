var express = require('express');
var router = express.Router();
var json2csv = require('json2csv');
router.get('/', function (req, res, next) {
    var fields = [
        'employeeId',
        'firstName',
        'lastName',
        'birthDate',
        'socialSecurity',
        'campaign',
        'positionid',
        'status'
    ];
 
    var csv = json2csv({ data: '', fields: fields });
 
    res.set("Content-Disposition", "attachment;filename=employee-upload.csv");
    res.set("Content-Type", "application/octet-stream");
 
    res.send(csv);
});

module.exports = router;