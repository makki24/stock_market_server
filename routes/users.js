var express = require('express');
var router = express.Router();
var passport = require('passport');
/* GET users listing. */
router.post('/login', (req, res, next) =>
{
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json({success: true, status: 'You are successfully logged in!'});
});

module.exports = router;
