const db=require('../../db/index');
module.exports= async (ctx, next) => {
  const title = '报名统计'
  let name=ctx.query.name;
  let phone=ctx.query.phone;
  let remake=ctx.query.remake;
  let id=ctx.query.id;
 
   //查询
   if(data){
    await db.query("select * from user").then(res=>{
      outtime();
      ctx.body=res;
    });
  }else if(user){//添加|修改
    if(id){
      await db.query("update user set user='"+user+"',password='"+password+"' where id="+id).then(res=>{
        ctx.body={code:1,msg:'修改成功!'};
      }).catch(err=>{
        ctx.body={code:0,msg:'修改失败!'};
      });
    }else{
      await db.query("insert into user (user,password) values ('"+user+"','"+password+"')").then(res=>{
        ctx.body={code:1,msg:'添加成功!'};
      }).catch(err=>{
        ctx.body={code:0,msg:'添加失败!'};
      });
    }
  }else{
    await ctx.render('user/index', {
      title,
    })
  }
  
}

