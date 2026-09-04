const validate = (requiredFields) => {
  return (req, res, next) => {
    const missingFields = requiredFields.filter((field) => !(field in req.body));

    if (missingFields.length > 0) {
      return res.status(400).send(`Не хватает полей: ${missingFields}`);
    }

    next();
  };
};

module.exports = validate;
