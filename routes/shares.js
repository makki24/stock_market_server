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
        var currency="INSERT INTO currencies(curId,currName,exchageValue) VALUES ('"+share.curId+"','"+share.currName+
                                    "','"+share.exchangeValue+"' )"
        connect.query(currency,(err,result) =>
        {
            if(!err || "ER_DUP_ENTRY"===err.code)
            {
                console.log("inserted currency successfully");
                var country ="INSERT INTO country (countryId,population,name,curId) VALUES ('" +share.countryId
                        +"' ," +share.population+" ,'" +share.name+"' ,'" +share.curId+
                            "')"
                connect.query(country,(err,result) =>
                {
                    if(!err || "ER_DUP_ENTRY"===err.code)
                    {
                        console.log("inserted country successfullly");
                        var market = "INSERT INTO stockMarket (marketName,marketId,countryId) VALUES ('" +share.marketName+"' ,'" +
                            share.marketId+"' ,'" +share.countryId+"' " +
                            ")"
                        connect.query(market,(err,result) =>
                        {
                            if(!err || "ER_DUP_ENTRY"===err.code)
                            {
                                console.log("inserted market successfullly")
                                var sql = "INSERT INTO shares (shareId,shareValue,marketId,corpId) VALUES ('"+share.shareId+"' ," +
                                    share.shareValue+" ,'"+share.marketId+"' ,'"+share.corpId+"')";
                                connect.query(sql,(err,result) =>
                                {
                                    if(!err)
                                    {
                                        console.log("inserted share successfullly")
                                        res.statusCode=200;
                                        res.setHeader('Content-Type','application/json');
                                        res.json({status:"success"});
                                    }
                                    else
                                    {
                                        if(err.code==="ER_DUP_ENTRY")
                                            err.message="share already added";
                                        console.log("from share");
                                        next(err);
                                    }
                                })
                            }
                            else
                            {
                                console.log("from market");
                                next(err);
                            }
                        })
                    }
                    else
                    {
                        console.log("from market");
                        next(err);
                    }
                });
                var corp = "INSERT INTO corporation (corpId,corpName,corpType) VALUES ('" +share.corpId+"' ,'" +
                    share.corpName+"' ,'" +share.corpType+"' "+
                    ")"
                connect.query(corp,(err,result) =>
                {
                    if(!err || "ER_DUP_ENTRY"===err.code)
                    {
                        console.log("inserted into corporation successfully ");
                    }
                    else
                    {
                        console.log("from corporation");
                        if(err.code==="WARN_DATA_TRUNCATED")
                            err.message="Only specific types are allowed in field corporation types";
                        next(err);
                    }
                });
            }
            else if(err)
            {
                console.log("from currency");
                if(err.code==="ER_NO_DEFAULT_FOR_FIELD")
                {
                    err.message="currency name is required";
                    err.status=404;
                }
                next(err);
            }
        });
    });
})
module.exports= router;