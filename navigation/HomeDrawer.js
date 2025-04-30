import React, { useEffect } from "react";
import { TouchableOpacity, Image } from "react-native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import HomeStackNavigator from "./HomeStack";
import { CustomDrawerContent } from "./MainDrawer";
import { useOrientation } from "../screens/ExtraImports";

function LogoTitle({ navigation }) {
  return (
    <TouchableOpacity
      onPress={() =>
        navigation.reset({
          index: 0,
          routes: [{ name: "HomeStack", params: { screen: "Home" } }],
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

const Drawer = createDrawerNavigator();

//export default function HomeDrawerNavigator({ navigation, route }) {
const HomeDrawerNavigator = ({ navigation, route }) => {
  const isPortrait = useOrientation();
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={({ navigation }) => ({
        headerTitle: () => <LogoTitle navigation={navigation} />,
        headerStyle: { height: isPortrait ? 130 : 80, backgroundColor: "#5d95e8" },
        headerBackTitleVisible: false,
        headerTintColor: "white",
      })}
    >
      <Drawer.Screen name="HomeStack" component={HomeStackNavigator} />
    </Drawer.Navigator>
  );
};

export default HomeDrawerNavigator;
