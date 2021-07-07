module.exports = (joi, mongoose) => {
  const customerUserJoi = joi.object({
    name: joi.string().allow(''),
    username: joi.string().pattern(/^(?=.{1,100}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/).required(),
    avatar: joi.string().allow('').default(''),
    password: joi.string().min(1),
    activated: joi.number().valid(0, 1).default(1),
    isAdministrator: joi.number().valid(0, 1).default(0),
    merchantId: joi.string().required()
  })
  return {
    validateObj: (obj, options = {}) => {
      return customerUserJoi.validate(obj, options)
    }
  }
}
