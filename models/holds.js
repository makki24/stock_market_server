module.exports =(connect,next) =>
{

    var sql = "create table if not exists holds(" +
        "username varchar(255) ," +
        "shareId varchar(10) ," +
        "priceBoughtAt int(10)," +
        "primary key(username,shareId), "+
        "FOREIGN KEY (`shareId`) REFERENCES `shares` (`shareId`) ON DELETE CASCADE, " +
        "FOREIGN KEY (`username`) REFERENCES `users` (`username`) ON DELETE CASCADE " +
        " )";

    connect.query(sql,(err,result,field) =>
    {
        if(err)
        {
            console.log('can\'t create relationship user "holds" shares',err);
        }
        else
        {
            console.log("created relationship user \"holds\" shares successfully");
        }
    });
}

