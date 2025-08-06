const db=require('../../db/index');
var fs = require("fs");
const path = require('path');



const get= async (ctx, next) => {
  const title = '图片处理'
  const get=ctx.query.get;
  const data=ctx.query;
  if(get==1){

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