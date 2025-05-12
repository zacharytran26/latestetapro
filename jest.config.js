module.exports = {
  preset: 'react-native',
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
  },
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
      ")/)"
  ],
  setupFiles: [
    './__mocks__/react-native-gesture-handler.js' 
  ],
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|webp|svg)$': '<rootDir>/__mocks__/fileMock.js',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
};
