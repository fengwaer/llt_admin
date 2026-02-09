const cron = require('node-cron');
const db=require('./index');
var fs = require("fs");
const today = new Date();
const todayStr = db.format('yyyy-MM-dd', today);
const filePath = `./public/msg.txt`;

const task = async () => {
    
    const sql = `INSERT INTO wait (names, date) VALUES (?, ?)`;
    const values = ['每天学习一个案例。一定要记住哟。不记住就打屁股~',todayStr];
    try{
        await db.query(sql, values).then(re=>{ 
            let newContent = `${todayStr}写入成功${err}\n`;
            fs.appendFile(filePath, newContent,(err) => {});
        })
    }catch(err){
        let newContent = `${todayStr}写入失败${err}\n`;
        fs.appendFile(filePath, newContent,(err) => {});
    }
};
//测试用
const test= async()=>{
    const sql = `INSERT INTO wait (names, date) VALUES (?, ?)`;
        const values = ['每天学习一个案例。一定要记住哟。不记住就打屁股~',todayStr];
        try{
            await db.query(sql, values).then(re=>{})
        }catch(err){
            console.log('添加失败',err);
        }
    console.log('开始执行')
};
const schedule = () => {
    cron.schedule('0 2 * * *', task, {
        timezone: 'Asia/Shanghai' // 中国时区
    });
   
    console.log('定时任务已设置，每天2点 点执行');
};
// setTimeout(() => {
//     task();
// }, 2000); 
module.exports = {
    schedule,test
};
