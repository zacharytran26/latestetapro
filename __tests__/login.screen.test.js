import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import LoginScreen from '../screens/LoginScreen';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ApplicationProvider } from '@ui-kitten/components';
import * as eva from '@eva-design/eva';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Extend matchers
import '@testing-library/jest-native/extend-expect';

jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual('@react-navigation/native');
  return {
    ...actualNav,
    useNavigation: jest.fn(),
    useRoute: jest.fn(),
  };
});

describe('Login Screen', () => {
  it('navigates to LoginSSO if SSO login is required', async () => {
    const mockedNavigate = jest.fn();
    useNavigation.mockReturnValue({ navigate: mockedNavigate });
    useRoute.mockReturnValue({ params: {} });

    // Set terms as accepted
    await AsyncStorage.setItem('termsAcknowledged', 'true');

    // ✅ Mock fetch to simulate SSO login response
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve({
            ssologin: '1',
            validated: '0',
          }),
      })
    );

    const { getByTestId, getByPlaceholderText, findByTestId } = render(
      <ApplicationProvider {...eva} theme={eva.light}>
        <LoginScreen />
      </ApplicationProvider>
    );

    // ✅ Fill required inputs
    fireEvent.changeText(getByPlaceholderText('Enter your access code'), '12SSO456789');
    fireEvent.changeText(getByPlaceholderText('Enter your username'), 'testuser');
    fireEvent.changeText(getByPlaceholderText('Enter your password'), 'password123');

    // ✅ Wait for button to be enabled
    const loginButton = await findByTestId('loginButton');
    await waitFor(() => expect(loginButton).toBeEnabled());

    // ✅ Press login
    fireEvent.press(loginButton);

    // ✅ Wait for navigation to be called
    await waitFor(() =>
      expect(mockedNavigate).toHaveBeenCalledWith('LoginSSO', expect.anything())
    );
  });
});
