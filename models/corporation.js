module.exports =(connect,next) =>
{

    var sql = "create table if not exists corporation(" +
        "corpId varchar(10) primary key," +
        "IPODate date," +
        "corpName varchar(10) not null ," +
        "corpType enum('publicly held','closely held','limited liability','c corporation','s corporation'" +
            ",'professional','non-profit') default 'non-profit', " +
        "startDate date"+
        "  )"

    connect.query(sql,(err,result,field) =>
    {
        if(err)
        {
            console.log('can\'t create table corporation',err);
        }
        else
        {
            console.log("created corporation table successfully");
        }
    });
}