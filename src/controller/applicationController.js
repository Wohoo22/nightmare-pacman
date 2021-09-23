// const moment = require('moment')
const request = require('request-promise')
module.exports = (container) => {
  const logger = container.resolve('logger')
  const ObjectId = container.resolve('ObjectId')
  const { customerUserServiceConfig, httpCode } =
  container.resolve('config')
  const accessToken = customerUserServiceConfig.customerUserToken
  
  const getAppById = async (req, res) => {
    try {
      const { id } = req.params
      const options = {
        headers: { 'be-token': accessToken },
        uri: `${customerUserServiceConfig.url}/operation/developerUser/application/${id}`,
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

  const setStatusApp = async (req, res) => {
    try {
      const { id } = req.params
      const objStatus = {
        status: req.body.status
      }
      const options = {
        headers: { 'be-token': accessToken },
        uri: `${customerUserServiceConfig.url}/operation/developerUser/application/${id}/set-status`,
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
  const getApps = async (req, res) => {
    try {
      console.log('getApps')
      const options = {
        headers: { 'be-token': accessToken },
        uri: `${customerUserServiceConfig.url}/operation/developerUser/application`,
        json: true,
        method: 'GET',
        qs: req.query
      }
      const data = await request(options)
      console.log('data' , data)

      res.status(200).send(data)
    } catch (e) {
      //logger.e(e)
      const { name, statusCode, error } = e
      if (name === 'StatusCodeError') {
        res.status(statusCode).send({ ok: false,  msg: (error || {}).msg || '' })
      }else 
        res.status(httpCode.UNKNOWN_ERROR).send({ ok: false,  msg: 'Unknow error' })
    }
  }
  
  

  return {
    getApps,
    setStatusApp,
    getAppById
  }
}
