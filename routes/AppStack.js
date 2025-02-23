import React, { useState } from "react";
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";

import { IconRegistry, useTheme } from "@ui-kitten/components";

import { EvaIconsPack } from "@ui-kitten/eva-icons";
import HomeScreenTabs from "../navigation/MainBottomNav";

export default function AppContent() {
  const theme = useTheme();

  return (
    <>
      <IconRegistry icons={EvaIconsPack} />
      <StatusBar />
      <HomeScreenTabs />
    </>
  );
}
