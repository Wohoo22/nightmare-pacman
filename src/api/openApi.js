module.exports = (app, container) => {
  const { serverSettings } = container.resolve('config')
  const { openController, merchantController } = container.resolve('controller')
  const { checkCustomerBeToken } = container.resolve('middleware')
  const { basePath } = serverSettings
  app.post(`${basePath}/open/merchant`, checkCustomerBeToken, openController.addMerchant)
  app.post(`${basePath}/open/verifyWebhook`, checkCustomerBeToken, openController.verifyWebhookMerchant)
  app.get(`${basePath}/open/merchant`, checkCustomerBeToken, openController.getMerchantDetail)
  app.get(`${basePath}/open/merchant/:id`, checkCustomerBeToken, openController.getMerchantDetailById)
}
