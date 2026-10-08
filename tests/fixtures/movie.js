let counter = 0;

const buildMovie = (overrides = {}) => {
  counter += 1;
  return {
    title: `Test Movie ${counter}`,
    year: 2000,
    ...overrides,
  };
};

module.exports = { buildMovie };
