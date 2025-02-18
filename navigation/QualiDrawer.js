import React from "react";
import { TouchableOpacity, Image } from "react-native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import QualiStackNavigator from "./QualiStack";
import { CustomDrawerContentQuali } from "./QualiMainDrawer";

const Drawer = createDrawerNavigator();

export default function QualiDrawerNavigator() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContentQuali {...props} />}
      screenOptions={({ navigation }) => ({
        headerTitle: () => <LogoTitle navigation={navigation} />,
        headerStyle: { height: 130, backgroundColor: "#5d95e8" },
        headerBackTitleVisible: false,
        headerTintColor: "white",
      })}
    >
      <Drawer.Screen name="QualiStack" component={QualiStackNavigator} />
    </Drawer.Navigator>
  );
}

function LogoTitle({ navigation }) {
  return (
    <TouchableOpacity
      onPress={() =>
        navigation.reset({
          index: 0,
          routes: [{ name: "QualiStack", params: { screen: "Quali" } }],
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
