module.exports = (container) => {
  const logger = container.resolve('logger')
  const { httpCode } = container.resolve('config')
  const beHelper = container.resolve('helper')

  const getCameraPaging = async (req, res) => {
    try {
      const params = { ...req.query, isAdmin: req.headers['is-admin'] || false }
      // console.log('params: ', params)
      const camerasPromise = beHelper.getNextcamCamera(params)
      const totalPromise = beHelper.countNextcamCamera(params)
      Promise.all([camerasPromise, totalPromise])
        .then(apiRepsonses => {
          const cameras = JSON.parse(apiRepsonses[0]).data
          const total = JSON.parse(apiRepsonses[1]).data.total
          res.status(httpCode.SUCCESS).send({ ok: true, data: { resourceDetails: cameras, total } })
        })
    } catch (e) {
      logger.e('nextcamCameraController error: ', e.message)
      res.status(httpCode.UNKNOWN_ERROR).json({ ok: false, msg: e.message })
    }
  }

  return {
    getCameraPaging
  }
}
