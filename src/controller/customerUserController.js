module.exports = (container) => {
  const logger = container.resolve('logger')
  const ObjectId = container.resolve('ObjectId')
  const {
    schemaValidator,
    schemas: {
      CustomerUser
    }
  } = container.resolve('models')
  const { httpCode, serverHelper } = container.resolve('config')
  const beHelper = container.resolve('helper')
  const addCustomerUser = async (req, res) => {
    try {
      const thoauoc = req.body
      const {
        error,
        value
      } = await schemaValidator(thoauoc, 'CustomerUser')
      if (error) {
        return res.status(httpCode.BAD_REQUEST).send({ msg: error.message })
      }
      const { statusCode, data } = await beHelper.addUser(value)
      res.status(statusCode).send(data)
    } catch (e) {
      logger.e(e)
      res.status(httpCode.UNKNOWN_ERROR).end()
    }
  }
  const deleteCustomerUser = async (req, res) => {
    try {
      const { id } = req.params
      if (id) {
        const { statusCode, data } = await beHelper.deleteUserById(id)
        res.status(statusCode).send(data)
      } else {
        res.status(httpCode.BAD_REQUEST).end()
      }
    } catch (e) {
      logger.e(e)
      res.status(httpCode.UNKNOWN_ERROR).send({ ok: false })
    }
  }
  const getCustomerUserById = async (req, res) => {
    try {
      const { id } = req.params
      if (id) {
        const { statusCode, data } = await beHelper.getUserById(id)
        res.status(statusCode).send(data)
      } else {
        res.status(httpCode.BAD_REQUEST).end()
      }
    } catch (e) {
      logger.e(e)
      res.status(httpCode.UNKNOWN_ERROR).send({ ok: false })
    }
  }
  const updateCustomerUser = async (req, res) => {
    try {
      const { id } = req.params
      const customerUser = req.body
      const {
        error,
        value
      } = await schemaValidator(customerUser, 'CustomerUser')
      if (error) {
        return res.status(httpCode.BAD_REQUEST).send({ msg: error.message })
      }
      if (id && value) {
        const { statusCode, data } = await beHelper.updateUser(id, value)
        res.status(statusCode).send(data)
      } else {
        res.status(httpCode.BAD_REQUEST).end()
      }
    } catch (e) {
      logger.e(e)
      res.status(httpCode.UNKNOWN_ERROR).send({ ok: false })
    }
  }
  const getCustomerUser = async (req, res) => {
    try {
      const { statusCode, data } = await beHelper.getUser(req.query)
      res.status(statusCode).send(data)
    } catch (e) {
      logger.e(e)
      res.status(httpCode.UNKNOWN_ERROR).send({ ok: false })
    }
  }
  return {
    addCustomerUser,
    getCustomerUser,
    getCustomerUserById,
    updateCustomerUser,
    deleteCustomerUser
  }
}
