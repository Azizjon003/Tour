module.exports = (err, req, res, next) => {
  if ((process.env.NodeEnv = "Development")) {
    if (req.originalUrl.startsWith("/api")) {
      err.statusCode = err.statusCode || 404;
      err.status = err.status || "error";
      err.message = err.message;
      res.status(err.statusCode).json({
        status: err.status,
        statusCode: err.statusCode,
        message: err.message,
        infoError: err.stack,
      });
    } else {
      res.status(err.statusCode).render("error", {
        message: err.message,
      });
    }
  }
};
