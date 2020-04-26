var express = require('express');
var router = express.Router();
var passport = require('passport');
var authenticate =require('../authenticate');
const bodyParser =require('body-parser');
var connect = require('../connection').connect;
var cors =require('./cors');
router.use(bodyParser.json());

router.options('*',cors.corsWithOptions,(req,res)=>{res.sendStatus(200);})
router.get('/holds',cors.corsWithOptions,authenticate.authenticateUser,(req,res,next) =>
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

router.get('/history',cors.corsWithOptions,authenticate.authenticateUser,(req,res,next) =>
{
    var sql ="SELECT shareName,priceBoughtAt,priceSoldAt,priceSoldAt,timeBoughtAt,timeSoldAt FROM tradeShares where username= '"+req.user.user+"'";
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
})
router.post('/',cors.corsWithOptions,authenticate.authenticateUser,(req,res,next) =>
{
    /* update amount left */
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
                var que="select accountBalance from users where username= '"+req.user.user+"'";
                connect.query(que,(err,result) =>
                {
                    var accountBalance=result[0].accountBalance;
                    if(accountBalance>=price)
                    {
                        accountBalance=accountBalance-price;
                        var sql = "INSERT INTO tradeShare" +
                        "s (username,shareName,priceBoughtAt,timeBoughtAt) VALUES ( '" + req.user.user + "'," +
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
                                                var upd2="UPDATE users set accountBalance="+accountBalance+" where " +
                                                    "username ='"+req.user.user+"'";
                                                connect.query(upd2,(err,result) =>
                                                {
                                                    if(err)
                                                        console.log(err);
                                                    res.statusCode = 200;
                                                    res.setHeader('Content-Type', 'application/json');
                                                    res.json({"success": true});
                                                })
                                            }
                                            else
                                                console.log(err);
                                        })
                                    })
                                } else
                                    next(err);
                        });
                    }
                    else
                    {
                        err=new Error();
                        err.message="Insufficient account balance\n";
                        err.status=403;
                        next(err);
                    }
                })
            }
        }
        else
        {
            if(result.length===0)
                err=new Error("Share not found")
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
                        var que="select accountBalance from users where username= '"+req.user.user+"'";
                        connect.query(que,(err,result) =>
                        {
                            if(!err)
                            {
                                var accountBalance=result[0].accountBalance+value;
                                var upd3="UPDATE users set accountBalance="+accountBalance+" where username ='"+
                                    req.user.user+"'";
                                connect.query(upd3,(err,result) =>
                                {
                                    var upd2 = "UPDATE tradeShares set priceSoldAt='" + value + "', timeSoldAt=now() where " +
                                    "timeSoldAt is NULL and shareName='"+id+"'";
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
                                })
                            }
                            else
                            {
                                console.log(err);
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


router.post('/addMoney',authenticate.authenticateUser,(req,res,next) =>
{
    let sql="select name,accountBalance from users where username='"+req.user.user+"'";
    connect.query(sql,(err,result) =>
    {
        if(!err && result.length>0)
        {
            let sql2 = "select exchageValue from currencies where name='" + result[0].name + "'";
            let accountBalance = result[0].accountBalance;
            connect.query(sql2, (err, result) =>
            {
                if(result.length>0 && !err)
                {
                    let value = result[0].exchageValue;
                    req.body.amount = req.body.amount / value;
                    console.log(req.body.amount);
                    let sql3 = "INSERT INTO transacts (amount,username,status,dated) VALUES (" +
                        req.body.amount + ",'" + req.user.user + "','success',now())";
                    connect.query(sql3, (err, result) =>
                    {
                        if(!err)
                        {
                            accountBalance += req.body.amount;
                            let sql4 = "UPDATE users set accountBalance=" + accountBalance + " where username='" + req.user.user + "'";
                            connect.query(sql4, (err, result) =>
                            {
                                if(!err)
                                {
                                    res.statusCode = 200;
                                    res.setHeader('Content-Type', 'application/json');
                                    res.json({"success": true});
                                }
                                else
                                    next(err);
                            })
                        }
                        else
                        {
                            next(err);
                        }
                    })
                }
                else
                {
                    if(result.length<1)
                    {
                        err.message="Your country doesn't have currency";
                        err.status=404;
                    }
                    next(err);
                }
            })
        }
        else
        {
            next(err);
        }
    })
})
module.exports= router;