import React, { useState } from "react";
import { StyleSheet,Alert } from "react-native";
import { Text, Button, Layout } from "@ui-kitten/components";
import { useAuth } from "./ThemeContext";

export default function LogoutScreen({ navigation }) {
  const { authUser, setAuthUser, isLoggedIn, setIsLoggedIn } = useAuth();
  const logOut = () => {
    const logoutURL=authUser.host;    
    var surl=`${authUser.host}content?module=home&page=m&reactnative=1&uname=${authUser.uname}&password=${authUser.upwd}&customer=eta${authUser.schema}&session_id=${authUser.sessionid}&mode=mLogout&etamobilepro=1`;
    fetch(surl)
          .then((response) => response.json())
          .then((json) => {
            if (json.errcode == "0") {
              setIsLoggedIn(false);
              //setAuthUser(null);
              setAuthUser(authUser);
            } else {
              Alert.alert("Unable to logout of ETA properly.");
              setIsLoggedIn(false);
              //setAuthUser(null);
              setAuthUser(authUser);
            }
            return json;
          })
          .catch((error) => {            
            Alert.alert(error.message);
            setIsLoggedIn(false);
            setAuthUser(null);
          });      
  };

  const [isSelected, setIsSelected] = useState(false);

  const handlePressIn = () => {
    setIsSelected(true);
  };

  const handlePressOut = () => {
    setIsSelected(false);
  };

  return (
    <Layout style={styles.container} level="1">
      <Text category="h5" style={styles.title}>
        Are you sure you want to log out?
      </Text>

      <Button
        style={[
          styles.button,
          isSelected && styles.buttonSelected, // Apply selected styles
        ]}
        onPressIn={handlePressIn} // Trigger when button is pressed
        onPressOut={handlePressOut} // Trigger when button is released
        onPress={logOut}
      >
        Logout
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
