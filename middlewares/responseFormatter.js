const responseFormatter = (req, res, next) => {
  res.success = (message = "Success", additionalFields = {}) => {
    res.status(200).json({
      Result: "true",
      ResponseCode: "200",
      ResponseMsg: message,
      ...additionalFields,
    });
  };

  res.error = (message, statusCode = 500) => {
    res.status(statusCode).json({
      Result: "false",
      ResponseCode: statusCode.toString(),
      ResponseMsg: message,
    });
  };

  next();
};

module.exports = responseFormatter;