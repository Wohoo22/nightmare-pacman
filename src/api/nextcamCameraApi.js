module.exports = (app, container) => {
  const { serverSettings } = container.resolve('config')
  const { nextcamCameraController } = container.resolve('controller')
  const { basePath } = serverSettings

  app.get(`${basePath}/nextcam-camera`, nextcamCameraController.getCameraPaging)
  app.get(`${basePath}/nextcam-camera/device-status`, nextcamCameraController.getDeviceStatus)
  app.get(`${basePath}/nextcam-camera/:id`, nextcamCameraController.getCameraById)
  app.get(`${basePath}/nextcam-camera/:id/state`, nextcamCameraController.getDeviceStates)
}
