import React, { useEffect } from "react";
import { TouchableOpacity, Image } from "react-native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import HomeStackNavigator from "./HomeStack";
import { CustomDrawerContent } from "./MainDrawer";

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
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={({ navigation }) => ({
        headerTitle: () => <LogoTitle navigation={navigation} />,
        headerStyle: { height: 130, backgroundColor: "#5d95e8" },
        headerBackTitleVisible: true,
        headerTintColor: "white",
      })}
    >
      <Drawer.Screen name="HomeStack" component={HomeStackNavigator} />
    </Drawer.Navigator>
  );
};

export default HomeDrawerNavigator;
