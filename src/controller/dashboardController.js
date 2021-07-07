module.exports = (container) => {
  const logger = container.resolve('logger')
  const { httpCode } = container.resolve('config')
  const { merchantRepo } = container.resolve('repo')
  const beHelper = container.resolve('helper')
  const {
    schemaValidator,
    schemas: {
      Merchant,
    }
  } = container.resolve('models')
  const getDashboard = async (req, res) => {
    try {
      const totalMerchant = await merchantRepo.getCount({ activated: 1 })
      const { data: beDashboard } = await beHelper.getDashboard()
      const response = {
        ...beDashboard,
        totalMerchant
      }
      res.status(httpCode.SUCCESS).json(response)
    } catch (e) {
      logger.e(e)
      res.status(httpCode.UNKNOWN_ERROR).json({})
    }
  }
  return { getDashboard }
}
