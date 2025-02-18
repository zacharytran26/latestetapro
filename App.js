import React,{ useEffect } from "react";
import { Router } from "./routes/Route";
import { AuthProvider } from "./screens/ThemeContext";
import * as eva from "@eva-design/eva";
import { ApplicationProvider,IconRegistry } from "@ui-kitten/components";
import { EvaIconsPack } from "@ui-kitten/eva-icons";
import messaging from '@react-native-firebase/messaging';
import { PermissionsAndroid, Alert, Platform } from "react-native";
 
const requestNotificationPermission = async () => {
// let notificationsPermissionCheck = "granted";
// The permission exists only for Android API versions bigger than 33 (Android 13),
// we can assume it's always granted beforehand
//if (Platform.Version >= 33) {
/*
notificationsPermissionCheck = await PermissionsAndroid.request(
PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
);
}
console.log("notificationsPermissionCheck:", notificationsPermissionCheck);
*/
try {
const granted = await PermissionsAndroid.request(
PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
{
title: 'ETAPro Notification Permission',
message:'ETAPro needs access to Notification.',
buttonNeutral: 'Ask Me Later',
buttonNegative: 'Cancel',
buttonPositive: 'OK',
},
).then((result)=>{
//Alert.alert('getting permission...');
//Alert.alert(result);
/*if ('granted' === result){//PermissionsAndroid.RESULTS.GRANTED) {
Alert.alert('You can use the notification');
} else {
Alert.alert('Notification permission denied');
}*/
});
/*
if (granted === PermissionsAndroid.RESULTS.GRANTED) {
Alert.alert('You can use the notification');
} else {
Alert.alert('Notification permission denied');
}
 
messaging().getToken().then((mytoken)=>{
Alert.alert(mytoken);
});
*/
} catch (err) {
Alert.alert("Unable to get phone permission to receive notification. Error - "+err.toString());
}
}
 
//};//if (Platform.Version >= 33) {
 
export default function App() {
useEffect(() => {
requestNotificationPermission();
//Alert.alert('app-requestNotificationPermission...');
}, []);
return (
<>
<ApplicationProvider{...eva} theme={eva.light}>
<IconRegistry icons={EvaIconsPack}/>
<AuthProvider>
<Router />
</AuthProvider>
</ApplicationProvider>
</>
 
);
}