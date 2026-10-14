let counter = 0;

const buildChat = (overrides = {}) => {
  counter += 1;
  return {
    title: `Test Chat ${counter}`,
    ...overrides,
  };
};

module.exports = { buildChat };
