const { BoardEventPublisherConfig } = require('./config')

let rabbitChannel

async function initRabbitChannel() {
  if (rabbitChannel !== undefined) {
    return
  }
  const rabbit = require('amqplib')

  const conn = await rabbit.connect(`amqp://${BoardEventPublisherConfig.rabbitHost}:${BoardEventPublisherConfig.rabbitPort}`)

  const channel = await conn.createChannel()
  await channel.assertExchange(BoardEventPublisherConfig.rabbitExchange, BoardEventPublisherConfig.rabbitExchangeType)
  await channel.assertQueue(BoardEventPublisherConfig.rabbitQueueName)
  await channel.bindQueue(BoardEventPublisherConfig.rabbitQueueName, BoardEventPublisherConfig.rabbitExchange)
  rabbitChannel = channel
}
/**
 * @effects Push event to Board Event Queue
 */
async function publishBoardEvent (event) {
  await initRabbitChannel();
  await rabbitChannel.sendToQueue(BoardEventPublisherConfig.rabbitQueueName, Buffer.from(JSON.stringify(event)));
}

module.exports = {
  publishBoardEvent
}