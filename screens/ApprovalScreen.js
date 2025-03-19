import React, { useState, useEffect } from "react";
import { StyleSheet, SafeAreaView, ScrollView, View, Platform, Alert } from "react-native";
import {
  Layout,
  Text,
  Button,
  Input,
  Toggle,
  Icon
} from "@ui-kitten/components";
import { useAuth } from "./ThemeContext";
import { useRoute } from "@react-navigation/native";
import { handleFetchError } from "./ExtraImports";
const useInputState = (initialValue = "") => {
  const [value, setValue] = useState(initialValue);
  return { value, onChangeText: setValue, reset: () => setValue(initialValue) };
};

const Approve = ({ navigation }) => {
  const route = useRoute();
  const { pdata } = route.params;
  const hoursInputState = useInputState("");
  const [activityType, setActivityType] = useState(pdata.acttype);
  const [submit, setSubmit] = useState(false); // Control toggle visibility
  const commentInputState = useInputState("");
  const pinInputState = useInputState("");
  const { authUser, setAuthUser, setIsLoggedIn } = useAuth();
  const [submitToScheduling, setSubmitToScheduling] = useState(false);
  const [etaresponse, setEtaresponse] = useState(null);
  const [warnings, setWarnings] = useState([]);

  const handleToggleChange = (isChecked) => {
    setSubmitToScheduling(isChecked);
  };

  const ToggleCondition = () => {
    // Check if activity type requires "Submit to Scheduling" option
    if (
      activityType === "admin" ||
      activityType === "rental" ||
      activityType === "curr" ||
      activityType === "refresher"
    ) {
      setSubmit(true); // Show the toggle
    } else {
      setSubmit(false); // Hide the toggle
    }
  };

  const fetchAuthWarning = async (reqid, reqstp) => {
    try {
      const response = await fetch(
        `${authUser.host}content?module=home&page=m&reactnative=1&uname=${authUser.uname
        }&password=${authUser.upwd}&customer=eta${authUser.schema}&session_id=${authUser.sessionid
        }&mode=getauthwarn&etamobilepro=1&nocache=${Math.random().toString().split(".")[1]
        }&persid=${authUser.currpersid}&reqid=${reqid}&reqtp=${reqstp}
        `
      );

      response.text().then((data) => { setWarnings((data.replace('\\n', '').replace('\\nClick OK to continue or CANCEL to stop.\\n', '').replace('.\\n', '.')).split('Note:')); });
    } catch (e) {
      Alert.alert("Warning", "Unable to get warning(s) related to pending authorization request.");
    }
  };

  const HandleAuthorization = async (authtype) => {
    const hours = hoursInputState.value;
    const comment = commentInputState.value;
    const pin = pinInputState.value;

    if ((!hours || !pin || !comment) && authtype === 'approved') {
      if (
        activityType === "admin" ||
        activityType === "rental" ||
        activityType === "curr" ||
        activityType === "refresher"
      ) { } else {
        if (hours > pdata.hour) {
          Alert.alert("Warning", "Hours approved cannot be greater than " + pdata.hour.toString() + ".");
        } else
          Alert.alert("Warning", "All fields are required.");
        return;
      }
    }

    const response = await fetch(
      `${authUser.host
      }content?module=home&page=m&reactnative=1&mode=authrequest&reqtype=${pdata.reqtype
      }&requestid=${pdata.requestid
      }&hrsappr=${hours}&authtype=${authtype}&pinnum=${pin}&comment=${comment}&submittoscheduling=${submitToScheduling}&persid=${authUser.currpersid
      }&uname=${authUser.uname}&password=${authUser.upwd}&customer=eta${authUser.schema
      }&session_id=${authUser.sessionid}&etamobilepro=1&nocache=${Math.random().toString().split(".")[1]
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

    setEtaresponse({ ...data, action: authtype });
    navigation.popTo("PendingAuth", { reqid: pdata.requestid, processed: true })
  };


  useEffect(() => {
    // Check toggle visibility based on the activity type
    ToggleCondition();
    fetchAuthWarning(pdata.requestid, pdata.reqtype);
  }, [activityType, pdata]); // Run only when the activityType changes


  const handleConfirm = () => {
    if (etaresponse.status == "-1") {
      Alert.alert("Error", etaresponse.msg);
    } else if (etaresponse.status == "0") {
      Alert.alert(
        "Alert",
        etaresponse.msg,
        [
          {
            text: "OK",
            onPress: navigation.popTo("PendingAuth", {
              isapprdeny: true,
              reqid: pdata.requestid,
            }),
          }, //worked but seem like it is executed and go back instead of wait for acknowledgment
        ],
        { cancelable: false }
      );
    }
  };

  return (
    <Layout style={styles.container}>
      <SafeAreaView>
        <ScrollView>
          <View style={styles.content}>
            <Text category="h5" style={styles.title}>{pdata.value}</Text>
            {activityType === "admin" ||
              activityType === "rental" ||
              activityType === "curr" ||
              activityType === "refresher" ?
              (warnings.length > 0 ?
                (<ScrollView style={styles.scrollViewWarning}>
                  <Text category="p1" style={styles.comment}>{pdata.comment}</Text>
                  <Text style="color:red">Warning(s):</Text>
                  {warnings.map((w, i) => (<Text key={i}>{w}</Text>))}
                </ScrollView>)
                : (<></>)
              )
              :
              (<View style={styles.content}>
                <Text category="p2" appearance="hint" style={styles.subtitle}>
                  {pdata.hour} Hours
                </Text>
                <Text category="p1" style={styles.comment}>{pdata.comment}</Text>
                <Input
                  label="Hours Approved"
                  placeholder="Enter Hours"
                  keyboardType="numeric"
                  {...hoursInputState}
                  style={styles.input}
                  returnKeyType={Platform.OS === "ios" ? "done" : "next"}
                />
              </View>
              )
            }
            <Input
              label="Authorization Comment"
              placeholder="Enter Comment"
              {...commentInputState}
              style={styles.input}
            />
            <Input
              label="PIN"
              placeholder="Enter your PIN"
              secureTextEntry={true}
              accessoryRight={(props) => <Icon {...props} name="lock-outline" />}
              {...pinInputState}
              style={styles.input}
              returnKeyType={Platform.OS === "ios" ? "done" : "next"}
            />

            {submit && (
              <View style={styles.toggleContainer}>
                <Text style={styles.toggleText}>Submit to Scheduling?</Text>
                <Toggle
                  checked={submitToScheduling}
                  onChange={handleToggleChange}
                />
              </View>
            )}

            <View style={styles.buttonContainer}>
              <Button style={styles.approveButton} onPress={() => {
                HandleAuthorization('approved');
              }}>Approve</Button>
              <Button style={styles.denyButton} onPress={() => {
                HandleAuthorization('denied');
              }}>Deny</Button>
              <Button appearance="outline" onPress={() => navigation.goBack()}>Cancel</Button>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f5f7",
    padding: 16,
  },
  content: {
    marginTop: 10,
  },
  title: {
    fontWeight: "bold",
    fontSize: 20,
    marginBottom: 4,
    textAlign: "center",
  },
  subtitle: {
    textAlign: "center",
    marginBottom: 10,
    color: "#6b7280",
  },
  comment: {
    marginBottom: 20,
    textAlign: "center",
    color: "#6b7280",
  },
  input: {
    marginBottom: 12,
    borderRadius: 8,
    backgroundColor: "#ffffff",
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  toggleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    marginBottom: 16,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
  approveButton: {
    flex: 1,
    marginRight: 8,
    backgroundColor: "#4CAF50",
    borderColor: "#4CAF50",
  },
  denyButton: {
    flex: 1,
    marginRight: 8,
    backgroundColor: "red",
    borderColor: "red",
  },
  scrollViewWarning: {
    height: 100,
    borderWidth: 1,
    borderColor: 'red'
  }
});

export default Approve;
