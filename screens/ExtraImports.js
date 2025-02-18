import React from "react";
import { Alert,Image, StyleSheet} from "react-native";
import { useAuth } from "./ThemeContext";
import Animated, { useAnimatedStyle} from 'react-native-reanimated';

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


const styles = StyleSheet.create({
  chevron: {
    width: 24,
    height: 24,
  },
});