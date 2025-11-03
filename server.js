
const Koa=require('koa')
const app=new Koa();
const https = require('https');
var fs = require("fs");
const cors = require('koa2-cors');//跨域
// var bodyParser = require('koa-bodyparser');//获取post参数
const { koaBody } = require('koa-body');
const koalog=require('./log/koa-log');
const router = require('./router/index');
const views=require('koa-views')//views
const stac=require('koa-static')//static
const art=require('koa-art-template')//模板引擎
const err500=require('koa-onerror')//服务器报错插件
const cmd=require('child_process')//运行命令行插件
const jwt=require('jsonwebtoken');


// app.use(koalog);//日志

app.use(cors());
app.use(koaBody({formLimit:'50mb',jsonLimit:'50mb',multipart: true,formidable:{uploadDir:'public/upload/',keepExtensions: true}}));

art(app,{root:__dirname+'/views',extname:'.art'})//模板引擎
app.use(stac(__dirname,'/public'));//静态文件
cmd.exec('npm run sass');//执行命令行解析sass

err500(app, {template: '/views/500'})// 500 error

function isToken(token) {try {jwt.verify(token,'bx');return true; } catch (err) {return false;}}//检测token

app.use(async (req,next)=>{//检测登陆状态
  let cookie=req.cookies.get('token');
  
  let token=req.request.headers['syt-token'];
  let sqls=['select','insert','update','delete'];
  let is=true;
  sqls.find(sql=>{
    if(req.request.url.indexOf(sql)>=0){is=false; return;}
  })
  const path_s = ['/login', '/zlsj_det', '/5', '/api/notify_url'];
  if(!path_s.some(path => req.request.url.includes(path))){
      if(!isToken(cookie)){
        if(req.request.url.indexOf('/login')<0)
        req.redirect('/login')//重定向
      }
  }
  if(is==true){await next();}
})
router(app);//路由


app.listen(83)
//https服务
// const opt = {
//   key: fs.readFileSync('182.148.55.99.key'),  // 私钥文件路径
//   cert: fs.readFileSync('182.148.55.99.pem'),     // 证书文件路径
//   port:93,
// };
// https.createServer(opt, app.callback()).listen(opt.port, () => {});

console.log('http://localhost:83');
