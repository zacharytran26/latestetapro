import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  SafeAreaView,
  Alert,
  TouchableOpacity,
  Keyboard,
  TouchableWithoutFeedback,
  Platform,
} from "react-native";
import {
  Button,
  Input,
  Layout,
  Text,
  Icon,
  Divider,
} from "@ui-kitten/components";
import { useRoute, useNavigation } from "@react-navigation/native";
import { useAuth } from "./ThemeContext";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const SendIcon = (props) => <Icon {...props} name="paper-plane-outline" />;
const DeleteIcon = (props) => <Icon {...props} name="trash-2-outline" />;

const useInputState = (initialValue = "") => {
  const [value, setValue] = useState(initialValue);
  return { value, onChangeText: setValue, reset: () => setValue(initialValue) };
};

export const ReplyScreen = ({ navigation }) => {
  const multilineInputState = useInputState("");
  const route = useRoute();
  const { email } = route.params;
  const { authUser } = useAuth();
  const message = multilineInputState.value;

  const ReplyEmails = async () => {
    const response = await fetch(
      `${authUser.host}content?module=home&page=m&reactnative=1&uname=${
        authUser.uname
      }&password=${authUser.upwd}&customer=eta${authUser.schema}&session_id=${
        authUser.sessionid
      }&mode=replymessage&etamobilepro=1&nocache=${
        Math.random().toString().split(".")[1]
      }&persid=${authUser.currpersid}&msgid=${email.id}&topersid=${
        email.sender
      }&string=${message}`,
      {
        method: "POST",
        headers: {
          Accept: "application/txt",
          "Content-Type": "application/txt",
        },
      }
    );
  };

  const handleRefresh = () => {
    multilineInputState.reset();
  };

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      enableOnAndroid={true}
      enableAutomaticScroll={true}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <Layout style={styles.container}>
          <SafeAreaView style={styles.safeArea}>
            <Divider />
            <View style={styles.emailInfoContainer}>
              <Text category="s1" style={styles.emailInfo}>
                To: {email.from}
              </Text>              
            </View>
            <Input
              multiline={true}
              textStyle={{ minHeight: 200 }} // Extended input height
              placeholder="Type your message"
              //returnKeyType={Platform.OS === "ios" ? "done" : "next"} // Add this line to change return key to "Done" on iOS
              //blurOnSubmit={true} // Add this line to dismiss keyboard on submit
              {...multilineInputState}
              style={styles.input}
            />
            <View style={styles.buttonContainer}>
              <Button
                style={styles.sendButton}
                status="primary"
                accessoryLeft={SendIcon}
                onPress={() => {
                  ReplyEmails();
                  navigation.goBack();
                  Alert.alert("Message Sent");
                }}
              >
                Send
              </Button>
              <Button
                style={styles.deleteButton}
                status="danger"
                appearance="outline"
                accessoryLeft={DeleteIcon}
                onPress={() => navigation.goBack()}
              >
                Cancel
              </Button>
            </View>
          </SafeAreaView>
        </Layout>
      </TouchableWithoutFeedback>
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F9FC",
  },
  safeArea: {
    flex: 1,
    padding: 16,
  },
  emailInfoContainer: {
    marginBottom: 16,
    marginLeft: 8,
  },
  emailInfo: {
    marginVertical: 4,
  },
  input: {
    flex: 1,
    marginBottom: 16,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: "auto", // Move buttons to the bottom
    marginBottom: 16,
  },
  sendButton: {
    flex: 1,
    marginHorizontal: 5,
  },
  deleteButton: {
    flex: 1,
    marginHorizontal: 5,
  },
});

export default ReplyScreen;
