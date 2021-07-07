module.exports = (app, container) => {
  const { serverSettings } = container.resolve('config')
  const { dashboardController } = container.resolve('controller')
  const { basePath } = serverSettings
  app.get(`${basePath}/dashboard`, dashboardController.getDashboard)
}
