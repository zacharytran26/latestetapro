import React, { useEffect, useState, useRef } from "react";
import { Alert, Image, StyleSheet, View, Text, Dimensions} from "react-native";
import { useAuth } from "./ThemeContext";
import Animated, { useAnimatedStyle, useSharedValue, withTiming, Easing } from "react-native-reanimated";
import messaging from '@react-native-firebase/messaging';

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
  Alert.alert(message.notification.title, message.notification.body);
});

export const handleBackgroundNotification = messaging().setBackgroundMessageHandler((message) => {
  Alert.alert(message.notification.title, message.notification.body);
  return Promise.resolve();
});

export function useOrientation() {
  const [isPortrait, setIsPortrait] = useState(true);

  useEffect(() => {
    const updateOrientation = () => {
      const { width, height } = Dimensions.get('window');
      setIsPortrait(height >= width); // Portrait if height >= width
    };

    const subscription = Dimensions.addEventListener('change', updateOrientation);

    updateOrientation(); // Set initially when component loads

    return () => subscription?.remove(); // Cleanup on unmount
  }, []);

  return isPortrait;
}

export const EtaAlert = (title, msg, textAlert, customstr, onOkPress, onCancelPress) => {
  const buttons = [];

  if (customstr.includes("okay")) {
    buttons.push({ text: textAlert, onPress: onOkPress });
  }

  if (customstr.includes("cancel")) {
    buttons.push({ text: "Cancel", onPress: onCancelPress, style: "cancel" });
  }
  if(customstr === ""){
    Alert.alert(title, msg);
  }else{
    Alert.alert(title, msg, buttons);
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