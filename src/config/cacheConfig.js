const CachePrefixes = {
  ncUser: 'nc-user',
  ncCam: 'nc-cam',
  ncUserCam: 'nc-user-cam',
  ncUserFace: 'nc-user-face',
  ncCamStatus: 'nc-cam-status',
  ncCamStates: 'nc-cam-states',
  ncAllUser: 'nc-all-user',
  ncAllCam: 'nc-all-cam',
  ncCountUser: 'nc-count-user',
  ncCountCam: 'nc-count-cam',
}

const CacheConverter = {
  // expect value of each param is primitive
  paramsToCacheSuffix: (params) => {
    const entries = Object.entries(params)
    return entries.reduce((result, elem, i) => {
      return result + (i > 0 ? ',' : '') + elem[0] + ':' + elem[1]
    }, '')
  },
}

module.exports = {
  CachePrefixes,
  CacheConverter,
}