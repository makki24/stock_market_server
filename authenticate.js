
var connect = require('./connection').connect;

const authenticateUser =(req,res,next) =>
{
    if (!req.session.user)
    {
       var username =req.body.username;
       var password =req.body.password;
       var sql="SELECT * from users where username = \'"+username+"\' and password = \'" +password+"\'";
       connect.query(sql,(err,res,field) =>
       {
           if(err)
           {
               next(err);
               return ;
           }
           if(res.length>0)
           {
               var obj=new Object();
               obj.user=username;
               obj.broker =res[0].broker;
               obj.admin= res[0].admin;
               req.user=obj;
               req.session.user = username;
               next();
           }
           else
           {
               var err =new Error("password and username combination doesn't exist  ");
               err.status=401;
               next(err);
           }
       })
    }
    else
    {
        req.user =req.session.user;
        next();
    }
};


module.exports =authenticateUser;