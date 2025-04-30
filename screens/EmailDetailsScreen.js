import React, { useEffect, useState } from "react";
import { StyleSheet, SafeAreaView, View } from "react-native";
import { Button, ButtonGroup, Icon, Layout, Text } from "@ui-kitten/components";
import { useRoute, useNavigation } from "@react-navigation/native";
import { handleFetchError } from "./ExtraImports";
import { useAuth } from "./ThemeContext";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const TrashIcon = (props) => <Icon {...props} name="trash-2-outline" />;
const ReplyIcon = (props) => <Icon {...props} name="corner-up-left-outline" />;

const EmailList = ({ navigation }) => {
  const route = useRoute();
  const { email } = route.params;
  const { authUser, setAuthUser, setIsLoggedIn } = useAuth();
  const [messages, setMessages] = useState([]);
  const [deletedItems, setDeletedItems] = useState([]);

  useEffect(() => {
    setMessages([email]);
  }, [email]);

  const removeItem = (id) => {
    setMessages((prevMessages) =>
      prevMessages.filter((message) => message.id !== id)
    );
    setDeletedItems((prevDeletedItems) => [...prevDeletedItems, id]);
  };

  const archiveEmails = async (id) => {
    const querystring = `${authUser.host
      }content?module=home&page=m&reactnative=1&uname=${authUser.uname
      }&password=${authUser.upwd}&customer=eta${authUser.schema}&session_id=${authUser.sessionid
      }&mode=archivemessage&etamobilepro=1&nocache=${Math.random().toString().split(".")[1]
      }&persid=${authUser.currpersid}&msgid=${id}`;
    try {
      const response = await fetch(querystring);
      const data = await response.json();
      if (handleFetchError(data, setAuthUser, setIsLoggedIn)) {
        return; // Stop further processing if an error is handled
      }
    } catch (error) {
      console.error("Error archiving email:", error);
    }
  };

  const handleDelete = () => {
    archiveEmails(email.id);
    removeItem(email.id);
    // Pass the 'isDeleted' parameter back to MessagesScreen
    navigation.popTo("Messages", { isDeleted: true });
  };

  return (
    <KeyboardAwareScrollView enableAutomaticScroll={true} contentContainerStyle={styles.scrollcontainer}>

    <Layout style={styles.container}>
      <SafeAreaView>
        <View style={styles.emailHeader}>
          <View style={styles.emailHeaderText}>
            <Text category="s1">From:</Text>
            <Text category="h3">{email.from}</Text>
            <Text appearance="hint">{email.date}</Text>
          </View>
        </View>
        <Text category="s1" style={styles.message}>
          {email.message}
        </Text>
        <Text category="p1" style={styles.body}>
          {email.body}
        </Text>
      </SafeAreaView>
      <View style={styles.contentContainer}></View>
      <View style={styles.buttonGroupContainer}>
        <ButtonGroup style={styles.buttonGroup} size="giant">
          <Button
            accessoryLeft={TrashIcon}
            onPress={handleDelete} // Use handleDelete function here
          />
          <Button
            accessoryLeft={ReplyIcon}
            onPress={() =>
              navigation.navigate("MessageReplyScreen", { email: email })
            }
          />
        </ButtonGroup>
      </View>
    </Layout>
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#F7F9FC",
  },
  scrollcontainer: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  emailHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  emailHeaderText: {
    flexDirection: "column",
  },
  message: {
    marginVertical: 8,
    fontWeight: "bold",
  },
  body: {
    marginVertical: 8,
  },
  contentContainer: {
    flex: 1,
  },
  buttonGroupContainer: {
    justifyContent: "flex-end",
    padding: 16,
    alignItems: "center",
  },
  buttonGroup: {
    margin: 2,
    backgroundColor: "#b6daf2",
  },
});

export default EmailList;
