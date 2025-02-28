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
import { Button, Layout, Text, Icon, Input } from "@ui-kitten/components";
import { useRoute, useNavigation } from "@react-navigation/native";
import { useAuth } from "./ThemeContext";
import { SelectList } from "react-native-dropdown-select-list";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { handleFetchError } from "./ExtraImports";

const SendIcon = (props) => <Icon {...props} name="paper-plane-outline" />;

const DeleteIcon = (props) => <Icon {...props} name="trash-2-outline" />;

const useInputState = (initialValue = "") => {
  const [value, setValue] = useState(initialValue);
  return { value, onChangeText: setValue, reset: () => setValue(initialValue) };
};

const NewMessage = () => {
  const multilineInputState = useInputState("");
  const route = useRoute();
  const navigation = useNavigation();
  const { email } = route.params;
  const [sentmail, setSentMail] = useState(false);
  const [selected, setSelected] = useState("");
  const [dropdown, setDropDown] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const { authUser, setTabBarBadge, setAuthUser, setIsLoggedIn } = useAuth();

  const message = multilineInputState.value;

  useEffect(() => {
    FetchAllRecipients();
  }, []);

  const FetchAllRecipients = async () => {
    try {
      const response = await fetch(
        `${authUser.host}` +
        `content?module=home&page=m&reactnative=1&uname=${authUser.uname}&password=${authUser.upwd}&customer=eta${authUser.schema}&session_id=${authUser.sessionid}&mode=getrecipients&etamobilepro=1&nocache=n&persid=${authUser.currpersid}`
      );

      const AllRecipientsText = await response.text();

      const AllRecipients = JSON.parse(AllRecipientsText);
      if (handleFetchError(AllRecipients, setAuthUser, setIsLoggedIn)) {
        return; // Stop further processing if an error is handled
      }

      // Assuming recipientData is an array of objects with 'persid' and 'name'
      const formattedData = AllRecipients.map((recipient) => ({
        key: recipient.persid,
        value: recipient.name,
      }));

      setDropDown(formattedData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setRefreshing(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    multilineInputState.reset();
    setSelected(null);
  };

  const handleSentMessage = () => {
    setSentMail(true);
    navigation.popTo("Messages", { isSent: true });
  };

  const SendNewMessages = async () => {
    try {
      const response = await fetch(
        `${authUser.host}` +
        `content?module=home&page=m&reactnative=1&uname=${authUser.uname}&password=${authUser.upwd}&customer=eta${authUser.schema}&session_id=${authUser.sessionid}&mode=newmessage&etamobilepro=1&nocache=n&persid=${authUser.currpersid}&topersid=${selected}&string=${message}`,
        {
          method: "POST",
          headers: {
            Accept: "application/txt",
            "Content-Type": "application/txt",
          },
        }
      );

      const responseText = await response;
    } catch (error) {
      console.error("Error sending message:", error);
    }
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
            <Text category="s1" style={styles.label}>
              To:
            </Text>
            <SelectList
              data={dropdown}
              setSelected={setSelected}
              placeholder="Select a contact"
              boxStyles={styles.selectListBox}
              value={selected}
              dropdownStyles={styles.dropdownStyles}
            />
            <Input
              multiline={true}
              textStyle={{ minHeight: 200 }} // Extended input height
              placeholder="Type your message"
              returnKeyType="default" // Add this line to change return key to "Done" on iOS
              //blurOnSubmit={false} // Add this line to dismiss keyboard on submit
              {...multilineInputState}
              style={styles.input}
            />
            <View style={styles.buttonContainer}>
              <Button
                style={styles.sendButton}
                status="primary"
                accessoryLeft={SendIcon}
                onPress={() => {
                  SendNewMessages();
                  Alert.alert("Message Sent");
                  handleSentMessage();
                }}
              >
                Send
              </Button>
              <Button
                style={styles.deleteButton}
                status="danger"
                appearance="outline"
                accessoryLeft={DeleteIcon}
                onPress={() => {
                  navigation.goBack();
                }}
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
  label: {
    marginVertical: 10,
  },
  selectListBox: {
    marginBottom: 16,
  },
  input: {
    flex: 1, // Allow the input to expand
    marginBottom: 16,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16, // Moved buttons to the bottom
  },
  sendButton: {
    flex: 1,
    marginHorizontal: 5,
  },
  deleteButton: {
    flex: 1,
    marginHorizontal: 5,
  },
  dropdownStyles: {
    maxHeight: 150,
  },
});

export default NewMessage;
