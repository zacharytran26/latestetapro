import React, { useEffect, useState, useRef } from "react";
import { Alert, Image, StyleSheet, View, Text } from "react-native";
import { useAuth } from "./ThemeContext";
import Animated, { useAnimatedStyle, useSharedValue, withTiming, Easing } from "react-native-reanimated";
import messaging from '@react-native-firebase/messaging';
import ReactNativeBiometrics from "react-native-biometrics";

export function handleFetchError(data, setAuthUser, setIsLoggedIn) {
  if (data.errcode === "-911") {
    Alert.alert(data.errmsg); // Show the error message
    setAuthUser(null); // Clear the authenticated user
    setIsLoggedIn(false); // Set the login status to false
    return true; // Indicate that the error was handled
  }
  return false; // No error to handle
}


export const Chevron = ({ progress }) => {
  const iconStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${progress.value * -180}deg` }],
  }));

  return (
    <Animated.View style={iconStyle}>
      <Image source={require('../assets/Chevron.png')} style={styles.chevron} />
    </Animated.View>
  );
};

export const Carousel = () => {
  const { authUser } = useAuth();

  const [currentIndex, setCurrentIndex] = useState(0);
  const opacity = useSharedValue(1);
  const intervalRef = useRef(null);
  const timeoutRef = useRef(null);
  const messages = [`${authUser.currentasof}`, `ops condition: ${authUser.opscond}`];

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      // Fade out first
      opacity.value = withTiming(0, { duration: 1000, easing: Easing.linear });

      // Wait for the fade-out animation to complete, then update index and fade in
      timeoutRef.current = setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % messages.length);
        opacity.value = withTiming(1, { duration: 1000, easing: Easing.linear });
      }, 1000); // Wait for fade-out to finish before updating index
    }, 3000);

    return () => {
      clearInterval(intervalRef.current);
      clearTimeout(timeoutRef.current);
    };
  }, [opacity]); // Dependency on opacity ensures animations are controlled

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <View style={styles.carouselContainer}>
      <Animated.Text style={[styles.carouselText, animatedStyle]}>
        {messages[currentIndex]}
      </Animated.Text>
    </View>
  );
};

export const handleForegroundNotification = messaging().onMessage((message) => {
  Alert.alert(message.notification.title, message.notification.body,
    message.notification.body);
});

export const handleBackgroundNotification = messaging().setBackgroundMessageHandler((message) => {
  Alert.alert(message.notification.title, message.notification.body);
  return Promise.resolve();
});

// Biometric Authentication Setup
const rnBioMetrics = new ReactNativeBiometrics();

export const handleBiometricAuth = async () => {
  const { available, biometryType } = await rnBioMetrics.isSensorAvailable();
  if (available) {
    const result = await rnBioMetrics.simplePrompt({
      promptMessage: `Authenticate with ${biometryType}`,
    });

    if (result.success) {
      console.log('Biometric Authentication Successful');
      return true;
    } else {
      console.log('Biometric Authentication Failed or Cancelled');
      return false;
    }
  } else {
    console.log('Biometric Authentication Not Available');
    return false;
  }
};

// Check if Biometrics is Available
export const checkBiometricsAvailability = async () => {
  try {
    const { available, biometryType } = await rnBioMetrics.isSensorAvailable();
    if (available) {
      console.log(`${biometryType} is supported`);
      return true;
    } else {
      console.log('Biometrics not supported');
      return false;
    }
  } catch (error) {
    console.log('Error checking biometric availability:', error);
    return false;
  }
};

// Create Key Pair for Secure Authentication
export const createBiometricKey = async () => {
  try {
    const { publicKey } = await rnBioMetrics.createKeys();
    console.log('Biometric Keys Created:', publicKey);
    return publicKey;
  } catch (error) {
    console.log('Failed to create biometric keys:', error);
    return null;
  }
};

// Check if Biometric Keys Exist
export const areBiometricKeysExist = async () => {
  try {
    const { keysExist } = await rnBioMetrics.biometricKeysExist();
    console.log(keysExist ? 'Biometric keys exist' : 'Biometric keys do not exist');
    return keysExist;
  } catch (error) {
    console.log('Error checking biometric keys:', error);
    return false;
  }
};

// Delete Biometric Keys
export const deleteBiometricKeys = async () => {
  try {
    const { keysDeleted } = await rnBioMetrics.deleteKeys();
    console.log(keysDeleted ? 'Biometric keys deleted' : 'Biometric keys not deleted');
    return keysDeleted;
  } catch (error) {
    console.log('Error deleting biometric keys:', error);
    return false;
  }
};

// Create Biometric Signature
export const createBiometricSignature = async () => {
  try {
    const { success, signature } = await rnBioMetrics.createSignature({
      promptMessage: 'Sign in',
      payload: 'some payload',
    });
    if (success) {
      console.log('Biometric Signature Created:', signature);
      return signature;
    } else {
      console.log('Failed to create biometric signature');
      return null;
    }
  } catch (error) {
    console.log('Error creating biometric signature:', error);
    return null;
  }
};

// Verify Biometric Signature
export const verifyBiometricSignature = async (signature) => {
  try {
    const { success } = await rnBioMetrics.verifySignature({
      signature: signature,
      payload: 'some payload',
    });
    console.log(success ? 'Biometric Signature Verified' : 'Failed to verify biometric signature');
    return success;
  } catch (error) {
    console.log('Error verifying biometric signature:', error);
    return false;
  }
};


const styles = StyleSheet.create({
  chevron: {
    width: 24,
    height: 24,
  },
  carouselContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  carouselText: {
    fontSize: 11,
    color: "#333",
  },
});