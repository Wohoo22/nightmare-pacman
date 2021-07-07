module.exports = container => {
  const { schemas } = container.resolve('models')
  const { Merchant } = schemas
  const addMerchant = (cate) => {
    const c = new Merchant(cate)
    return c.save()
  }
  const getMerchantById = (id) => {
    return Merchant.findById(id)
  }
  const deleteMerchant = (id) => {
    return Merchant.findByIdAndRemove(id, { useFindAndModify: false })
  }
  const updateMerchant = (id, n) => {
    return Merchant.findByIdAndUpdate(id, n, {
      useFindAndModify: false,
      returnOriginal: false
    })
  }
  const checkIdExist = (id) => {
    return Merchant.findOne({ id })
  }
  const getCount = (pipe = {}) => {
    return Merchant.countDocuments(pipe)
  }
  const getMerchantAgg = (pipe) => {
    return Merchant.aggregate(pipe)
  }
  const getMerchant = (pipe, limit, skip, sort) => {
    return Merchant.find(pipe).limit(limit).skip(skip).sort(sort)
  }
  const getMerchantNoPaging = (pipe) => {
    return Merchant.find(pipe)
  }
  const findOne = (pipe) => {
    return Merchant.findOne(pipe)
  }
  const removeMerchant = (pipe) => {
    return Merchant.deleteMany(pipe)
  }
  return {
    findOne,
    getMerchantNoPaging,
    removeMerchant,
    addMerchant,
    getMerchantAgg,
    getMerchantById,
    deleteMerchant,
    updateMerchant,
    checkIdExist,
    getCount,
    getMerchant
  }
}
