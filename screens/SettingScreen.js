import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  ScrollView,
  View,
  SafeAreaView,
  Alert,
  Linking,
  Webview,
  Modal,
} from "react-native";
import {
  Layout,
  Text,
  Avatar,
  Icon,
  Button,
  IconRegistry,
  ApplicationProvider,
  Input,
  Toggle,
} from "@ui-kitten/components";
import { WebView } from 'react-native-webview';
import { EvaIconsPack } from "@ui-kitten/eva-icons";
import * as eva from "@eva-design/eva";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "./ThemeContext";

const SettingsScreen = ({ setProfileImage }) => {
  const { theme, authUser, setFormPreferences } = useAuth();
  const [uploadedImageUri, setUploadedImageUri] = useState(null);
  const [WebViewUrl, setWebViewUrl] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  const [form, setForm] = useState({
    pushNotifications: false,
    accessCode: "",
    username: "",
  });

  const openInDrawerWebView = (url) => {
    setWebViewUrl(url);
    setModalVisible(true);
  };

  const uric = `https://apps5.talonsystems.com/tseta/php/upload/view.php?imgRes=10&viewPers=${authUser.currpersid}&rorwwelrw=rw&curuserid=${authUser.currpersid}&id=${authUser.sysdocid}&svr=${authUser.svr}&s=${authUser.sessionid}&c=eta${authUser.schema}`;

  useEffect(() => {
    loadSettings();
  }, []);


  const updatePreferences = (isChecked) => {
  
    var surl = `${authUser.host}content?module=home&page=m&reactnative=1&uname=${authUser.uname}&password=${authUser.upwd}&customer=eta${authUser.schema}&session_id=${authUser.sessionid}&mode=updateperf&etamobilepro=1&isPushEnabled=${isChecked}&persid=${authUser.currpersid}`;
    fetch(surl)
      .then((response) => response.json())
      .then((json) => {
        return json;
      })
      .catch((error) => {
      });
    return true;
  };

  const handleUpdate = (isChecked) => {
    updatePreferences(isChecked);
  };


  const loadSettings = async () => {
    try {
      const storedPush = await AsyncStorage.getItem("pushNotifications");
      const accessCode = await AsyncStorage.getItem("accesscode");
      const username = await AsyncStorage.getItem("username");

      const isPushEnabled = storedPush === "true";

      const loadedForm = {
        pushNotifications: isPushEnabled,
        accessCode: accessCode || "",
        username: username || "",
      };

      setForm(loadedForm);
      setFormPreferences(loadedForm); // Update context as well
    } catch (error) {
      console.error("Error loading settings:", error);
    }
  };

  const saveSettings = async (key, value) => {
    try {
      if (value !== undefined && value !== null) {
        await AsyncStorage.setItem(key, value.toString());
      }
    } catch (error) {
      console.error("Error saving settings:", error);
    }
  };

  const handlePushNotificationsToggle = (isChecked) => {
    const updatedForm = { ...form, pushNotifications: isChecked };
    setForm(updatedForm);
    setFormPreferences(updatedForm); // Optional: update global context
    saveSettings("pushNotifications", isChecked);
  };

  return (
    <>
      <Modal visible={modalVisible} animationType="slide" onRequestClose={() => setModalVisible(false)}>
        <SafeAreaView style={{ flex: 1 }}>
          <View style={styles.webViewHeader}>
            <Button onPress={() => setModalVisible(false)}>Close</Button>
          </View>
          <WebView source={{ uri: WebViewUrl }} />
        </SafeAreaView>
      </Modal>

      <IconRegistry icons={EvaIconsPack} />
      <ApplicationProvider {...eva} theme={eva[theme]}>
        <SafeAreaView style={styles.safeArea}>
          <Layout style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Layout style={styles.card}>
                <Avatar
                  source={{ uri: uploadedImageUri || uric }}
                  style={styles.profileAvatar}
                />
                <View style={{ alignItems: "center" }}>
                <Text category="h6" style={{ marginTop: 16 }}>
                  Welcome, {form.username || "User"}
                </Text>
                </View>
                
              </Layout>

              <Layout style={styles.card}>
                <Text category="label" style={styles.sectionTitle}>Account</Text>
                <Input label="Access Code" value={form.accessCode} style={styles.input} />
                <Input label="Username" value={form.username} style={styles.input} />
                <Button
                  appearance="ghost"
                  status="info"
                  style={{ marginTop: 10 }}
                  onPress={() => openInDrawerWebView("https://apps5.talonsystems.com/tseta/tc.htm")}
                >
                  View Terms & Conditions
                </Button>
              </Layout>

              <Layout style={styles.card}>
                <Text category="label" style={styles.sectionTitle}>Preferences</Text>
                <View style={styles.preferenceRow}>
                  <Icon name="bell-outline" style={styles.icon} fill="#3366FF" />
                  <Text style={styles.preferenceLabel}>Push Notifications</Text>
                  <Toggle
                    checked={form.pushNotifications}
                    onChange={(isChecked) => {
                      handlePushNotificationsToggle(isChecked);
                      handleUpdate(isChecked);
                    }}
                  />
                </View>
              </Layout>
            </ScrollView>
          </Layout>
        </SafeAreaView>
      </ApplicationProvider>
    </>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  container: {
    flex: 1,
    padding: 16,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
    elevation: 5,
  },
  profileAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignSelf: "center",
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: "#8F9BB3",
    marginBottom: 12,
    textTransform: "uppercase",
  },
  input: {
    marginVertical: 8,
  },
  preferenceRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 10,
  },
  preferenceLabel: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: "#222B45",
  },
  icon: {
    width: 24,
    height: 24,
  },
  webViewHeader: {
    padding: 16,
    flexDirection: "row",
    justifyContent: "flex-end",
    backgroundColor: "#fff",
    borderBottomColor: "#ddd",
    borderBottomWidth: 1,
  },
});

export default SettingsScreen;
