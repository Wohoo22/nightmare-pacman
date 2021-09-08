// const moment = require('moment')
module.exports = (container) => {
  const logger = container.resolve('logger')
  // const beHelper = container.resolve('helper')
  const ObjectId = container.resolve('ObjectId')
  const Response = require('../models/response.model').Response
  const {
    schemaValidator,
    schemas: {
      Merchant
    }
  } = container.resolve('models')
  const { httpCode, serverHelper } = container.resolve('config')
  const { merchantRepo } = container.resolve('repo')
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
      value.createdBy = req.user._id || ''
      console.log(req.user)
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
  const deleteMerchant = async (req, res) => {
    try {
      const { id } = req.params
      if (id) {
        await merchantRepo.updateMerchant(id, { activated: 0 })
        res.status(httpCode.SUCCESS).send({ ok: true })
      } else {
        res.status(httpCode.BAD_REQUEST).end()
      }
    } catch (e) {
      logger.e(e)
      res.status(httpCode.UNKNOWN_ERROR).send({ ok: false })
    }
  }
  const getMerchantInfo = async (req, res) => {
    try {
      const { mst } = req.query
      if (mst) {
        const data = await serverHelper.getMerchantInfoFromMST(mst)
        return res.status(httpCode.SUCCESS).json({ data })
      }
      res.status(httpCode.BAD_REQUEST).json({})
    } catch (e) {
      logger.e(e)
      res.status(httpCode.UNKNOWN_ERROR).json({})
    }
  }
  const getMerchantById = async (req, res) => {
    try {
      const { id } = req.params
      if (id) {
        const merchant = await merchantRepo.getMerchantById(id)
        res.status(httpCode.SUCCESS).send(merchant)
      } else {
        res.status(httpCode.BAD_REQUEST).end()
      }
    } catch (e) {
      logger.e(e)
      res.status(httpCode.UNKNOWN_ERROR).send({ ok: false })
    }
  }
  // const getMerchantFromMST = async (req, res) => {
  //   try {
  //     const { mst } = req.query
  //     if (mst) {
  //       const merchant = await merchantRepo.getMerchantById(id)
  //       res.status(httpCode.SUCCESS).send(merchant)
  //     } else {
  //       res.status(httpCode.BAD_REQUEST).end()
  //     }
  //   } catch (e) {
  //     logger.e(e)
  //     res.status(httpCode.UNKNOWN_ERROR).send({ ok: false })
  //   }
  // }
  const updateMerchant = async (req, res) => {
    try {
      const { id } = req.params
      const merchant = req.body
      const {
        error,
        value
      } = await schemaValidator(merchant, 'Merchant')
      if (error) {
        return res.status(httpCode.BAD_REQUEST).send({ msg: error.message })
      }
      if (id && merchant) {
        value.updatedBy = req.user._id
        value.updatedAt = Math.floor(Date.now() / 1000)
        const sp = await merchantRepo.updateMerchant(id, value)
        res.status(httpCode.SUCCESS).send(sp)
      } else {
        res.status(httpCode.BAD_REQUEST).end()
      }
    } catch (e) {
      if (e.code === 11000) {
        return res.status(httpCode.BAD_REQUEST).json({ msg: 'Mã Merchant đã tồn tại, vui lòng thử mã khác.' })
      }
      logger.e(e)
      res.status(httpCode.UNKNOWN_ERROR).send({ ok: false })
    }
  }
  const getMerchant = async (req, res) => {
    try {
      let {
        page,
        perPage,
        sort,
        ids
      } = req.query
      page = +page || 1
      perPage = +perPage || 10
      sort = +sort === 0 ? { _id: 1 } : +sort || { _id: -1 }
      const skip = (page - 1) * perPage
      const search = { ...req.query }
      if (ids) {
        if (ids.constructor === Array) {
          search.id = { $in: ids }
        } else if (ids.constructor === String) {
          search.id = { $in: ids.split(',') }
        }
      }
      delete search.ids
      delete search.page
      delete search.perPage
      delete search.sort
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
      pipe.activated = 1
      const data = await merchantRepo.getMerchant(pipe, perPage, skip, sort)
      const total = await merchantRepo.getCount(pipe)
      res.status(httpCode.SUCCESS).send({
        perPage,
        skip,
        sort,
        data,
        total,
        page
      })
    } catch (e) {
      logger.e(e)
      res.status(httpCode.UNKNOWN_ERROR).send({ ok: false })
    }
  }
  const deleteMerchantApplications = async (req, res) => {
    try {
      const data = await merchantRepo.deleteMerchantApplications({
        id: req.body.id,
        applications: req.body.applications
      })

      // console.log('######### delete-merchant-applications')
      // console.log(data)
      // console.log('######### /delete-merchant-applications')

      res.status(httpCode.SUCCESS).send(
        new Response({
          success: true,
          code: httpCode.SUCCESS,
          message: 'OK',
          data: data
        })
      )
    } catch (e) {
      res.status(httpCode.UNKNOWN_ERROR).send(
        new Response({
          success: false,
          code: httpCode.UNKNOWN_ERROR,
          message: e.message,
          data: {}
        })
      )
    }
  }
  // deleteMerchantApplications({
  //   body: {
  //     id: '6125c3f1ad96d5001346b9b9',
  //     applications: [
  //       'app2'
  //     ]
  //   }
  // })
  const addMerchantApplications = async (req, res) => {
    try {
      const data = await merchantRepo.addMerchantApplication({
        id: req.body.id,
        applications: req.body.applications
      })

      // console.log('######### add-merchant-applications')
      // console.log(data)
      // console.log('######### /add-merchant-applications')

      res.status(httpCode.SUCCESS).send(
        new Response({
          success: true,
          code: httpCode.SUCCESS,
          message: 'OK',
          data: data
        })
      )
    } catch (e) {
      res.status(httpCode.UNKNOWN_ERROR).send(
        new Response({
          success: false,
          code: httpCode.UNKNOWN_ERROR,
          message: e.message,
          data: {}
        })
      )
    }
  }
  // addMerchantApplications({
  //   body: {
  //     id: '60ee62aa434240001391b803',
  //     applications: [
  //       'app3',
  //       'app4'
  //     ]
  //   }
  // })
  return {
    addMerchant,
    getMerchant,
    getMerchantById,
    updateMerchant,
    deleteMerchant,
    getMerchantInfo,
    deleteMerchantApplications,
    addMerchantApplications
  }
}
