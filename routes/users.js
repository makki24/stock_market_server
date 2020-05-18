var express = require('express');
var router = express.Router();
var passport = require('passport');
var authenticate =require('../authenticate');
const bodyParser =require('body-parser');
var connect = require('../connection').connect;
var cors =require('./cors');


router.use(bodyParser.json());
router.options('*',cors.corsWithOptions,(req,res)=>{res.sendStatus(200);});

router.get('/',authenticate.authenticateUser,authenticate.verifyAdmin,(req,res,next) =>
{
    var sql = "SELECT * FROM users";
    connect.query(sql,(err,result,field) =>
    {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({result});
    });
});
router.get('/details',cors.corsWithOptions,authenticate.authenticateUser,(req,res,next) =>
{
    var sql = "select * from users where username= '"+req.user.user+"'";
    connect.query(sql,(err,result,field) =>
    {
        res.statusCode=200;
        res.setHeader('Content-Type', 'application/json');
        res.json(result[0]);
    })
})
router.post('/signup',cors.corsWithOptions,(req,res,next) =>
{
   console.log(req.body);
   var arr=['full service','discount','online broker'];
   var ind;
   if(req.body.broker)
   ind=arr.indexOf(req.body.type);
   req.body.broker=req.body.broker===true?1:0;
   req.body.gender=req.body.gender==='Male'?'m':'f';
   req.body.commision=parseFloat(req.body.commission).toFixed(2);
   if(!req.body.broker || ((req.body.commision>=0) && (req.body.commision<=100) && ind!==-1))
   {
       var sql = "INSERT INTO users (username,password,broker,firstname,lastname,address,phone,name,gender) VALUES (" +
           "'" + req.body.username + "','" + req.body.password + "','" + req.body.broker + "','" + req.body.firstname + "','" +
           req.body.lastname + "','" + req.body.address + "','" + req.body.phone_no + "','" + req.body.country+"','" +
           "" +req.body.gender + "')"
       connect.query(sql, (err, resu, field) =>
       {
           if (err)
           {
               console.log(err);
               if(err.code==='ER_DUP_ENTRY')
                   err.message="Username aleready exists";
               next(err);
               return;
           } else
           {
               if (req.body.broker)
               {
                   var sql_q = "INSERT INTO brokers (LicenceNumber,company,commision,username,type) VALUES (" +
                       "'" + req.body.LicenceNumber + "','" + req.body.company + "','" + req.body.commision + "','" + req.body.username
                       + "','" + req.body.type + "')";
                   connect.query(sql_q, (err, resu, field) =>
                   {
                       if (err)
                       {
                           console.log(err)
                           next(err);
                           return;
                       } else
                       {
                           res.statusCode = 200;
                           res.setHeader('Content-Type', 'application/json');
                           res.json({"success": true, "broker_added": true});
                       }
                   })
               } else
               {
                   res.statusCode = 200;
                   res.setHeader('Content-Type', 'application/json');
                   res.json({"success": true,});
               }
           }
       });
   }
   else
   {
       if(req.body.commision <0 || req.body.commision>100)
       {
           err=new Error("commision must be in range 0-100 inclusive");
           err.status=401;
           next(err);
           return;
       }
       else if(ind===-1)
       {
           err=new Error("type can only be \'full service,discount,online broker'");
           err.status=401;
           next(err);
           return ;
       }
       console.log(req.body.commission,ind);
       err=new Error("unknown err");
       next(err);
   }
});


router.post('/logout',cors.corsWithOptions,(req,res,next) =>
{
    console.log(req.session);
    if(1)
    {
        req.session.destroy((err) => {
                if(err) {
                    return console.log(err);
                }
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                return res.json({"success": true});
        });
    }
    else
    {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        return res.json({"success": false, "status": 'login unsuccessfull',err:'You are not logged in'});
    }
});

router.post('/login',cors.corsWithOptions,(req,res,next) =>
{
    req.session.user=null;
    res.clearCookie('session-id');
    next();
}, authenticate.authenticateUser,(req, res, next) =>
{
    if(req.user)
    {
         res.statusCode = 200;
         res.setHeader('Content-Type', 'application/json');
         res.json({"success":true});
    }
    else
    {
        var err =new Error('Unknown error');
        next(err);
    }
});



module.exports = router;
