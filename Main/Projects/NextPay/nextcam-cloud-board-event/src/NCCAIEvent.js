const assert = require('assert');

class Meta {
  mask;
  glasses;
  age;
  faceName;
  faceId;
  numberId;
  faceTags;
  emotions;
  gender;
  detectedUrl;
  cameraId;
  cameraName;
  cameraFunction;
  brand;
  zoneName;
  zoneId;
  locationId;
  locationName;
  arrivedAt;

  constructor({
    mask,
    glasses,
    age,
    faceName,
    faceId,
    numberId,
    faceTags,
    emotions,
    gender,
    detectedUrl,
    cameraId,
    cameraName,
    cameraFunction,
    brand,
    zoneName,
    zoneId,
    locationId,
    locationName,
    arrivedAt, 
  }) {
    assert(mask === undefined || typeof mask === 'number')
    this.mask = mask

    assert(glasses === undefined || typeof glasses === 'number')
    this.glasses = glasses

    assert(age === undefined || typeof age === 'number')
    this.age = age

    assert(faceName === undefined || typeof faceName === 'string')
    this.faceName = faceName

    assert(faceId === undefined || typeof faceId === 'string')
    this.faceId = faceId

    assert(numberId === undefined || typeof numberId === 'number')
    this.numberId = numberId

    assert(faceTags === undefined || Array.isArray(faceTags))
    if (faceTags !== undefined) {
      for (const faceTag of faceTags) {
        assert(typeof faceTag === 'string')
      }
    }
    this.faceTags = faceTags

    assert(emotions === undefined || Array.isArray(emotions))
    if (emotions !== undefined) {
      for (const emotion of emotions) {
        assert(typeof emotion === 'string')
      }
    }
    this.emotions = emotions 
    
    assert(gender === undefined || typeof gender === 'number')
    this.gender = gender

    assert(detectedUrl === undefined || typeof detectedUrl === 'string')
    this.detectedUrl = detectedUrl

    assert(cameraId === undefined || typeof cameraId === 'string')
    this.cameraId = cameraId

    assert(cameraName === undefined || typeof cameraName === 'string')
    this.cameraName = cameraName

    assert(cameraFunction === undefined || typeof cameraFunction === 'string')
    this.cameraFunction = cameraFunction

    assert(brand === undefined || typeof brand === 'number')
    this.brand = brand

    assert(zoneName === undefined || typeof zoneName === 'string')
    this.zoneName = zoneName

    assert(zoneId === undefined || typeof zoneId === 'string')
    this.zoneId = zoneId

    assert(locationId === undefined || typeof locationId === 'string')
    this.locationId = locationId

    assert(locationName === undefined || typeof locationName === 'string')
    this.locationName = locationName

    assert(arrivedAt === undefined || typeof arrivedAt === 'number')
    this.arrivedAt = arrivedAt
  }
}

class NCCAIEvent {
  _id;
  id;
  resourceType;
  actionType;
  eventType;
  meta;
  time;
  merchantId;
  createdAt;

  constructor({
    _id,
    id,
    resourceType,
    actionType,
    eventType,
    meta,
    time,
    merchantId,
    createdAt,
  }) {
    assert(typeof _id === 'string')
    this._id = _id

    assert(typeof id === 'string')
    this.id = id

    assert(typeof resourceType === 'number' && resourceType === 1)
    this.resourceType = resourceType

    assert(typeof actionType === 'number')
    this.actionType = actionType

    assert(typeof eventType === 'number' && [0,1,2,3,4].includes(eventType))
    this.eventType = eventType

    assert(meta === undefined || typeof meta === 'object')
    if (meta !== undefined) {
      this.meta = new Meta(meta)
    }

    assert(typeof time === 'number')
    this.time = time

    assert(merchantId === undefined || typeof merchantId === 'string')
    this.merchantId = merchantId

    assert(typeof createdAt === 'number')
    this.createdAt = createdAt
  }
}

module.exports = {
  NCCAIEvent, Meta
}