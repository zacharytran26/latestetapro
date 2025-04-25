import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  SafeAreaView,
  View,
  Platform,
  Alert,
  ScrollView,
} from "react-native";
import { Layout, Text, Button, Input, Icon, Card } from "@ui-kitten/components";
import { useAuth } from "./ThemeContext";
import { useRoute, useNavigation } from "@react-navigation/native";
import { handleFetchError } from "./ExtraImports";

const useInputState = (initialValue = "") => {
  const [value, setValue] = useState(initialValue);
  return { value, onChangeText: setValue, reset: () => setValue(initialValue) };
};

const ConfirmFIF = ({ navigation }) => {
  const route = useRoute();
  const { fifdata } = route.params; // Passed JSON array with CONFIRM_CODE
  const pinInputState = useInputState(""); // Input for PIN
  const confirmInputState = useInputState("");
  const [confirm, setConfirm] = useState(false); // Determines if confirmation code is needed
  const { authUser, setAuthUser, setIsLoggedIn } = useAuth();
  const [etaresponse, setEtaresponse] = useState(null); // Stores the response JSON

  const HandleAuthorization = async () => {
    const confirmcode = confirmInputState.value;
    const pin = pinInputState.value;
    try {
      //console.log("Response Data:", data);
      const response = await fetch(
        `${authUser.host}content?module=home&page=m&reactnative=1&uname=${authUser.uname
        }&password=${authUser.upwd}&customer=eta${authUser.schema}&session_id=${authUser.sessionid
        }&mode=confirmfif&etamobilepro=1&nocache=${Math.random().toString().split(".")[1]
        }&pinnum=${pin}&confirmcode=${confirmcode}&persid=${authUser.currpersid
        }&fifid=${fifdata.ID}`,
        {
          method: "POST",
          headers: {
            Accept: "application/txt",
            "Content-Type": "application/txt",
          },
        }
      );
      const data = await response.json(); // Parse the JSON from the response
      if (handleFetchError(data, setAuthUser, setIsLoggedIn)) {
        return; // Stop further processing if an error is handled
      }
      //console.log("Response Data:", data);
      setEtaresponse(data); // Store response in state
    } catch (error) {
      console.error("Error during fetch:", error);
    }
  };
  useEffect(() => {
    if (etaresponse) {
      handleInput(etaresponse);
    }
  }, [etaresponse]);

  const renderConfirmInput = () => {
    const confirmCode = fifdata?.CONFIRM_CODE?.trim();
    useEffect(() => {
      if (confirmCode) {
        setConfirm(true);
      } else {
        setConfirm(false);
      }
    }, [confirmCode]);
    if (confirmCode) {
      return (
        <Input
          {...confirmInputState}
          placeholder="Enter Confirmation Code"
          returnKeyType={Platform.OS === "ios" ? "done" : "next"}
          style={styles.input}
          accessoryRight={(props) => (
            <Icon {...props} name="checkmark-outline" />
          )}
        />
      );
    }
    return (
      <Text style={styles.subtitle}>
        No confirmation code required. Please enter your PIN to proceed.
      </Text>
    );
  };

  const handleInput = (response) => {
    if (response.status === "cancel") {
      // Handle cancellation logic
      navigation.goBack();
      return;
    }
    if (confirm) {
      if (fifdata.CONFIRM_CODE != confirmInputState.value ) {
        Alert.alert("Invalid Confirmation Code. Please Try Again");
      } else {
        if (response.status === "confirm") {
          Alert.alert("The FIF has been confirmed");
          const FifId = {
            id: String(fifdata.ID), // Ensure ID is a string
          };
          // navigation.navigate("FIF", { FifId });
          navigation.popTo("FIF", { FifId, isConfirmed: true })
        }else{
          Alert.alert(response.msg);
        }
      }
    }

    // if (response.status === "confirm") {
    //   Alert.alert("The FIF has been confirmed");
    // }
  };

  return (
    <Layout style={styles.container}>
      <SafeAreaView>
        <Text style={styles.title}>Confirm FIF Activity</Text>
        <View style={styles.content}>
          {renderConfirmInput()}
          <Input
            multiline={false}
            textStyle={styles.textArea}
            placeholder="Pin"
            returnKeyType={Platform.OS === "ios" ? "done" : "next"}
            // blurOnSubmit={true}
            {...pinInputState}
            style={styles.input}
            secureTextEntry={true}
            accessoryRight={(props) => <Icon {...props} name="lock-outline" />}
          />
          <View style={styles.buttonContainer}>
            <Button
              style={styles.confirmButton}
              status="success"
              onPress={HandleAuthorization}
            >
              Confirm
            </Button>
            <Button
              style={styles.cancelButton}
              appearance="outline"
              onPress={() => {
                handleInput({ status: "cancel" });
              }}
            >
              Cancel
            </Button>
          </View>
        </View>
      </SafeAreaView>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f7f9fc",
  },
  card: {
    padding: 20,
    borderRadius: 10,
    backgroundColor: "#ffffff",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2E3A59",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: "#8F9BB3",
    marginBottom: 20,
  },
  input: {
    borderColor: "#E4E9F2",
    marginBottom: 16,
    borderRadius: 8,
  },
  textArea: {
    minHeight: 40,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginTop: 20,
  },
  confirmButton: {
    flex: 1,
    marginRight: 8,
    backgroundColor: "#4CAF50",
    borderColor: "#4CAF50",
    borderRadius: 8,
  },
  cancelButton: {
    flex: 1,
    marginLeft: 8,
    borderColor: "#3366FF",
    borderRadius: 8,
  },
});

export default ConfirmFIF;
