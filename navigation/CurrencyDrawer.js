import React from "react";
import { TouchableOpacity, Image } from "react-native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import CurrencyStackNavigator from "./CurrencyStack";
import { CustomDrawerContentCurrency } from "./CurrencyMainDrawer";
import { useOrientation } from "../screens/ExtraImports";

const Drawer = createDrawerNavigator();



export default function CurrencyDrawerNavigator() {
  const isPortrait = useOrientation();
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContentCurrency {...props} />}
      screenOptions={({ navigation }) => ({
        headerTitle: () => <LogoTitle navigation={navigation} />,
        headerBackTitleVisible: false,
        headerTintColor: "white",
        headerStyle: { height: isPortrait ? 130 : 80, backgroundColor: "#5d95e8" },
      })}
    >
      <Drawer.Screen name="CurrencyStack" component={CurrencyStackNavigator} />
    </Drawer.Navigator>
  );
}

function LogoTitle({ navigation }) {
  return (
    <TouchableOpacity
      onPress={() =>
        navigation.reset({
          index: 0,
          routes: [{ name: "CurrencyStack", params: { screen: "Currency" } }],
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
