import React, { useState, useEffect, useRef } from "react";
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
import { Button, Layout, Text, Icon, Input, Select, SelectItem } from "@ui-kitten/components";
import { useRoute, useNavigation } from "@react-navigation/native";
import { useAuth } from "./ThemeContext";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { handleFetchError, EtaAlert } from "./ExtraImports";
import { FlashList } from "@shopify/flash-list";

const SendIcon = (props) => <Icon {...props} name="paper-plane-outline" />;

const DeleteIcon = (props) => <Icon {...props} name="trash-2-outline" />;

const useInputState = (initialValue) => {
  const [value, setValue] = useState(initialValue ?? ""); // Ensure default fallback
  return { value, onChangeText: setValue, reset: () => setValue(initialValue ?? "") };
};

const NewMessage = () => {
  const multilineInputState = useInputState("");
  const route = useRoute();
  const navigation = useNavigation();
  const { email } = route.params;
  const [sentmail, setSentMail] = useState(false);
  const [selected, setSelected] = useState("");
  const [dropdown, setDropDown] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const { authUser, setTabBarBadge, setAuthUser, setIsLoggedIn } = useAuth();
  const [focused, setFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const message = multilineInputState.value;

  useEffect(() => {
    FetchAllRecipients();
  }, []);
  useEffect(() => {
    const filtered = dropdown.filter((item) =>
      item.value.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredData(filtered);
  }, [searchQuery, dropdown]); // Runs when searchQuery or dropdown changes


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
      setFilteredData(formattedData);
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
      keyboardShouldPersistTaps="handled"
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <Layout style={styles.container}>
          <SafeAreaView style={styles.safeArea}>
            <View style={styles.headerContainer}>
              {/* "To:" and Input Field Side by Side */}
              <View style={styles.toContainer}>
                <Text category="s1" style={styles.label}>
                  To:
                </Text>
                <Input
                  multiline={false}
                  textStyle={{ minHeight: 20 }}
                  placeholder="Search recipients"
                  returnKeyType="default"
                  onFocus={() => setFocused(true)}
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  style={styles.inputField} // New style for proper spacing
                />
              </View>

              {/* FlashList - Shows only when input is focused */}
              {focused && filteredData.length > 0 && (
                <FlashList
                  data={filteredData}
                  estimatedItemSize={50}
                  keyExtractor={(item) => item.key}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={styles.inputRecipient}
                      onPress={() => {
                        setSearchQuery(item.value);
                        setSelected(item.key);
                        setFocused(false);
                      }}
                      activeOpacity={0.6}
                    >
                      <Text>{item.value}</Text>
                    </TouchableOpacity>
                  )}
                  style={styles.dropdownlist}
                />
              )}
            </View>

            {/* Message Input */}
            <Input
              multiline={true}
              textStyle={{ minHeight: 200 }}
              placeholder="Type your message"
              returnKeyType="default"
              {...multilineInputState}
              style={styles.input}
            />

            {/* Buttons */}
            <View style={styles.buttonContainer}>
              <Button
                style={styles.sendButton}
                status="primary"
                accessoryLeft={SendIcon}
                onPress={() => {
                  SendNewMessages();
                  //Alert.alert("Message Sent");
                  EtaAlert(
                    "Success",
                    "Message Sent",
                    "Ok",
                    ""
                  );
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

  toContainer: {
    flexDirection: "row", // Aligns items side by side
    alignItems: "center", // Centers text with input
    width: "100%", // Ensures full width
    marginBottom: 10, // Adds spacing below
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 10, // Adds spacing between "To:" and input
    marginLeft: 10
  },
  inputField: {
    flex: 1, // Makes the input take the remaining space
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 5,
    borderRadius: 5,
  },
  dropdownlist: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    maxHeight: 200,
    backgroundColor: "white",
    marginTop: 10
  },
  inputRecipient: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    backgroundColor: "white"
  },
  container: {
    flex: 1,
    backgroundColor: "#F7F9FC",
  },
  safeArea: {
    flex: 1,
    padding: 16,
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
