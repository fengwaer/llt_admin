module.exports= async (ctx, next) => {
  const title = '地址出错啦~'

  await ctx.render('public/404', {
    title
  })
}