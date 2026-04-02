const { log } = require('console');
const db=require('../../db/index');
var fs = require("fs");



const get= async (ctx, next) => {
  const title = '案件统计'
  const get=ctx.query.get;
  const data=ctx.query;
  if(get==1){
    const sql = `SELECT stage, COUNT(*) AS num FROM cases
    WHERE stage IN ('一审', '二审', '再审', '执行', '结案') AND start_date like ? GROUP BY stage;
    SELECT * FROM cases WHERE DATE(next_date) = CURDATE();
    SELECT * FROM cases WHERE DATE(next_date) = CURDATE() + INTERVAL 1 day;
    SELECT * FROM cases WHERE date(next_date) > CURDATE() ORDER BY next_date ASC LIMIT 3;
    SELECT client FROM cases WHERE next_date >= CURDATE() AND next_date < DATE_ADD(CURDATE(), INTERVAL 15 DAY) ORDER BY next_date asc;
    select * from wait where date(date)= curdate()`;
        const values = [`%${data.date}%`];
        try{
          await db.query(sql, values).then(re=>{
            ctx.body={code:1,msg:re};
          })
        }catch(err){
          console.log(err);
          ctx.body={code:0,msg:'获取失败！'+err};
        }
  }else if(get==2){//
    
  }else{
    await ctx.render('base/case_tj', {
      title,
    })
  }
  
}

module.exports={
  get
}