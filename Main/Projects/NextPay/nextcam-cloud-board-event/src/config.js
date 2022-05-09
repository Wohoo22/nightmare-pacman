const AIEventListenerConfig = {
  rabbitHost: process.env.AI_EVENT_RABBIT_HOST || 'localhost',
  rabbitPort: process.env.AI_EVENT_RABBIT_PORT || 5672,
  rabbitQueueName: process.env.AI_EVENT_QUEUE_NAME || 'EventStorage',
  rabbitExchange: process.env.AI_EVENT_QUEUE_EXCHANGE || 'Result',
  rabbitExchangeType: process.env.AI_EVENT_QUEUE_EXCHANGE_TYPE || 'fanout'
}

const BoardEventPublisherConfig = {
  rabbitHost: process.env.BOARD_EVENT_PUBLISHER_RABBIT_HOST || 'localhost',
  rabbitPort: process.env.BOARD_EVENT_PUBLISHER_RABBIT_PORT || 5672,
  rabbitQueueName: process.env.BOARD_EVENT_PUBLISHER_QUEUE_NAME || 'BoardEvent',
  rabbitExchange: process.env.BOARD_EVENT_PUBLISHER_QUEUE_EXCHANGE || 'Result',
  rabbitExchangeType: process.env.BOARD_EVENT_PUBLISHER_QUEUE_EXCHANGE_TYPE || 'fanout'
}

module.exports = {
  AIEventListenerConfig,
  BoardEventPublisherConfig
}