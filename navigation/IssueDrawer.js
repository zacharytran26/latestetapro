import React from "react";
import { TouchableOpacity, Image } from "react-native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import IssueStackNavigator from "./IssueStack";
import { CustomDrawerContentIssue } from "./IssueMainDrawer";
import { useOrientation } from "../screens/ExtraImports";


const Drawer = createDrawerNavigator();

export default function IssueDrawerNavigator() {
  const isPortrait = useOrientation();
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContentIssue {...props} />}
      screenOptions={({ navigation }) => ({
        headerTitle: () => <LogoTitle navigation={navigation} />,
        headerStyle: { height: isPortrait ? 130 : 80, backgroundColor: "#5d95e8" },
        headerBackTitleVisible: false,
        headerTintColor: "white",
      })}
    >
      <Drawer.Screen name="IssueStack" component={IssueStackNavigator} />
    </Drawer.Navigator>
  );
}

function LogoTitle({ navigation }) {
  return (
    <TouchableOpacity
      onPress={() =>
        navigation.reset({
          index: 0,
          routes: [{ name: "IssueStack", params: { screen: "Issues" } }],
        })
      }
    >
      <Image
        style={{ width: 150, height: 50 }}
        source={require("../assets/logo-transparent.png")}
      />
    </TouchableOpacity>
  );
}
