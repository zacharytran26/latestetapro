// setup-test.js
import '@testing-library/jest-native/extend-expect';

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

jest.mock('react-native-reanimated', () =>
  require('react-native-reanimated/mock')
);
jest.mock('react-native-webview', () => ({
  WebView: () => null,
}));
jest.mock('@react-native-firebase/messaging', () => {
  return () => ({
    getToken: jest.fn(() => Promise.resolve('mock-token')),
    onMessage: jest.fn(() => () => {}),
    setBackgroundMessageHandler: jest.fn(),
    onNotificationOpenedApp: jest.fn(() => Promise.resolve()),
    getInitialNotification: jest.fn(() => Promise.resolve()),
  });
});


// Remove the following if using RN >= 0.73 or not needed
// jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');
