import React, { useEffect } from "react";
import { TouchableOpacity, Image } from "react-native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import HomeStackNavigator from "./HomeStack";
import { CustomDrawerContent } from "./MainDrawer";
import { useOrientation, LogoTitle} from "../screens/ExtraImports";


const Drawer = createDrawerNavigator();

//export default function HomeDrawerNavigator({ navigation, route }) {
const HomeDrawerNavigator = ({ navigation, route }) => {
  const isPortrait = useOrientation();
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={({ navigation }) => ({
        headerTitle: () => <LogoTitle routeName="HomeStack" screenName="Home" />,
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
