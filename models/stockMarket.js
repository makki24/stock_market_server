module.exports =(connect,next) =>
{

    var sql = "create table if not exists stockMarket(" +
        "marketName varchar(20) not null," +
        "workingDays int(10)," +
        "marketId varchar(10) primary key," +
        "name varchar(10)," +
        "FOREIGN KEY (`name`) REFERENCES `country` (`name`) ON DELETE CASCADE  )"

    connect.query(sql,(err,result,field) =>
    {
        if(err)
        {
            console.log('can\'t create table stockMarket',err);
        }
        else
        {
            console.log("created stockMarket table successfully");
        }
    });
}