const { Listener } = require('./listenerBoilerplate')
const { AIEventListenerConfig } = require('./config')

const listener = new Listener(
  {
    host: AIEventListenerConfig.rabbitHost,
    port: AIEventListenerConfig.rabbitPort,
    queueName: AIEventListenerConfig.rabbitQueueName,
    exchangeName: AIEventListenerConfig.rabbitExchange,
    exchangeType: AIEventListenerConfig.rabbitExchangeType
  },
  {
    maxRetryCount: 1
  }
)

const { processNCCCameraEvent } = require('./processNCCCameraEvent')

function startConsumingNCCCameraEvent () {
  // start consuming message
  listener.start({
    /**
     * @effects Receive message from NCC Queue and process it
     */
    // callback to process message payload (JSON), return True/False
    process: async (msg) => {
      console.log('==================================================')
      console.log('================== PROCESS AI EVENT ==============')
      console.log('==================================================')
      console.log('Receive message', msg)
      try {
        await processNCCCameraEvent(msg)
        return true
      } catch (e) {
        console.log(e.message)
        return false
      }
    },
    // callback to be executed when process message success
    resolve: async () => {
    },
    // callback to be executed when process message fail
    reject: async () => {
    },
    // callback to be executed when there is an error when processing message
    catch: async (error) => {
      console.log(error)
    },
    // callback to be executed before start consuming messages
    before: async () => {
      console.log('AI Event listener started !!!')
    }
  })
}

module.exports = {
  startConsumingNCCCameraEvent
}
