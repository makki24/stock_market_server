module.exports =(connect,next) =>
{

    var sql = "create table if not exists transacts(" +
        "transactionId int(10) auto_increment primary key ," +
        "amount decimal(10,2) not null," +
        "username varchar(255) not null ," +
        "status enum('success','failure'), " +
        "dated datetime not null,"+
        "FOREIGN KEY (`username`) REFERENCES `users` (`username`) ON DELETE CASCADE )";

    connect.query(sql,(err,result,field) =>
    {
        if(err)
        {
            console.log('can\'t create relationship user "transacts\'s" currencies',err);
        }
        else
        {
            console.log("created relationship user \"transacts\'s \" currencies successfully");
        }
    });
}