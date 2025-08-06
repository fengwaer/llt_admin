const Koart = require('koa-router');
const fs = require("fs");
// const upload=require('../controls/public/upload');
var sktport=[];
//初始化路由
const router = new Koart();
const user = new Koart();

//用户
const c_user=require('../controls/user/index');
user.prefix('/user');
user.get('/index',c_user)


//案件管理
const c_case=require('../controls/base/case');
const c_timeline=require('../controls/base/timeline');
const c_case_tj=require('../controls/base/case_tj');
router.get('/case',c_case.get);
router.get('/timeline',c_timeline.get);//时间线

//待办事项 
const c_wait=require('../controls/base/wait');
router.get('/wait',c_wait.get);


//资料收集
const c_zlsj=require('../controls/base/zlsj');
router.get('/zlsj_det',c_zlsj.det_get);
router.get('/zlsj',c_zlsj.get);
router.post('/zlsj',c_zlsj.post);



//图片处理
const c_pic=require('../controls/base/pic');
router.get('/pic',c_pic.get);
router.post('/pic',c_pic.post);
router.post('/pic_pdf',c_pic.topdf);

//公共路由
const ctl_404=require('../controls/public/404');
const ctl_500=require('../controls/public/404');
const ctl_index=require('../controls/public/index');
const ctl_login=require('../controls/public/login');
router.get('/404', ctl_404);//错误页
router.get('/500', ctl_500);//服务器错误
router.get('/', ctl_index);//首页
router.get('/login', ctl_login);//登录
//上传附件
router.post("/upload", async ctx => {
  const files = ctx.request.files;
  if (files.files) {
    // 文件信息
    ctx.body = { msg: '多文件上传成功', file: files.files };
  } else if(files.file) {
    // 文件信息
    ctx.body = { msg: '单文件上传成功', file: files.file};
  }else{
      ctx.body = { msg: '未上传文件' };
  }
});





module.exports= function(app){
  app.use(router.routes()).use(router.allowedMethods());
  app.use(user.routes()).use(user.allowedMethods());
  app.use(ctx=>{
    if(ctx.request.url.indexOf('.jpg')<0&&ctx.request.url.indexOf('.png')<0){ctx.redirect('/404')}
  })
}

