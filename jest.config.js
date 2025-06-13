module.exports = {
  preset: 'react-native',
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
  },
  setupFilesAfterEnv: [
    '<rootDir>/setup-test.js',
  ],
  transformIgnorePatterns: [
    "node_modules/(?!(react-native" +
      "|@react-native" +
      "|@react-native-community" +        
      "|@ui-kitten" +
      "|@eva-design" + 
      "|@react-native-firebase" +
      "|@shopify" +
      "|react-native-vector-icons" +
      "|@react-navigation" +
      "|react-native-reanimated" +
      "|react-native-keyboard-aware-scroll-view" + 
      "|react-native-iphone-x-helper" + 
      "|react-native-webview" + 
      ")/)"
  ],
  setupFiles: [
    './node_modules/react-native-gesture-handler/jestSetup.js' 
  ],
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|webp|svg)$': '<rootDir>/__mocks__/fileMock.js',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
};
