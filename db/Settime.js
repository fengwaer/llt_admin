const cron = require('node-cron');
const db=require('./index');
const fs = require("fs");
var today,todayStr;
const filePath = `./public/msg.txt`;

const task = async () => {
    today= new Date()
    todayStr=db.format('yyyy-MM-dd hh:mm', today)
    
    const sql = `INSERT INTO wait (names, date) VALUES (?, ?)`;
    const values = ['每天学习一个案例。一定要记住哟。不记住就打屁股~',todayStr];
    try{
        await db.query(sql, values).then(re=>{ 
            let newContent = `${todayStr}添加成功\n`;
            fs.appendFile(filePath, newContent,(err) => {});
        })
    }catch(err){
        let newContent = `${todayStr}添加失败${err}\n`;
        fs.appendFile(filePath, newContent,(err) => {});
    }
};
//测试用
const test= async()=>{
    const sql = `INSERT INTO wait (names, date) VALUES (?, ?)`;
    const values = ['每天学习一个案例。一定要记住哟。不记住就打屁股~',todayStr];
    try{
        await db.query(sql, values).then(re=>{ 
            let newContent = `${todayStr}添加成功\n`;
            fs.appendFile(filePath, newContent,(err) => {});
        })
    }catch(err){
        let newContent = `${todayStr}添加失败${err}\n`;
        fs.appendFile(filePath, newContent,(err) => {});
    }
};
const schedule = () => {
    cron.schedule('11 9 * * *', task, {
        timezone: 'Asia/Shanghai' // 中国时区
    });
   
    let msg=`定时任务已设置，每天定点执行\n`;
    fs.appendFile(filePath, msg,(err) => {});
};
// setTimeout(() => {
//     task();
// }, 2000); 
module.exports = {
    schedule,test
};
