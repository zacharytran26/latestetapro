import React from "react";
import { StatusBar, StyleSheet, View } from "react-native";
import { Layout } from "@ui-kitten/components";

import TimelineCalendarScreen from "./MySchedule";

//function HomeScreen() {
const HomeScreen = () => {
  return (
    <Layout style={styles.container}>
      <StatusBar style="dark-content" />
      <View style={styles.calendarContainer}>
        <TimelineCalendarScreen />
      </View>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  calendarContainer: {
    flex: 1,
  },
  bottomTabContainer: {
    height: 70, // Adjust this value to change the height of the bottom navigator
  },
});

export default HomeScreen;
