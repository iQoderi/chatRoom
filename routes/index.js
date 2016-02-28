/**
 *
 * Created by qoder on 16-2-27.
 */

var express = require('express');
var router = express.Router();
var file = require("../controllers/file.js");

router.post('/fileupload', file.upload, function (req,res,next) {
    res.send(200);
});
//router.get('/download/:id', file.download);


module.exports = router;