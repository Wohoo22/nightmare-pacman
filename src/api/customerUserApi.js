module.exports = (app, container) => {
  const { serverSettings } = container.resolve('config')
  const { customerUserController } = container.resolve('controller')
  const { basePath } = serverSettings
  app.get(`${basePath}/customerUser`, customerUserController.getCustomerUser)
  app.get(`${basePath}/customerUser/:id`, customerUserController.getCustomerUserById)
  app.put(`${basePath}/customerUser/:id`, customerUserController.updateCustomerUser)
  app.delete(`${basePath}/customerUser/:id`, customerUserController.deleteCustomerUser)
  app.post(`${basePath}/customerUser`, customerUserController.addCustomerUser)
}
