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
    var sql="SELECT * FROM corporation";
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
    var sql ="INSERT into corporation (corpId,corpName,corpType,image,startDate) values ('" +
        req.body.corpId+"','"+req.body.corpName+"','"+req.body.corpType+"','"+req.body.image+"', now())";
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

module.exports =router;