module.exports = (app, container) => {
  const { verifyAccessToken } = container.resolve('middleware')
  require('./dashboardApi')(app, container)
  require('./openApi')(app, container)
  // app.use(verifyAccessToken)
  require('./merchantApi')(app, container)
  require('./phanQuyenApi')(app, container)
  require('./customerUserApi')(app, container)
  require('./phanQuyenApi')(app, container)
  require('./nextcamCameraApi')(app, container)
  require('./nextcamUserApi')(app, container)
}
