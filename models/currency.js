module.exports =(connect,next) =>
{

    var sql = "create table if not exists currencies(" +
        "name varchar(10) not null ," +
        "curId varchar(15) primary key," +
        "exchageValue decimal(8,3) default 0  , " +
        "currName varchar(10) not null," +
        "FOREIGN KEY (`name`) REFERENCES `country` (`name`) ON DELETE CASCADE  )";

    connect.query(sql,(err,result,field) =>
    {
        if(err)
        {
            console.log('can\'t create table currency',err);
        }
        else
        {
            console.log("created currency table successfully");
        }
    });
}