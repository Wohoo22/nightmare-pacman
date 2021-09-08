module.exports = (app, container) => {
  const { serverSettings } = container.resolve('config')
  const { nextcamUserController } = container.resolve('controller')
  const { basePath } = serverSettings

  app.get(`${basePath}/nextcam-user`, nextcamUserController.getUser)
}
