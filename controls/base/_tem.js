const db=require('../../db/index');
var fs = require("fs");
const path = require('path');



const get= async (ctx, next) => {
  const title = '图片处理'
  const get=ctx.query.get;
  const data=ctx.query;
  if(get==1){
    const sql = `UPDATE cases SET user = ?, names = ?, num = ? WHERE Id = ?`;
    const values = [
        data.user, data.names, data.num, data.Id  // WHERE 条件的 id
    ];
        try{
          await db.query(sql, values).then(re=>{
            ctx.body={code:1,msg:'修改成功'};
          })
        }catch(err){
          console.log(err);
          ctx.body={code:0,msg:'修改失败！'+err};
        }

  }else{
    await ctx.render('base/pic', {
      title,
    })
  }
  
}

const post=(ctx, next) => {
 
}

module.exports={
  get,post
}