class CustomAPIError extends Error {
  constructor(message) {
    super(message)
    console.log(message);
  }
}

module.exports = CustomAPIError
