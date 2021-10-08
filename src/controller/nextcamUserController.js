module.exports = (container) => {
  const logger = container.resolve('logger')
  const { httpCode, CachePrefixes } = container.resolve('config')
  const beHelper = container.resolve('helper')
  const cacheController = container.resolve('cache')

  const getUserPaging = async (req, res) => {
    try {
      const params = { ...req.query, isAdmin: req.headers['is-admin'] || false }
      // console.log('params: ', params)
      const usersPromise = beHelper.getNextcamUser(params)
      const totalPromise = beHelper.countNextcamUser(params)
      Promise.all([usersPromise, totalPromise])
        .then(apiRepsonses => {
          const users = JSON.parse(apiRepsonses[0]).data
          const total = JSON.parse(apiRepsonses[1]).data.total
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
      const cacheKey = CachePrefixes.ncUser + '-' + id
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
      const result = await beHelper.getNextcamCameraByUserId(isAdmin, id)
      res.status(httpCode.SUCCESS).json({ ok: true, data: JSON.parse(result).data })
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
      const result = await beHelper.getNextcamFaceByUserId(isAdmin, id)
      res.status(httpCode.SUCCESS).json({ ok: true, data: JSON.parse(result).data })
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
