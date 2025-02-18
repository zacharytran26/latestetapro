import * as React from "react";
import { useState, useEffect } from "react";
import { StyleSheet, View, SafeAreaView, Alert } from "react-native";
import { WebView } from "react-native-webview";
import { useAuth } from "./ThemeContext";
import { Button, Layout, Text } from "@ui-kitten/components";
import { useRoute } from "@react-navigation/native";

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
    Alert.alert("WebView Error", nativeEvent.description);
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
    } else Alert.alert("Unable to login to ETA via Single Sign On.");
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
          Alert.alert("You are not authorized to access ETA.");
          setIsLoggedIn(false);
          setAuthUser(null);
        }
        return json;
      })
      .catch((error) => {
        //setLoading(false); // Stop loading
        //setProgress(0); // Reset progress
        Alert.alert(error.message);
        console.error(error.message);
      });
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Layout style={styles.container}>
        <View style={styles.header}>
          <Text category="h1">SSO Login</Text>
          <Button onPress={logoutSSO}>SSO Logout</Button>
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
      </Layout>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F7F9FC",
  },
  header: {
    alignItems: "center",
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  button: {
    flex: 1,
    marginHorizontal: 10,
  },
});
