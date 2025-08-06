const db=require('../../db/index');
module.exports= async (ctx, next) => {
  const title = '用户管理'
  let data=ctx.query;
   //查询
   if(data.get==1){
    await db.query("select * from user").then(res=>{
      ctx.body=res;
    });
  }else if(data.get==2){//添加|修改
    
      await db.query(`update user set names="${data.names}",phone="${data.phone}",pwd="${data.pwd}" where Id="${data.Id}"`).then(res=>{
        ctx.body={code:1,msg:'修改成功!'};
      }).catch(err=>{
        ctx.body={code:0,msg:'修改失败!'};
      });
    }else if(data.get==3){
      await db.query(`insert into user (names,phone,pwd) values ('${data.names}','${data.phone}','${data.pwd}')`).then(res=>{
        ctx.body={code:1,msg:'添加成功!'};
      }).catch(err=>{
        ctx.body={code:0,msg:'添加失败!'};
      });
  }else if(data.get==4){//删除
    await db.query("delete from user where Id="+data.id).then(res=>{
      ctx.body={code:1,msg:'删除成功!'};
    }).catch(err=>{
      ctx.body={code:0,msg:'删除失败!'+err};
    });
  }else{
    await ctx.render('user/index', {
      title,
    })
  }
  
}

