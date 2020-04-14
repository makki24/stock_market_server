module.exports =(connect,next) =>
{

    var sql = "create table if not exists currencies(" +
        "curId varchar(15) primary key," +
        "exchageValue int(15) not null," +
        "currName varchar(10) not null" +
        " )"

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