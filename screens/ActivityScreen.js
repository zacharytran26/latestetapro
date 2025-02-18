import React, { useEffect } from "react";
import {
  StyleSheet,
  SafeAreaView,
  View,
  Platform,
  Alert,
  Linking,
} from "react-native";
import {
  Layout,
  Text,
  Card,
  Button,
  Icon,
  Divider,
} from "@ui-kitten/components"; // Import Button and Icon components
import { useRoute, useNavigation } from "@react-navigation/native";
import { FlashList } from "@shopify/flash-list";
//import * as Calendar from "expo-calendar";

const Activity = () => {
  const route = useRoute();
  const { activity } = route.params;

  useEffect(() => {
    requestCalendarPermissions();
  }, []);

  const requestCalendarPermissions = async () => {
    const { status } = await Calendar.requestCalendarPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Denied",
        "Calendar permission is required to add events. Please enable it in the settings."
      );
      return false;
    }
    return true;
  };

  const openInBrowser = (url) => {
    Linking.canOpenURL(url)
      .then((supported) => {
        if (supported) {
          Linking.openURL(url);
        } else {
          console.warn("Don't know how to open URI: " + url);
        }
      })
      .catch((err) => console.error("An error occurred", err));
  };

  const getDefaultCalendarSource = async () => {
    if (Platform.OS === "ios") {
      const defaultCalendar = await Calendar.getDefaultCalendarAsync();
      return defaultCalendar.source;
    } else {
      return { isLocalAccount: true, name: "Expo Calendar" };
    }
  };

  const createCalendarEvent = async (title, startDate, endDate, notes) => {
    const calendarGranted = await requestCalendarPermissions();
    if (!calendarGranted) return;

    let calendarId;

    if (Platform.OS === "ios") {
      const defaultCalendarSource = await getDefaultCalendarSource();
      calendarId = await Calendar.createCalendarAsync({
        title: "My New Calendar",
        color: "blue",
        entityType: Calendar.EntityTypes.EVENT,
        sourceId: defaultCalendarSource.id,
        source: defaultCalendarSource,
        name: "My Internal Calendar",
        ownerAccount: "personal",
        accessLevel: Calendar.CalendarAccessLevel.OWNER,
      });
    } else {
      const calendars = await Calendar.getCalendarsAsync(
        Calendar.EntityTypes.EVENT
      );
      calendarId = calendars.find(
        (cal) => cal.accessLevel === Calendar.CalendarAccessLevel.OWNER
      )?.id;

      if (!calendarId) {
        Alert.alert("Error", "No suitable calendar found.");
        return;
      }
    }

    const eventId = await Calendar.createEventAsync(calendarId, {
      title: title,
      startDate: startDate,
      endDate: endDate,
      timeZone: "GMT", // Adjust this according to your needs
      notes: notes,
    });

    Alert.alert(
      "Event Created",
      `Event with ID ${eventId} created successfully!`
    );
  };

  const handleAddEvent = async () => {
    const startDate = new Date(activity.start);
    const endDate = new Date(activity.end);
    const title = activity.activitytype + "(" + activity.subtype + ")";
    const notes = activity.start + activity.end;
    await createCalendarEvent(title, startDate, endDate, notes);
  };

  const handleAuthEvent = async (schactid, requestid) => {
    navigation.navigate("ActivityApproval", {
      activity: { schactid, requestid },
    });
  };

  const navigation = useNavigation();

  const handleInstructorPress = (instructorId, picid) => {
    navigation.navigate("InstructorActivity", {
      activity: { instructorId, picid },
    });
  };

  const RenderActivity = ({ item }) => {
    return (
      <View>
        <Card style={styles.card}>
          <Button
            onPress={handleAddEvent}
            accessoryLeft={(props) => (
              <Icon {...props} name="calendar-outline" fill="#fff" />
            )}
            style={styles.button}
          >
            Add to Calendar
          </Button>
        </Card>
        {item.status == "Pend Authorize" ? (
          <Card style={styles.card}>
            <Button
              onPress={handleAuthEvent}
              accessoryLeft={(props) => (
                <Icon {...props} name="unlock-outline" fill="#fff" />
              )}
              style={styles.button}
            >
              Authorize
            </Button>
          </Card>
        ) : (
          <></>
        )}
        <Card style={styles.card}>
          <View style={styles.header}>
            <Text category="h6" style={styles.title}>
              Activity Details
            </Text>
          </View>
          <Divider style={styles.divider} />
          <View style={styles.content}>
            <View style={styles.row}>
              <Text style={styles.label}>Status:</Text>
              <Text style={styles.value}>{item.status}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Activity Type:</Text>
              <Text style={styles.value}>{item.activitytype}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Activity Subtype:</Text>
              <Text style={styles.value}>{item.subtype}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Resource Type:</Text>
              <Text style={styles.value}>{item.resourcetype}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Resource:</Text>
              <Text style={styles.value}>{item.resource}</Text>
            </View>
          </View>
        </Card>

        <Card style={styles.card}>
          <View style={styles.header}>
            <Text category="h6" style={styles.title}>
              Times
            </Text>
          </View>
          <Divider style={styles.divider} />
          <View style={styles.content}>
            <View style={styles.row}>
              <Text style={styles.label}>Event Start:</Text>
              <Text style={styles.value}>{item.eventstart}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Activity Start:</Text>
              <Text style={styles.value}>{item.actstart}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Activity Duration:</Text>
              <Text style={styles.value}>{item.actdur}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Activity Stop:</Text>
              <Text style={styles.value}>{item.actstop}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Event Stop:</Text>
              <Text style={styles.value}>{item.eventstop}</Text>
            </View>
          </View>
        </Card>

        {item.s1 ? (
          <View>
            <Card style={styles.card}>
              <View style={styles.header}>
                <Text category="h6" style={styles.title}>
                  Student 1 Details
                </Text>
              </View>
              <Divider style={styles.divider} />
              <View style={styles.content}>
                <View style={styles.row}>
                  <Text style={styles.label}> Name:</Text>
                  <Text style={styles.value}>{item.s1}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.label}>Course:</Text>
                  <Text style={styles.value}>{item.course1}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.label}>Unit:</Text>
                  <Text style={styles.value}>{item.u1}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.label}>Open FIFs:</Text>
                  <Text style={styles.value}>{item.fif1}</Text>
                </View>
              </View>
            </Card>
            {item.gs1 ? (
              <Card style={styles.card}>
                <View style={styles.rowContainer}>
                  <Text category="s1" style={styles.cardText}>
                    Gradesheet:
                  </Text>
                  <Button
                    appearance="ghost"
                    onPress={() => openInBrowser(item.gs1)}
                    style={styles.button}
                  >
                    View Gradesheet
                  </Button>
                </View>
              </Card>
            ) : (
              <Card></Card>
            )}
          </View>
        ) : null}

        {item.s2 ? (
          <View>
            <Card style={styles.card}>
              <View style={styles.header}>
                <Text category="h6" style={styles.title}>
                  Student 2 Details
                </Text>
              </View>
              <Divider style={styles.divider} />
              <View style={styles.content}>
                <View style={styles.row}>
                  <Text style={styles.label}> Name:</Text>
                  <Text style={styles.value}>{item.s2}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.label}>Course:</Text>
                  <Text style={styles.value}>{item.course2}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.label}>Unit:</Text>
                  <Text style={styles.value}>{item.u2}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.label}>Open FIFs:</Text>
                  <Text style={styles.value}>{item.fif2}</Text>
                </View>
              </View>
            </Card>
            {item.gs2 ? (
              <Card style={styles.card}>
                <View style={styles.rowContainer}>
                  <Text category="s1" style={styles.cardText}>
                    Gradesheet:
                  </Text>
                  <Button
                    appearance="ghost"
                    onPress={() => openInBrowser(item.gs2)}
                    style={styles.button}
                  >
                    View Gradesheet
                  </Button>
                </View>
              </Card>
            ) : (
              <Card></Card>
            )}
          </View>
        ) : null}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlashList
        data={[activity]} // Pass the activity data as an array
        renderItem={RenderActivity}
        keyExtractor={(item) => item.id}
        estimatedItemSize={100}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: 10,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  header: {
    paddingBottom: 10,
    alignItems: "center",
  },
  title: {
    fontWeight: "bold",
    color: "#5d95e8",
  },
  divider: {
    marginBottom: 10,
  },
  content: {
    paddingVertical: 5,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 5,
  },
  label: {
    fontWeight: "600",
    color: "#888",
    fontSize: 14,
  },
  value: {
    fontWeight: "400",
    color: "#333",
    fontSize: 14,
  },
  container: {
    flex: 1,
    backgroundColor: "#F7F9FC",
  },
  sectionContainer: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: "#E5E9F2",
    borderRadius: 8,
    marginVertical: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  rowContainer: {
    flexDirection: "row", // Aligns Text and Button in a row
    alignItems: "center", // Vertically center the content
    justifyContent: "space-between", // Adds space between Text and Button
  },
  sectionHeader: {
    fontWeight: "bold",
    color: "#2E3A59",
    fontSize: 20,
  },
  card: {
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 8,
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  cardText: {
    color: "#2E3A59",
    fontSize: 16,
  },
  button: {
    marginVertical: 8,
  },
  linkButton: {
    marginTop: 4,
    color: "#3366FF",
  },
});

export default Activity;
