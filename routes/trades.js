var express = require('express');
var router = express.Router();
var passport = require('passport');
var authenticate =require('../authenticate');
const bodyParser =require('body-parser');
var connect = require('../connection').connect;

router.use(bodyParser.json());

router.get('/',authenticate.authenticateUser,(req,res,next) =>
{
    var sql ="SELECT shareId,priceBoughtAt FROM holds where username= '"+req.user.user+"'";
    connect.query(sql,(err,result)=>
    {
        if(!err)
        {
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
    var sql2="select shareValue,soldOut from shares where shareId= '"+req.body.shareId+"'";
    connect.query(sql2,(err,result) =>
    {
        if (!err && result.length>0)
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
                var sql = "INSERT INTO tradeShare" +
                    "s (username,shareId,priceBoughtAt,timeBoughtAt) VALUES ( '" + req.user.user + "'," +
                    "'" + req.body.shareId + "','" + price + "', now()     )";
                connect.query(sql, (err, result) =>
                {
                    if (!err)
                    {
                        var upd = "UPDATE shares set soldOut=1 where shareId= '" + req.body.shareId + "'";
                        connect.query(upd, (err, result) =>
                        {
                            var sql3= "INSERT INTO holds (username,shareId,priceBoughtAt) VALUES ( '" +
                                req.user.user+"','"+req.body.shareId+"','"+price+"')";
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
        {
            if(result.length===0)
                err.message="Share not found";
            next(err);
        }
    });
});

router.delete('/',authenticate.authenticateUser,(req,res,next) =>
{

    var ret= "select shareValue,shareId from shares where shareId= '"+req.body.shareId+"'";
    connect.query(ret,(err,result) =>
    {
       var id= result[0].shareId;
       var value= result[0].shareValue;
       var sql = "DELETE FROM holds where shareId= '"+id+"'";
       connect.query(sql,(err,result) =>
       {
            if(err)
                next(err);
            else
            {
                var upd= "UPDATE shares set soldOut=0 where shareId='"+id+"'";
                connect.query(upd,(error,result) =>
                {
                    if(!error)
                    {
                        var upd2 = "UPDATE tradeShares set priceSoldAt='" + value + "', timeSoldAt=now() where " +
                            "timeSoldAt is NULL and shareId='"+id+"'";
                        connect.query(upd2,(err,result) =>
                        {
                            console.log(result);
                            if(!err)
                            {
                                res.statusCode = 200;
                                res.setHeader('Content-Type', 'application/json');
                                res.json({"success": true});
                            }
                            else
                            {
                                next(err);
                            }
                        })
                    }
                    else
                        next(err);
                });
            }
       });
    });
});

module.exports= router;