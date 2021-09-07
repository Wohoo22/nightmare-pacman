const request = require('request-promise')
const querystring = require('query-string')
module.exports = (container) => {
  const { customerUserServiceConfig, httpCode, defaultResource } =
    container.resolve('config')
  const logger = container.resolve('logger')
  const accessToken = customerUserServiceConfig.customerUserToken
  const addUser = async (body) => {
    try {
      const options = {
        headers: { 'be-token': accessToken },
        uri: `${customerUserServiceConfig.url}/customerUser`,
        json: true,
        method: 'POST',
        body
      }
      const data = await request(options)
      return { statusCode: 200, data }
    } catch (e) {
      const { name, statusCode, error } = e
      if (name === 'StatusCodeError') {
        return { data: error, statusCode, msg: (error || {}).msg || '' }
      }
      logger.e(e)
      return { statusCode: httpCode.BAD_REQUEST, msg: '' }
    }
  }
  const updateUser = async (_id, body) => {
    try {
      const options = {
        headers: { 'be-token': accessToken },
        uri: `${customerUserServiceConfig.url}/customerUser/${_id}`,
        json: true,
        method: 'PUT',
        body
      }
      const data = await request(options)
      return { statusCode: 200, data }
    } catch (e) {
      const { name, statusCode, error } = e
      if (name === 'StatusCodeError') {
        return { data: error, statusCode, msg: (error || {}).msg || '' }
      }
      logger.e(e)
      return { statusCode: httpCode.BAD_REQUEST, msg: '' }
    }
  }
  const getUserById = async (_id) => {
    try {
      const options = {
        headers: { 'be-token': accessToken },
        uri: `${customerUserServiceConfig.url}/customerUser/${_id}`,
        json: true,
        method: 'GET'
      }
      const data = await request(options)
      return { statusCode: 200, data }
    } catch (e) {
      const { name, statusCode, error } = e
      if (name === 'StatusCodeError') {
        return { data: error, statusCode, msg: (error || {}).msg || '' }
      }
      logger.e(e)
      return { statusCode: httpCode.BAD_REQUEST, msg: '' }
    }
  }
  const deleteUserById = async (_id) => {
    try {
      const options = {
        headers: { 'be-token': accessToken },
        uri: `${customerUserServiceConfig.url}/customerUser/${_id}`,
        json: true,
        method: 'DELETE'
      }
      const data = await request(options)
      return { statusCode: 200, data }
    } catch (e) {
      const { name, statusCode, error } = e
      if (name === 'StatusCodeError') {
        return { data: error, statusCode, msg: (error || {}).msg || '' }
      }
      logger.e(e)
      return { statusCode: httpCode.BAD_REQUEST, msg: '' }
    }
  }
  const getUser = async (qs) => {
    try {
      const options = {
        headers: { 'be-token': accessToken },
        uri: `${customerUserServiceConfig.url}/customerUser`,
        json: true,
        method: 'GET',
        qs
      }
      const data = await request(options)
      return { statusCode: 200, data }
    } catch (e) {
      const { name, statusCode, error } = e
      if (name === 'StatusCodeError') {
        return { data: error, statusCode, msg: (error || {}).msg || '' }
      }
      logger.e(e)
      return { statusCode: httpCode.BAD_REQUEST, msg: '' }
    }
  }
  const addResources = async (merchantId) => {
    try {
      const options = {
        headers: { 'be-token': accessToken },
        uri: `${customerUserServiceConfig.url}/addResource`,
        json: true,
        method: 'POST',
        body: {
          merchantId,
          resources: defaultResource
        }
      }
      const data = await request(options)
      return { statusCode: 200, data }
    } catch (e) {
      const { name, statusCode, error } = e
      if (name === 'StatusCodeError') {
        return { data: error, statusCode, msg: (error || {}).msg || '' }
      }
      logger.e(e)
      return { statusCode: httpCode.BAD_REQUEST, msg: '' }
    }
  }
  // gọi sang customer backend tạo schedule, shift mặc đinh
  const addShiftDefaultByMerchantId = async (merchantId) => {
    try {
      const allSchedule = [
        {
          dddd: 'T2',
          end_time: '18:00:00',
          start_time: '08:30:00',
          end_time_number: 64800000,
          start_time_number: 30600000,
          isDefault: 1,
          type: 0,
          merchantId
        },
        {
          dddd: 'T3',
          end_time: '18:00:00',
          start_time: '08:30:00',
          end_time_number: 64800000,
          start_time_number: 30600000,
          isDefault: 1,
          type: 0,
          merchantId
        },
        {
          dddd: 'T4',
          end_time: '18:00:00',
          start_time: '08:30:00',
          end_time_number: 64800000,
          start_time_number: 30600000,
          isDefault: 1,
          type: 0,
          merchantId
        },
        {
          dddd: 'T5',
          end_time: '18:00:00',
          start_time: '08:30:00',
          end_time_number: 64800000,
          start_time_number: 30600000,
          isDefault: 1,
          type: 0,
          merchantId
        },
        {
          dddd: 'T6',
          end_time: '18:00:00',
          start_time: '08:30:00',
          end_time_number: 64800000,
          start_time_number: 30600000,
          isDefault: 1,
          type: 0,
          merchantId
        }
      ]

      const result = await Promise.all(
        allSchedule.map((i) => {
          const options = {
            headers: { 'be-token': accessToken },
            uri: `${customerUserServiceConfig.customerBackenUrl}/share/schedule`,
            json: true,
            method: 'POST',
            body: i
          }
          return request(options)
        })
      )
      const schedules = result.map((i) => i.data._id)

      const options = {
        headers: { 'be-token': accessToken },
        uri: `${customerUserServiceConfig.customerBackenUrl}/share/shift`,
        json: true,
        method: 'POST',
        body: {
          name: 'Ca mặc định',
          merchantId,
          isDefault: 1,
          schedules
        }
      }
      const data = await request(options)
      return { statusCode: 200, data }
    } catch (e) {
      const { name, statusCode, error } = e
      if (name === 'StatusCodeError') {
        return { data: error, statusCode, msg: (error || {}).msg || '' }
      }
      logger.e(e)
      return { statusCode: httpCode.BAD_REQUEST, msg: '' }
    }
  }
  const sendToCustomerAuth = async (opt, url) => {
    try {
      const options = {
        ...opt,
        headers: { 'be-token': accessToken },
        uri: `${customerUserServiceConfig.url}/default${url}`,
        json: true
      }
      const data = await request(options)
      return { statusCode: 200, data }
    } catch (e) {
      const { name, statusCode, error } = e
      if (name === 'StatusCodeError') {
        return { data: error, statusCode, msg: (error || {}).msg || '' }
      }
      logger.e(e)
      return { statusCode: httpCode.BAD_REQUEST, msg: '' }
    }
  }
  const sendToCustomerBackend = async (opt, url) => {
    try {
      const options = {
        ...opt,
        headers: { 'be-token': accessToken },
        uri: `${customerUserServiceConfig.customerBackenUrl}/share${url}`,
        json: true
      }
      const data = await request(options)
      return { statusCode: 200, data }
    } catch (e) {
      const { name, statusCode, error } = e
      if (name === 'StatusCodeError') {
        return { data: error, statusCode, msg: (error || {}).msg || '' }
      }
      logger.e(e)
      return { statusCode: httpCode.BAD_REQUEST, msg: '' }
    }
  }
  const getDashboard = async () => {
    try {
      const options = {
        headers: { 'be-token': accessToken },
        uri: `${customerUserServiceConfig.customerBackenUrl}/share/dashboard`,
        json: true,
        method: 'GET'
      }
      const data = await request(options)
      return { statusCode: 200, data }
    } catch (e) {
      const { name, statusCode, error } = e
      if (name === 'StatusCodeError') {
        return { data: error, statusCode, msg: (error || {}).msg || '' }
      }
      logger.e(e)
      return { statusCode: httpCode.BAD_REQUEST, msg: '' }
    }
  }

  const verifyUrl2XX = async (url) => {
    try {
      const options = {
        uri: url,
        json: true,
        method: 'POST'
      }
      const data = await request(options)
      console.log(data)
      return { statusCode: 200, data }
    } catch (e) {
      const { name, statusCode, error } = e
      if (name === 'StatusCodeError') {
        return { data: error, statusCode, msg: (error || {}).msg || '' }
      }
      logger.e(e)
      return { statusCode: httpCode.BAD_REQUEST, msg: '' }
    }
  }

  // @author: manhthd, 2021 August 31
  const getCamera = async (params) => {
    const ADMIN_TOKEN = process.env.ADMIN_TOKEN || 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0eXBlIjoiZnVsbCIsImlhdCI6MTYzMDAzNjQ2Mn0.kw1DC0jKhQh3kipcMmTDlzR3couZ_TcVrqgf_qx4cmd0pZyXd3pV6JiDIp1E0eY3FA34NKY4oh-7JQUqk6F5bKJrSJra3sayVRoPNwdyO09PMqBPlFF6yEdifSPK73KaUZ3cMcRB03mvoTsnypHqFxKzmiSQkNxYCGUPbItbQuc'
    const VIEW_TOKEN = process.env.VIEW_TOKEN || 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0eXBlIjoidmlldyIsImlhdCI6MTYzMDAzNjQyNn0.XMvnNzbJP6RWq8GKPHPUBS_S__5_t6kpKRGxH7bfpQN83TyD-lpezqZAVjviWWdwxYznvuZ6xM7wYj982G_Vy--J3JY9JKnFta159iT5woR9pDH_c83tS8Z8vjd4f8JAXhf0KyasseXXbjmauJZb6NSrFPYPg_EPPbzA3WoU81c'

    const token = params.isAdmin ? ADMIN_TOKEN : VIEW_TOKEN
    const options = {
      headers: { Authorization: `Bearer ${token}` },
      uri: `${customerUserServiceConfig.nextcamUrl}/camera?${querystring.stringify(params)}`,
      method: 'GET'
    }
    const data = await request(options)
    return data
  }

  return {
    addUser,
    updateUser,
    getUser,
    getUserById,
    deleteUserById,
    addResources,
    sendToCustomerBackend,
    sendToCustomerAuth,
    getDashboard,
    addShiftDefaultByMerchantId,
    verifyUrl2XX,
    getCamera
  }
}
