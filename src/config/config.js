const serverSettings = {
  port: process.env.PORT || 8080,
  basePath: process.env.BASE_PATH || ''
}
const httpCode = {
  SUCCESS: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  TOKEN_EXPIRED: 409,
  UNKNOWN_ERROR: 520,
  FORBIDDEN: 403,
  ADMIN_REQUIRE: 406
}
const customerUserServiceConfig = {
  customerUserToken: process.env.USER_DATA_TOKEN || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoic2ktYmFja2VuZCIsImlhdCI6MTYyNTIwMTUwNiwiZXhwIjo0NzgwOTYxNTA2fQ.EWAibq87KjWRal4NdE9DEMpp9Po5yjUtqwdvSY0yJD4',
  url: process.env.PERMISSION_USER_URL || 'http://nextcam-cloud-permission-user:8080',
  customerBackenUrl: process.env.USER_DATA_URL || 'http://nextcam-cloud-user-data:8080',
  nextcamUrl: process.env.NEXTCAM_URL || 'http://18.136.231.246:8080'
}
const defaultResource = [
  {
    title: 'Dashboard',
    path: '/dashboard'
  },
  {
    title: 'Nhóm quyền',
    path: '/group'
  },
  {
    title: 'Quyền',
    path: '/permission'
  },
  {
    title: 'Tài nguyên',
    path: '/resource'
  },
  {
    title: 'Vai trò',
    path: '/role'
  },
  {
    title: 'Người dùng',
    path: '/user'
  }
].map(i => {
  i.isDefault = 1
  i.activated = 1
  return i
})

const dbSettings = {
  db: process.env.DB || '',
  user: process.env.DB_USER || '',
  pass: process.env.DB_PASS || '',
  repl: process.env.DB_REPLS || '',
  servers: (process.env.DB_SERVERS)
    ? process.env.DB_SERVERS.split(',')
    : [
        '127.0.0.1:27017'
      ]
}
const serverHelper = function () {
  const jwt = require('jsonwebtoken')
  const crypto = require('crypto')
  const request = require('request-promise')
  const secretKey = process.env.SECRET_KEY || '112cms#$!@!'

  async function getMerchantInfoFromMST (mst) {
    try {
      const options = {
        uri: `http://hoadonviet.vn/api/invoice/GetTaxCode/${mst}`,
        json: true,
        method: 'GET'
      }
      process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0
      const data = await request(options)
      process.env.NODE_TLS_REJECT_UNAUTHORIZED = 1
      return data
    } catch (e) {
      return {}
    }
  }
  function uuidv4 () {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      const r = Math.random() * 16 | 0; const v = c === 'x' ? r : (r & 0x3 | 0x8)
      return v.toString(16)
    })
  }

  function decodeToken (token) {
    return jwt.decode(token)
  }

  function genToken (obj) {
    return jwt.sign(obj, secretKey, { expiresIn: '1d' })
  }

  function verifyToken (token) {
    return new Promise((resolve, reject) => {
      jwt.verify(token, secretKey, (err, decoded) => {
        err ? reject(new Error(err)) : resolve(decoded)
      })
    })
  }

  function encryptPassword (password) {
    return crypto.createHash('sha256').update(password, 'binary').digest('base64')
  }

  // function stringToCamelCase (str) {
  //   const from = 'àáãảạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệđùúủũụưừứửữựòóỏõọôồốổỗộơờớởỡợìíỉĩịäëïîöüûñçýỳỹỵỷ'
  //   const to = 'aaaaaaaaaaaaaaaaaeeeeeeeeeeeduuuuuuuuuuuoooooooooooooooooiiiiiaeiiouuncyyyyy'
  //   for (let i = 0, l = from.length; i < l; i++) {
  //     str = str.replace(RegExp(from[i], 'gi'), to[i])
  //   }
  //   return str
  //     .replace(/\s(.)/g, function ($1) { return $1.toUpperCase() })
  //     .replace(/\s/g, '')
  //     .replace(/^(.)/, function ($1) { return $1.toLowerCase() })
  // }

  return { decodeToken, encryptPassword, verifyToken, genToken, getMerchantInfoFromMST, uuidv4 }
}
module.exports = {
  dbSettings,
  serverHelper: serverHelper(),
  serverSettings,
  httpCode,
  customerUserServiceConfig,
  defaultResource
}
