var express = require('express');
var router = express.Router();
var passport = require('passport');
var authenticate =require('../authenticate');
const bodyParser =require('body-parser');
var connect = require('../connection').connect;

router.use(bodyParser.json());

router.get('/',(req,res,next) =>
{
    var sql = "SELECT * FROM shares ";

    connect.query(sql,(err,result) =>
    {
        if(err)
        {
            next(err);
        }
        else
        {
            res.statusCode=200;
            res.setHeader('Content-Type','application/json');
            res.json(result);
        }
    })
});

router.post('/',authenticate.authenticateUser,authenticate.verifyAdmin,(req,res,next) =>
{
    var status=[];
    req.body.map((share,index) =>
    {
        var sql = "INSERT INTO shares (shareId,shareValue,marketId,corpId) VALUES ('"+share.shareId+"' ," +
            share.shareValue+" ,'"+share.marketId+"' ,'"+share.corpId+"')";
        connect.query(sql,(err,result) =>
        {
            var stat =new Object({status:false});
            if(!err)
            {
                stat={status:true};
            }
            status.push(stat);
            if(err)
            {
                console.log(err);
            }
            console.log(status);
        });
    });
    console.log(status);
    res.statusCode=200;
    res.setHeader('Content-Type','application/json');
    res.json(status);
})
module.exports= router;