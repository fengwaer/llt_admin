const { log } = require('console');
const db=require('../../db/index');
const XLSX=require('xlsx');
var fs = require("fs");
const now_date=new Date()

const get= async (ctx, next) => {
  const title = '时间线'
  const get=ctx.query.get;
  const data=ctx.query;
  if (get == 1) {
    let sql = `
        select * from cases where Id='${data.case_id}';
        SELECT * FROM timeline WHERE case_id='${data.case_id}' and
        event LIKE '%${data.sch}%' 
        ORDER BY date ASC `
    await db.query(sql).then(results => {
        const res = results;
        res[1].map(i => {
            i.date = db.format('yyyy-MM-dd', i.date);
        });
        ctx.body = { code: 1, data: res };
    });
}
  else if(get==2){//更新数据
    const sql = `UPDATE timeline SET event = ?, notes = ? WHERE Id = ?`;
    
    const values = [
        data.event, data.notes,data.Id  // WHERE 条件的 id
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
    const sql = `INSERT INTO timeline (date, event, notes,case_id) VALUES (?, ?, ?, ?)`;
    const values = [data.date, data.event, data.notes, data.case_id];
    try{
      await db.query(sql, values).then(re=>{
          ctx.body={code:1,msg:'添加成功！'};
        })
    }catch(err){
      ctx.body={code:0,msg:'添加失败！'+err};
      console.log(err);
    }

  }else if(get==0){//删除数据
    let sql=`delete from timeline where Id=${data.id}`;
    try{
    await db.query(sql).then(re=>{
      ctx.body={code:1,msg:'删除成功！'};
    })
    }catch(err){
      ctx.body={code:0,msg:'删除失败！'+err};
    }
  }else{
    await ctx.render('base/timeline', {
      title,
    })
  }
  
}

const post=async (ctx,next)=>{
  let dts='',sql='insert into md_list values ';
  // let dd=Object.values(ctx.request.body.data)
  // console.log(ctx.request.body.data) 
  const file= ctx.request.files.file;
  const workbook = XLSX.readFile(file.filepath,{cellDates:true,UTC:false});
  const sheetNames = workbook.SheetNames[0];
  const sheet=workbook.Sheets[sheetNames]; 
  const dd =XLSX.utils.sheet_to_json(sheet,{cellNF:'yyyy-mm-dd'});
  dd.find((re,idx)=>{
    dts+='(DEFAULT,"'
             +re['档案号']+'","'
             +re['企业名称']+'","'
             +db.format('yyyy-MM-dd',now_date)+'",'
             +1+',"'
             +ctx.request.body.of_user+'")'
             if(idx<dd.length-1){dts+=','}
  })
  dts = dts.replace(/undefined/g, '');
  dts = dts.replace(/\./g, '-');
  dts = dts.replace(/\s+\n/g, '');
  await db.query(sql+dts).then(res=>{
    ctx.body=res
  })  
}

module.exports={
  get,post
}