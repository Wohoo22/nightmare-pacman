module.exports = (container) => {
  const merchantController = require('./merchantController')(container)
  const customerUserController = require('./customerUserController')(container)
  const phanQuyenController = require('./phanQuyenController')(container)
  const dashboardController = require('./dashboardController')(container)
  const openController = require('./openController')(container)
  const cameraController = require('./cameraController')(container)
  const nextcamUserController = require('./nextcamUserController')(container)
  return {
    dashboardController,
    phanQuyenController,
    merchantController,
    customerUserController,
    openController,
    cameraController,
    nextcamUserController
  }
}
