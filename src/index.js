require('dotenv').config()
const { initDI } = require('./di')
const { name } = require('../package.json')
const config = require('./config')
const logger = require('./logger')
const elasticApmAgent = require('elastic-apm-node')

elasticApmAgent.start({
  serviceName: process.env.npm_package_name,
  serverUrl: process.env.ELASTIC_APM_SERVER_URL,
  active: process.env.ELASTIC_APM_ENABLE_LOG_CORRELATION === 'true',
  environment: process.env.ELASTIC_APM_ENVIRONMENT
})
const middleware = require('./middleware')
const server = require('./server')
const models = require('./models')
const controller = require('./controller')
const { connect } = require('./database')
const repo = require('./repo')
const helper = require('./helper')
const EventEmitter = require('events').EventEmitter
const mediator = new EventEmitter()
const cacheController = require('./libs/cache').CacheFactory.getInstance()
logger.d(`${name} Service`)
mediator.once('di.ready', container => {
  console.log('di.ready, starting connect db ', config.dbSettings)
  container.registerValue('config', config)
  container.registerValue('middleware', middleware)
  container.registerValue('logger', logger)
  container.registerValue('mediator', mediator)
  container.registerValue('helper', helper(container))
  container.registerValue('cache', cacheController)
  mediator.once('db.ready', db => {
    logger.d('db.ready, starting server')
    container.registerValue('db', db)
    container.registerValue('models', models(container))
    const repository = repo.connect(container)
    container.registerValue('repo', repository)
    container.registerValue('controller', controller(container))
    container.registerValue('middleware', middleware(container))
    server.start(container).then(app => {
      logger.d('Server started at port ', app.address().port)
    })
  })
  connect(container, mediator)
})
initDI(mediator)
