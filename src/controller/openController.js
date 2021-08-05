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
      Merchant
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
  const updateAliasMerchant = async (req, res) => {
    try {
      const { alias } = req.body
      const { id } = req.params
      if (alias && alias.trim()) {
        const sp = await merchantRepo.updateMerchant(id, { alias })
        return res.status(httpCode.CREATED).send(sp)
      }
      return res.status(httpCode.BAD_REQUEST).json({ msg: 'Alias công ty không để trống' })
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
      const search = { ...req.query }
      const pipe = {}
      Object.keys(search).forEach(i => {
        const vl = search[i]
        const pathType = (Merchant.schema.path(i) || {}).instance || ''
        if (pathType.toLowerCase() === 'objectid') {
          pipe[i] = ObjectId(vl)
        } else if (pathType === 'Number') {
          pipe[i] = +vl
        } else if (pathType === 'String' && vl.constructor === String) {
          pipe[i] = new RegExp(vl, 'gi')
        } else {
          pipe[i] = vl
        }
      })
      let merchant = await merchantRepo.findOne(pipe)
      if (merchant && merchant.toObject) merchant = merchant.toObject()
      if (merchant && merchant.activated) {
        return res.status(httpCode.SUCCESS).json(merchant)
      }
      console.log(merchant)
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
  return { addMerchant, updateAliasMerchant, getMerchantDetail, getMerchantDetailById }
}
