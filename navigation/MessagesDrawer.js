import React from "react";
import { TouchableOpacity, Image } from "react-native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import MessagesStackNavigator from "./MessagesStack";
import { CustomDrawerContentMsg } from "./MessageMainDrawer";

const Drawer = createDrawerNavigator();

export default function MessagesDrawerNavigator() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContentMsg {...props} />}
      screenOptions={({ navigation }) => ({
        headerTitle: () => <LogoTitle navigation={navigation} />,
        headerStyle: { height: 130, backgroundColor: "#5d95e8" },
        headerShown: true,
        headerTintColor: "white",
      })}
    >
      <Drawer.Screen name="MessageStack" component={MessagesStackNavigator} />
    </Drawer.Navigator>
  );
}

function LogoTitle({ navigation }) {
  return (
    <TouchableOpacity
      onPress={() =>
        navigation.reset({
          index: 0,
          routes: [{ name: "MessageStack", params: { screen: "Messages" } }],
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
