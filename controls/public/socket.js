
sockets=function(pts){
  const soket = require('ws');//websocket
    const ws = new soket.Server({port: pts});
    let userlist=[]
    ws.on('connection', ws => {
    //打开
    userlist.push(ws);
    ws.on('message', msg => {
        let time=new Date().Format('hh:mm');
        let data=JSON.parse(msg);
        data['time']=time;
        for(let i=0;i<userlist.length;i++){
        userlist[i].send(JSON.stringify(data));
        }
    });
    });
    ws.on('close',err=>{})
};

//时间格式化
Date.prototype.Format = function(fmt){
  var o = {   
    "M+" : this.getMonth()+1, 
    "d+" : this.getDate(),
    "h+" : this.getHours(),
    "m+" : this.getMinutes(),
    "s+" : this.getSeconds(),
    "q+" : Math.floor((this.getMonth()+3)/3),
    "S"  : this.getMilliseconds()
  };   
  if(/(y+)/.test(fmt))   
    fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));   
  for(var k in o)   
    if(new RegExp("("+ k +")").test(fmt))   
  fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));   
  return fmt;   
}

module.exports=sockets;