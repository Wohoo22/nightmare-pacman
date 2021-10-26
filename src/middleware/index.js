const request = require('request-promise')
module.exports = (container) => {
  const {
    serverHelper,
    httpCode
  } = container.resolve('config')
  const logger = container.resolve('logger')

  const verifyAccessToken = async (req, res, next) => {

    // disable middleware for some specific path
    const openPath = [
      '/merchant/delete-applications', 
    '/merchant/add-applications', '/merchant/:id', 
    '/developer/sub/application/get-app-list/approved',
    '/developer/sub/application/:id']
    for (const path of openPath) {
      if (path === req.path) return next()
      const openPathSegments = path.split('/')
      const reqPathSegments = req.path.split('/')
      if (openPathSegments.length !== reqPathSegments.length) continue
      let match = true
      for (let i=0; i<openPathSegments.length; i++) 
        if (openPathSegments[i] !== ':id'
            && openPathSegments[i] !== reqPathSegments[i])
            match = false
      if (match) return next()
    }

    console.log('verifyAccessToken')
    try {
      const token = req.headers['x-access-token'] || ''
      if (!token) {
        return res.status(httpCode.BAD_REQUEST).json({ msg: 'Bạn không có quyền thực hiện tác vụ này.' })
      }
      const user = await serverHelper.verifyToken(token)
      console.log('user', user)

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
      console.log('ok', ok)
      console.log('msg', msg)
      console.log('user', user)
      console.log('reqPath', path)
      if (ok) {
        req.user = userAuthorization
        console.log('authenticationMIddleware req.user', req.user)
        if (userAuthorization.readonly && req.method !== 'GET') {
          return res.status(httpCode.BAD_REQUEST).json({ msg: 'Bạn chỉ có quyền xem thông tin, không thể thực hiện được thao tác này.' })
        }
        console.log('next', 'true')
        return next()
      }
      res.status(httpCode.BAD_REQUEST).json({ msg: msg || 'Bạn không có quyền thực hiện tác vụ này.' })
    } catch (e) {
      if (!e.message.includes('TokenExpiredError')) {
        logger.e(e.message)
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
