module.exports =(connect,next) =>
{

    var sql = "create table if not exists tradeShares(" +
        "username varchar(255) ," +
        "shareId varchar(10) ," +
        "priceBoughtAt int(10) not null," +
        "priceSoldAt int(10) ,"+
        "status enum('available,not-available,owned'),"+
        "timeBoughtAt datetime not null,"+
        "timeSoldAt datetime,"+
        "primary key(username,shareId,timeBoughtAt),"+
        "FOREIGN KEY (`username`) REFERENCES `users` (`username`) ON DELETE CASCADE " +
        " )";

    connect.query(sql,(err,result,field) =>
    {
        if(err)
        {
            console.log('can\'t create relationship user "trade\'s" shares',err);
        }
        else
        {
            console.log("created relationship user \"trades\'s \" shares successfully");
        }
    });
}
