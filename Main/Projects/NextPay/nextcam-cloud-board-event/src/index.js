/**
 * @overview A project that receive Camera Event from NCC Queue 
 * and push to Board Event Queue (to display on the board)
 */

const { startConsumingNCCCameraEvent } = require('./NCCAIEventListener');
(async () => {
  await startConsumingNCCCameraEvent()
})()