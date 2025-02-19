import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  Alert,
  TouchableOpacity,
  Image,
  Platform,
  View,
  Linking,
  StatusBar,
} from "react-native";
import {
  Input,
  Button,
  Layout,
  Text,
  Spinner,
  ProgressBar,
} from "@ui-kitten/components";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { WebView } from "react-native-webview";
import { useAuth } from "./ThemeContext";
import { useFocusEffect, useRoute } from "@react-navigation/native";
import messaging from '@react-native-firebase/messaging';
import { PermissionsAndroid } from "react-native";

var ssoLogin = 0;
const LoginScreen = ({ navigation }) => {
  const [accesscode, setAccesscode] = useState("");
  const [passedData, setPassedData] = useState([])
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginLabel, setLoginLabel] = useState("LOGIN");
  const [loading, setLoading] = useState(false); // Loading state
  const [progress, setProgress] = useState(0); // Progress state
  const [isSelected, setIsSelected] = useState(false);
  const [etaPushToken, setEtaPushToken] = useState("");
  const route = useRoute();
  const webViewRef = useRef(null);


  useEffect(() => {
    setIsLoginEnabled(true);
    const handleForegroundNotification = messaging().onMessage((message) => {
      Alert.alert(message.notification.title, message.notification.body);
    });
    return handleForegroundNotification;
  }, []);

  const [urlview, setUrlview] = useState(
    "https://apps5.talonsystems.com/tseta/tc.htm"
  );

  const [isTermsAccepted, setIsTermsAccepted] = useState(false);
  const [isLoginEnabled, setIsLoginEnabled] = useState(false);

  const url = "https://apps5.talonsystems.com/tseta/tc.htm";

  useEffect(() => {
    checkAlertStatus();
    loadAccessCode();
    messaging().getToken().then((mytoken) => {
      setEtaPushToken(mytoken);
    });
  }, []);

  const { setUrl, authUser, setAuthUser, isLoggedIn, setIsLoggedIn, chgPwd } = useAuth();
  useEffect(() => {
    if (authUser.chgpwd === "1") {
      navigation.navigate("ChgPwd");
    }
  }, [authUser, navigation]); // Run this effect whenever `authUser` changes



  const CreateTermsAndConditionAlert = () => {
    Alert.alert("Terms & Conditions", "Please review our terms:", [
      {
        text: "View",
        onPress: () => setIsTermsAccepted(true), // Show WebView
      },
    ]);
  };

  const checkAlertStatus = async () => {
    const termsAcknowledged = await AsyncStorage.getItem("termsAcknowledged");
    if (!termsAcknowledged) {
      // Show the alert to view terms if not acknowledged
      CreateTermsAndConditionAlert();
    } else {
      // Enable login if terms have already been acknowledged
      setIsLoginEnabled(true);
    }
  };

  const handleWebViewError = (syntheticEvent) => {
    const { nativeEvent } = syntheticEvent;
    Alert.alert("WebView Error", nativeEvent.description);
  };


  const handleAcknowledge = async () => {
    // Set the terms acknowledged flag and hide the WebView
    await AsyncStorage.setItem("termsAcknowledged", "true");
    setIsTermsAccepted(false); // Return to login page
    setIsLoginEnabled(true); // Enable login button
  };

  const handlePressIn = () => {
    setIsSelected(true);
  };

  const handlePressOut = () => {
    setIsSelected(false);
  };

  const loadAccessCode = async () => {
    try {
      const savedAccessCode = await AsyncStorage.getItem("accesscode");
      if (savedAccessCode !== null) {
        setAccesscode(savedAccessCode);
        fCheckAccessCode(savedAccessCode);
      }
    } catch (error) {
      console.error("Failed to load access code", error);
    }
  };

  const saveAccessCode = async (acode) => {
    try {
      await AsyncStorage.setItem("accesscode", acode);
    } catch (error) {
      console.error("Failed to save access code", error);
    }
  };

  const saveUsername = async (user) => {
    try {
      await AsyncStorage.setItem("username", user);
    } catch (error) {
      console.error("Failed to save username", error);
    }
  };

  function fCheckAccessCode(acode) {
    var ucode = acode.toUpperCase();
    if (ucode.indexOf("SSO") != -1) {
      setLoginLabel("SSO LOGIN");
      ssoLogin = 1;
    } else {
      setLoginLabel("LOGIN");
      ssoLogin = 0;
    }
    if (Platform.OS === "ios") {
      setAccesscode(ucode);
    } else {
      setAccesscode(acode);
    }
  }

  function fLogin() {
    if (accesscode === "" && ssoLogin === 0) {
      Alert.alert("You must specify an Access Code.");
      return;
    }
    if (username === "" && ssoLogin === 0) {
      Alert.alert("You must specify a User Name.");
      return;
    }
    if (password === "" && ssoLogin === 0) {
      Alert.alert("You must specify a Password.");
      return;
    }

    setLoading(true); // Start loading
    setProgress(0.3); // Example progress value, adjust based on your logic

    const conn = ""; //checkConnection();

    if (conn === "No network connection" || conn === "Unknown connection") {
      Alert.alert("You do not have an internet connection!");
      setLoading(false); // Stop loading
      setProgress(0); // Reset progress
    } else {
      const svr = accesscode.substring(0, 2).replace("0", ""); //remove leading zeros from the server: 02 becomes 2
      const talProd = "https://apps" + svr + ".talonsystems.com/";
      const localAcode = accesscode;
      var schema = "";
      // ERAU DEV
      if (localAcode.substring(0, 3).toUpperCase() === "ERD") {
        schema = "";
      } else if (localAcode.substring(0, 3).toUpperCase() === "ERQ") {
        schema = "";
      } else if (localAcode.substring(0, 3).toUpperCase() === "ERP") {
        schema = "";
      } else if (localAcode.substring(0, 6).toUpperCase() === "TALDEV") {
        schema = "";
      } else if (localAcode.substring(0, 6).toUpperCase() === "TALTST") {
        schema = "";
      } else {
        schema = localAcode.substring(2, 6);
      }

      if (
        //accesscode.substring(0, 1).toUpperCase() !== "E" &&
        ssoLogin === 0 &&
        isNaN(accesscode)
      ) {
        Alert.alert(
          "You have entered an invalid access code. Only numeric characters are allowed."
        );
        setLoading(false); // Stop loading
        setProgress(0); // Reset progress
      } else if (
        accesscode.substring(0, 1).toUpperCase() !== "E" &&
        accesscode.substring(0, 2) !== "01" &&
        accesscode.substring(0, 2) !== "02" &&
        accesscode.substring(0, 2) !== "03" &&
        accesscode.substring(0, 2) !== "04" &&
        accesscode.substring(0, 2) !== "05" &&
        accesscode.substring(0, 2) !== "06" &&
        accesscode.substring(0, 2) !== "07" &&
        accesscode.substring(0, 2) !== "08" &&
        accesscode.substring(0, 2) !== "09" &&
        accesscode.substring(0, 2) !== "10" &&
        accesscode.substring(0, 2) !== "11" &&
        accesscode.substring(0, 2) !== "12"
      ) {
        Alert.alert("You have entered an invalid access code.");
        setLoading(false); // Stop loading
        setProgress(0); // Reset progress
      } else if (
        accesscode.substring(0, 1).toUpperCase() !== "E" &&
        accesscode.length !== 10 &&
        ssoLogin === 0
      ) {
        Alert.alert("You have entered an invalid access code.");
        setLoading(false); // Stop loading
        setProgress(0); // Reset progress
      } else {
        var url = talProd + "tseta/servlet/";
        var sHost = talProd + "tseta/servlet/";

        var sHostResURL =
          sHost +
          "content?module=home&page=m&reactnative=1&accesscode=" +
          accesscode +
          "&customer=eta" +
          schema +
          "&etamobilepro=1&ssologin=" +
          ssoLogin;
        var getURL =
          sHostResURL +
          "&mode=mLogin" +
          "&uname=" +
          username +
          "&password=" +
          password +
          "&pushtoken=" +
          encodeURIComponent(etaPushToken);
        fetch(getURL)
          .then((response) => response.json())
          .then((json) => {
            if (json.ssologin == "1" && json.validated == "0") {
              json.host = sHostResURL;
              json.schema = schema;
              navigation.navigate("LoginSSO", { json });
              return json;
            }
            setLoading(false);
            setProgress(1);
            if (json.validated == "1") {
              json.host = sHost;
              json.schema = schema;
              if (json.svr == "") {
                json.svr = "TS" + svr + "P";
              }
              setAuthUser(json);
              setPassedData(json);
              setIsLoggedIn(true);
              saveAccessCode(accesscode);
              saveUsername(username);
            } else {
              Alert.alert("You are not authorized to access ETA.");
              setIsLoggedIn(false);
              setAuthUser(json);
            }
            return json;
          })
          .catch((error) => {
            setLoading(false); // Stop loading
            setProgress(0); // Reset progress
            Alert.alert(error.message);
            console.error(error.message);
          });
      }
    }
    setIsSelected(false);
  }

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      enableOnAndroid={true}
      enableAutomaticScroll={true}
    >
      <StatusBar style="dark-content" />
      {isTermsAccepted ? (
        <Layout style={{ flex: 1 }}>
          <View style={{ flex: 1, width: "100%", height: "100%" }}>
            <Button style={styles.backButton} onPress={handleAcknowledge}>
              Acknowledge
            </Button>
            <WebView
              ref={webViewRef}
              source={{ uri: urlview }}
              onError={handleWebViewError}
              style={{ flex: 1 }}
            />
          </View>
        </Layout>
      ) : (
        <Layout style={styles.container}>
          <Image
            style={styles.image}
            source={require("../assets/login-transparent.png")}
          />

          <Input
            style={styles.input}
            value={accesscode}
            label="Access Code"
            placeholder="Enter your access code"
            returnKeyType={Platform.OS === "ios" ? "done" : "next"}
            onChangeText={(text) => fCheckAccessCode(text)}
          />

          <Input
            style={styles.input}
            value={username}
            label="Username"
            placeholder="Enter your username"
            returnKeyType={Platform.OS === "ios" ? "done" : "next"}
            onChangeText={(text) => setUsername(text)}
          />

          <Input
            style={styles.input}
            value={password}
            label="Password"
            placeholder="Enter your password"
            secureTextEntry={true}
            returnKeyType={Platform.OS === "ios" ? "done" : "next"}
            onChangeText={(text) => setPassword(text)}
          />
          {/* <Button onPress={resetTermsAcknowledgmentAndShowAlert}>
            Reset Terms & Show Alert
          </Button> */}

          {loading && (
            <ProgressBar
              style={styles.progressBar}
              progress={progress}
              status="primary"
            />
          )}

          <Button
            style={[styles.button, isSelected && styles.buttonSelected]}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            onPress={fLogin}
            disabled={!isLoginEnabled}
          >
            {loginLabel}
          </Button>
        </Layout>
      )}
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  image: {
    width: 300,
    height: 300,
  },
  input: {
    marginVertical: 8,
    width: "100%",
  },
  progressBar: {
    marginVertical: 16,
    width: "100%",
  },
  button: {
    marginTop: 16,
    width: "100%",
    backgroundColor: "#0c4bc9",
    borderColor: "#0c4bc9",
  },
  sso: {
    marginTop: 8,
    color: "#b6daf2",
  },
  buttonSelected: {
    backgroundColor: "#5a8db0", // Darker shade when selected
    borderColor: "#5a8db0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
});

export default LoginScreen;
