module.exports = {
  collectCoverage: true,
  transform: {
    "^.+.vue$": "vue-jest",
    ".+.(css|styl|less|sass|scss|svg|png|jpg|ttf|woff|woff2)$":
      "jest-transform-stub",
    "^.+.tsx?$": "ts-jest",
    "^.+.(js|jsx)?$": "babel-jest"
  },
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1"
  }
};
