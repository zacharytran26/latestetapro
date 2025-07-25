import React, { useEffect } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../screens/HomeScreen";
import InstructorsScreen from "../screens/InstructorScreen";
import StudentsScreen from "../screens/StudentScreen";
import InstructorList from "../screens/InstructorDetailScreen";
import StudentList from "../screens/StudentDetailScreen";
import LogoutScreen from "../screens/Logout";
import StudentCourse from "../screens/StudentCourseScreen";
import StudentMap from "../screens/StudentMap";
import StudentMapDetails from "../screens/StudentMapsDetail";
import LineItem from "../screens/LineItems";
import Approve from "../screens/ApprovalScreen";
import Times from "../screens/TimesScreen";
import DisplayImage from "../screens/ImageScreen";
import Activity from "../screens/ActivityScreen";
import InstructorActivity from "../screens/InstructorActivity";
import ApproveActivity from "../screens/ActivityApproval";
import ConfirmFIF from "../screens/ConfirmationFIF";
import SettingsScreen from "../screens/SettingScreen";
import PendingAuths from "../screens/PendingAuths";
import FIFScreen from "../screens/FIFScreen";
import { useAuth } from "../screens/ThemeContext";
// import RequestScreen from "../screens/RequestScreen";
// import Calendar from "../screens/CalendarScreen";
// import RequestQuick from "../screens/RequestQuick";
// import RequestStudent from "../screens/RequestStudent";
// import RequestRefresher from "../screens/RequestRefresher";
// import RequestConfirmS from "../screens/RequestConfirm";
// import RequestAdmin from "../screens/RequestAdmin";
// import RequestRental from "../screens/RequestRental";

const Stack = createNativeStackNavigator();

//export default function HomeStackNavigator({ route, navigation }) {
const HomeStackNavigator = ({ navigation, route }) => {
  const { authUser, currentasof } = useAuth();
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true, //has the back button
        headerBackTitleVisible: false,
        headerTitleStyle: {
          fontSize: 13,
        },
        headerTitleAlign: " center",
        headerStyle: {
          backgroundColor: "#f7f9fc",

        },
        headerTitle: `OPS COND: ${authUser.opscond}`,
      }}
    >
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="InstructorScreen" component={InstructorsScreen} />
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
      <Stack.Screen name="Activity" component={Activity} />
      <Stack.Screen name="InstructorActivity" component={InstructorActivity} />
      <Stack.Screen name="ActivityApproval" component={ApproveActivity} />
      <Stack.Screen name="Confirm" component={ConfirmFIF} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="PendingAuth" component={PendingAuths} />
      <Stack.Screen name="FIF" component={FIFScreen} />
      {/* <Stack.Screen name="Request" component={RequestScreen}/> */}
      {/* <Stack.Screen name="Calendar" component={Calendar}/> */}
    </Stack.Navigator>
  );
}

export default HomeStackNavigator;