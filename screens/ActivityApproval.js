import React, { useState, useEffect } from "react";
import { StyleSheet, SafeAreaView, View, Platform, Alert } from "react-native";
import {
  Layout,
  Text,
  Button,
  Input,
  Toggle,
  Icon,
} from "@ui-kitten/components";
import { useAuth } from "./ThemeContext";
import { useRoute } from "@react-navigation/native";
import { handleFetchError } from "./ExtraImports";
import { EtaAlert } from "./ExtraImports";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const useInputState = (initialValue = "") => {
  const [value, setValue] = useState(initialValue);
  return { value, onChangeText: setValue, reset: () => setValue(initialValue) };
};

const ApproveActivity = ({ navigation }) => {
  const route = useRoute();
  const { activity } = route.params;
  const hoursInputState = useInputState("");
  const commentInputState = useInputState("");
  const pinInputState = useInputState("");
  const { authUser, setAuthUser, setIsLoggedIn } = useAuth();
  const [submitToScheduling, setSubmitToScheduling] = useState(false);
  const [etaresponse, setEtaresponse] = useState(null);

  const handleToggleChange = (isChecked) => {
    setSubmitToScheduling(isChecked);
  };

  const HandleAuthorization = async (approved) => {
    const hours = hoursInputState.value;
    const comment = commentInputState.value;
    const pin = pinInputState.value;

    const response = await fetch(
      `${authUser.host}content?module=home&page=m&reactnative=1&uname=${authUser.uname
      }&password=${authUser.upwd}&customer=eta${authUser.schema}&session_id=${authUser.sessionid
      }&mode=authrequest&etamobilepro=1&nocache=${Math.random().toString().split(".")[1]
      }&schactid=${activity.scheduleid}&requestid=${activity.requestid
      }&approval=${approved}&pinnum=${pin}&comment=${comment}&submittoscheduling=${submitToScheduling}&persid=${authUser.currpersid
      }`,
      {
        method: "POST",
        headers: {
          Accept: "application/txt",
          "Content-Type": "application/txt",
        },
      }
    );
    const data = await response.json();
    if (handleFetchError(data, setAuthUser, setIsLoggedIn)) {
      return; // Stop further processing if an error is handled
    }
    setEtaresponse(data);
  };

  useEffect(() => {
    if (etaresponse) {
      AlertMessage(etaresponse);
    }
  }, [etaresponse]);

  const AlertMessage = (item) => {
    //Alert.alert(item.msg);
    EtaAlert(
        "Alert",
        item.msg,
        "Ok",
        ""
      );
  };

  return (
    <KeyboardAwareScrollView enableAutomaticScroll={true} contentContainerStyle={styles.scrollcontainer}>
    <Layout style={styles.container}>
      <SafeAreaView>
        <View style={styles.content}>
          <Input
            multiline={true}
            textStyle={styles.textArea}
            placeholder="Hours Approved"
            returnKeyType={Platform.OS === "ios" ? "done" : "next"}
            blurOnSubmit={true}
            {...hoursInputState}
            style={styles.input}
          />
          <Input
            multiline={true}
            textStyle={styles.textArea}
            placeholder="Comment"
            returnKeyType={Platform.OS === "ios" ? "done" : "next"}
            blurOnSubmit={true}
            {...commentInputState}
            style={styles.input}
          />
          <Input
            multiline={true}
            textStyle={styles.textArea}
            placeholder="Pin"
            returnKeyType={Platform.OS === "ios" ? "done" : "next"}
            blurOnSubmit={true}
            {...pinInputState}
            style={styles.input}
            accessoryRight={(props) => <Icon {...props} name="lock-outline" />}
          />
          <View style={styles.toggleContainer}>
            <Text style={styles.toggleText}>Submit to Scheduling?</Text>
            <Toggle
              checked={submitToScheduling}
              onChange={handleToggleChange}
            />
          </View>
          <View style={styles.buttonContainer}>
            <Button
              style={styles.approveButton}
              status="success"
              onPress={() => {
                HandleAuthorization("approve");
                navigation.goBack();
              }}
            >
              Approve
            </Button>
            <Button
              style={styles.denyButton}
              status="danger"
              onPress={() => {
                HandleAuthorization("deny");
                navigation.goBack();
              }}
            >
              Deny
            </Button>
            <Button
              style={styles.cancelButton}
              appearance="outline"
              onPress={() => {
                navigation.goBack();
              }}
            >
              Cancel
            </Button>
          </View>
        </View>
      </SafeAreaView>
    </Layout>
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f7f9fc",
  },
  scrollcontainer: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    justifyContent: "center",
  },
  title: {
    fontWeight: "bold",
    fontSize: 20,
    color: "#2E3A59",
  },
  content: {
    paddingHorizontal: 16,
  },
  textArea: {
    minHeight: 64,
  },
  input: {
    borderColor: "#E4E9F2",
    marginBottom: 16,
    borderRadius: 8,
  },
  toggleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 16,
    paddingHorizontal: 8,
  },
  toggleText: {
    fontWeight: "bold",
    color: "#8F9BB3",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 16,
  },
  approveButton: {
    backgroundColor: "#4CAF50",
    borderColor: "#4CAF50",
    borderRadius: 8,
  },
  denyButton: {
    backgroundColor: "#f44336",
    borderColor: "#f44336",
    borderRadius: 8,
  },
  cancelButton: {
    borderColor: "#3366FF",
    borderRadius: 8,
  },
});

export default ApproveActivity;
