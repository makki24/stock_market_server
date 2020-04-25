module.exports =(connect,next) =>
{
    /*
    Assuming that corporation is not going to have same share in different market too.
     */
    var sql = "create table if not exists shares(" +
        "shareId varchar(10) primary key," +
        "shareName varchar(10)," +
        "shareValue int(10)," +
        "marketId varchar(10)," +
        "corpId varchar(10)," +
        "soldOut bool default false,"+
        "UNIQUE KEY(shareName,corpId),"+
        "FOREIGN KEY (`marketId`) REFERENCES `stockMarket` (`marketId`) ON DELETE CASCADE," +
        "FOREIGN KEY (`corpId`) REFERENCES `corporation` (`corpId`) ON DELETE CASCADE  )"

    connect.query(sql,(err,result,field) =>
    {
        if(err)
        {
            console.log('can\'t create table shares',err);
        }
        else
        {
            console.log("created share table successfully");
        }
    });
}