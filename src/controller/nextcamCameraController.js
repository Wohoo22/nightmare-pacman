module.exports = (container) => {
  const logger = container.resolve('logger')
  const { httpCode, CachePrefixes, CacheConverter } = container.resolve('config')
  const beHelper = container.resolve('helper')
  const cacheController = container.resolve('cache')

  const getCameraPaging = async (req, res) => {
    try {
      const params = { ...req.query, isAdmin: req.headers['is-admin'] || false }
      // console.log('params: ', params)
      const getCamsExecution = () => beHelper.getNextcamCamera(params)
      const countCamsExecution = () => beHelper.countNextcamCamera(params)

      const _suffix = CacheConverter.paramsToCacheSuffix(params)
      const getCamsCacheKey = CachePrefixes.ncAllCam + '-' + _suffix
      const countCamsCacheKey = CachePrefixes.ncCountCam + '-' + _suffix

      Promise.all([
        cacheController.get(getCamsCacheKey, getCamsExecution),
        cacheController.get(countCamsCacheKey, countCamsExecution)
      ])
        .then(apiRepsonses => {
          const cameras = apiRepsonses[0].data
          const total = apiRepsonses[1].data.total
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
      const _suffix =  CacheConverter.paramsToCacheSuffix({ isAdmin, id })
      const cacheKey = CachePrefixes.ncCam + '-' + _suffix
      const execution = () => beHelper.getNextcamCameraById(isAdmin, id)
      const result = await cacheController.get(cacheKey, execution)
      res.status(httpCode.SUCCESS).json({ ok: true, data: result.data })
    } catch (e) {
      logger.e('nextcamCameraController error: ', e.message)
      res.status(httpCode.UNKNOWN_ERROR).json({ ok: false, msg: e.message })
    }
  }

  const getDeviceStatus = async (req, res) => {
    try {
      const cacheKey = CachePrefixes.ncCamStatus
      const execution = () => beHelper.getDeviceStatus()
      console.log('?');
      const result = await cacheController.get(cacheKey, execution)
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
      const _suffix =  CacheConverter.paramsToCacheSuffix({ isAdmin, id })
      const cacheKey = CachePrefixes.ncCamStates + '-' + _suffix
      const execution = () => beHelper.getDeviceStates(id, username, isAdmin)
      const result = await cacheController.get(cacheKey, execution)
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
