const db=require('../../db/index');
const jwt=require('jsonwebtoken');
module.exports= async (ctx,res, next) => {
  var obj={user:ctx.query.user,pwd:ctx.query.pwd};
  var out=ctx.query.out;
  if(obj.user){
    try{
    await db.query(`select * from user where (phone="${obj.user}" or names="${obj.user}") and pwd="${obj.pwd}"`).then(res=>{
      if(res.length>0){
        let token=jwt.sign(obj,'bx',{expiresIn:"30d"})
        ctx.cookies.set('token',token,{maxAge:30*1000*60*60*24});
        ctx.body={code:1,msg:'登陆成功',user:res[0]};
      }else{
        ctx.body={code:0,msg:'用户名或密码错误'};
      }
    });
    }catch(err){
      ctx.body={code:0,msg:err};
    }
  }else if(out){
    ctx.cookies.set('token',null,{signed:false,maxAge:0})
    ctx.redirect('/login')//重定向
  }
  else{
    await ctx.render('public/login', {
      title:'用户登陆',
      time:db.format('yyyy-MM-dd hh:mm')
    })
  }
}