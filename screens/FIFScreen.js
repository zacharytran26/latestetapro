import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  StyleSheet,
  SafeAreaView,
  View,
  StatusBar,
  Alert,
  Modal,
} from "react-native";
import { Layout, Text, Button, Icon, Card, Spinner } from "@ui-kitten/components";
import { useAuth } from "./ThemeContext";
import { FlashList } from "@shopify/flash-list";
import { WebView } from "react-native-webview";
import { useFocusEffect, useRoute } from "@react-navigation/native";
import { handleFetchError } from "./ExtraImports";
import AsyncStorage from "@react-native-async-storage/async-storage";

const FIFScreen = ({ navigation }) => {
  const [fif, setFif] = useState([]);
  const [goFetch, setgoFetch] = useState(true);
  // const [confirmedFif, setConfirmedFif] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewedItems, setViewedItems] = useState(new Set()); // Track viewed items
  const [confirmedItems, setConfirmedItems] = useState(new Set());
  const [fifcount, setFifCount] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [webViewVisible, setWebViewVisible] = useState(false); // Modal visibility
  const [webViewUrl, setWebViewUrl] = useState(""); // URL for WebView
  const { authUser, setAuthUser, setIsLoggedIn } = useAuth();
  const route = useRoute();
  const fifRef = useRef(new Set());
  //var goFetch = true;

  useEffect(() => {
    if (goFetch) {
      fetchFif();
    }
  }, [goFetch]);


  useFocusEffect(
    //useref fif should have original list?

    useCallback(() => {
      // if (route.params?.isConfirmed) {
      //   const { id } = route.params.FifId;

      //   let newFif = fifRef.current.filter((fif) => {
      //     //console.log("fif.ID", fif.ID);
      //     return fif.ID !== id;
      //   });

      //   setFif(newFif);

      //   setgoFetch(false);
      // }
      if (route.params?.isConfirmed) {
        const { id } = route.params.FifId;
        const result = fif.find((item) => item.ID === id);
        setConfirmedItems((prev) => new Set([...prev, result.ID]));
        fifRef.current.delete(result.ID);


        handleRefresh();
      }

    }, [route.params?.isConfirmed]) // Dependency array excludes `fif` but includes `fifRef`
  );
  const fetchFif = async () => {
    setLoading(true);
    const url = `${authUser.host
      }content?module=home&page=m&reactnative=1&uname=${authUser.uname
      }&password=${authUser.upwd}&customer=eta${authUser.schema}&session_id=${authUser.sessionid
      }&mode=getfif&etamobilepro=1&nocache=${Math.random().toString().split(".")[1]
      }&persid=${authUser.currpersid}`;
    const response = await fetch(url);
    const data = await response.json();
    if (handleFetchError(data, setAuthUser, setIsLoggedIn)) {
      return; // Stop further processing if an error is handled
    }
    if (data.fifs && data.fifs.length > 0) {
      setFif(data.fifs);
      setFifCount(data.fifs.length);
    } else {
      setFif([]); // Ensure fif state is empty if no data
      setFifCount(0);
    }
    setLoading(false);
  };
  const handleConfirm = (item) => {
    //set useref to fif use state
    if (!fifRef.current.has(item.ID)) {
      Alert.alert("Please press View to confirm FIF");
    } else {
      navigation.navigate("Confirm", { fifdata: item });
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchFif();
    setRefreshing(false);
    setViewedItems(new Set());
  };
  const openInWebView = async (url, item) => {
    setWebViewUrl(url);
    setWebViewVisible(true);
    setViewedItems((prev) => new Set(prev).add(item.ID)); // Mark item as viewed
    fifRef.current.add(item.ID);
    await fetchFif();
  };

  const renderFif = ({ item }) => {
    const isViewed = fifRef.current.has(item.ID);
    const isConfirmed = confirmedItems.has(item.ID); //confirmedItems.has(item.ID) should return true
    return (
      <Card
        style={styles.card}
        status="basic"
        header={() => (
          <View style={styles.cardHeader}>
            <Text style={styles.cardHeaderText}>{item.DIS}</Text>
          </View>
        )}
      >
        <Text style={styles.descriptionText}>{item.DESCRIP}</Text>
        <View style={styles.buttonRow}>
          <Button
            style={styles.viewButton}
            status="primary"
            appearance="ghost"
            accessoryLeft={(props) => <Icon {...props} name="eye-outline" />}
            onPress={() => openInWebView(item.LINK, item)} // Open in WebView
          >
            View
          </Button>
          <Button
            style={styles.confirmButton}
            status="success"
            accessoryLeft={(props) => (
              <Icon {...props} name="checkmark-outline" />
            )}
            disabled={!isViewed || isConfirmed} // Disable until item is viewed
            onPress={() => handleConfirm(item)}
          >
            Confirm
          </Button>

        </View>
      </Card>
    );
  };

  if (loading && !refreshing) {
    return (
      <Layout style={styles.container}>
        <Spinner />
      </Layout>
    );
  }

  return (
    <Layout style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f7f9fc" />
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.headerContainer}>
          <Text category="h5" style={styles.headerText}>
            FIF: {fifcount}
          </Text>
        </View>



        <FlashList
          data={fif}
          renderItem={renderFif}
          keyExtractor={(item) => item.ID.toString()}
          refreshing={refreshing}
          onRefresh={handleRefresh}
          contentContainerStyle={styles.list}
          estimatedItemSize={150}
          ListEmptyComponent={<View style={styles.noDataContainer}>
            <Text style={styles.noDataText}>No FIFs available</Text>
          </View>}
        />

        {/* WebView Modal */}
        <Modal
          visible={webViewVisible}
          animationType="slide"
          onRequestClose={() => setWebViewVisible(false)}
        >
          <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.webViewHeader}>
              <Button onPress={() => setWebViewVisible(false)}>Close</Button>
            </View>
            <WebView source={{ uri: webViewUrl }} />
          </SafeAreaView>
        </Modal>
      </SafeAreaView>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: "#f7f9fc",
  },
  headerContainer: {
    alignItems: "center",
  },
  headerText: {
    fontWeight: "bold",
    color: "#2E3A59",
    marginTop: 8,
  },
  card: {
    marginVertical: 8,
    borderRadius: 12,
    elevation: 3,
  },
  cardHeader: {
    padding: 12,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    backgroundColor: "#b6daf2",
  },
  cardHeaderText: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 16,
  },
  descriptionText: {
    marginVertical: 12,
    fontSize: 14,
    color: "#2E3A59",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 8,
  },
  viewButton: {
    flex: 0.48,
  },
  confirmButton: {
    flex: 0.48,
  },
  list: {
    paddingBottom: 20,
  },
  noDataContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 200,
  },
  noDataText: {
    fontSize: 18,
    color: "#8F9BB3",
  },
  webViewHeader: {
    padding: 10,
    backgroundColor: "#f7f9fc",
    alignItems: "flex-end",
  },
});

export default FIFScreen;
