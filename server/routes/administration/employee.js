var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var Client = require('../../models/administration/administration-company');
var Department = require('../../models/administration/administration-department');
var mongoose = require('mongoose');

router.post('/client', function (req, res, next) {
    var token = jwt.decode(req.query.token);

    var client = new Client({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        campaigns: req.body.campaigns
    });
    if(parseInt(token.user.role) === 4) {
    client.save(function (err, result) {
        if (err) {
            return res.status(500).json({
                title: 'An error occurred',
                error: err
            });
        }
        res.status(200).json({
            message: 'saved menu',
            obj: result
            });
        });
    }else {
        res.status(400)
    }
});

router.get('/client', function (req, res, next) {
    Client.find(
        function (err, result) {
        if (err) {
            return res.status(500).json({
                title: 'An error occurred',
                error: err
            });
        }if (req.query.token === '') {
            return res.status(500).json({
                title: 'Not Found',
                message: 'authentication not found'
            });
        }if (result === null) {
            return res.status(500).json({
                title: 'Not found',
                message: 'Positions are empty or not found'
            });
        }
        res.status(200).json({
            message: 'Position request succesfull',
            obj: result
        });
    });
});

router.put('/client', function ( req, res, next) {
    Client.findById(req.query.id, function(err, doc) {
        doc.name = req.body.name;
        doc.campaigns = req.body.campaigns;
        doc.save();
        if (err) {
            return res.status(500).json({
                title: 'An error occurred',
                error: err
            });
        }
        res.status(200).json({
            message: 'client update request succesfull',
            obj: doc
        });
    });
});

module.exports = router;
