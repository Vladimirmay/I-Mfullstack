let counter = 0;

const buildMessage = (overrides = {}) => {
  counter += 1;
  return {
    text: `Test message ${counter}`,
    ...overrides,
  };
};

module.exports = { buildMessage };
