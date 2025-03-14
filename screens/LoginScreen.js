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
  KeyboardAvoidingView,
  Keyboard,
  TouchableWithoutFeedback
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
import { handleBiometricAuth, storeCredentials, retrieveCredentials } from "./BiometricStorage";

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
  const [isAutofilled, setIsAutofilled] = useState(false);
  const [isLoginEnabled, setIsLoginEnabled] = useState(false);
  const route = useRoute();
  const webViewRef = useRef(null);
  const BiometricAuthRef = useRef(false);
  const [urlview, setUrlview] = useState("https://apps5.talonsystems.com/tseta/tc.htm");
  const [isTermsAccepted, setIsTermsAccepted] = useState(false);
  const url = "https://apps5.talonsystems.com/tseta/tc.htm";

  // useEffect(() => {
  //   const authenticateAndRetrieve = async () => {
  //     if (BiometricAuthRef.current) {
  //       return; // Exit if already authenticated
  //     }
  //     BiometricAuthRef.current = true; // Mark as authenticated
  //     setIsLoginEnabled(true); // Enable login button

  //     // 🔹 Step 1: Authenticate with Face ID
  //     const isAuthenticated = await handleBiometricAuth("Authenticate to Autofill Credentials");

  //     if (!isAuthenticated) {
  //       return; // Stop execution if Face ID fails
  //     }

  //     // 🔹 Step 2: Retrieve stored credentials
  //     const storedCredentials = await retrieveCredentials();

  //     if (storedCredentials?.username && storedCredentials?.password) {
  //       setAccesscode(storedCredentials.accesscode);
  //       setUsername(storedCredentials.username);
  //       setPassword(storedCredentials.password);
  //       setTimeout(() => {
  //         fLogin(); // Ensure state updates before login
  //       }, 100);

  //       if (!isAutofilled) {
  //         setIsAutofilled(true); // Prevent multiple autofills
  //       }
  //     } else {
  //       console.log("❌ No stored credentials found.");
  //     }
  //   };

  //   if (!isAutofilled && !BiometricAuthRef.current) {
  //     authenticateAndRetrieve(); // 🔥 Call the function here!
  //   }
  // }, [isAutofilled]);

  useEffect(() => {
    const authenticateAndRetrieve = async () => {
      if (BiometricAuthRef.current) return; // Exit if already authenticated
      BiometricAuthRef.current = true; // Mark as authenticated
      setIsLoginEnabled(true); // Enable login button

      // 🔹 Step 1: Authenticate with Face ID
      const isAuthenticated = await handleBiometricAuth("Authenticate to Autofill Credentials");

      if (!isAuthenticated) {
        console.log("❌ Biometric authentication failed.");
        return; // Stop execution if Face ID fails
      }

      // 🔹 Step 2: Retrieve stored credentials
      const storedCredentials = await retrieveCredentials();
      console.log("📌 Retrieved Credentials:", storedCredentials);

      if (storedCredentials?.username && storedCredentials?.password && storedCredentials?.accesscode) {
        setAccesscode(storedCredentials.accesscode);
        setUsername(storedCredentials.username);
        setPassword(storedCredentials.password);
        setIsAutofilled(true); // Prevent multiple autofills

        console.log("✅ Autofill Success: Access Code Set!");
      } else {
        console.log("❌ No stored credentials found.");
      }
    };

    // Ensure autofill is only triggered once
    if (!isAutofilled && !BiometricAuthRef.current) {
      authenticateAndRetrieve(); // 🔥 Call the function!
    }
  }, [isAutofilled]);

  // 🔹 Trigger `fLogin()` only when `accesscode` is set
  useEffect(() => {
    if (accesscode && username && password) {
      console.log("🚀 Attempting Auto Login...");
      fLogin();
    }
  }, [accesscode, username, password]);

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

  // async function fLogin() {
  //   if (accesscode === "" && ssoLogin === 0) {
  //     Alert.alert("You must specify an Access Code.");
  //     return;
  //   }
  //   if (username === "" && ssoLogin === 0) {
  //     Alert.alert("You must specify a User Name.");
  //     return;
  //   }
  //   if (password === "" && ssoLogin === 0) {
  //     Alert.alert("You must specify a Password.");
  //     return;
  //   }

  //   setLoading(true); // Start loading
  //   setProgress(0.3); // Example progress value, adjust based on your logic

  //   const conn = ""; //checkConnection();

  //   if (conn === "No network connection" || conn === "Unknown connection") {
  //     Alert.alert("You do not have an internet connection!");
  //     setLoading(false); // Stop loading
  //     setProgress(0); // Reset progress
  //   } else {
  //     const svr = accesscode.substring(0, 2).replace("0", ""); //remove leading zeros from the server: 02 becomes 2
  //     const talProd = "https://apps" + svr + ".talonsystems.com/";
  //     const localAcode = accesscode;
  //     var schema = "";
  //     // ERAU DEV
  //     if (localAcode.substring(0, 3).toUpperCase() === "ERD") {
  //       schema = "";
  //     } else if (localAcode.substring(0, 3).toUpperCase() === "ERQ") {
  //       schema = "";
  //     } else if (localAcode.substring(0, 3).toUpperCase() === "ERP") {
  //       schema = "";
  //     } else if (localAcode.substring(0, 6).toUpperCase() === "TALDEV") {
  //       schema = "";
  //     } else if (localAcode.substring(0, 6).toUpperCase() === "TALTST") {
  //       schema = "";
  //     } else {
  //       schema = localAcode.substring(2, 6);
  //     }

  //     if (
  //       //accesscode.substring(0, 1).toUpperCase() !== "E" &&
  //       ssoLogin === 0 &&
  //       isNaN(accesscode)
  //     ) {
  //       Alert.alert(
  //         "You have entered an invalid access code. Only numeric characters are allowed."
  //       );
  //       setLoading(false); // Stop loading
  //       setProgress(0); // Reset progress
  //     } else if (
  //       accesscode.substring(0, 1).toUpperCase() !== "E" &&
  //       accesscode.substring(0, 2) !== "01" &&
  //       accesscode.substring(0, 2) !== "02" &&
  //       accesscode.substring(0, 2) !== "03" &&
  //       accesscode.substring(0, 2) !== "04" &&
  //       accesscode.substring(0, 2) !== "05" &&
  //       accesscode.substring(0, 2) !== "06" &&
  //       accesscode.substring(0, 2) !== "07" &&
  //       accesscode.substring(0, 2) !== "08" &&
  //       accesscode.substring(0, 2) !== "09" &&
  //       accesscode.substring(0, 2) !== "10" &&
  //       accesscode.substring(0, 2) !== "11" &&
  //       accesscode.substring(0, 2) !== "12"
  //     ) {
  //       Alert.alert("You have entered an invalid access code.");
  //       setLoading(false); // Stop loading
  //       setProgress(0); // Reset progress
  //     } else if (
  //       accesscode.substring(0, 1).toUpperCase() !== "E" &&
  //       accesscode.length !== 10 &&
  //       ssoLogin === 0
  //     ) {
  //       Alert.alert("You have entered an invalid access code.");
  //       setLoading(false); // Stop loading
  //       setProgress(0); // Reset progress
  //     } else {
  //       var url = talProd + "tseta/servlet/";
  //       var sHost = talProd + "tseta/servlet/";

  //       var sHostResURL =
  //         sHost +
  //         "content?module=home&page=m&reactnative=1&accesscode=" +
  //         accesscode +
  //         "&customer=eta" +
  //         schema +
  //         "&etamobilepro=1&ssologin=" +
  //         ssoLogin;
  //       var getURL =
  //         sHostResURL +
  //         "&mode=mLogin" +
  //         "&uname=" +
  //         username +
  //         "&password=" +
  //         password +
  //         "&pushtoken=" +
  //         encodeURIComponent(etaPushToken);
  //       fetch(getURL)
  //         .then((response) => response.json())
  //         .then((json) => {
  //           if (json.ssologin == "1" && json.validated == "0") {
  //             json.host = sHostResURL;
  //             json.schema = schema;
  //             navigation.navigate("LoginSSO", { json });
  //             return json;
  //           }
  //           setLoading(false);
  //           setProgress(1);

  //           if (json.validated == "1") {
  //             json.host = sHost;
  //             json.schema = schema;
  //             if (json.svr == "") {
  //               json.svr = "TS" + svr + "P";
  //             }
  //             setAuthUser(json);
  //             setPassedData(json);
  //             setIsLoggedIn(true);
  //             saveAccessCode(accesscode);
  //             saveUsername(username);
  //           } else {
  //             Alert.alert(json.msg);
  //             setIsLoggedIn(false);
  //             setAuthUser(json);
  //           }
  //           return json;
  //         })
  //         .catch((error) => {
  //           setLoading(false); // Stop loading
  //           setProgress(0); // Reset progress
  //           Alert.alert(error.message);
  //           console.error(error.message);
  //         });
  //     }
  //   }
  //   setIsSelected(false);
  // }
  async function fLogin() {
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

    setLoading(true);
    setProgress(0.3);

    const conn = ""; //checkConnection();

    if (conn === "No network connection" || conn === "Unknown connection") {
      Alert.alert("You do not have an internet connection!");
      setLoading(false);
      setProgress(0);
    } else {
      const svr = accesscode.substring(0, 2).replace("0", "");
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

      if (ssoLogin === 0 && isNaN(accesscode)) {
        Alert.alert(
          "You have entered an invalid access code. Only numeric characters are allowed."
        );
        setLoading(false);
        setProgress(0);
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
          .then(async (json) => {
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

              // 🔹 Store Credentials with Face ID for Future Logins
              await storeCredentials(username, password, accesscode);
            } else {
              Alert.alert(json.msg);
              setIsLoggedIn(false);
              setAuthUser(json);
            }
            return json;
          })
          .catch((error) => {
            setLoading(false);
            setProgress(0);
            Alert.alert(error.message);
            console.error(error.message);
          });
      }
    }
    setIsSelected(false);
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <StatusBar style="dark-content" />

      <KeyboardAwareScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        enableOnAndroid={true}
        enableAutomaticScroll={true}
        keyboardShouldPersistTaps="handled" // ✅ Ensures button remains clickable
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <Layout style={{ flex: 1 }}>
            {isTermsAccepted ? (
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
            ) : (
              <Layout style={styles.container}>
                <Image
                  style={styles.image}
                  source={require("../assets/official_logo.png")}
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
                  autoCapitalize="none"
                />

                <Input
                  style={styles.input}
                  value={password}
                  label="Password"
                  placeholder="Enter your password"
                  secureTextEntry={true}
                  returnKeyType={Platform.OS === "ios" ? "done" : "next"}
                  onChangeText={(text) => setPassword(text)}
                  autoCapitalize="none"
                />

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
          </Layout>
        </TouchableWithoutFeedback>
      </KeyboardAwareScrollView>
    </KeyboardAvoidingView>
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
    width: 370, // Fixed width
    height: undefined, // Let the height adjust automatically
    aspectRatio: .9, // Maintains the correct aspect ratio (adjust as needed)
    resizeMode: "contain", // Ensures the image is not distorted
    alignSelf: "center", // Centers the image
    marginVertical: 20, // Adds spacing above and below
    marginTop: -80
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
