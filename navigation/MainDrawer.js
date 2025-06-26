import React, { useState } from "react";
import {
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
  View,
  Modal,
  Alert,
  Linking,
} from "react-native";
import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import { useTheme, Avatar, Text, Button } from "@ui-kitten/components";
import { useAuth } from "../screens/ThemeContext";
import Icon from "react-native-vector-icons/MaterialCommunityIcons"; // Import icon library
import { WebView } from 'react-native-webview';

export function CustomDrawerContent(props) {
  const theme = useTheme();
  const { authUser } = useAuth();
  const [WebViewUrl, setWebViewUrl] = useState("");
  const [modalVisible, setModalVisible] = useState(false);


  const openInDrawerWebView = (url) => {
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
    setWebViewUrl(urlGoto);
    setModalVisible(true);
  };
  const uric = `${authUser.host.replace(
    "servlet/",
    ""
  )}php/upload/view.php?imgRes=10&viewPers=${authUser.currpersid
    }&rorwwelrw=rw&curuserid=${authUser.currpersid}&id=${authUser.sysdocid}&svr=${authUser.svr
    }&s=${authUser.sessionid}&c=eta${authUser.schema}`;


  const openEtaBroswer = (url) => {
    const arrCalStart = authUser.calstart.split(";"); //DD/MON/YYYY;MM/DD/YYYY
    const sHost = authUser.host + "content?";
    var surl =
      url +
      "&etamobilepro=1&nocache=" +
      Math.random().toString().split(".")[1] +
      "&rnetalink=" +
      1 +
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
    setWebViewUrl(urlGoto);

    // Linking.canOpenURL(urlGoto).then((supported) => {
    //   if (supported) {
    //     Linking.openURL(urlGoto);
    //   } else {
    //     console.warn("Don't know how to open URI:" + urlGoto);
    //   }
    // }).catch((err) => console.error("An error occured,", err))
  }
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
    setWebViewUrl(sCalUrl);
    setModalVisible(true);
  };

  const openHelp = (url) => {
    setWebViewUrl(url);
    setModalVisible(true);
  };

  function openAndFormatEmail() {
    const link = `mailto: etamobile@talonsystems.com`;

    Linking.canOpenURL(link)
      .then((supported) => {
        if (supported) Linking.openURL(link);
      })
      .catch((err) => console.log(error));
  };

  const handleWebViewError = (syntheticEvent) => {
    const { nativeEvent } = syntheticEvent;
    Alert.alert("WebView Error", nativeEvent.description);
  };


  return (
    <>
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
            onPress={() => openEtaBroswer("module=home&page=homepg")}
          />

          <DrawerItem
            label="FIF"
            icon={({ color, size }) => (
              <Icon name="file-document-edit-outline" color={color} size={size} />
            )}
            labelStyle={styles.drawerItemLabel}
            onPress={() =>
              props.navigation.navigate("HomeStack", { screen: "FIF" })
            }
          />

          {/* <DrawerItem
            label="Full Calendar"
            icon={({ color, size }) => (
              <Icon name="calendar-outline" color={color} size={size} />
            )}
            labelStyle={styles.drawerItemLabel}
            //onPress={openInBrowserCal}
            onPress={() =>
              props.navigation.navigate("HomeStack", {
                screen: "Calendar",
              })
            }
          /> */}
          <DrawerItem
            label="Full Calendar"
            icon={({ color, size }) => (
              <Icon name="calendar-outline" color={color} size={size} />
            )}
            labelStyle={styles.drawerItemLabel}
            onPress={openInBrowserCal}
          />

          <DrawerItem
            label="Instructors"
            icon={({ color, size }) => (
              <Icon name="account-tie-outline" color={color} size={size} />
            )}
            labelStyle={styles.drawerItemLabel}
            onPress={() =>
              props.navigation.navigate("HomeStack", {
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
              openInDrawerWebView("module=home&page=m&mode=mMyLogBookInit")
            }
          />

          {authUser.perstype === "student" || authUser.penaut != "rw" ? (null) : (<DrawerItem
            label="Pending Authorizations"
            icon={({ color, size }) => (
              <Icon name="clipboard-clock-outline" color={color} size={size} />
            )}
            labelStyle={styles.drawerItemLabel}
            onPress={() =>
              props.navigation.navigate("HomeStack", { screen: "PendingAuth" })
            }
          />)}


          {/* <DrawerItem
            label="Request"
            icon={({ color, size }) => (
              <Icon name="account-group-outline" color={color} size={size} />
            )}
            labelStyle={styles.drawerItemLabel}
            onPress={() =>
              props.navigation.navigate("HomeStack", {
                screen: "Request",
              })
            }
          /> */}

          <DrawerItem
            label="Scheduling"
            icon={({ color, size }) => (
              <Icon name="clock-outline" color={color} size={size} />
            )}
            labelStyle={styles.drawerItemLabel}
            onPress={() =>
              openInDrawerWebView("module=home&page=m&mode=mGetPreGantt")
            }
          />
          {authUser.perstype === "student" ? (<DrawerItem
            label="Courses"
            icon={({ color, size }) => (
              <Icon name="account-group-outline" color={color} size={size} />
            )}
            labelStyle={styles.drawerItemLabel}
            onPress={() =>
              props.navigation.navigate("HomeStack", {
                screen: "StudentScreen",
              })
            }
          />) : (<DrawerItem
            label="Students"
            icon={({ color, size }) => (
              <Icon name="account-group-outline" color={color} size={size} />
            )}
            labelStyle={styles.drawerItemLabel}
            onPress={() =>
              props.navigation.navigate("HomeStack", {
                screen: "StudentScreen",
              })
            }
          />)}


          <DrawerItem
            label="Settings"
            icon={({ color, size }) => (
              <Icon name="cog-outline" color={color} size={size} />
            )}
            labelStyle={styles.drawerItemLabel}
            onPress={() =>
              props.navigation.navigate("HomeStack", { screen: "Settings" })
            }
          />

          <DrawerItem
            label="Logout"
            icon={({ color, size }) => (
              <Icon name="logout" color={color} size={size} />
            )}
            labelStyle={styles.drawerItemLabel}
            onPress={() =>
              props.navigation.navigate("HomeStack", { screen: "Logout" })
            }
          />

          <View style={styles.bottomTextContainer}>
            <TouchableOpacity onPress={openAndFormatEmail}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Icon name="bullhorn-outline" fill="black" size={25} />
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => openHelp(authUser.LINK)}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Icon name="help-circle" fill="black" width={10} height={10} />
                <Text style={{ marginLeft: 5 }}>Help</Text>
              </View>
            </TouchableOpacity>
            <Text style={styles.bottomText}>{authUser.vers}</Text>
            <Text style={styles.bottomText}>© 2025 Talon Systems LLC</Text>
            <Text style={styles.bottomText}>All Rights Reserved</Text>
          </View>
          <Modal
            visible={modalVisible}
            animationType="slide"
            onRequestClose={() => setModalVisible(false)}
          >
            <SafeAreaView style={{ flex: 1 }}>
              <View style={styles.webViewHeader}>
                <TouchableOpacity onPress={() => setModalVisible(false)}>
                  <Text style={styles.closeText}>Close</Text>
                </TouchableOpacity>
              </View>
              <WebView source={{ uri: WebViewUrl }} />
            </SafeAreaView>
          </Modal>
        </SafeAreaView>
      </DrawerContentScrollView>
    </>
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
    paddingVertical: 1,
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
  closeText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FF0000", // Black text
    textAlign: "center",
    padding: 10,
  },
  webViewHeader: {
    padding: 10,
    alignItems: "center",
  },
});
