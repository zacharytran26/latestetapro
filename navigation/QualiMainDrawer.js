import React, { useState } from "react";
import {
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
  View,
  Linking,
} from "react-native";
import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import { useTheme, Avatar, Text } from "@ui-kitten/components";
import { useAuth } from "../screens/ThemeContext";
import Icon from "react-native-vector-icons/MaterialCommunityIcons"; // Import icon library

export function CustomDrawerContentQuali(props) {
  const theme = useTheme();
  const { authUser } = useAuth();

  const uric = `${authUser.host.replace(
    "servlet/",
    ""
  )}php/upload/view.php?imgRes=10&viewPers=${
    authUser.currpersid
  }&rorwwelrw=rw&curuserid=${authUser.currpersid}&id=${authUser.sysdocid}&svr=${
    authUser.svr
  }&s=${authUser.sessionid}&c=eta${authUser.schema}`;

  const openInBrowser = (url) => {
    const arrCalStart = authUser.calstart.split(";"); //DD/MON/YYYY;MM/DD/YYYY
    const sHost = authUser.host + "content?";
    var surl =
      url +
      "&etamobilepro=1&nocache=" +
      Math.random().toString().split(".")[1] +
      "&session_id=" +
      authUser.sessionid +
      "&hash=" +
      authUser.hash +
      "&customer=eta" +
      authUser.schema +
      "&zajael1120=" +
      authUser.custhash;
    surl =
      surl +
      "&teamId=&uname=" +
      authUser.uname +
      "&password=" +
      authUser.upwd +
      "&curDate=" +
      arrCalStart[0] +
      "&schedDate=" +
      arrCalStart[1] +
      "&version=3.0.2&";
    const urlGoto = sHost + surl;
    Linking.canOpenURL(urlGoto)
      .then((supported) => {
        if (supported) {
          Linking.openURL(urlGoto);
        } else {
          console.warn("Don't know how to open URI: " + urlGoto);
        }
      })
      .catch((err) => console.error("An error occurred", err));
  };

  const openInBrowserCal = () => {
    const arrCalStart = authUser.calstart.split(";"); //DD/MON/YYYY;MM/DD/YYYY
    const sHost = authUser.host.replace("servlet/", "");
    const urlHost = sHost + "php/fullcalendar/demos/default.php?url=";
    var surl =
      authUser.host +
      "content?module=home&toggleValue=1&msgToggleValue=1&etamobilepro=1&deviceid=";
    var surl =
      surl +
      "&nocache=" +
      Math.random().toString().split(".")[1] +
      "&page=m&session_id=" +
      authUser.sessionid +
      "&hash=" +
      authUser.hash +
      "&customer=eta" +
      authUser.schema +
      "&zajael1120=" +
      authUser.custhash;
    surl =
      surl +
      "&teamId=&uname=" +
      authUser.uname +
      "&password=" +
      authUser.upwd +
      "&curDate=" +
      arrCalStart[0] +
      "&schedDate=" +
      arrCalStart[1] +
      "&version=3.0.2&";

    const sCalUrl = urlHost + encodeURIComponent(surl);
    Linking.canOpenURL(sCalUrl)
      .then((supported) => {
        if (supported) {
          Linking.openURL(sCalUrl);
        } else {
          console.warn("Don't know how to open URI: " + sCalUrl);
        }
      })
      .catch((err) => console.error("An error occurred", err));
  };

  return (
    <DrawerContentScrollView
      {...props}
      style={{ backgroundColor: theme["color-basic-300"] }}
      showsVerticalScrollIndicator={false}
    >
      <SafeAreaView>
        <View style={styles.avatar}>
          <Avatar source={{ uri: uric }} style={styles.profileAvatar} />
        </View>

        <DrawerItem
          label="ETA"
          icon={({ color, size }) => (
            <Icon name="home-outline" color={color} size={size} />
          )}
          labelStyle={styles.drawerItemLabel}
          onPress={() => openInBrowser("module=home&page=homepg")}
        />

        <DrawerItem
          label="FIF"
          icon={({ color, size }) => (
            <Icon name="file-document-edit-outline" color={color} size={size} />
          )}
          labelStyle={styles.drawerItemLabel}
          onPress={() =>
            props.navigation.navigate("QualiStack", { screen: "FIF" })
          }
        />

        <DrawerItem
          label="Full Calendar"
          icon={({ color, size }) => (
            <Icon name="calendar-outline" color={color} size={size} />
          )}
          labelStyle={styles.drawerItemLabel}
          onPress={() => openInBrowserCal()}
        />

        <DrawerItem
          label="Instructors"
          icon={({ color, size }) => (
            <Icon name="account-tie-outline" color={color} size={size} />
          )}
          labelStyle={styles.drawerItemLabel}
          onPress={() =>
            props.navigation.navigate("QualiStack", {
              screen: "InstructorScreen",
            })
          }
        />

        <DrawerItem
          label="Logbook"
          icon={({ color, size }) => (
            <Icon name="book-open-outline" color={color} size={size} />
          )}
          labelStyle={styles.drawerItemLabel}
          onPress={() =>
            openInBrowser("module=home&page=m&mode=mMyLogBookInit")
          }
        />

        <DrawerItem
          label="Pending Authorizations"
          icon={({ color, size }) => (
            <Icon name="clipboard-clock-outline" color={color} size={size} />
          )}
          labelStyle={styles.drawerItemLabel}
          onPress={() =>
            props.navigation.navigate("QualiStack", {
              screen: "PendingAuth",
            })
          }
        />

        <DrawerItem
          label="Scheduling"
          icon={({ color, size }) => (
            <Icon name="clock-outline" color={color} size={size} />
          )}
          labelStyle={styles.drawerItemLabel}
          onPress={() => openInBrowser("module=home&page=m&mode=mGetPreGantt")}
        />

        <DrawerItem
          label="Students"
          icon={({ color, size }) => (
            <Icon name="account-group-outline" color={color} size={size} />
          )}
          labelStyle={styles.drawerItemLabel}
          onPress={() =>
            props.navigation.navigate("QualiStack", {
              screen: "StudentScreen",
            })
          }
        />

        <DrawerItem
          label="Settings"
          icon={({ color, size }) => (
            <Icon name="cog-outline" color={color} size={size} />
          )}
          labelStyle={styles.drawerItemLabel}
          onPress={() =>
            props.navigation.navigate("QualiStack", { screen: "Settings" })
          }
        />

        <DrawerItem
          label="Logout"
          icon={({ color, size }) => (
            <Icon name="logout" color={color} size={size} />
          )}
          labelStyle={styles.drawerItemLabel}
          onPress={() =>
            props.navigation.navigate("QualiStack", { screen: "Logout" })
          }
        />

        <View style={styles.bottomTextContainer}>
          <TouchableOpacity onPress={() => openInBrowser(authUser.LINK)}>
            <Text>Help</Text>
          </TouchableOpacity>
          <Text style={styles.bottomText}>Version 1.0.0</Text>
          <Text style={styles.bottomText}>© 2024 Talon Systems LLC</Text>
          <Text style={styles.bottomText}>All Rights Reserved</Text>
        </View>
      </SafeAreaView>
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  avatar: {
    alignItems: "center",
  },
  bottomTextContainer: {
    marginTop: "auto", // Pushes the text to the bottom
    alignItems: "center",
    paddingVertical: 20,
  },
  bottomText: {
    fontSize: 10,
    color: "#888", // Customize as needed
  },
  profileAvatar: {
    width: 75,
    height: 75,
  },
  drawerItemLabel: {
    fontSize: 18, // Increase font size
    fontWeight: "bold", // Make it bold (optional)
    color: "#333", // Set a custom text color
  },
});
