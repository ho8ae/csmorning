// 유효성 검사 미들웨어
const validate = (schema) => {
    return (req, res, next) => {
      try {
        const { error } = schema.validate(req.body);
        if (error) {
          return res.status(400).json({
            success: false,
            error: {
              message: error.details[0].message,
              status: 400
            }
          });
        }
        next();
      } catch (err) {
        next(err);
      }
    };
  };
  
  module.exports = validate;