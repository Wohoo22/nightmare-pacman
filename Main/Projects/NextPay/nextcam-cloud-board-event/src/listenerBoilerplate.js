/*
This listener boilerplate supports:
+ Retry when procecss message fail
+ Detect time out when process a message
+ Guarantee max number of messages being processed at a time
*/
class Listener {
  constructor (rabbitConfig = {
    host: '',
    port: '',
    queueName: '',
    exchangeName: '',
    exchangeType: ''
  }, options = {
    maxRetryCount: 0
  }) {
    // rabbit configurations
    this._rabbitConfig = rabbitConfig
    this._options = options

    // configurations to handle too much message coming
    // {QoS} should be greater than {processingThreshold}
    this._QoS = +process.env.RABBIT_QOS || 30
    this._processingThreshold = this._QoS - 1

    // configurations to handle timeout
    this._timeoutThresholdInMillis = 1200000 // 12 minutes
    this._delayTimeBeforeTerminateInMillis = 300000 // 5 minutes

    // [DO_NOT_MODIFY] properties to handle timeout
    this._timeoutCheckerList = []
    this._consumerCancelled = false

    // max value for counter variables
    this._maxCountValue = 1000000

    // [DO_NOT_MODIFY] counter variables
    this._receivedCount = 0
    this._processedCount = 0
    this._ackSentCount = 0
  }

  /*
    Start consuming message from queue
    @param {process} callback function to process message
    @param {resolve} callback function to execute when process message success
    @param {reject} callback function to execute when process message fail or raise exception
    @param {catch} callback function to execute when process message callback raise exception
    @param {before} callback function to execute before start consuming messages
  */
  async start (consumerObject = {
    process: () => {},
    resolve: () => {},
    reject: () => {},
    catch: () => {},
    before: () => {}
  }) {
    const rabbit = require('amqplib')
    const conn = await rabbit.connect(`amqp://${this._rabbitConfig.host}:${this._rabbitConfig.port}`)
    const channel = await conn.createChannel()
    await channel.prefetch(this._QoS)
    await channel.assertExchange(this._rabbitConfig.exchangeName, this._rabbitConfig.exchangeType)
    await channel.assertQueue(this._rabbitConfig.queueName)
    await channel.bindQueue(this._rabbitConfig.queueName, this._rabbitConfig.exchangeName)
    this._channel = channel
    try {
      // callback before start listening
      // CAN_RAISE_EXCEPTION
      await consumerObject.before()
    } catch (e) { console.log('callback before() raises an error', e.message) }
    channel.consume(this._rabbitConfig.queueName, async (msg) => {
      // Only process message in JSON format
      try {
        JSON.parse(msg.content.toString())
      } catch (e) {
        await channel.ack(msg)
        return
      }

      this._reduceCounterVariablesIfNeeded()
      this._consumerTag = msg.fields.consumerTag
      this._receivedCount++
      const timeoutCheckerId = this._createTimeoutChecker()

      // [STEP 1] send ACK when processing count < processing threshold
      this._ack(msg, this)

      // CAN_RAISE_EXCEPTION
      const msgPayload = JSON.parse(msg.content.toString())

      const lstRetry = msgPayload.retryCount || 0
      delete msgPayload.retryCount

      // [STEP 2] process message and get result
      let processResult = false
      try {
        // callback to process message
        // CAN_RAISE_EXCEPTION
        processResult = await consumerObject.process(msgPayload)
      } catch (e) {
        processResult = false
        try {
          // callback when error
          // CAN_RAISE_EXCEPTION
          await consumerObject.catch(e, msgPayload)
        } catch (e) { console.log('callback catch() raises an error', e.message) }
      }

      // [STEP 3] requeue message (retry) if needed
      if (processResult) {
        try {
          // callback when process success
          // CAN_RAISE_EXCEPTION
          await consumerObject.resolve(msgPayload)
        } catch (e) { console.log('callback resolve() raises an error', e.message) }
      } else {
        msgPayload.retryCount = lstRetry + 1
        if (msgPayload.retryCount <= this._options.maxRetryCount) {
          await this._sendMessageToQueue(msgPayload, this)
        }
        try {
          // callback when process fail
          // CAN_RAISE_EXCEPTION
          await consumerObject.reject(msgPayload)
        } catch (e) { console.log('callback reject() raises an error', e.message) }
      }

      this._removeTimeoutChecker(timeoutCheckerId)
      this._processedCount++
    })
  }

