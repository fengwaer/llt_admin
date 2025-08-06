const { log } = require('console');
const db=require('../../db/index');
var fs = require("fs");
const path = require('path');
const pdf = require('pdf-poppler');
const archiver = require('archiver');
const convert = require('images-to-pdf');



const get= async (ctx, next) => {
  var img_list =await get_img();
  const title = '图片处理'
  const get=ctx.query.get;
  const data=ctx.query;
  const year =ctx.query.year;
  if(get==1){
    try {
      fs.unlinkSync(data.file);
      ctx.body={msg:'删除成功！'}
    }catch{
      ctx.body={msg:'删除失败！'}
    }
    

  }else{
    await ctx.render('base/pic', {title,img_list})
  }
  
}

// 筛选出图片文件
async function get_img(){
  const folderPath = 'public/upload/'; // 替换为图片文件夹路径
  // 获取文件夹中的所有文件
  const files = fs.readdirSync(folderPath);
  const imageExtensions = ['.jpg', '.jpeg', '.png'];
  let images = files.filter(file => {
      const ext = path.extname(file).toLowerCase();
      return imageExtensions.includes(ext);
  }).map(file => path.join(folderPath, file));
  return images;
}
//pdf转图片
const post = async (ctx, next) => {
  try {
    const file = ctx.request.files.file.filepath;
    const imagesDir = path.join('./public/temp-images/');
    const zipPath = path.join('./public/down', 'images.zip');

    // 确保临时图片目录存在
    if (!fs.existsSync(imagesDir)) {
      fs.mkdirSync(imagesDir);
    }

    // 转换PDF为图片
    let opts = {
      format: 'jpeg',
      out_dir: imagesDir,
      out_prefix: 'img_',
      page: null,
    };

    await pdf.convert(file, opts); // 使用 await 等待转换完成

      if(fs.existsSync(zipPath)){fs.unlinkSync(zipPath);} // 如果存在就删除旧的zip文件

    // 创建一个zip文件供下载
    const output = fs.createWriteStream(zipPath);
    const archive = archiver('zip', { zlib: { level: 9 } });

    archive.pipe(output);
    archive.directory(imagesDir, false);
    await archive.finalize(); // 等待 archive 完成

    await new Promise((resolve, reject) => {
      output.on('close', () => {
        resolve();
      });
      output.on('error', (err) => {
        reject(err);
      })
    });

    // 删除临时图片目录
    fs.rmSync(imagesDir, { recursive: true });
    fs.unlinkSync(file)

    ctx.body = { msg: '转换成功！', file: zipPath };
  } catch (error) {
    console.error(error);
    ctx.body = { msg: '转换失败' + error };
  }
};

//图片转pdf
const topdf=(ctx,next)=>{
  let img_path=ctx.request.body?.img_path;
  if(!img_path){ctx.body={msg:'请上传图片'}; return;}

  async function convertImagesToPDF(folderPath, outputFilePath) {
    try {
        // 将图片合并为PDF
        await convert(img_path, outputFilePath);
        ctx.body={msg:'PDF文件已生成',file:outputFilePath};
        //删除上传的图片
        img_path.forEach(i=>{fs.unlinkSync(i);})
    } catch (error) {
        ctx.body={msg:'生成PDF时出错：'+error};
    }
}

const outputFilePath = 'public/down/img_pdf.pdf'; // 输出的PDF文件路径
convertImagesToPDF(img_path, outputFilePath);
}

module.exports={
  get,post,topdf
}