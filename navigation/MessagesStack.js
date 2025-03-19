import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MessagesScreen from "../screens/MessageListScreen";
import EmailList from "../screens/EmailDetailsScreen";
import ReplyScreen from "../screens/ReplyScreen";
import NewMessage from "../screens/NewMessageScreen";

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

export default function MessagesStackNavigator({ updateBadgeCount }) {
  const { authUser, currentasof } = useAuth();
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true, //has the back button
        headerBackTitleVisible: false,
        headerTitleStyle: {
          fontSize: 13,
        },
        headerStyle: {
          backgroundColor: "#f7f9fc",
        },
        headerTitle: `OPS COND: ${authUser.opscond}`,
      }}
    >
      <Stack.Screen name="Messages">
        {(props) => (
          <MessagesScreen {...props} updateBadgeCount={updateBadgeCount} />
        )}
      </Stack.Screen>
      <Stack.Screen name="MessageEmails" component={EmailList} />
      <Stack.Screen name="MessageNewMessage" component={NewMessage} />
      <Stack.Screen name="MessageReplyScreen" component={ReplyScreen} />
      <Stack.Screen name="FIF" component={FIFScreen} />
      <Stack.Screen name="Confirm" component={ConfirmFIF} />
      <Stack.Screen name="InstructorScreen" component={InstructorsScreen} />
      <Stack.Screen name="InstructorDetailScreen" component={InstructorList} />
      <Stack.Screen name="PendingAuth" component={PendingAuths} />
      <Stack.Screen name="Times" component={Times} />
      <Stack.Screen name="Auth" component={Approve} />
      <Stack.Screen name="StudentScreen" component={StudentsScreen} />
      <Stack.Screen name="StudentDetailScreen" component={StudentList} />
      <Stack.Screen name="StudentCourse" component={StudentCourse} />
      <Stack.Screen name="StudentMap" component={StudentMap} />
      <Stack.Screen name="StudentMapDetails" component={StudentMapDetails} />
      <Stack.Screen name="LineItem" component={LineItem} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="Logout" component={LogoutScreen} />
    </Stack.Navigator>
  );
}

//<Stack.Screen name="Log" component={LogScreen} /> //<== logbook screen 
//<Stack.Screen name="Image" component={DisplayImage} /> //image screen for display currency/qualification document
//<Stack.Screen name="InstructorActivity" component={InstructorActivity} />      