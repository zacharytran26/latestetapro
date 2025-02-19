// import React, { useState, useEffect, useCallback } from "react";
// import {
//   StyleSheet,
//   SafeAreaView,
//   View,
//   StatusBar,
//   Alert,
//   Modal,
// } from "react-native";
// import { Layout, Text, Button, Icon, Card } from "@ui-kitten/components";
// import { useAuth } from "./ThemeContext";
// import { FlashList } from "@shopify/flash-list";
// import { WebView } from "react-native-webview";
// import { useRoute } from "@react-navigation/native";

// const FIFScreen = ({ navigation }) => {
//   const [fif, setFif] = useState([]);
//   const [viewedItems, setViewedItems] = useState(new Set());
//   const [fifCount, setFifCount] = useState(0);
//   const [refreshing, setRefreshing] = useState(false);
//   const [webViewVisible, setWebViewVisible] = useState(false);
//   const [webViewUrl, setWebViewUrl] = useState("");

//   const { authUser } = useAuth();
//   const route = useRoute();

//   useEffect(() => {
//     // Sample data for demonstration
//     const data = [
//       {
//         CONF: "02 JAN 2025",
//         CONFIRM_CODE: "1234",
//         DESCRIP: "Testing list",
//         DIS: "Mobile3",
//         ID: "2702",
//         LINK: "https://www.google.com",
//       },
//       {
//         CONF: "31 DEC 2024",
//         CONFIRM_CODE: "556",
//         DESCRIP: "Sample description",
//         DIS: "Sample",
//         ID: "2582",
//         LINK: "https://example.com",
//       },
//       {
//         CONF: "23 OCT 2024",
//         CONFIRM_CODE: "abcd",
//         DESCRIP: "Runway Incursion 24R",
//         DIS: "Runway Incursion",
//         ID: "2522",
//         LINK: "http://talonsystems.com/taloneta",
//       },
//     ];

//     setFif(data);
//     setFifCount(data.length);
//     const removeid = "2702";
//     handleRemove(removeid);
//   }, []);
//   useEffect(() => {
//     setFifCount(fif.length);
//   }, [fif]);

//   const handleRemove = (removeid) => {
//     setFif((prevData) => prevData.filter((item) => item.ID !== removeid));
//   };

//   const handleConfirm = (item) => {
//     if (!viewedItems.has(item.ID)) {
//       Alert.alert("Notice", "Please press 'View' to confirm FIF.");
//       return;
//     }
//     navigation.navigate("Confirm", { fifdata: item });
//   };

//   const handleRefresh = async () => {
//     setRefreshing(true);
//     // Simulate fetching updated data (replace with real fetch logic)
//     setTimeout(() => {
//       setRefreshing(false);
//     }, 1000);
//   };

//   const openInWebView = (url, item) => {
//     setWebViewUrl(url);
//     setWebViewVisible(true);
//     setViewedItems((prev) => {
//       const updated = new Set(prev);
//       updated.add(item.ID);
//       return updated;
//     });
//   };

//   const renderFif = ({ item }) => {
//     const isViewed = viewedItems.has(item.ID);

//     return (
//       <Card
//         style={styles.card}
//         status="basic"
//         header={() => (
//           <View style={styles.cardHeader}>
//             <Text style={styles.cardHeaderText}>{item.DIS}</Text>
//           </View>
//         )}
//       >
//         <Text style={styles.descriptionText}>{item.DESCRIP}</Text>
//         <View style={styles.buttonRow}>
//           <Button
//             style={styles.viewButton}
//             status="primary"
//             appearance="ghost"
//             accessoryLeft={(props) => <Icon {...props} name="eye-outline" />}
//             onPress={() => openInWebView(item.LINK, item)}
//           >
//             View
//           </Button>
//           <Button
//             style={styles.confirmButton}
//             status="success"
//             accessoryLeft={(props) => (
//               <Icon {...props} name="checkmark-outline" />
//             )}
//             disabled={!isViewed}
//             onPress={() => handleConfirm(item)}
//           >
//             Confirm
//           </Button>
//         </View>
//       </Card>
//     );
//   };

//   return (
//     <Layout style={styles.container}>
//       <StatusBar barStyle="dark-content" backgroundColor="#f7f9fc" />
//       <SafeAreaView style={{ flex: 1 }}>
//         <Text category="h5" style={styles.headerText}>
//           FIF: {fifCount}
//         </Text>

