import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Alert,
  TouchableOpacity,
  Image,
  Platform,
  View,
  KeyboardAvoidingView,
  ScrollView
} from "react-native";
import {
  Input,
  Button,
  Layout,
  Text,
  Spinner,
  ProgressBar,
} from "@ui-kitten/components";
import { useAuth } from "./ThemeContext";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useFocusEffect, useRoute } from "@react-navigation/native";

export default function ChgPwdScreen({ navigation }) {
  const { authUser, setAuthUser, chgPwd, setChgPwd, setIsLoggedIn, pinformat, pwdformat } = useAuth();
  const [newpassword, setNewPassword] = useState("");
  const [confirmpass, setConfirmPass] = useState("");
  const [oldpassword, setOldPassword] = useState("");
  const [newpin, setNewPin] = useState("");
  const [confirmpin, setConfirmPin] = useState("");
  const [oldpin, setOldPin] = useState("");
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [isSelected, setIsSelected] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [focusOldPwd, setFocusOldPwd] = useState(false);
  const [focusNewPwd, setFocusNewPwd] = useState(false);
  const [focusConfirmPwd, setFocusConfirmPwd] = useState(false);
  const [focusNewPin, setFocusNewPin] = useState(false);
  const [focusConfirmPin, setFocusConfirmPin] = useState(false);
  const encodeComponentoldpassword = encodeURIComponent(oldpassword);
  const encodeComponentnewpin = encodeURIComponent(newpin);
  const encodeComponentnewpassword = encodeURIComponent(newpassword);
  const encodeComponentoldpin = encodeURIComponent(oldpin);
  //const [msg, setMsg] = useState("");
  const [violations, setViolation] = useState([]);
  const [requirements, setRequirements] = useState([]);

  const forbiddenChars = /[\^,:#;@\[\]{}<>|="%\\\/+&]/;


  const hasLetter = /[a-zA-Z]/.test(newpin);
  const hasNumber = /[0-9]/.test(newpin);
  const hasMinLength = newpin.length >= 4;
  const hasNoSpecials = !forbiddenChars.test(newpin);
  const pinMatches = newpin === confirmpin;
  const isPinValid = hasLetter && hasNumber && hasMinLength && hasNoSpecials && pinMatches;

  //   // --- Password validation ---
  // const pwdHasMinLength = newpassword.length >= 4;
  // const pwdNoSpecials = !forbiddenChars.test(newpassword);
  // const pwdMatches = newpassword === confirmpass;
  // const isPwdValid = pwdHasMinLength && pwdNoSpecials && pwdMatches;

  // // --- Combined condition ---
  // const isFormValid =
  //   (authUser.chgpwd === "1" ? isPwdValid : true) &&
  //   (authUser.chgpin === "1" ? isPinValid : true);

  // Build a list of what’s missing

  // useEffect(() => {
  //   const rawRequirements = "needs to be 5 characters long. need to have 1 number. need to have 1 letter. Cannot contain special characters. Max length is 6";
  //   const fakeResponseFail = {
  //     chgpwd: "1",
  //     chgpin:"1",
  //     validated: "0",
  //     msg: "Password must include a number. Password must not contain special characters.",
  //   };

  //   setRequirements(rawRequirements.split("."));
  //   setViolation(fakeResponseFail.msg.split("."));
  // }, []);

  useEffect(() => {
    const pwdArray = pwdformat.split(".").map((s) => s.trim()).filter(Boolean);
    const pinArray = pinformat.split(".").map((s) => s.trim()).filter(Boolean);
    setRequirements([...pwdArray, ...pinArray]);
  }, []);

  const errors = [];
  if (!hasMinLength) errors.push("at least 4 characters");
  if (!hasLetter) errors.push("a letter");
  if (!hasNumber) errors.push("a number");
  if (!hasNoSpecials) errors.push("no special characters");
  const passwordHint = ` 
        Your password/pin cannot contain these special characters: ^ , : # ; @ [ ] { } < > | = " % \ / + &`

  const updatePWD = () => {
    // const logoutURL = authUser.host;
    //setChgPwd(0);
    var surl = `${authUser.host}content?module=home&page=m&reactnative=1&uname=${authUser.uname}&password=${authUser.upwd}&customer=eta${authUser.schema}&session_id=${authUser.sessionid}&mode=chgpwdpin&etamobilepro=1&newpwd=${encodeComponentnewpassword}&newpin=${encodeComponentnewpin}&oldpassword=${encodeComponentoldpassword}&oldpin=${encodeComponentoldpin}&persid=${authUser.currpersid}`;
    fetch(surl)
      .then((response) => response.json())
      .then((json) => {

        authUser.chgpwd = json.chgpwd;
        authUser.chgpin = json.chgpin;
        authUser.validated = json.validated;
        //update specific fields
        setAuthUser(authUser);

        if (authUser.validated === 1) {
          //setMsg(json.msg);
          const updatedData = { validated: authUser.validated, chgpwd: authUser.chgpwd, chgpin: authUser.chgpin}
          setChgPwd("0");
          Alert.alert(json.msg);
          navigation.popTo("Login", { updatedData })
        } else {
          const pwdviolation = json.pwdformat.split(".").map((s) => s.trim()).filter(Boolean);
          const pinviolation = json.pinformat.split(".").map((s) => s.trim()).filter(Boolean);
          setViolation([...pwdviolation, ...pinviolation]);
          Alert.alert("Your password/pin is not valid. Please try again");
        }
        return json;
      })
      .catch((error) => {
        console.log("error",error);
        Alert.alert(error.message);
        setIsLoggedIn(false);
        setAuthUser(null);
      });
    return true;
  };


  const toggleSecurity = () => {
    setSecureTextEntry(!secureTextEntry);
  }


  const handlePress = () => {
    updatePWD();
  };


  const RenderIcon = (isVisible, toggle) => {
    return (props) => (
      <Icon
        {...props}
        name={isVisible ? "eye" : "eye-off"}
        size={20}
        color="#8f9bb3"
        onPress={toggle}
      />
    );
  };


  const handlePressIn = () => {
    setIsSelected(true);
  };

  const handlePressOut = () => {
    setIsSelected(false);
  };
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <KeyboardAwareScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        enableOnAndroid={true}
        enableAutomaticScroll={true}
        keyboardShouldPersistTaps="handled"
      >
        <Layout style={styles.container} level="1">
          {pinformat ? (<>
            <Text category="h5" style={styles.title}>
              You are required to change your password/pin.
            </Text>
            <View style={styles.requirementsBox}>
              {requirements.map((req, i) => (
                <Text key={i} style={styles.requirementItem}> {req.trim()}</Text>
              ))}
            </View>

          </>) : (<>
            <Text category="h5" style={styles.title}>
              You are required to change your password.
            </Text>
            <View style={styles.requirementsBox}>
              {requirements.map((req, i) => (
                <Text key={i} style={styles.requirementItem}> {req.trim()}</Text>
              ))}
            </View>

          </>)}
          <Text>
            {violations.length > 0 && (
              <View style={styles.violationBox}>
                <Text style={styles.violationTitle}>Violations:</Text>
                {violations.map((v, i) =>
                  v.trim() ? (
                    <Text key={i} style={styles.violationItem}>
                      • {v.trim()}
                    </Text>
                  ) : null
                )}
              </View>
            )}

            <Text style={styles.hint}>{passwordHint}</Text>

          </Text>
          {pwdformat && (
            <>
              <Input
                style={styles.input}
                value={oldpassword}
                label="Enter Your Old Password"
                placeholder="Enter Your Old Password"
                returnKeyType={Platform.OS === "ios" ? "done" : "next"}
                secureTextEntry={secureTextEntry}
                onChangeText={(text) => setOldPassword(text)}
                onFocus={() => setFocusOldPwd(true)}
                onBlur={() => setFocusOldPwd(false)}
              />

              <Input
                style={styles.input}
                value={newpassword}
                label="Enter New Password"
                placeholder="Enter New Password"
                returnKeyType={Platform.OS === "ios" ? "done" : "next"}
                secureTextEntry={secureTextEntry}
                onChangeText={(text) => setNewPassword(text)}
                onFocus={() => setFocusNewPwd(true)}
                onBlur={() => setFocusNewPwd(false)}
              />
              <Input
                style={styles.input}
                value={confirmpass}
                label="Re-enter New Password"
                placeholder="Enter your Password"
                returnKeyType={Platform.OS === "ios" ? "done" : "next"}
                secureTextEntry={secureTextEntry}
                onChangeText={(text) => setConfirmPass(text)}
                onFocus={() => setFocusConfirmPwd(true)}
                onBlur={() => setFocusConfirmPwd(false)}
              />
              {focusConfirmPwd && (
                <Text style={{ color: confirmpass === newpassword ? 'green' : 'red', marginTop: 4 }}>
                  {confirmpass === newpassword
                    ? 'Passwords match'
                    : 'Passwords do not match'}
                </Text>
              )}
            </>
          )}


          {pinformat && (
            <>
              <Input
                style={styles.input}
                value={oldpin}
                label="Enter Your Old Pin"
                placeholder="Enter Your Old Pin"
                returnKeyType={Platform.OS === "ios" ? "done" : "next"}
                secureTextEntry={secureTextEntry}
                onChangeText={(text) => setOldPin(text)}
                onFocus={() => setFocusOldPwd(true)}
                onBlur={() => setFocusOldPwd(false)}
              />

              <Input
                style={styles.input}
                value={newpin}
                label="Enter New Pin"
                placeholder="Enter New Pin"
                returnKeyType={Platform.OS === "ios" ? "done" : "next"}
                secureTextEntry={secureTextEntry}
                onChangeText={(text) => setNewPin(text)}
                onFocus={() => setFocusNewPin(true)}
                onBlur={() => setFocusNewPin(false)}
              />
              <Input
                style={styles.input}
                value={confirmpin}
                label="Re-enter New Pin"
                placeholder="Enter your Pin"
                returnKeyType={Platform.OS === "ios" ? "done" : "next"}
                secureTextEntry={secureTextEntry}
                onChangeText={(text) => setConfirmPin(text)}
                onFocus={() => setFocusConfirmPin(true)}
                onBlur={() => setFocusConfirmPin(false)}
              />
              {focusConfirmPin && (
                <Text style={{ color: confirmpin === newpin ? 'green' : 'red', marginTop: 4 }}>
                  {confirmpin === newpin
                    ? 'PINs match'
                    : 'PINs do not match'}
                </Text>
              )}
            </>
          )}
          <Button
            style={[
              styles.button,
              isSelected && styles.buttonSelected, // Apply selected styles
            ]}
            onPressIn={handlePressIn} // Trigger when button is pressed
            onPressOut={handlePressOut} // Trigger when button is released
            onPress={handlePress}
          // disabled={}
          >
            {authUser?.chgpin === "1" ? "UPDATE PASSWORD AND PIN" : "UPDATE PASSWORD"}
          </Button>
        </Layout>
      </KeyboardAwareScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f6fc",
    padding: 20,
  },
  section: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
    color: "#1a2138",
  },
  requirementsBox: {
    marginBottom: 12,
    backgroundColor: "#eef2fa",
    borderRadius: 8,
    padding: 12,
  },
  requirementsTitle: {
    fontWeight: "600",
    color: "#3d5a80",
    marginBottom: 6,
  },
  requirementItem: {
    fontSize: 14,
    color: "#364f6b",
    paddingLeft: 6,
  },
  violationBox: {
    backgroundColor: "#fff0f0",
    borderColor: "#ff6b6b",
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  violationTitle: {
    fontWeight: "600",
    color: "#c53030",
    marginBottom: 6,
  },
  violationItem: {
    color: "#c53030",
    fontSize: 14,
    paddingLeft: 6,
  },
  hint: {
    textAlign: "center",
    fontSize: 13,
    color: "#ff6b6b",
    fontStyle: "italic",
    marginTop: 8,
  },
  input: {
    marginBottom: 16,
    borderRadius: 8,
    backgroundColor: "#f7f9fc",
  },
  button: {
    marginTop: 20,
    borderRadius: 25,
    backgroundColor: "#3366FF",
    borderColor: "#3366FF",
  },
  buttonSelected: {
    backgroundColor: "#254EDB",
    borderColor: "#254EDB",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },

});
