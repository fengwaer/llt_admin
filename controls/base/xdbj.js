const { log } = require('console');
const db=require('../../db/index');
const XLSX=require('xlsx');
var fs = require("fs");
const now_date=new Date()

const get= async (ctx, next) => {
  const title = '心得笔记'
  const get=ctx.query.get;
  const data=ctx.query;

if(get==1){//获取心得笔记
    let sql=`select DISTINCT type from xdbj;SELECT * FROM xdbj WHERE (type = ? OR ? = '') AND txt LIKE CONCAT('%',?,'%')`;
    let val=[data.type,data.type,data.sch]
    // console.log(sql);
    await db.query(sql,val).then(res => {
        ctx.body = { code: 1, data:res };
    });
}else if(get==2){//添加数据
    const sql = `INSERT INTO xdbj (type, txt) VALUES (?, ?)`;
    const values = [data.type, data.txt];
    try{
      await db.query(sql, values).then(re=>{
          ctx.body={code:1,msg:'添加成功！'};
        })
    }catch(err){
      ctx.body={code:0,msg:'添加失败！'+err};
      console.log(err);
    }

  }else if(get==3){//修改
    const sql = `UPDATE xdbj SET type = ?, txt = ? WHERE id = ?`;
    const values = [
        data.type, data.txt, data.id  // WHERE 条件的 id
    ];
    try{
      await db.query(sql, values).then(re=>{
        ctx.body={code:1,msg:'修改成功'};
      })
    }catch(err){
      ctx.body={code:0,msg:'修改失败！'+err};
    }
  }else if(get==0){//删除数据
    let sql=`delete from xdbj where id=${data.id}`;
    try{
    await db.query(sql).then(re=>{
      ctx.body={code:1,msg:'删除成功！'};
    })
    }catch(err){
      ctx.body={code:0,msg:'删除失败！'+err};
    }
  }else{
    await ctx.render('base/xdbj', {
      title,
    })
  }
  
}

module.exports={
  get
}