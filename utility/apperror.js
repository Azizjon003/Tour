class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = statusCode === 404 ? "falil" : "Error";
  }
}

module.exports = AppError;
