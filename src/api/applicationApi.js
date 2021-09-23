module.exports = (app, container) => {
  const { serverSettings } = container.resolve('config')
  const { applicationController } = container.resolve('controller')
  const { basePath } = serverSettings
  app.get(`${basePath}/developer/sub/application`, applicationController.getApps)
  app.get(`${basePath}/developer/sub/application/:id`, applicationController.getAppById)
  app.put(`${basePath}/developer/sub/application/:id/set-status`, applicationController.setStatusApp)
  }