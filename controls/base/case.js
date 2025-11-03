const { log } = require('console');
const db=require('../../db/index');
const XLSX=require('xlsx');
var fs = require("fs");
const now_date=new Date()

const get= async (ctx, next) => {
  const title = '案件管理'
  const get=ctx.query.get;
  const data=ctx.query;
  if(get==0){
    let sql=`select * from cases`;
    await db.query(sql).then(results => {
        const res = results;
        ctx.body = { code: 1, data: res };
    });

  }
  else if (get == 1) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayStr = db.format('yyyy-MM-dd', today);

    let stage;
    data.stage==''?stage=` stage!='结案' and `:stage=` stage='${data.stage}' and `;
    let sql = `
        update cases set next_date=NULL
        where next_date < NOW() AND next_date IS NOT NULL;
        SELECT * FROM cases WHERE ${stage}
        user = '${data.user}' AND
        (names LIKE '%${data.sch}%' OR num LIKE '%${data.sch}%' or client like '%${data.sch}%')
         ORDER BY(next_date IS NULL), next_date ASC 
        LIMIT ${parseInt(data.num) * parseInt(data.page)}, ${data.num};
    `;
    await db.query(sql).then(results => {
        const res = results[1];
        res.map(i => {
            i.next_date = i.next_date?db.format('yyyy-MM-dd hh:mm', i.next_date):null;
            i.start_date = i.start_date?db.format('yyyy-MM-dd', i.start_date):null;
            i.evidence_end = i.evidence_end?db.format('yyyy-MM-dd', i.evidence_end):null;
            i.up_end = i.up_end?db.format('yyyy-MM-dd', i.up_end):null;
            i.make_date = i.make_date?db.format('yyyy-MM-dd', i.make_date):null;
            i.xb_end = i.xb_end?db.format('yyyy-MM-dd', i.xb_end):null;
            i.end_date = i.end_date?db.format('yyyy-MM-dd', i.end_date):null;
        });
        ctx.body = { code: 1, data: res };
    });
}
  else if(get==2){//更新数据
    const sql = `UPDATE cases SET 
        user = ?, names = ?, num = ?, stage = ?, 
        judge = ?, judge_call = ?, clerk = ?, clerk_call = ?, 
        client = ?, client_call = ?, client_addr = ?, role = ?, 
        evidence_end = ?, up_end = ?, side = ?, side_call = ?, side_addr = ?,
        side_cost=?, side_atty = ?,side_atty_call = ?,xb_end = ?, make_date = ?,
        court = ?, addr = ?, next_date = ?, remake = ?,end_date = ?,
        agent=? WHERE Id = ?`;

    const values = [
        data.user, data.names, data.num, data.stage,
        data.judge, data.judge_call, data.clerk, data.clerk_call,
        data.client, data.client_call, data.client_addr, data.role,
        data.evidence_end||null, data.up_end||null, data.side, data.side_call,data.side_addr,
        data.side_cost,data.side_atty,data.side_atty_call,data.xb_end||null,data.make_date||null,
        data.court, data.addr, data.next_date||null, data.remake,data.end_date,
        data.agent, data.Id  // WHERE 条件的 id
    ];
    try{
      await db.query(sql, values).then(re=>{
        ctx.body={code:1,msg:'修改成功'};
      })
    }catch(err){
      console.log(err);
      ctx.body={code:0,msg:'修改失败！'+err};
    }

  }else if(get==3){//添加数据
    const sql = `INSERT INTO cases (user, names, num, stage, judge, judge_call, 
    clerk, clerk_call, client, client_call, client_addr, 
    role, evidence_end, up_end, side, side_call,side_addr,
    side_cost,side_atty,side_atty_call,xb_end,make_date,
    court,addr, next_date, start_date, remake,agent) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?,?,CURDATE(),?,?)`;
    const values = [
        data.user, data.names, data.num, data.stage,
        data.judge, data.judge_call, data.clerk, data.clerk_call,
        data.client, data.client_call, data.client_addr, data.role,
        data.evidence_end||null, data.up_end||null, data.side, data.side_call,data.side_addr,
        data.side_cost,data.side_atty, data.side_atty_call,data.xb_end||null,data.make_date||null,
        data.court, data.addr, data.next_date||null, data.remake,data.agent
    ];
    try{
      await db.query(sql, values).then(re=>{
          ctx.body={code:1,msg:'添加成功！'};
        })
    }catch(err){
      ctx.body={code:0,msg:'添加失败！'+err};
      console.log(err);
    }

  }else if(get==4){//删除数据
    let sql=`delete from cases where Id=${ctx.query.id}`;
    try{
    await db.query(sql).then(re=>{
      ctx.body={code:1,msg:'删除成功！'};
    })
    }catch(err){
      ctx.body={code:0,msg:'删除失败！'+err};
    }
  }else if(get==5){//查询所有律师
    let sql="select * from user";
    await db.query(sql).then(res=>{
      ctx.body={code:1,data:res};
    })
  }else{
    await ctx.render('base/case', {
      title,
    })
  }
  
}

module.exports={
  get
}