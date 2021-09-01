class Response {
    constructor ({success, code, message, data}) {
      this.success = success
      this.code = code
      this.message = message
      this.data = data
    } 
  }
  
  module.exports = {
    Response
  }
  