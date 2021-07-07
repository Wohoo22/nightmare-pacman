const request = require("request-promise");
module.exports = (container) => {
  const { customerUserServiceConfig, httpCode, defaultResource } =
    container.resolve("config");
  const logger = container.resolve("logger");
  const accessToken = customerUserServiceConfig.customerUserToken;
  const addUser = async (body) => {
    try {
      const options = {
        headers: { "be-token": accessToken },
        uri: `${customerUserServiceConfig.url}/customerUser`,
        json: true,
        method: "POST",
        body,
      };
      const data = await request(options);
      return { statusCode: 200, data };
    } catch (e) {
      const { name, statusCode, error } = e;
      if (name === "StatusCodeError") {
        return { data: error, statusCode, msg: (error || {}).msg || "" };
      }
      logger.e(e);
      return { statusCode: httpCode.BAD_REQUEST, msg: "" };
    }
  };
  const updateUser = async (_id, body) => {
    try {
      const options = {
        headers: { "be-token": accessToken },
        uri: `${customerUserServiceConfig.url}/customerUser/${_id}`,
        json: true,
        method: "PUT",
        body,
      };
      const data = await request(options);
      return { statusCode: 200, data };
    } catch (e) {
      const { name, statusCode, error } = e;
      if (name === "StatusCodeError") {
        return { data: error, statusCode, msg: (error || {}).msg || "" };
      }
      logger.e(e);
      return { statusCode: httpCode.BAD_REQUEST, msg: "" };
    }
  };
  const getUserById = async (_id) => {
    try {
      const options = {
        headers: { "be-token": accessToken },
        uri: `${customerUserServiceConfig.url}/customerUser/${_id}`,
        json: true,
        method: "GET",
      };
      const data = await request(options);
      return { statusCode: 200, data };
    } catch (e) {
      const { name, statusCode, error } = e;
      if (name === "StatusCodeError") {
        return { data: error, statusCode, msg: (error || {}).msg || "" };
      }
      logger.e(e);
      return { statusCode: httpCode.BAD_REQUEST, msg: "" };
    }
  };
  const deleteUserById = async (_id) => {
    try {
      const options = {
        headers: { "be-token": accessToken },
        uri: `${customerUserServiceConfig.url}/customerUser/${_id}`,
        json: true,
        method: "DELETE",
      };
      const data = await request(options);
      return { statusCode: 200, data };
    } catch (e) {
      const { name, statusCode, error } = e;
      if (name === "StatusCodeError") {
        return { data: error, statusCode, msg: (error || {}).msg || "" };
      }
      logger.e(e);
      return { statusCode: httpCode.BAD_REQUEST, msg: "" };
    }
  };
  const getUser = async (qs) => {
    try {
      const options = {
        headers: { "be-token": accessToken },
        uri: `${customerUserServiceConfig.url}/customerUser`,
        json: true,
        method: "GET",
        qs,
      };
      const data = await request(options);
      return { statusCode: 200, data };
    } catch (e) {
      const { name, statusCode, error } = e;
      if (name === "StatusCodeError") {
        return { data: error, statusCode, msg: (error || {}).msg || "" };
      }
      logger.e(e);
      return { statusCode: httpCode.BAD_REQUEST, msg: "" };
    }
  };
  const addResources = async (merchantId) => {
    try {
      const options = {
        headers: { "be-token": accessToken },
        uri: `${customerUserServiceConfig.url}/addResource`,
        json: true,
        method: "POST",
        body: {
          merchantId,
          resources: defaultResource,
        },
      };
      const data = await request(options);
      return { statusCode: 200, data };
    } catch (e) {
      const { name, statusCode, error } = e;
      if (name === "StatusCodeError") {
        return { data: error, statusCode, msg: (error || {}).msg || "" };
      }
      logger.e(e);
      return { statusCode: httpCode.BAD_REQUEST, msg: "" };
    }
  };
  // gọi sang customer backend tạo schedule, shift mặc đinh
  const addShiftDefaultByMerchantId = async (merchantId) => {
    try {
      const allSchedule = [
        {
          dddd: "T2",
          end_time: "18:00:00",
          start_time: "08:30:00",
          end_time_number: 64800000,
          start_time_number: 30600000,
          isDefault: 1,
          type: 0,
          merchantId
        },
        {
          dddd: "T3",
          end_time: "18:00:00",
          start_time: "08:30:00",
          end_time_number: 64800000,
          start_time_number: 30600000,
          isDefault: 1,
          type: 0,
          merchantId
        },
        {
          dddd: "T4",
          end_time: "18:00:00",
          start_time: "08:30:00",
          end_time_number: 64800000,
          start_time_number: 30600000,
          isDefault: 1,
          type: 0,
          merchantId
        },
        {
          dddd: "T5",
          end_time: "18:00:00",
          start_time: "08:30:00",
          end_time_number: 64800000,
          start_time_number: 30600000,
          isDefault: 1,
          type: 0,
          merchantId
        },
        {
          dddd: "T6",
          end_time: "18:00:00",
          start_time: "08:30:00",
          end_time_number: 64800000,
          start_time_number: 30600000,
          isDefault: 1,
          type: 0,
          merchantId
        },
      ];

      const result = await Promise.all(
        allSchedule.map((i) => {
          const options = {
            headers: { "be-token": accessToken },
            uri: `${customerUserServiceConfig.customerBackenUrl}/share/schedule`,
            json: true,
            method: "POST",
            body: i,
          };
          return request(options);
        })
      );
      const schedules = result.map((i) => i.data._id);

      const options = {
        headers: { "be-token": accessToken },
        uri: `${customerUserServiceConfig.customerBackenUrl}/share/shift`,
        json: true,
        method: "POST",
        body: {
          name: "Ca mặc định",
          merchantId,
          isDefault: 1,
          schedules
        },
      };
      const data = await request(options);
      return { statusCode: 200, data };
    } catch (e) {
      const { name, statusCode, error } = e;
      if (name === "StatusCodeError") {
        return { data: error, statusCode, msg: (error || {}).msg || "" };
      }
      logger.e(e);
      return { statusCode: httpCode.BAD_REQUEST, msg: "" };
    }
  };
  const sendToCustomerAuth = async (opt, url) => {
    try {
      const options = {
        ...opt,
        headers: { "be-token": accessToken },
        uri: `${customerUserServiceConfig.url}/default${url}`,
        json: true,
      };
      const data = await request(options);
      return { statusCode: 200, data };
    } catch (e) {
      const { name, statusCode, error } = e;
      if (name === "StatusCodeError") {
        return { data: error, statusCode, msg: (error || {}).msg || "" };
      }
      logger.e(e);
      return { statusCode: httpCode.BAD_REQUEST, msg: "" };
    }
  };
  const sendToCustomerBackend = async (opt, url) => {
    try {
      const options = {
        ...opt,
        headers: { "be-token": accessToken },
        uri: `${customerUserServiceConfig.customerBackenUrl}/share${url}`,
        json: true,
      };
      const data = await request(options);
      return { statusCode: 200, data };
    } catch (e) {
      const { name, statusCode, error } = e;
      if (name === "StatusCodeError") {
        return { data: error, statusCode, msg: (error || {}).msg || "" };
      }
      logger.e(e);
      return { statusCode: httpCode.BAD_REQUEST, msg: "" };
    }
  };
  const getDashboard = async () => {
    try {
      const options = {
        headers: { "be-token": accessToken },
        uri: `${customerUserServiceConfig.customerBackenUrl}/share/dashboard`,
        json: true,
        method: "GET",
      };
      const data = await request(options);
      return { statusCode: 200, data };
    } catch (e) {
      const { name, statusCode, error } = e;
      if (name === "StatusCodeError") {
        return { data: error, statusCode, msg: (error || {}).msg || "" };
      }
      logger.e(e);
      return { statusCode: httpCode.BAD_REQUEST, msg: "" };
    }
  };
  return {
    addUser,
    updateUser,
    getUser,
    getUserById,
    deleteUserById,
    addResources,
    sendToCustomerBackend,
    sendToCustomerAuth,
    getDashboard,
    addShiftDefaultByMerchantId
  };
};