//         {fif.length === 0 ? (
//           <View style={styles.noDataContainer}>
//             <Text style={styles.noDataText}>No FIFs available</Text>
//           </View>
//         ) : (
//           <FlashList
//             data={fif}
//             renderItem={renderFif}
//             keyExtractor={(item) => item.ID.toString()}
//             refreshing={refreshing}
//             onRefresh={handleRefresh}
//             contentContainerStyle={styles.list}
//             estimatedItemSize={150}
//           />
//         )}

//         {/* WebView Modal */}
//         <Modal
//           visible={webViewVisible}
//           animationType="slide"
//           onRequestClose={() => setWebViewVisible(false)}
//         >
//           <SafeAreaView style={{ flex: 1 }}>
//             <View style={styles.webViewHeader}>
//               <Button onPress={() => setWebViewVisible(false)}>Close</Button>
//             </View>
//             <WebView source={{ uri: webViewUrl }} />
//           </SafeAreaView>
//         </Modal>
//       </SafeAreaView>
//     </Layout>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     paddingHorizontal: 16,
//     backgroundColor: "#f7f9fc",
//   },
//   headerText: {
//     fontWeight: "bold",
//     color: "#2E3A59",
//     marginTop: 8,
//   },
//   card: {
//     marginVertical: 8,
//     borderRadius: 12,
//     elevation: 3,
//   },
//   cardHeader: {
//     padding: 12,
//     borderTopLeftRadius: 12,
//     borderTopRightRadius: 12,
//     backgroundColor: "#b6daf2",
//   },
//   cardHeaderText: {
//     color: "#ffffff",
//     fontWeight: "bold",
//     fontSize: 16,
//   },
//   descriptionText: {
//     marginVertical: 12,
//     fontSize: 14,
//     color: "#2E3A59",
//   },
//   buttonRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginVertical: 8,
//   },
//   viewButton: {
//     flex: 0.48,
//   },
//   confirmButton: {
//     flex: 0.48,
//   },
//   list: {
//     paddingBottom: 20,
//   },
//   noDataContainer: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   noDataText: {
//     fontSize: 18,
//     color: "#8F9BB3",
//   },
//   webViewHeader: {
//     padding: 10,
//     backgroundColor: "#f7f9fc",
//     alignItems: "flex-end",
//   },
// });

// export default FIFScreen;


import React, { useState, useEffect } from "react";
import { SafeAreaView, StyleSheet, ScrollView } from "react-native";
import { ListItem, Icon } from "@rneui/themed";
import { useAuth } from "./ThemeContext";
import { useRoute } from "@react-navigation/native";
import { handleFetchError } from "./ExtraImports";

const StudentMap = ({ navigation }) => {
  const route = useRoute();
  const { course } = route.params;
  const [stages, setStages] = useState([]);
  const { authUser, setAuthUser, setIsLoggedIn } = useAuth();

  useEffect(() => {
    fetchMap();
  }, []);

  const fetchMap = async () => {
    try {
      const response = await fetch(
        `${authUser.host}` +
          `content?module=home&page=m&reactnative=1&uname=${
            authUser.uname
          }&password=${authUser.upwd}&customer=eta${
            authUser.schema
          }&session_id=${
            authUser.sessionid
          }&mode=getcoursemap&etamobilepro=1&nocache=${
            Math.random().toString().split(".")[1]
          }&persid=${authUser.currpersid}&persregid=${course.ID}`
      );
      const data = await response.json();
      if (handleFetchError(data, setAuthUser, setIsLoggedIn)) {
        return; // Stop further processing if an error is handled
      }
      setStages(data.stages);
    } catch (error) {
      console.error("Error fetching map data:", error);
    }
  };

  const handlePress = (units, lesson) => {
    navigation.navigate("StudentMapDetails", { units, lesson });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {stages.map((stage, stageIndex) => (
          <ListItem.Accordion
            key={stageIndex}
            content={
              <>
                <ListItem.Content>
                  <ListItem.Title>{stage.stage}</ListItem.Title>
                </ListItem.Content>
              </>
            }
            isExpanded={stage.isExpanded}
            onPress={() => {
              setStages((prevStages) =>
                prevStages.map((s, index) =>
                  index === stageIndex ? { ...s, isExpanded: !s.isExpanded } : s
                )
              );
            }}
          >
            {stage.lessons.map((lesson, lessonIndex) => (
              <ListItem
                key={lessonIndex}
                bottomDivider
                onPress={() => handlePress(lesson.units, lesson)}
              >
                <ListItem.Content>
                  <ListItem.Title style={styles.lesson}>
                    {lesson.lesson}
                  </ListItem.Title>
                </ListItem.Content>
                <ListItem.Chevron />
              </ListItem>
            ))}
          </ListItem.Accordion>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#F7F9FC",
  },
  lesson: {
    paddingLeft: 16,
  },
});

export default StudentMap;

