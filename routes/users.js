var express = require('express');
var router = express.Router();
var passport = require('passport');
var authenticate =require('../authenticate');
const bodyParser =require('body-parser');
var connect = require('../connection').connect;
/* GET users listing. */


router.use(bodyParser.json());
router.post('/signup',(req,res,next) =>
{
    var sql ='INSERT INTO users (username,password,broker) VALUES (\''+req.body.username+'\',\''+req.body.password+'\',\''+req.body.broker+'\')';
    connect.query(sql,(err,resu,field) =>
    {
        if(err)
        {
            next(err);
            return ;
        }
        else
        {
             res.statusCode = 200;
             res.setHeader('Content-Type', 'application/json');
             res.json({"status":"success"});
        }
    });

})
router.post('/login',(req,res,next) =>
{
    req.session.user=null;
    res.clearCookie('session-id');
    next();
}, authenticate,(req, res, next) =>
{
    if(req.user)
    {
         console.log(req.user);
         res.statusCode = 200;
         res.setHeader('Content-Type', 'application/json');
         res.json({"status":"success"});
    }
    else
    {
        var err =new Error('Unknown error');
        next(err);
    }
});

module.exports = router;
