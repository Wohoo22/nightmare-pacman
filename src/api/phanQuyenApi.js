module.exports = (app, container) => {
  const { serverSettings } = container.resolve('config')
  const { phanQuyenController } = container.resolve('controller')
  const { basePath } = serverSettings
  app.get(`${basePath}/phanQuyen/:model`, phanQuyenController.get)
  app.post(`${basePath}/phanQuyen/:model`, phanQuyenController.add)
  app.get(`${basePath}/phanQuyen/:model/:id`, phanQuyenController.getById)
  app.put(`${basePath}/phanQuyen/:model/:id`, phanQuyenController.update)
  app.delete(`${basePath}/phanQuyen/:model/:id`, phanQuyenController.remove)
}
