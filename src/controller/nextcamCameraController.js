module.exports = (container) => {
  const logger = container.resolve('logger')
  const { httpCode } = container.resolve('config')
  const beHelper = container.resolve('helper')

  const getCameraPaging = async (req, res) => {
    try {
      const params = { ...req.query, isAdmin: req.headers['is-admin'] || false }
      // console.log('params: ', params)
      const camerasPromise = beHelper.getNextcamCamera(params)
      const totalPromise = beHelper.countNextcamCamera(params)
      Promise.all([camerasPromise, totalPromise])
        .then(apiRepsonses => {
          const cameras = JSON.parse(apiRepsonses[0]).data
          const total = JSON.parse(apiRepsonses[1]).data.total
          res.status(httpCode.SUCCESS).send({ ok: true, data: { resourceDetails: cameras, total } })
        })
    } catch (e) {
      logger.e('nextcamCameraController error: ', e.message)
      res.status(httpCode.UNKNOWN_ERROR).json({ ok: false, msg: e.message })
    }
  }

  const getCameraById = async (req, res) => {
    try {
      const isAdmin = req.headers['is-admin'] || false
      const { id } = req.params
      const result = await beHelper.getNextcamCameraById(isAdmin, id)
      res.status(httpCode.SUCCESS).json({ ok: true, data: JSON.parse(result).data })
    } catch (e) {
      logger.e('nextcamCameraController error: ', e.message)
      res.status(httpCode.UNKNOWN_ERROR).json({ ok: false, msg: e.message })
    }
  }

  const getDeviceStatus = async (req, res) => {
    try {
      const result = await beHelper.getDeviceStatus()
      res.status(httpCode.SUCCESS).json({ ok: true, data: result.data })
    } catch (e) {
      logger.e('nextcamCameraController error: ', e.message)
      res.status(httpCode.UNKNOWN_ERROR).json({ ok: false, msg: e.message })
    }
  }

  const getDeviceStates = async (req, res) => {
    try {
      const { id } = req.params
      const { username } = req.query
      const isAdmin = req.headers['is-admin'] || false
      const result = await beHelper.getDeviceStates(id, username, isAdmin)
      res.status(httpCode.SUCCESS).json({ ok: true, data: result.data })
    } catch (e) {
      logger.e('nextcamCameraController error: ', e.message)
      res.status(httpCode.UNKNOWN_ERROR).json({ ok: false, msg: e.message })
    }
  }

  return {
    getCameraPaging,
    getCameraById,
    getDeviceStatus,
    getDeviceStates,
  }
}
