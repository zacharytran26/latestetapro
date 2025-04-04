import React, { useState } from "react";
//import { StyleSheet,Alert } from "react-native";
//import { Text, Button, Layout, Input } from "@ui-kitten/components";
import {
  StyleSheet,
  Alert,
  TouchableOpacity,
  Image,
  Platform,
  View,
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
import { useFocusEffect, useRoute } from "@react-navigation/native";

export default function ChgPwdScreen({ navigation }) {
  const { authUser, setAuthUser, chgPwd, setChgPwd, setIsLoggedIn } = useAuth();
  const [newpassword, setNewPassword] = useState("");
  const [confirmpass, setConfirmPass] = useState("");
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [isSelected, setIsSelected] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const updatePWD = () => {
    const logoutURL = authUser.host;
    //setChgPwd(0);
    var surl = `${authUser.host}content?module=home&page=m&reactnative=1&uname=${authUser.uname}&password=${authUser.upwd}&customer=eta${authUser.schema}&session_id=${authUser.sessionid}&mode=chgpwd&etamobilepro=1&newpwd=${newpassword}`;
    fetch(surl)
      .then((response) => response.json())
      .then((json) => {
        authUser.chgpwd = json.chgpwd;
        authUser.validated = json.validated;
        setAuthUser(authUser);
        //console.log("authUser2",authUser);

        return json;
      })
      .catch((error) => {
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
    if (newpassword === confirmpass) {
      const updatedData = { validated: authUser.validated, chgpwd: authUser.chgpwd }
      updatePWD();
      setChgPwd("0");
      navigation.popTo("Login", { updatedData })
    } else {
      Alert.alert("Your password and confirmation password do not match.")
    }
  }
  const RenderIcon = (props) => (
    <Icon
      {...props}
      name={secureTextEntry ? "eye-off" : "eye"}
      size={20}
      color="#8f9bb3"
      onPress={toggleSecurity}
    />
  );


  const handlePressIn = () => {
    setIsSelected(true);
  };

  const handlePressOut = () => {
    setIsSelected(false);
  };

  return (
    <Layout style={styles.container} level="1">
      <Text category="h5" style={styles.title}>
        Your existing password has expired or is no longer valid.  Please enter a new password
      </Text>
      <Input
        style={styles.input}
        value={newpassword}
        label="Enter New Password"
        placeholder="Enter New Password"
        returnKeyType={Platform.OS === "ios" ? "done" : "next"}
        secureTextEntry={secureTextEntry}
        onChangeText={(text) => setNewPassword(text)}
        accessoryRight={RenderIcon}
        onFocus={() => setIsFocused(true)}
      />
      {isFocused && (
  <Text style={{ color: newpassword.length === 4 ? 'green' : 'red', marginTop: 4 }}>
    {newpassword.length === 4
      ? 'Password length is good'
      : `Password must be at least 4 characters (${newpassword.length}/4)`}
  </Text>
)}
      <Input
        style={styles.input}
        value={confirmpass}
        label="Re-enter New Password"
        placeholder="Enter your Password"
        returnKeyType={Platform.OS === "ios" ? "done" : "next"}
        secureTextEntry={secureTextEntry}
        onChangeText={(text) => setConfirmPass(text)}
        accessoryRight={RenderIcon}
        onFocus={() => setIsFocused(true)}
      />
            {isFocused && (
  <Text style={{ color: confirmpass === newpassword ? 'green' : 'red', marginTop: 4 }}>
    {confirmpass === newpassword
      ? 'Passwords match'
      : 'Passwords do not match'}
  </Text>
)}
      <Button
        style={[
          styles.button,
          isSelected && styles.buttonSelected, // Apply selected styles
        ]}
        onPressIn={handlePressIn} // Trigger when button is pressed
        onPressOut={handlePressOut} // Trigger when button is released
        onPress={handlePress}
      >
        UPDATE PASSWORD
      </Button>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f7f9fc",
  },
  title: {
    marginBottom: 20,
    textAlign: "center",
  },
  button: {
    width: "80%",
    backgroundColor: "#f20a0a",
    borderColor: "#f20a0a",
    borderRadius: 25,
  },
  buttonSelected: {
    backgroundColor: "#d91e1e", // Darker shade when selected
    borderColor: "#d91e1e",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  text: {
    marginHorizontal: 8,
    marginTop: 20,
  },
});
