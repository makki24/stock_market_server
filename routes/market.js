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
    var sql="SELECT * FROM stockMarket";
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
 //   req.body.commision=parseFloat(req.body.commision).toFixed(2);
    console.log(req.body);
   var sql ="INSERT into stockMarket (name,workingDays,marketId,marketName) values ('" +
        req.body.name+"','"+req.body.workingDays+"','"+req.body.marketId+"','"+req.body.marketName+"' )";
    connect.query(sql,(err,result) =>
    {
        if(err)
            next(err)
        else
        {
            res.statusCode=200;
            res.setHeader('Content-Type','application/json');
            res.json({"success":true});
        }
    })
})


router.delete('/',cors.corsWithOptions,authenticate.authenticateUser,authenticate.verifyAdmin,(req,res,next) =>
{
   var sql ="DELETE FROM stockMarket WHERE marketId='"+req.body.marketId+"'";
   connect.query(sql,(err,result) =>
   {
       if(!err)
       {
           res.statusCode=200;
           res.setHeader('Content-Type','application/json');
           res.json({"success": true});
       }
       else
       {
           next(err);
       }
   })
});


module.exports =router;