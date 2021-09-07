module.exports = (app, container) => {
  const { serverSettings } = container.resolve('config')
  const { cameraController } = container.resolve('controller')
  const { basePath } = serverSettings

  app.get(`${basePath}/camera`, cameraController.getCamera)
}
