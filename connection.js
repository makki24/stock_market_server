var connect;
const connec_fn = () =>
{
    var mysql= require('mysql');
    connect =mysql.createConnection(
        {
          user:"root",
          host:"localhost",
          password:'password',
          database:'stock'
        }
    );
    connect.connect((err)  =>
    {
        if(err)
            console.log(err);
        else
        {
            console.log('connected correctly to the database server');
            const createuser =require('./models/users');
            createuser(connect);
            const createbrooker =require('./models/broker');
            createbrooker(connect);
            const createcorp = require('./models/corporation');
            createcorp(connect);
            const createcurrency= require('./models/currency');
            createcurrency(connect);
            const createcountry = require('./models/country');
            createcountry(connect);
            const createmarket = require('./models/stockMarket');
            createmarket(connect);
            const createshare =require('./models/shares');
            createshare(connect);
        }
    });
}

exports.connection =connec_fn();
exports.connect =connect;