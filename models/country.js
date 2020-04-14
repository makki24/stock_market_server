module.exports =(connect,next) =>
{

    var sql = "create table if not exists country(" +
        "countryId varchar(15) primary key," +
        "population int(15) not null check( population >=0)," +
        "name varchar(10) not null unique," +
        "commision decimal(5,2) default 0  check (commision between 0 and 100 ) ," +
        "curId varchar(10) not null,"+
        "FOREIGN KEY (`curId`) REFERENCES `currencies` (`curId`) ON DELETE CASCADE  )"

    connect.query(sql,(err,result,field) =>
    {
        if(err)
        {
            console.log('can\'t create table country',err);
        }
        else
        {
            console.log("created country table successfully");
        }
    });
}