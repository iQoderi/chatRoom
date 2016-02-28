/**
 *
 * Created by qoder on 16-2-25.
 */
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var User = mongoose.model('Users');
router.get('/', f = function (req, res, next) {
    res.render('index');
});
router.get('/login', function (req, res, next) {
    if (req.session.hasLogin) {
        res.redirect('/chatRoom');
    } else {
        res.render('login');
    }
});

router.post('/login', function (req, res, next) {
    User.findOne({username: req.body.user}, function (err, user) {
        if (err) {
            res.json({msg: "登录失败"});
        }
        if (user) {
            res.json(401, {msg: '该用户名已经被占用了'});
        } else {
            User.create({
                username: req.body.username
            }, function (err, users) {
                if (err) {
                    res.json({msg: err});
                } else {
                    console.log(users);
                    req.session.hasLogin = true;
                    res.send(200);
                }
            })
        }
    })

});

router.get('/chatRoom', function (req, res, next) {
    if (req.session.hasLogin) {
        res.render('chatRoom')
    } else {
        res.redirect('/login');
    }
});
module.exports = router;