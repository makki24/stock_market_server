module.exports =(connect,next) =>
{

    var sql = "create table if not exists users(" +
        "username varchar(255) not null unique," +
        "password varchar(255) not null," +
        "admin bool default false," +
        "broker bool default false)";

    connect.query(sql,(err,result,field) =>
    {
        if(err)
        {
            console.log('can\'t create table users');
        }
        else
        {
            console.log("created user table successfully");
        }
    });
}

