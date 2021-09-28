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

  async function setMerchantApplications ({
    id,
    applications
  }) {
    /*
      applications: [{
        id,
        appName,
        urlWebhook,
        secretKey,
        methodWebhook,
        note
      }]
    */
    const merchant = await Merchant.findById(id)
    let resultApplications = []
    resultApplications = resultApplications.concat(applications)
    for (const oldApp of merchant.applications) {
      let overrided = false
      for (const newApp of applications) {
        if (newApp.id === oldApp.id) {
          overrided = true
          break
        }
      }
      if (!overrided) {
        resultApplications.push(oldApp)
      }
    }
    return await Merchant.findOneAndUpdate(
      { _id: id },
      { applications: resultApplications },
      { new: true }
    )
  }

  const deleteMerchantApplications = async ({
    id,
    applicationIds
  }) => {
    const merchant = await Merchant.findById(id)
    const resultApplications = []
    for (const app of merchant.applications) {
      let deleted = false
      for (const id of applicationIds) {
        if (id === app.id) {
          deleted = true
          break
        }
        if (!deleted) {
          resultApplications.push(app)
        }
      }
    }
    return await Merchant.findOneAndUpdate(
      { _id: id },
      { applications: resultApplications },
      { new: true }
    )
  }

  async function countMerchantUsingApp (appIds) {
    
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
    getMerchant,
    setMerchantApplications,
    deleteMerchantApplications
  }
}
