module.exports = (app, container) => {
  const { serverSettings } = container.resolve('config')
  const { merchantController } = container.resolve('controller')
  const { basePath } = serverSettings
  app.get(`${basePath}/merchant`, merchantController.getMerchant)
  app.get(`${basePath}/merchant/merchantInfo`, merchantController.getMerchantInfo)
  app.get(`${basePath}/merchant/:id`, merchantController.getMerchantById)
  app.put(`${basePath}/merchant/:id`, merchantController.updateMerchant)
  app.delete(`${basePath}/merchant/:id`, merchantController.deleteMerchant)
  app.post(`${basePath}/merchant`, merchantController.addMerchant)
  app.post(`${basePath}/merchant/delete-applications`, merchantController.deleteMerchantApplications)
  app.post(`${basePath}/merchant/add-applications`, merchantController.addMerchantApplications)
  app.post(`${basePath}/merchant/count-merchant-using-app`, merchantController.countMerchantUsingApp)
}
