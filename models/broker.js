module.exports =(connect,next) =>
{

    var sql = "create table if not exists brokers(" +
        "LicenceNumber varchar(10) primary key," +
        "company varchar(15)," +
        "commision decimal(5,2)  check (commision between 0 and 100 )," +
        "username varchar(255) not null ," +
        "type enum('full service','discount','online broker'), " +
        "FOREIGN KEY (`username`) REFERENCES `users` (`username`) ON DELETE CASCADE )"

    connect.query(sql,(err,result,field) =>
    {
        if(err)
        {
            console.log('can\'t create table brokers',err);
        }
        else
        {
            console.log("created broker table successfully");
        }
    });
}