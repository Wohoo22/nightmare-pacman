const joi = require('@hapi/joi')
const mongoose = require('mongoose')
const typeMapping = {
  string: String,
  array: Array,
  number: Number,
  boolean: Boolean,
  object: Object
}

const joi2MongoSchema = (joiSchema, special = {}, schemaOnly = {}, joiOnly = {}) => {
  /*
  * @param {joiSchema} schema joi
  * @param {special} cấu hình đặc biệt của 1 field của schema ví dụ index, unique,....
  * @param {schemaOnly} 1 số field mà chỉ có ở db mà k có ở schema
  *
  *
  * */
  const { $_terms: { keys } } = joiSchema
  let schemaObj = {}
  keys.forEach(i => {
    const { key, schema: { type } } = i
    if (joiOnly[key]) {
      return
    }
    schemaObj[key] = {
      type: typeMapping[type],
      ...(special[key] || {})
    }
  })
  schemaObj = { ...schemaObj, ...schemaOnly }
  return mongoose.Schema(schemaObj)
}
module.exports = container => {
  container.registerValue('ObjectId', mongoose.Types.ObjectId)
  const config = container.resolve('config')
  const User = require('./user.model')(joi, mongoose, { joi2MongoSchema })
  const Merchant = require('./merchant.model')(joi, mongoose, { joi2MongoSchema }, config)
  const CustomerUser = require('./customerUser.model')(joi, mongoose, { joi2MongoSchema })
  const schemas = { Merchant, CustomerUser, User }
  const schemaValidator = (obj, type) => {
    const schema = schemas[type]
    if (schema) {
      return schema.validateObj(obj, {
        allowUnknown: true,
        stripUnknown: true
      })
    }
    return { error: `${type} not found.` }
  }
  return {
    schemas,
    schemaValidator
  }
}
