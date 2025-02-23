import React, { useEffect } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";

// Import your screens
import CurrencyScreen from "../screens/Currencies";
import StudentsScreen from "../screens/StudentScreen";
import InstructorsScreen from "../screens/InstructorScreen";
import InstructorList from "../screens/InstructorDetailScreen";
import StudentList from "../screens/StudentDetailScreen";
import HomeScreen from "../screens/HomeScreen";
import LogoutScreen from "../screens/Logout";
import StudentCourse from "../screens/StudentCourseScreen";
import StudentMap from "../screens/StudentMap";
import StudentMapDetails from "../screens/StudentMapsDetail";
import LineItem from "../screens/LineItems";
import Approve from "../screens/ApprovalScreen";
import Times from "../screens/TimesScreen";
import DisplayImage from "../screens/QualiScreens/ImageScreen";
import InstructorActivity from "../screens/InstructorActivity";
import ApproveActivity from "../screens/ActivityApproval";
import ConfirmFIF from "../screens/ConfirmationFIF";
import MainDrawer from "./MainDrawer";
import RequestScreen from "../screens/RequestScreen";
import RequestStudent from "../screens/RequestStudent";
import RequestConfirmS from "../screens/RequestConfirm";
import RequestSecondStudent from "../screens/RequestSecond";

const Stack = createNativeStackNavigator();

function LogoTitle({ navigation }) {
  return (
    <TouchableOpacity
      onPress={() =>
        navigation.reset({
          index: 0,
          routes: [{ name: "Drawer" }],
        })
      }
    >
      <Image
        style={{ width: 150, height: 50 }}
        source={require("../assets/logo.png")}
      />
    </TouchableOpacity>
  );
}

export default function StackScreens({ route, navigation }) {
  return (
    <Stack.Navigator
      screenOptions={({ navigation }) => ({
        headerTitle: () => <LogoTitle navigation={navigation} />,
        headerStyle: {
          backgroundColor: "#f7f9fc",
          height: 20,
        },
      })}
    >
      <Stack.Screen
        name="Drawer"
        component={MainDrawer}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="sHome" component={HomeScreen} />
      <Stack.Screen name="InstructorScreen" component={InstructorsScreen} />
      <Stack.Screen name="CurrencyScreen" component={CurrencyScreen} />
      <Stack.Screen name="StudentScreen" component={StudentsScreen} />
      <Stack.Screen name="InstructorDetailScreen" component={InstructorList} />
      <Stack.Screen name="StudentDetailScreen" component={StudentList} />
      <Stack.Screen name="Logout" component={LogoutScreen} />
      <Stack.Screen name="StudentCourse" component={StudentCourse} />
      <Stack.Screen name="StudentMap" component={StudentMap} />
      <Stack.Screen name="StudentMapDetails" component={StudentMapDetails} />
      <Stack.Screen name="LineItem" component={LineItem} />
      <Stack.Screen name="Auth" component={Approve} />
      <Stack.Screen name="Times" component={Times} />
      <Stack.Screen name="Image" component={DisplayImage} />
      <Stack.Screen name="ActivityApproval" component={ApproveActivity} />
      <Stack.Screen name="Confirm" component={ConfirmFIF} />
      <Stack.Screen name="InstructorActivity" component={InstructorActivity} />
      <Stack.Screen name="Request" component={RequestScreen} />
      <Stack.Screen name="RequestStudent" component={RequestStudent} />
      <Stack.Screen name="RequestSecondStudent" component={RequestSecondStudent} />
      <Stack.Screen name="RequestConfirmS" component={RequestConfirmS} />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  // Add any styles you need for the stack screen components
});
