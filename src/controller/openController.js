const moment = require('moment')
module.exports = (container) => {
  const logger = container.resolve('logger')
  const ObjectId = container.resolve('ObjectId')
  const { merchantRepo } = container.resolve('repo')
  const helper = container.resolve('helper')
  const { httpCode, serverHelper } = container.resolve('config')
  const {
    schemaValidator,
    schemas: {
      Merchant,
    }
  } = container.resolve('models')

  const addMerchant = async (req, res) => {
    try {
      const data = req.body
      const {
        error,
        value
      } = await schemaValidator(data, 'Merchant')
      if (error) {
        return res.status(httpCode.BAD_REQUEST).send({ msg: error.message })
      }
      // value.createdBy = req.user._id
      const sp = await merchantRepo.addMerchant(value)
      res.status(httpCode.CREATED).send(sp)
    } catch (e) {
      if (e.code === 11000) {
        return res.status(httpCode.BAD_REQUEST).json({ msg: 'Mã công ty đã tồn tại, vui lòng thử tên khác.' })
      }
      logger.e(e)
      res.status(httpCode.UNKNOWN_ERROR).end()
    }
  }
  const getMerchantDetail = async (req, res) => {
    try {
      const { mact } = req.query
      let merchant = await merchantRepo.findOne({ mact: (mact || '').toLowerCase() })
      if (merchant && merchant.toObject) merchant = merchant.toObject()
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
  const verifyWebhookMerchant = async (req, res) => {
    try {
      const { merchantId, webhookUrl } = req.body
      const rs = await helper.verifyUrl2XX(webhookUrl)
      if (rs.statusCode == 200 && merchantId && webhookUrl) {
        const sp = await merchantRepo.updateMerchant(merchantId, { $addToSet: { webhooks: webhookUrl } })
        res.status(httpCode.SUCCESS).send({ ok: true, msg: 'Thêm thành công !' })
      } else {
        res.status(httpCode.BAD_REQUEST).send({ ok: false, msg: 'Xác minh url không thành công. Vui lòng trả lại https status code 2xx' })
      }
    } catch (e) {
      logger.e(e)
      res.status(httpCode.UNKNOWN_ERROR).json({})
    }
  }
  return { addMerchant, getMerchantDetail, getMerchantDetailById, verifyWebhookMerchant }
}
