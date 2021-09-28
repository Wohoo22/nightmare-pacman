module.exports = (app, container) => {
  const { serverSettings } = container.resolve('config')
  const { nccUserController } = container.resolve('controller')
  const { basePath } = serverSettings
  
  app.get(`${basePath}/sys-user/user`, nccUserController.getUser)
}
