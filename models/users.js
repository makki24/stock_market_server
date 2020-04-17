module.exports =(connect,next) =>
{

    var sql = "create table if not exists users(" +
        "username varchar(255) primary key," +
        "password varchar(255) not null," +
        "admin bool default false," +
        "broker bool default false," +
        "firstname varchar(255) not null," +
        "lastname varchar(255)," +
        "gender enum('m','f') not null," +
        "address varchar(255)," +
        "name varchar(10) not null ," +
        "accountBalance decimal(15,2)," +
        "phone varchar(20), " +
        "FOREIGN KEY (`name`) REFERENCES `country` (`name`) ON DELETE CASCADE  )"


    connect.query(sql,(err,result,field) =>
    {
        if(err)
        {
            console.log('can\'t create table users',err);
        }
        else
        {
            console.log("created user table successfully");
        }
    });
}

