module.exports = (container) => {
  const logger = container.resolve('logger')
  const { httpCode, CachePrefixes, CacheConverter } = container.resolve('config')
  const beHelper = container.resolve('helper')
  const cacheController = container.resolve('cache')

  const getUserPaging = async (req, res) => {
    try {
      const params = { ...req.query, isAdmin: req.headers['is-admin'] || false }
      // console.log('params: ', params)
      const getUsersExecution = () => beHelper.getNextcamUser(params)
      const countUsersExecution = () => beHelper.countNextcamUser(params)

      const _suffix = CacheConverter.paramsToCacheSuffix(params)
      const getUsersCacheKey = CachePrefixes.ncAllUser + '-' + _suffix
      const countUsersCacheKey = CachePrefixes.ncCountUser + '-' + _suffix
      // console.log('cache keys: ', getUsersCacheKey, ' & ', countUsersCacheKey);

      Promise.all([
        cacheController.get(getUsersCacheKey, getUsersExecution),
        cacheController.get(countUsersCacheKey, countUsersExecution)
      ])
        .then(apiRepsonses => {
          const users = apiRepsonses[0].data
          const total = apiRepsonses[1].data.total
          res.status(httpCode.SUCCESS).send({ ok: true, data: { resourceDetails: users, total } })
        })
    } catch (e) {
      logger.e('nextcamUserController error: ', e.message)
      res.status(httpCode.UNKNOWN_ERROR).json({ ok: false, msg: e.message })
    }
  }

  const getUserById = async (req, res) => {
    try {
      const isAdmin = req.headers['is-admin'] || false
      const { id } = req.params
      const _suffix =  CacheConverter.paramsToCacheSuffix({ isAdmin, id })
      const cacheKey = CachePrefixes.ncUser + '-' + _suffix
      const execution = () => beHelper.getNextcamUserById(isAdmin, id)
      const result = await cacheController.get(cacheKey, execution)
      res.status(httpCode.SUCCESS).json({ ok: true, data: result.data })
    } catch (e) {
      logger.e('nextcamUserController error: ', e.message)
      res.status(httpCode.UNKNOWN_ERROR).json({ ok: false, msg: e.message })
    }
  }

  const getCameraByUserId = async (req, res) => {
    try {
      const isAdmin = req.headers['is-admin'] || false
      const { id } = req.params
      const _suffix =  CacheConverter.paramsToCacheSuffix({ isAdmin, id })
      const cacheKey = CachePrefixes.ncUserCam + '-' + _suffix
      const execution = () => beHelper.getNextcamCameraByUserId(isAdmin, id)
      const result = await cacheController.get(cacheKey, execution)
      res.status(httpCode.SUCCESS).json({ ok: true, data: result.data })
    } catch (e) {
      logger.e('nextcamUserController error: ', e.message)
      res.status(httpCode.UNKNOWN_ERROR).json({ ok: false, msg: e.message })  
    }
  }

  // @author: manhthd, 2021 Sep 25
  const getFaceByUserId = async (req, res) => {
    try {
      const isAdmin = req.headers['is-admin'] || false
      const { id } = req.params
      const _suffix =  CacheConverter.paramsToCacheSuffix({ isAdmin, id })
      const cacheKey = CachePrefixes.ncUserFace + '-' + _suffix
      const execution = () => beHelper.getNextcamFaceByUserId(isAdmin, id)
      const result = await cacheController.get(cacheKey, execution)
      res.status(httpCode.SUCCESS).json({ ok: true, data: result.data })
    } catch (e) {
      logger.e('nextcamUserController error: ', e.message)
      res.status(httpCode.UNKNOWN_ERROR).json({ ok: false, msg: e.message })  
    }
  }

  // @author: manhthd, 2021 Oct 6
  const changePassword = async (req, res) => {
    try {
      const isAdmin = req.headers['is-admin'] || false
      const { id } = req.params
      const result = await beHelper.changePassword(isAdmin, id, req.body)
      res.status(httpCode.SUCCESS).json({ ok: true, data: result.data })
    } catch (e) {
      logger.e('nextcamUserController error: ', e.message)
      res.status(httpCode.UNKNOWN_ERROR).json({ ok: false, msg: e.message })
    }
  }

  return {
    getUserPaging,
    getUserById,
    getCameraByUserId,
    getFaceByUserId,
    changePassword,
  }
}
