var mysql = require('mysql');
const fs = require('fs')
let config = {
    host     : '127.0.0.1',
    user     : 'root',
    password : 'root',
    database : 'llt_admin',
    port:33060,
    multipleStatements: true//允许多条sql同时执行
};
let pool = mysql.createPool(config);
let query = (sql, values) => {

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
const del=function(name){
  fs.unlink(name,function(res){
    return res;
  })
}
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
module.exports = {
    query,del,format
}