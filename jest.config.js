module.exports = {
  rootDir: process.cwd(),
  roots: ['<rootDir>/src'],
  cacheDirectory: '<rootDir>/jest-cache',
  moduleDirectories: ['node_modules', 'src'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
    '^.+\\.jsx?$': 'ts-jest',
  },
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|eot|otf|svg|ttf|woff|woff2|pdf|scss)$':
      '<rootDir>/scripts/jest/fileTransform.js',
    '^routes/(.*)': '<rootDir>/src/routes/$1'
  },
  testMatch: [
    '<rootDir>/src/**/*.test.ts?(x)',
    '<rootDir>/src/**/*.test.js?(x)',
  ],
  moduleFileExtensions: ['js', 'json', 'jsx', 'node', 'ts', 'tsx'],
  globals: {
    'ts-jest': {
      tsConfig: 'tsconfig.test.json',
    },
    EXPRESS_PAYMENT_BANNER_NOT_SHOW_EXPIRE: 15,
  },
  verbose: false
};
