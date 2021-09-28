module.exports = (app, container) => {
  const { serverSettings } = container.resolve('config')
  const { nccRoleController } = container.resolve('controller')
  const { basePath } = serverSettings
  app.get(`${basePath}/sys-user/role`, nccRoleController.getRole)
}
