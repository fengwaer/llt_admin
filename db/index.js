var mysql = require('mysql');
const fs = require('fs')
const fspr = require('fs').promises;
const path = require('path');
const sharp = require('sharp')
let config = {
    host     : '192.168.2.21',
    user     : 'root',
    password : 'root',
    database : 'llt_admin',
    port:33060,
    debugger:true,
    multipleStatements: true//允许多条sql同时执行..
};
var pool;
try{pool = mysql.createPool(config);}
catch{}

let query = (sql, values) => {
    // console.log(mysql.format(sql, values))
    return new Promise((resolve, reject) => {
        pool.getConnection((err,connection) => {
            if (err) {
                reject(err)
            } else {
                connection.query(sql, values, (err, rows) => {
                    if (err) {
                        reject(err)
                    } else {
                        resolve(rows)
                    }
                    connection.release()
                })
            }
        })
    })
};
//删除文件
const del = async function(path) {
    try {await fspr.unlink(path); return 1; }
    catch (err) {return err; }
};
//获取与格式时间
const format = function(fmt,times) {
    var time = new Date(times);
    if (isNaN(time.getTime())) {time = new Date();}
    var o = {
      "M+": time.getMonth() + 1, // 月份
      "d+": time.getDate(), // 日
      "h+": time.getHours(), // 小时
      "m+": time.getMinutes(), // 分
      "s+": time.getSeconds(), // 秒
      "q+": Math.floor((time.getMonth() + 3) / 3), // 季度
      "S": time.getMilliseconds() // 毫秒
    };
    if (/(y+)/.test(fmt))
      fmt = fmt.replace(RegExp.$1, (time.getFullYear() + "").slice(4 - RegExp.$1.length));
    for (var k in o)
      if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
}
// 上传文件
const upload = async (ctx, next) => {
    const up_path = `/public/upload/`;
    let dy = ctx.request.body;
    const file = ctx.request.files.file;
    const dir = path.resolve(__dirname, `../${up_path}${dy.path}/`);
    
    const webPath = dy.path.replace(/\\/g, '/');
    if (!fs.existsSync(dir)) {fs.mkdirSync(dir, { recursive: true });}

    if(ctx.request.files.file.length){
      let re_path=[];
      for(let i of file){
        await sharp(i.filepath).resize({width: 1080,withoutEnlargement: true }).jpeg({ quality: 80 }).toFile(`${dir}/${i.newFilename}`);
        await fs.promises.unlink(i.filepath);//删除
        re_path.push(`/upload/${webPath}/${i.newFilename}`.replace(/\/+/g, '/'))
        sharp.cache(false);
        ctx.body = {code: 1,arr:1,path:re_path };
      }
    }else{
      await sharp(file.filepath).resize({width: 1080,withoutEnlargement: true }).jpeg({ quality: 80 }).toFile(`${dir}/${file.newFilename}`);//处理并复制
      // await fs.promises.copyFile(file.filepath,  );//复制
      await fs.promises.unlink(file.filepath);//删除
      sharp.cache(false);
      ctx.body = {code: 1,path: `${up_path}${webPath}/${file.newFilename}`.replace(/\/+/g, '/')};
    }
  };
module.exports = {
    query,del,format,upload
}