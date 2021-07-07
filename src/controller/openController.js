const moment = require('moment')
module.exports = (container) => {
  const logger = container.resolve('logger')
  const ObjectId = container.resolve('ObjectId')
  const { merchantRepo } = container.resolve('repo')
  const { httpCode, serverHelper } = container.resolve('config')
  const {
    schemaValidator,
    schemas: {
      Merchant,
    }
  } = container.resolve('models')
  const getMerchantDetail = async (req, res) => {
    try {
      const { mact } = req.query
      const merchant = (await merchantRepo.findOne({ mact: (mact || '').toLowerCase() })).toObject()
      if (merchant && merchant.activated) {
        return res.status(httpCode.SUCCESS).json(merchant)
      }
      res.status(httpCode.BAD_REQUEST).json({ msg: 'Không tìm thấy' })
    } catch (e) {
      logger.e(e)
      res.status(httpCode.UNKNOWN_ERROR).json({})
    }
  }
  const getMerchantDetailById = async (req, res) => {
    try {
      const { id } = req.params
      const merchant = (await merchantRepo.getMerchantById(id)).toObject()
      if (merchant && merchant.activated) {
        return res.status(httpCode.SUCCESS).json(merchant)
      }
      res.status(httpCode.BAD_REQUEST).json({ msg: 'Không tìm thấy' })
    } catch (e) {
      logger.e(e)
      res.status(httpCode.UNKNOWN_ERROR).json({})
    }
  }
  return { getMerchantDetail, getMerchantDetailById }
}
