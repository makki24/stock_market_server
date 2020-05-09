var express = require('express');
var router = express.Router();
var passport = require('passport');
var authenticate =require('../authenticate');
const bodyParser =require('body-parser');
var connect = require('../connection').connect;
var cors =require('./cors');

router.use(bodyParser.json());

router.options('*',cors.corsWithOptions,(req,res)=>{res.sendStatus(200);})
router.get('/',cors.corsWithOptions,(req,res,next) =>
{
    var sql = "select shareId,shareName,shareValue,marketName,corpId,soldOut,name from shares,stockMarket where shares.marketId=stockMarket.marketId;";

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
        share.population=share.population?share.population:0;
        share.commision=share.commision?share.commision:0;
        share.corpType=share.corpType?share.corpType:'non-profit';
        share.exchageValue=share.exchageValue?share.exchageValue:0;
        share.currName=share.currName?share.currName:"";
        share.marketName=share.marketName?share.marketName:" ";
        var country ="INSERT INTO country (name,population,commision) VALUES ("
                        +" '" +share.name+"' ," +share.population+" ,'" +share.commision+
                            "')";
        connect.query(country,(err,result) =>
        {
            if(!err || "ER_DUP_ENTRY"===err.code )
            {
                console.log("inserted country successfully");
                var currency="INSERT INTO currencies(curId,currName,name,exchageValue) VALUES ('"+share.curId+"','"+share.currName+
                                    "','"+share.name+"',"+share.exchageValue+" )"
                connect.query(currency,(err,result) =>
                {
                    if(!err || "ER_DUP_ENTRY"===err.code)
                    {
                        console.log("inserted currencies successfullly");
                        var market = "INSERT INTO stockMarket (marketName,marketId,name) VALUES ('" +share.marketName+"' ,'" +
                            share.marketId+"' ,'" +share.name+"' " +
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
                                    if(!err || "ER_DUP_ENTRY"===err.code)
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
                        console.log("from currencies",err);
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
                console.log("from country",err);
                if(err.code==="ER_NO_DEFAULT_FOR_FIELD")
                {
                    err.message="country name is required";
                    err.status=404;
                }
                next(err);
            }
        });
    });
});

router.put('/',authenticate.authenticateUser,authenticate.verifyAdmin,(req,res,next) =>
{
    var sql="update shares set shareValue ="+req.body.shareValue+" where shareId='"+req.body.shareId+"'";
    connect.query(sql,(err,result) =>
    {
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
    });
})
router.delete('/',authenticate.authenticateUser,authenticate.verifyAdmin,(req,res,next) =>
{
   var count =0;
   req.body.map((value) =>
   {
       console.log(value);
       var sql ="DELETE FROM shares WHERE shareId='"+value+"'";
       connect.query(sql,(err,result) =>
       {
           if(!err)
           {
               count++;
           }
       })
   });
   res.statusCode=200;
   res.setHeader('Content-Type','application/json');
   res.json({status:"successfully deleted "+count});
});
module.exports= router;