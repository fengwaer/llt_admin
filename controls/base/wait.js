const { log } = require('console');
const db=require('../../db/index');
const XLSX=require('xlsx');
var fs = require("fs");
const now_date=new Date()

const get= async (ctx, next) => {
  const title = '代办事项'
  const get=ctx.query.get;
  const data=ctx.query;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayStr = db.format('yyyy-MM-dd', today);
  if (get == 1) {
    let sql = `
        delete from wait
        WHERE date < '${todayStr}';
        SELECT * FROM wait WHERE
        names LIKE '%${data.sch}%' 
        ORDER BY date ASC `
    await db.query(sql).then(results => {
        const res = results[1];
        res.map(i => {
            i.date = db.format('yyyy-MM-dd', i.date);
        });
        ctx.body = { code: 1, data: res };
    });
}else if(get==2){//获取今天的待办事项
    let sql=`select * from wait where date='${todayStr}'`;
    await db.query(sql).then(results => {
        const res = results;
        res.map(i => {
            i.date = db.format('yyyy-MM-dd', i.date);
        });
        ctx.body = { code: 1, data: res };
    });
}else if(get==3){//添加数据
    const sql = `INSERT INTO wait (names, date) VALUES (?, ?)`;
    const values = [data.names, data.date];
    try{
      await db.query(sql, values).then(re=>{
          ctx.body={code:1,msg:'添加成功！'};
        })
    }catch(err){
      ctx.body={code:0,msg:'添加失败！'+err};
      console.log(err);
    }

  }else if(get==0){//删除数据
    let sql=`delete from wait where Id=${data.id}`;
    try{
    await db.query(sql).then(re=>{
      ctx.body={code:1,msg:'删除成功！'};
    })
    }catch(err){
      ctx.body={code:0,msg:'删除失败！'+err};
    }
  }else{
    await ctx.render('base/wait', {
      title,
    })
  }
  
}

module.exports={
  get
}