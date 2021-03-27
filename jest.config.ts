
export default {
  roots:['<rootDir>/src/'],
  collectCoverageFrom: ['<rootDir>/src/**/*.ts'], // Cobertura de teste de arquivos
  coverageDirectory: "coverage",
  coverageProvider: "v8",
  testEnvironment: "node",
  transform: {
    '.+\\.ts$' : 'ts-jest'
  }
};
