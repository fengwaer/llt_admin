const db=require('../../db/index');
var fs = require("fs");
const pinyin = require("pinyin");
// const pyfl = require('pyfl').default;
;
module.exports= async (ctx, next) => {
  const title = '首页'
  const get=ctx.query.get;
  const data=ctx.query.data;
  const sql='select * from user';
  if(get==1){
    let dt1=''
    data.split(',').find(rs1=>{
      dt1+=(pinyin.pinyin(rs1,{heteronym: true,segment: true,style: "first_letter",passport:true, }).join('').toUpperCase())+'\n';
    })
    ctx.body=dt1;
  }else if(get==2){
   let accound=await db.query(' select * from bank_accound').then(res=>{return res;});
   let project=await db.query(' select * from project').then(res=>{return res;});
   let sub=await db.query(' select * from count_sub').then(res=>{return res;});
   ctx.body={accound:accound,project:project,sub:sub};
  }else{
    await ctx.render('index', {
      title
    })
  }
  
}