// const moment = require('moment')
const request = require('request-promise')
module.exports = (container) => {
  const logger = container.resolve('logger')
  const ObjectId = container.resolve('ObjectId')
  const { customerUserServiceConfig, httpCode } =
  container.resolve('config')
  const accessToken = customerUserServiceConfig.customerUserToken
  
  const getDeveloperById = async (req, res) => {
    try {
      console.log('getDeveloperById')
      const { id } = req.params
      const options = {
        headers: { 'be-token': accessToken },
        uri: `${customerUserServiceConfig.url}/developerUser/${id}`,
        json: true,
        method: 'GET'
      }

      const data = await request(options)

      res.status(200).send(data)
    } catch (e) {
      logger.e(e)
      const { name, statusCode, error } = e
      if (name === 'StatusCodeError') {
        res.status(statusCode).send({ ok: false,  msg: (error || {}).msg || '' })
      }else 
        res.status(httpCode.UNKNOWN_ERROR).send({ ok: false,  msg: 'Unknow error' })
    }
  }

  const setStatusDeveloper = async (req, res) => {
    try {
      const { id } = req.params
      const objStatus = {
        status: req.body.status
      }
      const options = {
        headers: { 'be-token': accessToken },
        uri: `${customerUserServiceConfig.url}/developerUser/${id}/setStatus`,
        json: true,
        body: objStatus,
        method: 'PUT'
      }
      console.log('send request' , options)

      const data = await request(options)
      res.status(200).send(data)
    } catch (e) {
      logger.e(e)
      const { name, statusCode, error } = e
      if (name === 'StatusCodeError') {
        res.status(statusCode).send({ ok: false,  msg: (error || {}).msg || '' })
      }else 
        res.status(httpCode.UNKNOWN_ERROR).send({ ok: false,  msg: 'Unknow error' })
    }
  }
  const getDeveloper = async (req, res) => {
    try {
    
      const options = {
        headers: { 'be-token': accessToken },
        uri: `${customerUserServiceConfig.url}/developerUser`,
        json: true,
        method: 'GET',
        qs: req.query
      }
      console.log('send request' , options)
      const data = await request(options)
      res.status(200).send(data)
    } catch (e) {
      logger.e(e)
      const { name, statusCode, error } = e
      if (name === 'StatusCodeError') {
        res.status(statusCode).send({ ok: false,  msg: (error || {}).msg || '' })
      }else 
        res.status(httpCode.UNKNOWN_ERROR).send({ ok: false,  msg: 'Unknow error' })
    }
  }
  
  

  return {
    getDeveloper,
    getDeveloperById,
    setStatusDeveloper
  }
}
