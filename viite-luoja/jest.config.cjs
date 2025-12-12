module.exports = {
  testEnvironment: "node",
  transform: {},
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  testMatch: ['**/__tests__/**/*.js', '**/?(*.)+(test).js'],
  testPathIgnorePatterns: ["tietokanta_operaatiot.test.js"],
};
