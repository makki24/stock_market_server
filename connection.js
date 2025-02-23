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
            const createcountry = require('./models/country');
            createcountry(connect);
            const createuser =require('./models/users');
            createuser(connect);
            const createbrooker =require('./models/broker');
            createbrooker(connect);
            const createcorp = require('./models/corporation');
            createcorp(connect);
            const createcurrency= require('./models/currency');
            createcurrency(connect);
            const createmarket = require('./models/stockMarket');
            createmarket(connect);
            const createshare =require('./models/shares');
            createshare(connect);
            const createholds =require('./models/holds');
            createholds(connect);
            const createtradeShares =require('./models/tradeShares');
            createtradeShares(connect);
            const createtransacts =require('./models/transacts');
            createtransacts(connect);
        }
    });
}

exports.connection =connec_fn();
exports.connect =connect;