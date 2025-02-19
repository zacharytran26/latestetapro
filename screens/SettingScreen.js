import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  ScrollView,
  View,
  SafeAreaView,
  Alert,
  Linking,
  Webview,
  Modal
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
import { EvaIconsPack } from "@ui-kitten/eva-icons";
import * as eva from "@eva-design/eva";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "./ThemeContext";

const SettingsScreen = ({ setProfileImage }) => {
  const { theme, authUser } = useAuth();
  const [uploadedImageUri, setUploadedImageUri] = useState(null);
  const [WebViewUrl, setWebViewUrl] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  const [form, setForm] = useState({
    emailNotifications: true,
    pushNotifications: false,
    accessCode: "",
    username: "",
  });

  const uric = `https://apps5.talonsystems.com/tseta/php/upload/view.php?imgRes=10&viewPers=${authUser.currpersid}&rorwwelrw=rw&curuserid=${authUser.currpersid}&id=${authUser.sysdocid}&svr=${authUser.svr}&s=${authUser.sessionid}&c=eta${authUser.schema}`;

  useEffect(() => {
    loadSettings();
  }, []);

  const openInWebView = (url) => {
    setWebViewUrl(url);
    setModalVisible(true);
  };

  const loadSettings = async () => {
    try {
      const emailNotifications = await AsyncStorage.getItem(
        "emailNotifications"
      );
      const accessCode = await AsyncStorage.getItem("accesscode");
      const username = await AsyncStorage.getItem("username");

      setForm((prevForm) => ({
        ...prevForm,
        emailNotifications: emailNotifications === "true",
        accessCode: accessCode || "",
        username: username || "",
      }));
    } catch (error) {
      console.error("Error loading settings:", error);
    }
  };

  const saveSettings = async (key, value) => {
    try {
      await AsyncStorage.setItem(key, value.toString());
    } catch (error) {
      console.error("Error saving settings:", error);
    }
  };

  const handleEmailNotificationsToggle = (isChecked) => {
    setForm({ ...form, emailNotifications: isChecked });
    saveSettings("emailNotifications", isChecked);
  };

  return (
    <>
      <IconRegistry icons={EvaIconsPack} />
      <ApplicationProvider {...eva} theme={eva[theme]}>
        <SafeAreaView style={styles.safeArea}>
          <Layout style={styles.container}>
            <Layout style={styles.profile}>
              <Avatar
                source={{
                  uri: uploadedImageUri || uric,
                }}
                style={styles.profileAvatar}
              />
            </Layout>

            <ScrollView style={styles.scrollView}>
              <Layout style={styles.section}>
                <Text category="label" style={styles.sectionTitle}>
                  Account Settings
                </Text>

                <View style={styles.row}>
                  <Text style={styles.label}>Version</Text>
                  <Text style={styles.value}>1.0.0</Text>
                </View>

                <View style={styles.row}>
                  <Input
                    label="Accesscode"
                    value={form.accessCode}
                    style={styles.input}
                    placeholder="Enter your access code"
                    editable={false}
                  />
                </View>

                <View style={styles.row}>
                  <Input
                    label="Username"
                    value={form.username}
                    style={styles.input}
                    placeholder="Enter your username"
                    editable={false}
                  />
                </View>
                <View
                  style={[
                    styles.row,
                    { justifyContent: "center", alignItems: "center" },
                  ]}
                >
                  <Button
                    style={styles.termstext}
                    onPress={() =>
                      openInWebView(
                        "https://apps5.talonsystems.com/tseta/tc.htm"
                      )
                    }
                  >
                    Terms & Conditions
                  </Button>
                </View>
              </Layout>

              <Layout style={styles.section}>
                <Text category="label" style={styles.sectionTitle}>
                  Preferences
                </Text>

                <View style={styles.row}>
                  <Layout
                    style={[styles.rowIcon, { backgroundColor: "#FFAA00" }]}
                  >
                    <Icon style={styles.icon} fill="#fff" name="bell-outline" />
                  </Layout>
                  <Text style={styles.rowLabel}>Push Notifications</Text>

                  <View style={styles.rowSpacer} />
                  <Toggle
                    checked={form.pushNotifications}
                    onChange={(pushNotifications) =>
                      setForm({ ...form, pushNotifications })
                    }
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
    backgroundColor: "#f7f9fc",
  },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f7f9fc",
  },
  profile: {
    paddingVertical: 24,
    backgroundColor: "#fff",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    marginBottom: 16,
  },
  profileAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  profileAction: {
    position: "absolute",
    right: -4,
    bottom: -10,
    width: 28,
    height: 28,
    borderRadius: 9999,
    backgroundColor: "#007bff",
    alignItems: "center",
    justifyContent: "center",
  },
  scrollView: {
    flex: 1,
  },
  termstext: {
    backgroundColor: "#3366FF",
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 16,
  },
  sectionTitle: {
    paddingBottom: 12,
    paddingHorizontal: 10,
    fontSize: 14,
    fontWeight: "600",
    color: "#9e9e9e",
    textTransform: "uppercase",
    letterSpacing: 1.1,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 60,
    backgroundColor: "#f2f2f2",
    borderRadius: 10,
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  rowIcon: {
    width: 30,
    height: 30,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  rowLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: "#0c0c0c",
    flex: 1,
    marginLeft: 10,
  },
  rowSpacer: {
    flexShrink: 2,
    flexBasis: 1,
  },
  icon: {
    width: 24,
    height: 24,
    alignSelf: "flex-end",
  },
  editButton: {
    position: "relative",
  },
  input: {
    flex: 1,
    marginVertical: 8,
    width: "100%",
  },
});

export default SettingsScreen;
