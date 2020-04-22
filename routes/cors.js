const cors= require('cors');
const express =require('express');

const app =express();

const whitelist = ['http://localhost:3001', 'https://localhost:3443','http://localhost:3001'];

var corsOptionsDelegate =(req,callback) =>
{
    var corsOptions={credentials:true} ;
    console.log(req.header('Origin'));

    if(whitelist.indexOf(req.header('Origin'))!==-1)
    {
        corsOptions.origin=true;
    }
    else
        corsOptions.origin=false;

    callback(null,corsOptions);
}

exports.cors =cors();
exports.corsWithOptions = cors(corsOptionsDelegate);