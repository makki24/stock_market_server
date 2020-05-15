var express = require('express');
var router = express.Router();
var authenticate =require('../authenticate');
const bodyParser =require('body-parser');
var connect = require('../connection').connect;
var cors =require('./cors');
router.use(bodyParser.json());

router.options('*',cors.corsWithOptions,(req,res)=>{res.sendStatus(200);});

router.get('/',cors.corsWithOptions,(req,res,next) =>
{
    var sql="SELECT * FROM country";
    connect.query(sql,(err,result)  =>
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


router.post('/',cors.corsWithOptions,authenticate.authenticateUser,authenticate.verifyAdmin,(req,res,next) =>
{
    req.body.commision=parseFloat(req.body.commision).toFixed(2);
    console.log(req.body);
    var sql ="INSERT into country (name,population,commision) values ('" +
        req.body.name+"','"+req.body.population+"','"+req.body.commision+"' )";
    connect.query(sql,(err,result) =>
    {
        if(err)
            next(err)
        else
        {
            let curq="INSERT into currencies (name,curId,exchageValue,currName) values ('" +
                req.body.name+"','"+req.body.curId+"','"+req.body.exchageValue+"','"+req.body.currName+"' )";
            connect.query(curq,(err,result) =>
            {
                if(err)
                    next(err);
                else
                {
                    res.statusCode=200;
                    res.setHeader('Content-Type','application/json');
                    res.json({"success":true});
                }
            })
        }
    })
})
module.exports =router;