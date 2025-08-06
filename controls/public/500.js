module.exports= async (ctx, next) => {
  const title = '服务器出错啦~'

  await ctx.render('public/500', {
    title
  })
}