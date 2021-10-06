module.exports = (app, container) => {
  const { serverSettings } = container.resolve('config')
  const { nextcamUserController } = container.resolve('controller')
  const { basePath } = serverSettings

  app.get(`${basePath}/nextcam-user`, nextcamUserController.getUserPaging)
  app.get(`${basePath}/nextcam-user/:id`, nextcamUserController.getUserById)
  app.get(`${basePath}/nextcam-user/:id/camera`, nextcamUserController.getCameraByUserId)
  app.get(`${basePath}/nextcam-user/:id/face`, nextcamUserController.getFaceByUserId)
  app.post(`${basePath}/nextcam-user/:id/change-pwd`, nextcamUserController.changePassword)
}
