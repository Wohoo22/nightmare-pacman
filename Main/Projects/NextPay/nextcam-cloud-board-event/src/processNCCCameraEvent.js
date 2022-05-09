const { NCCAIEvent } = require('./NCCAIEvent')
const { publishBoardEvent } = require('./boardEventPublisher')
const assert = require('assert')

/**
 * @effects receive an event and push it to BoardEvent Queue
 */
async function processNCCCameraEvent (event) {
  assert(typeof event === 'object')
  event = new NCCAIEvent(event)
  await publishBoardEvent(event)
}

module.exports = {
  processNCCCameraEvent
}