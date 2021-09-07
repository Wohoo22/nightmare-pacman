module.exports = (container) => {
  const logger = container.resolve('logger')
  const { httpCode } = container.resolve('config')
  const beHelper = container.resolve('helper')

  const getUser = async (req, res) => {
    try {
      const params = { ...req.query, isAdmin: req.headers['is-admin'] ?? false }
      // console.log('params: ', params)
      const apiResponse = await beHelper.getNextCamUser(params)
      res.status(httpCode.SUCCESS).send({ ok: true, data: JSON.parse(apiResponse).data })
    } catch (e) {
      logger.e('cameraController error: ', e.message)
      res.status(httpCode.UNKNOWN_ERROR).json({ ok: false, msg: e.message })
    }
  }

  return {
    getUser
  }
}
