
var connect = require('./connection').connect;

exports.authenticateUser =(req,res,next) =>
{
    if (!req.session.user)
    {
       var username =req.body.username;
       var password =req.body.password;
       var sql="SELECT * from users where username = \'"+username+"\' and password = \'" +password+"\'";
       connect.query(sql,(err,result,field) =>
       {
           if(err)
           {
               next(err);
               return ;
           }
           if(result.length>0)
           {
               var obj=new Object();
               obj.user=username;
               obj.broker =result[0].broker;
               obj.admin= result[0].admin;
               req.user=obj;
               req.session.user = obj;
               next();
           }
           else
           {
                req.session.destroy((err) =>
                {
                    if (err)
                    {
                        return console.log(err);
                    }
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    return res.json({
                        "success": false,
                        "status": 'login unsuccessfull',
                        err: 'username and password combination doesn\'t exist'
                    });
                })
           }
       })
    }
    else
    {
        req.user =req.session.user;
        next();
    }
};

exports.verifyAdmin =(req,res,next) =>
{
    if(req.user.admin)
       next();
    else
    {
        var err=new Error('You are not authorized');
        err.status=401;
        next(err);
    }
}