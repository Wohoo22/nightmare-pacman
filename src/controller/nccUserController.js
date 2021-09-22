module.exports = (container) => {
  const logger = container.resolve('logger')
  const { httpCode } = container.resolve('config')
  const beHelper = container.resolve('helper')

  const getUser = async (req, res) => {
    try {
      const params = { ...req.query }
      // apiResult = { ok: true, total: ..., data: ... }
      const apiResult = await beHelper.getUsersOfNCCMerchant(params)
      res.status(httpCode.SUCCESS).json(apiResult)
    } catch (e) {
      logger.e('nccUserController error: ', e.message)
      res.status(httpCode.UNKNOWN_ERROR).json({ ok: false, msg: e.message })
    }
  }

  return {
    getUser
  }
}