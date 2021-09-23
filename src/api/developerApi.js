module.exports = (app, container) => {
  const { serverSettings } = container.resolve('config')
  const { developerController } = container.resolve('controller')
  const { basePath } = serverSettings
  app.get(`${basePath}/developer`, developerController.getDeveloper)
  app.get(`${basePath}/developer/:id`, developerController.getDeveloperById)
  app.put(`${basePath}/developer/:id/set-status`, developerController.setStatusDeveloper)
  }