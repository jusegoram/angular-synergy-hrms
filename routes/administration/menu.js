var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');

var Menus = require('../../models/administration/menu');
var Users = require('../../models/administration/user');
router.get('/', function(req, res, next) {
    var token = jwt.decode(req.query.token);
    var userID = token.user._id;

    Menus.find( { roles: { $all:[parseInt(token.user.role, 10)] } },
        function (err, result) {
        if (err) {
            return res.status(500).json({
                title: 'An error occurred',
                error: err
            });
        }if (req.query.token === '') {
            return res.status(500).json({
                title: 'pages',
                message: 'pages not found'
            });
        }if (result === null) {
            return res.status(500).json({
                title: 'pages',
                message: 'pages not found'
            });
        }
        res.status(200).json({
            message: 'pages request succesfull',
            obj: result
        });
    });
});

router.post('/', function (req, res, next){
            var menu = new Menus({
                state: req.body.state,
                name: req.body.name,
                type: req.body.type,
                icon: req.body.icon,
                badge: req.body.badge,
                children: req.body.children,
                roles: req.body.roles
           });
            menu.save(function(err, result) {
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
    });

module.exports = router;