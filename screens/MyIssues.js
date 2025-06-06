import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  TextInput,
  SafeAreaView,
  View,
  Alert,
  StatusBar,
  RefreshControl
} from "react-native";
import { Layout, Text, Spinner, Card } from "@ui-kitten/components";
import { useAuth } from "./ThemeContext";
import { FlashList } from "@shopify/flash-list";
import { handleFetchError, EtaAlert } from "./ExtraImports";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const MyIssues = () => {
  const [myissues, setMyIssues] = useState([]);
  const [issuecount, setIssueCount] = useState(0);
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { authUser, setAuthUser, setIsLoggedIn, setTabBarBadge } = useAuth();

  useEffect(() => {
    FetchIssues();
  }, []);

  const FetchIssues = async () => {
    setLoading(true);
    const url = `${authUser.host
      }content?module=home&page=m&reactnative=1&uname=${authUser.uname
      }&password=${authUser.upwd}&customer=eta${authUser.schema}&session_id=${authUser.sessionid
      }&mode=getissues&etamobilepro=1&nocache=${Math.random().toString().split(".")[1]
      }&persid=${authUser.currpersid}`;
    try {
      const response = await fetch(url);
      const text = await response.text();
      const data = JSON.parse(text);
      if (handleFetchError(data, setAuthUser, setIsLoggedIn)) {
        return; // Stop further processing if an error is handled
      }
      setMyIssues(data.issues);
      if (data.openmsg > 0) {
        setTabBarBadge(jsonData.openmsg);
      }
      setIssueCount(data.issues.length);
      if (handleFetchError(data, setAuthUser, setIsLoggedIn)) {
        return; // Stop further processing if an error is handled
      }
    } catch (error) {
      //Alert.alert("Error", error.message);
      EtaAlert(
        "Error",
        error.message,
        "Ok",
        ""
      );
    } finally {
      setRefreshing(false);
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await FetchIssues();
  };

  const RenderIssue = ({ item }) => (
    <Card style={styles.card} status="basic">
      <View style={styles.contentContainer}>
        <Icon
          name="alert-circle"
          size={24}
          color="#FF5733"
          style={styles.icon}
        />
        <View style={styles.textContainer}>
          <Text category="s1" style={styles.issueTitle}>
            Issue
          </Text>
          <Text category="p2" style={styles.issueText}>
            {item.issue}
          </Text>
        </View>
      </View>
    </Card>
  );

  if (loading && !refreshing) {
    return (
      <Layout style={styles.loadingContainer}>
        <Spinner size="giant" />
      </Layout>
    );
  }

  const filteredIssues = myissues.filter((issue) =>
    issue.issue.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <Layout style={styles.container}>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.screenWrapper}>
          {/* Scrollable Section */}
          <KeyboardAwareScrollView
            enableAutomaticScroll={true}
            contentContainerStyle={styles.scrollContent}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
                tintColor="#3366FF" // Optional: iOS spinner color
                colors={["#3366FF"]} // Optional: Android spinner colors
              />
            }
          >
            <View style={styles.headerContainer}>
              <Text category="h5" style={styles.counterText}>
                Issues
              </Text>
            </View>
            <View style={styles.searchContainer}>
              <TextInput
                style={styles.input}
                placeholder="Search Issues"
                value={filter}
                onChangeText={setFilter}
                placeholderTextColor="#8F9BB3"
              />
            </View>


            <FlashList
              data={filteredIssues}
              renderItem={RenderIssue}
              keyExtractor={(item) => item.id.toString()}
              refreshing={refreshing}
              //onRefresh={handleRefresh}
              contentContainerStyle={styles.list}
              estimatedItemSize={129}
            />
          </KeyboardAwareScrollView>

          {/* Fixed Bottom Section */}
          <View style={styles.currentasof}>
            <Text>Current as of: {authUser.currentasof}</Text>
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
  screenWrapper: {
    flex: 1,
    justifyContent: 'space-between',
  },

  scrollContent: {
    paddingBottom: 20,
  },

  currentasof: {
    alignItems: 'center',
    marginTop: 30
  },
  headerContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f7f9fc",
  },

  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  input: {
    flex: 4,
    height: 40,
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 16,
    paddingLeft: 8,
    borderColor: "#E4E9F2",
    backgroundColor: "#ffffff",
  },
  card: {
    marginBottom: 16,
    borderRadius: 8,
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  contentContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  icon: {
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  issueTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2E3A59",
    marginBottom: 4,
  },
  issueText: {
    fontSize: 14,
    color: "#555",
    lineHeight: 20,
  },
});

export default MyIssues;
