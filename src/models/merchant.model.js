module.exports = (joi, mongoose, { joi2MongoSchema, schemas }, config) => {
  const { ObjectId } = mongoose.Types
  const { uuidv4 } = config.serverHelper
  const licenseTypeConfig = {
    TIME: 1,
    CONTRACT: 2,
    UNLIMITED: 3,
    TIME_AND_CONTRACT: 4
  }
  const merchantJoi = joi.object({
    ten: joi.string().required(),
    nguoiDaiDien: joi.string().allow(''),
    maSoThue: joi.string().allow(''),
    diaChi: joi.string().allow(''),
    chucVu: joi.string().allow(''),
    lienHe: joi.string().allow(''),
    logo: joi.string().allow(''),
    alias: joi.string().allow(''),
    merchantAlias: joi.string().pattern(/^[a-zA-Z0-9]{2,30}$/).required(),
    applications: joi.array()
  })
  const merchantSchema = joi2MongoSchema(merchantJoi, {
    alias: {
      require: true,
      // unique: true,
      lowercase: true,
      trim: true
    }
  }, {
    createdBy: { type: ObjectId },
    updatedBy: { type: ObjectId },
    updatedAt: { type: Number },
    clientSecret: {
      type: String,
      default: () => uuidv4()
    },
    createdAt: {
      type: Number,
      default: () => Math.floor(Date.now() / 1000)
    },
    activated: {
      type: Number,
      default: 1
    }
  })
  merchantSchema.statics.validateObj = (obj, config = {}) => {
    return merchantJoi.validate(obj, config)
  }
  merchantSchema.statics.getConfig = () => {
    return { licenseTypeConfig }
  }
  merchantSchema.statics.validateTaiLieu = (obj, config = {
    allowUnknown: true,
    stripUnknown: true
  }) => {
    return merchantJoi.validate(obj, config)
  }
  // merchantSchema.index({ merchantAlias: 1 }, { unique: true })
  const merchantModel = mongoose.model('Merchant', merchantSchema)
  merchantModel.syncIndexes()
  return merchantModel
}
