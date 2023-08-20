import ResponseError from "../error/error.response.js";

const errorMiddleware = async (err, req, res, next) => {
  if (!err) return next();
  if (err instanceof ResponseError) {
    res
      .status(err.status)
      .json({
        error: err.message
      })
      .end();
  } else {
    res
      .status(500)
      .json({
        error: err.message
      })
      .end();
  }
};

export default errorMiddleware;
