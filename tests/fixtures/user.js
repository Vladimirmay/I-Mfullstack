let counter = 0;

const buildUser = (overrides = {}) => {
  counter += 1;
  return {
    email: `user_${Date.now()}_${counter}@example.com`,
    password: "TestPassword123",
    username: `test-user-${counter}`,
    roles: ["user"],
    ...overrides,
  };
};

module.exports = { buildUser };
