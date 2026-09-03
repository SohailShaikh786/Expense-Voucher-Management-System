/**
 * Joi request validation middleware wrapper.
 * @param {import('joi').ObjectSchema} schema - Joi schema object
 * @param {'body' | 'query' | 'params'} source - request property to validate
 */
function validate(schema, source = 'body') {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[source], {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const formattedErrors = error.details.map((detail) => ({
        field: detail.path.join('.'),
        message: detail.message.replace(/['"]/g, '')
      }));

      return res.status(400).json({
        success: false,
        message: 'Validation failed. Please correct the highlighted errors.',
        errors: formattedErrors
      });
    }

    // Replace request payload with sanitized value
    req[source] = value;
    next();
  };
}

module.exports = validate;
