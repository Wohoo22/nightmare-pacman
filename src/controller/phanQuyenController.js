const queryString = require('querystring')
module.exports = (container) => {
  const logger = container.resolve('logger')
  const { httpCode, serverHelper } = container.resolve('config')
  const beHelper = container.resolve('helper')
  const add = async (req, res) => {
    try {
      const { model } = req.params
      const { statusCode, data } = await beHelper.sendToCustomerAuth({
        body: req.body,
        method: 'POST'
      }, `/${model}`)
      res.status(statusCode).send(data)
    } catch (e) {
      logger.e(e)
      res.status(httpCode.UNKNOWN_ERROR).json({})
    }
  }
  const update = async (req, res) => {
    try {
      const { model, id } = req.params
      const { statusCode, data } = await beHelper.sendToCustomerAuth({
        body: req.body,
        method: 'PUT'
      }, `/${model}/${id}`)
      res.status(statusCode).send(data)
    } catch (e) {
      logger.e(e)
      res.status(httpCode.UNKNOWN_ERROR).json({})
    }
  }
  const getById = async (req, res) => {
    try {
      const { model, id } = req.params
      const { statusCode, data } = await beHelper.sendToCustomerAuth({
        method: 'GET'
      }, `/${model}/${id}`)
      res.status(statusCode).send(data)
    } catch (e) {
      logger.e(e)
      res.status(httpCode.UNKNOWN_ERROR).json({})
    }
  }
  const remove = async (req, res) => {
    try {
      const { model, id } = req.params
      const { statusCode, data } = await beHelper.sendToCustomerAuth({
        method: 'DELETE'
      }, `/${model}/${id}`)
      res.status(statusCode).send(data)
    } catch (e) {
      logger.e(e)
      res.status(httpCode.UNKNOWN_ERROR).json({})
    }
  }
  const get = async (req, res) => {
    try {
      const { model } = req.params
      const { statusCode, data } = await beHelper.sendToCustomerAuth({
        method: 'GET'
      }, `/${model}?${queryString.stringify(req.query)}`)
      res.status(statusCode).send(data)
    } catch (e) {
      logger.e(e)
      res.status(httpCode.UNKNOWN_ERROR).json({})
    }
  }
  return { add, update, remove, getById, get }
}
