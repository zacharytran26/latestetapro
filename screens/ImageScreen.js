import React from 'react';
import { StyleSheet } from 'react-native';
import {
  GestureHandlerRootView,
  Gesture,
  GestureDetector,
} from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedGestureHandler,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';

const DisplayImage = () => {
  const route = useRoute();
  const { imageUri } = route.params;
  const scale = useSharedValue(1);
  const focalScale = useSharedValue(1);
  const savedScale = useSharedValue(1);

  const translationX = useSharedValue(0);
  const translationY = useSharedValue(0);
  const savedTranslationX = useSharedValue(0);
  const savedTranslationY = useSharedValue(0);
  const pinch = Gesture.Pinch()
  .onUpdate((e) => {
    scale.value = savedScale.value * e.scale;
  })
  .onEnd(() => {
    if (scale.value < 1) {
      scale.value = withTiming(1);
      savedScale.value = 1;
      translationX.value = withTiming(0);
      translationY.value = withTiming(0);
      savedTranslationX.value = 0;
      savedTranslationY.value = 0;
    } else {
      savedScale.value = scale.value;
    }
  });

const pan = Gesture.Pan()
  .onUpdate((e) => {
    translationX.value = savedTranslationX.value + e.translationX;
    translationY.value = savedTranslationY.value + e.translationY;
  })
  .onEnd(() => {
    savedTranslationX.value = translationX.value;
    savedTranslationY.value = translationY.value;
  });

const composed = Gesture.Simultaneous(pan, pinch);

const animatedStyle = useAnimatedStyle(() => ({
  transform: [
    { scale: scale.value },
    { translateX: translationX.value },
    { translateY: translationY.value },
  ],
}));

  return (
    <GestureHandlerRootView style={styles.container}>
    <GestureDetector gesture={composed}>
      <Animated.Image
        source={{ uri: imageUri }}
        style={[styles.image, animatedStyle]}
        resizeMode="contain"
      />
    </GestureDetector>
  </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F7F9FC",
  },
  image: {
    width: "75%",
    height: "75%",
    resizeMode: "contain",
  },
});

export default DisplayImage;
