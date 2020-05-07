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

module.exports =router;