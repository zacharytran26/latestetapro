import * as React from "react";
import { useState, useEffect } from "react";
import { StyleSheet, View, SafeAreaView, Alert } from "react-native";
import { WebView } from "react-native-webview";
import { useAuth } from "./ThemeContext";
import { Button, Layout, Text, Icon, Card } from "@ui-kitten/components";
import { useRoute } from "@react-navigation/native";
import { EtaAlert } from "./ExtraImports";

export default function LoginSSOScreen({ navigation }) {
  const route = useRoute();
  const { json } = route.params;
  const { authUser, setAuthUser, isLoggedIn, setIsLoggedIn } = useAuth();
  const [ssourl, setSsourl] = useState(json.ssourl);

  const urlHost = json.host;
  const sHost = urlHost.substring(0, urlHost.indexOf("content?"));
  var sessionid;
  var currpersid;
  const ssoLoginURL = json.ssourl;
  const ssoLogoutURL = json.logoutsso;
  const schema = json.schema;

  const handleWebViewError = (syntheticEvent) => {
    const { nativeEvent } = syntheticEvent;
    console.warn("WebView error: ", nativeEvent);
    //Alert.alert("WebView Error", nativeEvent.description);
    EtaAlert(
      "WebView Error",
      nativeEvent.description,
      "Ok",
      ""
    );
  };

  const logoutSSO = () => {
    setSsourl(ssoLogoutURL);
  };

  const loginSSO = (data) => {
    var ssojson = JSON.parse(data);
    if (ssojson.validated == 1 && ssojson.sessionid > 0) {
      sessionid = ssojson.sessionid;
      currpersid = ssojson.currpersid;
      getSSOLoginData();
    } else //Alert.alert("Unable to login to ETA via Single Sign On.");
      EtaAlert(
        "Error",
        "Unable to login to ETA via Single Sign On.",
        "Ok",
        ""
      );
  };

  function getSSOLoginData() {
    var getURL =
      urlHost +
      "&mode=talonsso" +
      "&session_id=" +
      sessionid +
      "&currpersid=" +
      currpersid;

    fetch(getURL)
      .then((response) => response.json())
      .then((json) => {
        if (json.validated == "1") {
          json.host = sHost;
          json.schema = schema;
          setAuthUser(json);
          setIsLoggedIn(true);
          //saveAccessCode(accesscode);
          //saveUsername(username);
        } else {
          //Alert.alert("You are not authorized to access ETA.");
          EtaAlert(
            "Error",
            "You are not authorized to access ETA.",
            "Ok",
            ""
          );
          setIsLoggedIn(false);
          setAuthUser(null);
        }
        return json;
      })
      .catch((error) => {
        //setLoading(false); // Stop loading
        //setProgress(0); // Reset progress
        //Alert.alert(error.message);
        EtaAlert(
          "Error",
          error.message,
          "Ok",
          ""
        );
        console.error(error.message);
      });
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F7F9FC" }}>
      <Layout style={styles.container}>
        <View style={styles.header}>
          <Icon name="log-in-outline" fill="#3366FF" style={styles.icon} />
          <Text category="h5" style={styles.headerText}>
            Secure SSO Login
          </Text>
          <Text category="p2" appearance="hint">
            Access your account securely via Single Sign-On
          </Text>
        </View>
        <WebView
          source={{ uri: ssourl }}
          onError={handleWebViewError}
          onMessage={(event) => {
            //setIsLoggedIn(true);
            //setAuthUser(JSON.parse(event.nativeEvent.data));
            loginSSO(event.nativeEvent.data);
          }}
        />
        <Button
          style={styles.logoutButton}
          onPress={logoutSSO}
          status="danger"
          accessoryLeft={(props) => <Icon {...props} name="log-out-outline" />}
        >
          Logout
        </Button>
      </Layout>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
  },
  header: {
    alignItems: "center",
    marginVertical: 20,
  },
  headerText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#3366FF",
    marginTop: 10,
  },
  icon: {
    width: 40,
    height: 40,
  },
  webViewCard: {
    flex: 1,
    borderRadius: 10,
    overflow: "hidden",
    elevation: 2, // Shadow for Android
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  webView: {
    flex: 1,
  },
  logoutButton: {
    marginVertical: 20,
    borderRadius: 10,
  },
});