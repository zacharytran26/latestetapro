import React, { useState, useCallback, useEffect } from "react";
import {
  StyleSheet,
  View,
  SafeAreaView,
  TouchableOpacity,
  StatusBar,
  Modal,
  TouchableWithoutFeedback,
  Platform,
  Alert,
  AppState,
  ScrollView,
} from "react-native";
import { Layout, Text, Spinner, Button } from "@ui-kitten/components";
import { FlashList } from "@shopify/flash-list";
import { useAuth } from "./ThemeContext";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { handleFetchError, EtaAlert } from "./ExtraImports";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const LeftIcon = () => <Icon name="arrow-left" size={20} />;
const RightIcon = () => <Icon name="arrow-right" size={20} />;

const RenderActivity = ({ item, openActivityDetails, openStudentDetails, openInstructorDetails, setSelectedActivity, setPreviewVisible }) => {
  return (
    <TouchableOpacity
      onPress={() => openActivityDetails(item)}
      onLongPress={() => {
        setSelectedActivity(item);
        setPreviewVisible(true);
      }}
      activeOpacity={0.9}
      style={styles.cardContainer}
    >
      {/* Card Header */}
      <View style={styles.cardHeader}>
        <Icon
          name="calendar-check"
          size={20}
          color="#4CAF50"
          style={styles.icon}
        />
        <Text style={styles.cardTitle}>{item.title}</Text>
      </View>

      {/* Card Content */}
      <View style={styles.cardContent}>
        {item.subtype === "Rental" || item.subtype === "Admin" ? (
          <TouchableOpacity
            onPress={() => openInstructorDetails(item)}
            style={styles.infoRow}
          >
            <Icon name="account-tie" size={18} color="#3366FF" />
            <Text style={styles.cardTextlink}>
              <Text style={styles.label}>PIC:</Text> {item.pic}
            </Text>
          </TouchableOpacity>
        ) : (
          <>
            {item.s1 ? ( // Only render this block if item.s1 is not empty
              <TouchableOpacity
                onPress={() => openStudentDetails(item)}
                style={styles.infoRow}
              >
                <Icon name="account" size={18} color="#3366FF" />
                <Text style={styles.cardTextlink}>
                  <Text style={styles.label}>Student:</Text> {item.s1}
                </Text>
              </TouchableOpacity>
            ) : null}
            <TouchableOpacity
              onPress={() => openInstructorDetails(item)}
              style={styles.infoRow}
            >
              <Icon name="account-tie" size={18} color="#3366FF" />
              <Text style={styles.cardTextlink}>
                <Text style={styles.label}>Instructor:</Text> {item.pic}
              </Text>
            </TouchableOpacity>
          </>
        )}
        <View style={styles.infoRow}>
          <Icon name="clipboard-text-outline" size={18} color="#FFC107" />
          <Text style={styles.cardText}>
            <Text style={styles.label}>Type:</Text> {item.activitytype} {item.subtype ? `(${item.subtype})` : ""}</Text>
        </View>
        <View style={styles.infoRow}>
          <Icon
            name="checkbox-marked-circle-outline"
            size={18}
            color="#FF5722"
          />
          <Text style={styles.cardText}>
            <Text style={styles.label}>Status:</Text> {item.status}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const TimelineCalendarScreen = () => {
  const navigation = useNavigation();
  const [appState, setAppState] = useState(AppState.currentState);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [opscond, setOpsCond] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [schedDate, setSchedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);

  const { authUser, setTabBarBadge, setAuthUser, setIsLoggedIn, setCountCurrency, setExpiringCurr, setCurrasof } = useAuth();


  // Fetch calendar data
  const fetchCalData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${authUser.host}content?module=home&page=m&reactnative=1&uname=${authUser.uname
        }&password=${authUser.upwd}&customer=eta${authUser.schema}&session_id=${authUser.sessionid
        }&mode=getactivities&etamobilepro=1&nocache=${Math.random().toString().split(".")[1]
        }&persid=${authUser.currpersid}&scheddate=${schedDate}`
      );
      const textData = await response.text();
      let jsonData;

      try {
        jsonData = JSON.parse(textData);
        if (handleFetchError(jsonData, setAuthUser, setIsLoggedIn)) {
          return; // Stop further processing if an error is handled
        }
        setCurrasof(jsonData.currentasof);
      } catch (parseError) {
        const jsonStart = textData.indexOf("{");
        const jsonEnd = textData.lastIndexOf("}") + 1;
        const jsonString = textData.substring(jsonStart, jsonEnd);
        jsonData = JSON.parse(jsonString);
      }
      setOpsCond(jsonData.opscondition);
      setTabBarBadge(jsonData.openmsg);
      setCountCurrency(jsonData.expiredcurrency);
      setExpiringCurr(jsonData.expiringcurrency);

      setActivities(jsonData.activities);
      authUser.calstart = jsonData.calstart;
    } catch (error) {
      //Alert.alert("Error fetching data:", error);
      EtaAlert(
        "Error",
        error,
        "Ok",
        ""
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [authUser, schedDate, setAuthUser, setIsLoggedIn]);

  useEffect(() => {
    const handleAppStateChange = (nextAppState) => {
      if (appState.match(/inactive|background/) && nextAppState === "active") {
        setSchedDate(new Date());
        fetchCalData();
        //console.log('App has come to the foreground app');
      } else {
        //console.log('App has come to the backround app');
        setAppState(nextAppState);
      }


    };

    const subscription = AppState.addEventListener("change", handleAppStateChange);

    return () => {
      subscription.remove();
    };
  }, [appState, fetchCalData]);

  useFocusEffect(
    useCallback(() => {
      fetchCalData();
    }, [fetchCalData])
  );


  const handleRefresh = () => {
    setRefreshing(true);
    fetchCalData().then(() => setRefreshing(false));
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setSchedDate(selectedDate);
    }
    //handleRefresh();//causing double call
  };

  const incrementDate = () => {
    setSchedDate(
      (prevDate) => new Date(prevDate.setDate(prevDate.getDate() + 1))
    );
    //handleRefresh();//causing double call
  };

  const decrementDate = () => {
    setSchedDate(
      (prevDate) => new Date(prevDate.setDate(prevDate.getDate() - 1))
    );
    //handleRefresh();//causing double call
  };

  const openActivityDetails = (activity) => {
    navigation.navigate("HomeStack", {
      screen: "Activity",
      params: { activity },
    });
  };
  const openStudentDetails = (detail) => {
    navigation.navigate("HomeStack", {
      screen: "StudentDetailScreen",
      params: { detail },
    });
  };
  const openInstructorDetails = (detail) => {
    navigation.navigate("HomeStack", {
      screen: "InstructorDetailScreen",
      params: { detail },
    });
  };

  if (loading && !refreshing) {
    return (
      <Layout style={styles.loadingContainer}>
        <Spinner />
      </Layout>
    );
  }

  return (
    <ScrollView>
    <Layout style={styles.container}>
      <StatusBar />
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.rowContainer}>
          <Button
            onPress={decrementDate}
            accessoryLeft={LeftIcon}
            appearance="ghost"
            style={styles.button}
          />
          <TouchableOpacity
            onPress={() => setShowDatePicker(true)}
            style={styles.datepickerButton}
          >
            <Text style={styles.datepickerText}>
              {schedDate.toDateString()}
            </Text>
          </TouchableOpacity>
          <Button
            onPress={incrementDate}
            accessoryRight={RightIcon}
            appearance="ghost"
            style={styles.button}
          />
        </View>
        {showDatePicker && (
          <View style={styles.datePickerWrapper}>
            <DateTimePicker
              value={schedDate}
              mode="date"
              display={Platform.OS === "ios" ? "inline" : "default"}
              onChange={handleDateChange}
            />
          </View>
        )}
        <View style={styles.flashListContainer}>
          <FlashList
            data={activities}
            renderItem={({ item }) => (
              <RenderActivity item={item} navigation={navigation}
                openActivityDetails={openActivityDetails}
                openStudentDetails={openStudentDetails}
                openInstructorDetails={openInstructorDetails}
                setSelectedActivity={setSelectedActivity}
                setPreviewVisible={setPreviewVisible}
              />
            )}
            keyExtractor={(item) =>
              item.id ? item.id.toString() : Math.random().toString()
            }
            refreshing={refreshing}
            onRefresh={handleRefresh}
            contentContainerStyle={styles.list}
            estimatedItemSize={100}
          />
        </View>

        {selectedActivity && (
          <Modal
            animationType="slide"
            transparent={true}
            visible={previewVisible}
            onRequestClose={() => setPreviewVisible(false)}
          >
            <TouchableWithoutFeedback onPress={() => setPreviewVisible(false)}>
              <View style={styles.modalOverlay}>
                <TouchableOpacity style={styles.modalView}>
                  <Text style={styles.modalText}>
                    Title: {selectedActivity?.title || "No Title"}
                  </Text>
                  <Text style={styles.modalText}>
                    Description:{" "}
                    {selectedActivity?.description || "No Description"}
                  </Text>
                  <Text style={styles.modalText}>
                    Time: {selectedActivity?.time || "No Time"}
                  </Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </Modal>
        )}
        <View style={styles.currentasof}>
          <Text>Current as of: {authUser.currentasof}</Text>
        </View>
      </SafeAreaView>
    </Layout>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7f9fc",
  },
  currentasof: {
    alignItems: 'center',
    marginTop: 30
  },
  datePickerWrapper: {
    justifyContent: "center", // Center vertically
    alignItems: "center", // Center horizontally
    backgroundColor: '#9c9ea1'
  },
  rowContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#E4E9F2",
  },
  datepickerButton: {
    flex: 1,
    alignItems: "center",
  },
  datepickerText: {
    fontSize: 16,
    fontWeight: "600",
  },
  button: {
    paddingHorizontal: 8,
  },
  flashListContainer: {
    flex: 1,
  },
  cardContainer: {
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 16,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2E3A59",
    marginLeft: 8,
  },
  cardContent: {
    flexDirection: "column",
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 4,
  },
  icon: {
    marginRight: 8,
  },
  cardText: {
    fontSize: 14,
    color: "#333",
  },
  cardTextlink: {
    fontSize: 14,
    color: "#079cff",
  },
  label: {
    fontWeight: "bold",
    color: "#555",
  },
  list: {
    paddingBottom: 16,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
    width: "80%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 8,
    textAlign: "center",
    color: "#2E3A59",
  },
});

export default TimelineCalendarScreen;
