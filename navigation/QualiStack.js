import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import QualiScreen from "../screens/QualificationScreen";
import DisplayImage from "../screens/ImageScreen";
import FIFScreen from "../screens/FIFScreen";
import ConfirmFIF from "../screens/ConfirmationFIF";
import InstructorsScreen from "../screens/InstructorScreen";
import InstructorList from "../screens/InstructorDetailScreen";
import PendingAuths from "../screens/PendingAuths";
import Times from "../screens/TimesScreen";
import Approve from "../screens/ApprovalScreen";
import StudentsScreen from "../screens/StudentScreen";
import StudentList from "../screens/StudentDetailScreen";
import StudentMap from "../screens/StudentMap";
import StudentMapDetails from "../screens/StudentMapsDetail";
import LineItem from "../screens/LineItems";
import StudentCourse from "../screens/StudentCourseScreen";
import SettingsScreen from "../screens/SettingScreen";
import LogoutScreen from "../screens/Logout";
import { useAuth } from "../screens/ThemeContext";

const Stack = createNativeStackNavigator();

export default function MessagesStackNavigator({ }) {
  const { authUser, currentasof } = useAuth();
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: "#f7f9fc",
        },
        headerTitleStyle: {
          fontSize: 13,
        },
        headerTitle: `OPS COND: ${authUser.opscond}             ${currentasof}`,
        headerBackTitleVisible: false,
      }}
    >
      <Stack.Screen name="Quali" component={QualiScreen} />
      <Stack.Screen name="Image" component={DisplayImage} />
      <Stack.Screen name="FIF" component={FIFScreen} />
      <Stack.Screen name="Confirm" component={ConfirmFIF} />
      <Stack.Screen name="InstructorScreen" component={InstructorsScreen} />
      <Stack.Screen name="InstructorDetailScreen" component={InstructorList} />
      <Stack.Screen name="PendingAuth" component={PendingAuths} />
      <Stack.Screen name="Times" component={Times} />
      <Stack.Screen name="Auth" component={Approve} />
      <Stack.Screen name="StudentScreen" component={StudentsScreen} />
      <Stack.Screen name="StudentDetailScreen" component={StudentList} />
      <Stack.Screen name="StudentMap" component={StudentMap} />
      <Stack.Screen name="StudentMapDetails" component={StudentMapDetails} />
      <Stack.Screen name="LineItem" component={LineItem} />
      <Stack.Screen name="StudentCourse" component={StudentCourse} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="Logout" component={LogoutScreen} />
    </Stack.Navigator>
  );
}
