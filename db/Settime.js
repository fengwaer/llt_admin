const cron = require('node-cron');
const db=require('./index');
var fs = require("fs");

const task = async () => {
    console.log('定时任务执行中，当前时间：', new Date().toLocaleString());
    const sql = `INSERT INTO wait (names, date) VALUES (?, ?)`;
        const values = ['每天学习一个案例', '一定要记住哟。不记住就打屁股~'];
        try{
            await db.query(sql, values).then(re=>{
                ctx.body={code:1,msg:'添加成功！'};
            })
        }catch(err){
            ctx.body={code:0,msg:'添加失败！'+err};
            console.log(err);
        }
};
//测试用
const test= async()=>{
    const sql = `INSERT INTO wait (names, date) VALUES (?, ?)`;
        const values = ['每天学习一个案例', '一定要记住哟。不记住就打屁股~'];
        try{
            await db.query(sql, values).then(re=>{
                ctx.body={code:1,msg:'添加成功！'};
            })
        }catch(err){
            ctx.body={code:0,msg:'添加失败！'+err};
            console.log(err);
        }
console.log('开始执行')
};
const schedule = () => {
    cron.schedule('0 2 * * *', task, {
        timezone: 'Asia/Shanghai' // 中国时区
    });
   
    console.log('定时任务已设置，每天上午 10 点执行');
};
// setTimeout(() => {
//     task();
// }, 2000); 
module.exports = {
    schedule,test
};
