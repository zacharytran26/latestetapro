import React from "react";
import { View, StyleSheet, Image } from "react-native";
import { useRoute } from "@react-navigation/native";

const DisplayImage = () => {
  const route = useRoute();
  const { imageUri } = route.params;

  return (
    <View style={styles.container}>
      <Image style={styles.image} source={{ uri: imageUri }} />
    </View>
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
