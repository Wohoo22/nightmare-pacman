const request = require('request-promise')
module.exports = (container) => {
  const {
    serverHelper,
    httpCode
  } = container.resolve('config')
  const logger = container.resolve('logger')
  const verifyAccessToken = async (req, res, next) => {
    try {
      const token = req.headers['x-access-token'] || ''
      if (!token) {
        return res.status(httpCode.BAD_REQUEST).json({ msg: 'Bạn không có quyền thực hiện tác vụ này.' })
      }
      const user = await serverHelper.verifyToken(token)
      const { path } = req
      const option = {
        uri: process.env.AUTHORIZATION_URL || 'http://nextcam-cloud-permission-operation:8080/authorization',
        json: {
          userId: user._id,
          path,
          method: req.method
        },
        headers: {
          'x-access-token': token
        },
        method: 'POST'
      }
      const {
        ok,
        msg,
        user: userAuthorization
      } = await request(option)
      if (ok) {
        req.user = userAuthorization
        if (userAuthorization.readonly && req.method !== 'GET') {
          return res.status(httpCode.BAD_REQUEST).json({ msg: 'Bạn chỉ có quyền xem thông tin, không thể thực hiện được thao tác này.' })
        }
        return next()
      }
      res.status(httpCode.BAD_REQUEST).json({ msg: msg || 'Bạn không có quyền thực hiện tác vụ này.' })
    } catch (e) {
      if (!e.message.includes('TokenExpiredError')) {
        logger.e(e)
      }
      res.status(httpCode.TOKEN_EXPIRED).json({})
    }
  }
  const checkCustomerBeToken = async (req, res, next) => {
    try {
      const u = await serverHelper.verifyToken(req.headers['customer-be-token'])
      if (u && u.name === 'customer-be') {
        return next()
      }
      res.status(httpCode.BAD_REQUEST).json({ ok: false, msg: 'Lỗi ...' })
    } catch (e) {
      logger.e(e)
      res.status(httpCode.UNKNOWN_ERROR).json({})
    }
  }
  return { verifyAccessToken, checkCustomerBeToken }
}