  _reduceCounterVariablesIfNeeded () {
    const mn = Math.min(this._receivedCount, Math.min(this._processedCount, this._ackSentCount))
    if (this._receivedCount > this._maxCountValue ||
      this._processedCount > this._maxCountValue ||
      this._ackSentCount > this._maxCountValue) {
      this._receivedCount -= mn
      this._processedCount -= mn
      this._ackSentCount -= mn
    }
  }

  // cannot call "this" in setTimeout callback
  // so {thisListener} is alternative to "this"
  async _ack (msg, thisListener) {
    const processingCount = thisListener._getProcessingCount(thisListener)
    if (processingCount < thisListener._processingThreshold || thisListener._timeoutOccurred()) {
      try {
        // CAN_RAISE_EXCEPTION
        await thisListener._channel.ack(msg)
      } catch (e) {
        setTimeout(async function () {
          await thisListener._ack(msg, thisListener)
        }, 100)
        return
      }
      this._ackSentCount++
    } else {
      setTimeout(async function () {
        await thisListener._ack(msg, thisListener)
      }, 100)
    }
    /*
    Once timeout occurs:
    - Stop receiving messages
    - Send all remaining ACKs
    - Terminate process
    */
    if (thisListener._timeoutOccurred() && !thisListener._consumerCancelled) {
      thisListener._consumerCancelled = true
      thisListener._cancelChannel(thisListener)
      setTimeout(async function () {
        await thisListener._terminateProcess(thisListener)
      }, thisListener._delayTimeBeforeTerminateInMillis)
    }
  }

  async _cancelChannel (thisListener) {
    try {
      // CAN_RAISE_EXCEPTION
      thisListener._channel.cancel(thisListener._consumerTag)
    } catch (e) {
      setTimeout(async function () {
        await thisListener._cancelChannel(thisListener)
      }, 100)
    }
  }

  async _sendMessageToQueue (msgPayload, thisListener) {
    try {
      // CAN_RAISE_EXCEPTION
      await thisListener._channel.sendToQueue(thisListener._rabbitConfig.queueName, Buffer.from(JSON.stringify(msgPayload)))
    } catch (e) {
      setTimeout(async function () {
        await thisListener._sendMessageToQueue(msgPayload, thisListener)
      }, 100)
    }
  }

  // utils

  async _terminateProcess (thisListener) {
    /*
    Terminate process only when all remaining ACKs have been sent
    */
    if (thisListener._ackSentCount === thisListener._receivedCount) {
      console.log('[LISTENER] Timeout occured, terminating process.')
      process.exit(1)
    } else {
      setTimeout(async function () {
        await thisListener._terminateProcess(thisListener)
      }, 100)
    }
  }

  _getProcessingCount (thisListener) {
    return thisListener._receivedCount - thisListener._processedCount
  }

  _uuid () {
    var dt = new Date().getTime()
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = (dt + Math.random() * 16) % 16 | 0
      dt = Math.floor(dt / 16)
      return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16)
    })
    return uuid
  }

  _createTimeoutChecker () {
    const timeoutChecker = {
      id: this._uuid(),
      startProcessingTime: Date.now()
    }
    this._timeoutCheckerList.push(timeoutChecker)
    return timeoutChecker.id
  }

  _removeTimeoutChecker (id) {
    let index = 0
    for (const timeoutChecker of this._timeoutCheckerList) {
      if (timeoutChecker.id === id) {
        this._timeoutCheckerList.splice(index, 1)
        return
      }
      index++
    }
  }

  _timeoutOccurred () {
    const curMillis = Date.now()
    for (const timeoutChecker of this._timeoutCheckerList) {
      const processingTime = curMillis - timeoutChecker.startProcessingTime
      if (processingTime > this._timeoutThresholdInMillis) {
        return true
      }
    }
    return false
  }
}

module.exports = {
  Listener
}
