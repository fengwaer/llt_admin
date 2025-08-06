const { log } = require('console');
const db=require('../../db/index');
var fs = require("fs");
const path = require('path');



const get= async (ctx, next) => {
  const title = '资料收集'
  const get=ctx.query.get;
  const data=ctx.query;
  var tb_id;
  if(get==1){
    c_sql=`CREATE TABLE IF NOT EXISTS zlsj_tb (id INT AUTO_INCREMENT PRIMARY KEY,
            name_1 VARCHAR(255),title VARCHAR(255),yj_num INT,sj_num INT,tb_head TEXT,
            create_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);
            select * from zlsj_tb where title like '%${data.sch}%' or name_1 like '%${data.sch}%'`;
  await db.query(c_sql).then(res=>{
      ctx.body=res[1];
  });
  }else if(get==2){
    let sql=`INSERT INTO zlsj_tb (name_1,title,yj_num,tb_head) VALUES ('${data.name_1}','${data.title}','${data.yj_num||0}','${data.tb_head}');`;
    await db.query(sql).then(res=>{
      tb_id=res.insertId;
    ctx.body={msg:'添加成功'};
    });
    dt_list = data.tb_head.split(/\r\n|\r|\n|、/);
    let dt= dt_list.map((i,idx) => `name_${idx} VARCHAR(255)`);
    let tb_sql=`CREATE TABLE IF NOT EXISTS zlsj_${tb_id}(id INT AUTO_INCREMENT PRIMARY KEY,${dt});`
    await db.query(tb_sql).then(res=>{});

  }else if(get==3){//删除数据
    let sql=`delete from zlsj_tb where id=${data.id};drop table zlsj_${data.id};`;
    await db.query(sql).then(res=>{
      ctx.body={code:1};
    })
  }else if(get==4){//到出数据
    let sql=`select * from zlsj_${data.id};select tb_head from zlsj_tb where id=${data.id};`;
    try{
      await db.query(sql).then(res=>{
        ctx.body={code:1,data:res};
      });
    }catch(e){
      ctx.body={code:0,msg:'数据错误。请联系信息部老师哦~'};
    }
  }else{
    await ctx.render('base/zlsj', {
      title,
    })
  }
  
}
//资料列表
const det_get=async (ctx, next) => {
  const path = ctx.path;
  const get=ctx.query.get;
  const data=ctx.query
  if(get==1){
    try{
      let sql=`select * from zlsj_tb where id=${data.id};SHOW COLUMNS FROM zlsj_${data.id};select * from zlsj_${data.id};update zlsj_tb set sj_num=(select count(*) from zlsj_${data.id}) where id=${data.id};`;
      await db.query(sql).then(res=>{
        ctx.body=res;
      });
    }catch(e){
      ctx.body={msg:'数据错误。请联系信息部老师哦~'};
    }
    //新增数据
  }else if(get==2){
    const entries = Object.entries(data).filter(([key]) => key !== 'get' && key !== 'id')
    
    const key = entries.map(([key]) => key).join(',');
    const val = entries.map(([, value]) => `'${value}'`).join(',');
    let sql=`INSERT INTO zlsj_${data.id}(${key}) VALUES (${val});`;
    await db.query(sql).then(res=>{
      ctx.body=res;
    });
  }else{
    let id=data.id;
    await ctx.render('base/zlsj_det', {path,id})
}
}
const post=(ctx, next) => {
 
}

module.exports={
  get,det_get,post
}