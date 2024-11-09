// middlewares/errorHandler.js

const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  res.status(statusCode).json({
    Result: "false",
    ResponseCode: statusCode.toString(),
    ResponseMsg: message,
  });
};

module.exports = errorHandler;
