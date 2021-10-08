module.exports = (app, container) => {
  const { serverSettings } = container.resolve('config')
  const { 
    nextcamUserController
  } = container.resolve('controller')
  const { basePath } = serverSettings

  app.get(`${basePath}/manhthd-test/cache/nc-user/:id`, nextcamUserController.getUserById)
}