var express = require('express');
var router = express.Router();
var passport = require('passport');
var authenticate =require('../authenticate');
const bodyParser =require('body-parser');
var connect = require('../connection').connect;

router.use(bodyParser.json());

router.get('/',authenticate.authenticateUser,(req,res,next) =>
{
    var sql ="SELECT * FROM holds where username= '"+req.user.username+"'";
    connect.query(sql,(err,result)=>
    {
        if(!err)
        {
            console.log(result);
            res.statusCode=200;
            res.setHeader('Content-Type','application/json');
            res.json(result);
        }
        else
            next(err);
    })
});

router.post('/',authenticate.authenticateUser,(req,res,next) =>
{
    res.statusCode=200;
    var sql2="select shareValue,soldOut from shares where shareId= '"+req.body.shareId+"'";
    connect.query(sql2,(err,result) =>
    {
        if (!err)
        {
            var price = result[0].shareValue;
            if(result[0].soldOut===1)
            {
                var err =new Error("Share is alredy Sold");
                err.status=403;
                next(err);
            }
            else
            {
                var sql = "INSERT INTO tradeShares (username,shareId,priceBoughtAt,timeBoughtAt) VALUES ( '" + req.user.user + "'," +
                    "'" + req.body.shareId + "','" + price + "', now()     )";
                connect.query(sql, (err, result) =>
                {
                    if (!err)
                    {
                        var upd = "UPDATE shares set soldOut=1 where shareId= '" + req.body.shareId + "'";
                        connect.query(upd, (err, result) =>
                        {
                            var sql3= "INSERT INTO holds (username,shareId,priceBoughtAt) " +
                                "SELECT username,shareId,priceBoughtAt from tradeShares where username='"+
                                req.user.user +"' and shareId ='"+req.body.shareId+"' ";
                            connect.query(sql3,(err,result) =>
                            {
                                if(!err)
                                {
                                    res.statusCode = 200;
                                    res.setHeader('Content-Type', 'application/json');
                                    res.json({"success": true});
                                }
                                else
                                    console.log(err);
                            })
                        })
                    } else
                        next(err);
                });
            }
        }
        else
            next(err);
    });
});

module.exports= router;