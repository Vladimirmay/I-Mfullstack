let counter = 0;

const buildUser = (overrides = {}) => {
  counter += 1;
  return {
    email: `user_${Date.now()}_${counter}@example.com`,
    username: `test-user-${counter}`,
    ...overrides,
  };
};

module.exports = { buildUser };
