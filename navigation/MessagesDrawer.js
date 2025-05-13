import React from "react";
import { TouchableOpacity, Image } from "react-native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import MessagesStackNavigator from "./MessagesStack";
import { CustomDrawerContentMsg } from "./MessageMainDrawer";
import { useOrientation, LogoTitle} from "../screens/ExtraImports";

const Drawer = createDrawerNavigator();

export default function MessagesDrawerNavigator() {
  const isPortrait = useOrientation();
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContentMsg {...props} />}
      screenOptions={({ navigation }) => ({
        headerTitle: () => <LogoTitle routeName="MessageStack" screenName="Messages" />,
        headerStyle: { height: isPortrait ? 130 : 80, backgroundColor: "#5d95e8" },
        headerShown: true,
        headerTintColor: "white",
      })}
    >
      <Drawer.Screen name="MessageStack" component={MessagesStackNavigator} />
    </Drawer.Navigator>
  );
}
