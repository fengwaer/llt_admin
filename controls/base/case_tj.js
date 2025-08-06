const { log } = require('console');
const db=require('../../db/index');
var fs = require("fs");



const get= async (ctx, next) => {
  const title = '案件统计'
  const get=ctx.query.get;
  const data=ctx.query;
  const year =ctx.query.year;
  const look_post=ctx.query.post;
  if(get==1){
    let of_user;
    if(look_post==1){ of_user='本草堂'}
    if(look_post==2){ of_user='百信'}
    let years=''//" and YEAR(add_date)="+year;
    let month=data.month>0?" and MONTH(add_date)="+data.month:' ';
    let sql="select region,count(name) as num,";
     sql+="(select count(*) from md_list where statuss=1 and "
     if(look_post==1||look_post==2){sql+='of_user="'+of_user+'" ';}
     sql+=years+month+")";
     sql+="as count from md_list where statuss=1  and "
     if(look_post==1||look_post==2){sql+='of_user="'+of_user+'" ';}
     sql+=years+month;
     sql+=" group by region order by num desc;";
     //换证
     sql+="select region,count(name) as num,";
     sql+="(select count(*) from md_list where statuss=1 and ";
     if(look_post==1||look_post==2){sql+='of_user="'+of_user+'" and ';}
     sql+=" DATEDIFF(xkz_end, CURDATE()) BETWEEN 0 AND 150 "+years+month+")";
     sql+=" as count from md_list where statuss=1 and ";
     if(look_post==1||look_post==2){sql+='of_user="'+of_user+'" ';}
     sql+=years+month;
     sql+=" and DATEDIFF(xkz_end, CURDATE()) BETWEEN 0 AND 150";//近150天(5个月)
     sql+=" group by region order by num desc;";
     //注销、过期、退出
     sql+="select region,count(name) as num,";
     sql+="(select count(*) from md_list where "
     if(look_post==1||look_post==2){sql+='of_user="'+of_user+'" and ';}
     sql+=" (statuss>1 or xkz_end < CURDATE()) )";
     sql+=" as count from md_list where "
     if(look_post==1||look_post==2){sql+='of_user="'+of_user+'" and ';}
     sql+=" (statuss>1 or xkz_end < CURDATE()) ";
     sql+=years+month;
     sql+=" group by region order by num desc;";
     
    await db.query(sql).then(res=>{
      ctx.body=res;
    })
    
  }else if(get==2){//更新数据
    
  }else{
    await ctx.render('index', {
      title,
    })
  }
  
}

module.exports={
  get
}