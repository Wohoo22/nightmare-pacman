module.exports = (container) => {
  const merchantController = require('./merchantController')(container)
  const customerUserController = require('./customerUserController')(container)
  const phanQuyenController = require('./phanQuyenController')(container)
  const dashboardController = require('./dashboardController')(container)
  const openController = require('./openController')(container)
  const nextcamCameraController = require('./nextcamCameraController')(container)
  const nextcamUserController = require('./nextcamUserController')(container)
  const developerController = require('./developerController')(container)
  const applicationController = require('./applicationController')(container)

  return {
    dashboardController,
    phanQuyenController,
    merchantController,
    customerUserController,
    openController,
    nextcamCameraController,
    nextcamUserController,
    developerController,
    applicationController
  }
}
