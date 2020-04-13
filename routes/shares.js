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
        var currency="INSERT INTO currencies(curId,exchageValue) VALUES ('"+share.curId+
                                    "','"+share.exchangeValue+"' )"
        connect.query(currency,(err,result) =>
        {
            if(!err)
            {
                console.log("inserted currency successfully");
                var country ="INSERT INTO country (countryId,population,name,curId) VALUES ('" +share.countryId
                        +"' ," +share.population+" ,'" +share.name+"' ,'" +share.curId+
                            "')"
                connect.query(country,(err,result) =>
                {
                    if(!err)
                    {
                        console.log("inserted country successfullly");
                        var market = "INSERT INTO stockMarket (marketName,marketId,countryId) VALUES ('" +share.marketName+"' ,'" +
                            share.marketId+"' ,'" +share.countryId+"' " +
                            ")"
                        connect.query(market,(err,result) =>
                        {
                            if(!err)
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
                                        console.log("shares err",err);
                                    }
                                })
                            }
                            else
                            {
                                console.log("market err",err);
                                return ;
                            }
                        })
                    }
                    else
                    {
                        console.log("country err",err);
                        return ;
                    }
                });
                var corp = "INSERT INTO corporation (corpId,corpName,corpType) VALUES ('" +share.corpId+"' ,'" +
                    share.corpName+"' ,'" +share.corpType+"' "+
                    ")"
                connect.query(corp,(err,result) =>
                {
                    if(!err)
                    {
                        console.log("inserted into corporation successfully ");
                    }
                    else
                    {
                        console.log("corp err",err);
                    }
                });
            }
            if(err)
            {
                console.log("currency err",err);
                return ;
            }
        });
    });
})
module.exports= router;