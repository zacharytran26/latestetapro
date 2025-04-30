import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  SafeAreaView,
  View,
  TouchableOpacity,
  Alert,
  ScrollView,
  Linking,
  Platform,
} from "react-native";
import {
  Layout,
  Text,
  Avatar,
  Card,
  Button,
  ButtonGroup,
  Divider,
} from "@ui-kitten/components";
import { useRoute } from "@react-navigation/native";
import { useAuth } from "./ThemeContext";
//import * as Contacts from "expo-contacts";
import Contacts from "react-native-contacts";
import { handleFetchError, EtaAlert } from "./ExtraImports";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const StudentDetailScreen = ({ navigation }) => {
  const route = useRoute();
  const { detail } = route.params;
  const [image, setImage] = useState(null);
  const [studDetail, setStudDetail] = useState({});
  const { authUser, setAuthUser, setIsLoggedIn } = useAuth();

  const uric = `${authUser.host.replace(
    "servlet/",
    ""
  )}/php/upload/view.php?imgRes=10&viewPers=${authUser.currpersid
    }&rorwwelrw=rw&curuserid=${authUser.currpersid}&id=${studDetail.SYSDOCID
    }&svr=${authUser.svr}&s=${authUser.sessionid}&c=eta${authUser.schema}`;

  useEffect(() => {
    fetchStudentDetails();
  }, []);

  //how to handle student 2
  var persRegId = 0;
  detail.s1pr ? (persRegId = detail.s1pr) : (persRegId = detail.id);
  const fetchStudentDetails = async () => {
    try {
      const response = await fetch(
        `${authUser.host}content?module=home&page=m&reactnative=1&uname=${authUser.uname
        }&password=${authUser.upwd}&customer=eta${authUser.schema}&session_id=${authUser.sessionid
        }&mode=getstudentdetail&etamobilepro=1&nocache=${Math.random().toString().split(".")[1]
        }&persid=${authUser.currpersid}&persregid=${persRegId}`
      );
      const data = await response.json();
      if (handleFetchError(data, setAuthUser, setIsLoggedIn)) {
        return; // Stop further processing if an error is handled
      }
      setStudDetail(data);
    } catch (error) {
      //Alert.alert("Error", error.message || "An error occurred");
      EtaAlert(
        "Error",
        error.message || "An error occurred",
        "Ok",
        ""
      );
    }
  };

  function callPhoneNumber() {
    const phoneNumber = `${Platform.OS !== "android" ? "telprompt" : "tel"}:${studDetail.PHONE
      }`;

    Linking.canOpenURL(phoneNumber)
      .then((supported) => {
        if (supported) Linking.openURL(phoneNumber);
      })
      .catch((error) => console.log(error));
  }

  function openAndFormatEmail() {
    const link = `mailto:${studDetail.EMAIL1}`;

    Linking.canOpenURL(link)
      .then((supported) => {
        if (supported) Linking.openURL(link);
      })
      .catch((err) => console.log(error));
  }

  const addContact = async () => {
    const contact = {
      familyName: studDetail.DISNAME || "Unknown",
      //givenName:'',
      emailAddresses: [{ label: 'work', email: studDetail.EMAIL1 }],
      phoneNumbers: [{ label: 'mobile', number: studDetail.PHONE }],
    };

    try {
      //const contactId = await Contacts.addContactAsync(contact);
      const contactId = await Contacts.addContact(contact).then(
        (contactId) => {
          if (contactId) {
            //Alert.alert("Success", "Contact added successfully!");
            EtaAlert(
              "Success",
              "Contact added successfully!",
              "Ok",
              ""
            );
          } else {
            //Alert.alert("Failed", "Failed to add contact.");
            EtaAlert(
              "Failure",
              "Failed to add contact.",
              "Ok",
              ""
            );
          }
        }
      );

    } catch (error) {
      //console.error("Error adding contact:"+error.toString());
      //Alert.alert("Error", "An error occurred while adding the contact.");
      EtaAlert(
        "Error",
        "An error occurred while adding the contact.",
        "Ok",
        ""
      );
    }
  };

  return (
    <ScrollView>
    <Layout style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView>
          <View style={styles.headerContainer}>
            <Avatar
              source={image ? { uri: image } : { uri: uric }}
              style={styles.profileAvatar}
            />
            {studDetail && studDetail.isgrounded === "1" && (
              <Text style={styles.groundedText}>
                {studDetail.DISNAME} is GROUNDED
              </Text>
            )}

            <Text category="h1" style={styles.profileName}>
              {studDetail ? studDetail.DISNAME : ""}
            </Text>
          </View>

          <View style={styles.buttonGroup}>
            <Button
              onPress={addContact}
              accessoryLeft={() => (
                <Icon name="account-plus" size={20} color="#fff" />
              )}
              style={styles.actionButton}
            >
              Add Contact
            </Button>
            <Button
              onPress={() =>
                navigation.navigate("StudentMap", { course: studDetail })
              }
              accessoryLeft={() => <Icon name="map" size={20} color="#fff" />}
              style={styles.actionButton}
            >
              Course Map
            </Button>
            <Button
              onPress={() =>
                navigation.navigate("StudentCourse", { course: studDetail })
              }
              accessoryLeft={() => <Icon name="book" size={20} color="#fff" />}
              style={styles.actionButton}
            >
              Course Details
            </Button>
          </View>

          <View style={styles.sectionContainer}>
            <Text category="h5" style={styles.sectionHeader}>
              Contact Information
            </Text>
            <Card style={styles.card}>
              {/* Email Row */}
              {studDetail.EMAIL1 === "*not set*" ? (
                <View style={styles.contactRow}>
                  <Icon name="email-outline" size={24} color="#4CAF50" />
                  <View style={styles.textContainer}>
                    <Text style={styles.contactLabel}>Email</Text>
                    <Text style={styles.contactValue}>*not set*</Text>
                  </View>
                </View>
              ) : (
                <TouchableOpacity
                  style={styles.contactRow}
                  onPress={openAndFormatEmail}
                >
                  <Icon name="email-outline" size={24} color="#4CAF50" />
                  <View style={styles.textContainer}>
                    <Text style={styles.contactLabel}>Email</Text>
                    <Text style={styles.contactValue}>{studDetail.EMAIL1}</Text>
                  </View>
                  <Icon name="chevron-right" size={24} color="#AAA" />
                </TouchableOpacity>
              )}

              {/* Phone Row */}
              {studDetail.PHONE === "*not set*" ? (
                <View style={styles.contactRow}>


                  <Icon name="phone-outline" size={24} color="#3F51B5" />
                  <View style={styles.textContainer}>
                    <Text style={styles.contactLabel}>Phone</Text>
                    <Text style={styles.contactValue}>{studDetail.PHONE}</Text>
                  </View>
                </View>
              ) : (
                <TouchableOpacity
                  style={styles.contactRow}
                  onPress={callPhoneNumber}
                >
                  <Icon name="phone-outline" size={24} color="#3F51B5" />
                  <View style={styles.textContainer}>
                    <Text style={styles.contactLabel}>Phone</Text>
                    <Text style={styles.contactValue}>{studDetail.PHONE}</Text>
                  </View>
                  <Icon name="chevron-right" size={24} color="#AAA" />
                </TouchableOpacity>
              )}
            </Card>
          </View>

          <View style={styles.sectionContainer}>
            <Text category="h6" style={styles.sectionHeader}>
              Course Information
            </Text>
            <Card style={styles.card}>
              {/* Next Checkride */}
              <View style={styles.infoRow}>
                <Icon name="calendar-check-outline" size={24} color="#4CAF50" />
                <View style={styles.textContainer}>
                  <Text style={styles.label}>Next Checkride</Text>
                  <Text style={styles.value}>{studDetail.NEXT_CHK}</Text>
                </View>
              </View>
              <Divider style={styles.divider} />

              {/* Last Flown */}
              <View style={styles.infoRow}>
                <Icon name="airplane" size={24} color="#2196F3" />
                <View style={styles.textContainer}>
                  <Text style={styles.label}>Last Flown</Text>
                  <Text style={styles.value}>{studDetail.LAST_FLY}</Text>
                </View>
              </View>
              <Divider style={styles.divider} />

              {/* Course */}
              <View style={styles.infoRow}>
                <Icon name="book-outline" size={24} color="#FF9800" />
                <View style={styles.textContainer}>
                  <Text style={styles.label}>Course</Text>
                  <Text style={styles.value}>{studDetail.COURSE}</Text>
                </View>
              </View>
              <Divider style={styles.divider} />

              {/* Instructor */}
              <View style={styles.infoRow}>
                <Icon name="account-tie-outline" size={24} color="#9C27B0" />
                <View style={styles.textContainer}>
                  <Text style={styles.label}>Instructor</Text>
                  <Text style={styles.value}>{studDetail.INST}</Text>
                </View>
              </View>
              <Divider style={styles.divider} />

              {/* Team */}
              <View style={styles.infoRow}>
                <Icon name="account-group-outline" size={24} color="#4CAF50" />
                <View style={styles.textContainer}>
                  <Text style={styles.label}>Team</Text>
                  <Text style={styles.value}>{studDetail.TEAM}</Text>
                </View>
              </View>
              <Divider style={styles.divider} />

              {/* Training Calendar */}
              <View style={styles.infoRow}>
                <Icon name="calendar-outline" size={24} color="#F44336" />
                <View style={styles.textContainer}>
                  <Text style={styles.label}>Training Calendar</Text>
                  <Text style={styles.value}>{studDetail.TRAINCAL}</Text>
                </View>
              </View>
              <Divider style={styles.divider} />

              {/* Flight Block */}
              <View style={styles.infoRow}>
                <Icon name="clock-outline" size={24} color="#FFC107" />
                <View style={styles.textContainer}>
                  <Text style={styles.label}>Flight Block</Text>
                  <Text style={styles.value}>{studDetail.FLT_BLK}</Text>
                </View>
              </View>
            </Card>
          </View>

          <View style={styles.sectionContainer}>
            <Text category="h6" style={styles.sectionHeader}>
              Progress Information
            </Text>
            <Card style={styles.card}>
              <View style={styles.progressRow}>
                <Icon name="check-circle-outline" size={24} color="#4CAF50" />
                <Text style={styles.label}> Completed Units: </Text>
                <Text style={styles.value}>{studDetail.completed}</Text>
              </View>
              <Divider style={styles.divider} />

              <View style={styles.progressRow}>
                <Icon name="alert-circle" size={24} color="#FF9800" />
                <Text style={styles.label}> Remaining Units: </Text>
                <Text style={styles.value}>{studDetail.remaining}</Text>
              </View>
              <Divider style={styles.divider} />

              <View style={styles.progressRow}>
                <Icon name="close-circle-outline" size={24} color="#F44336" />
                <Text style={styles.label}> Failed Units: </Text>
                <Text style={styles.value}>{studDetail.failures}</Text>
              </View>
              <Divider style={styles.divider} />

              <View style={styles.progressRow}>
                <Icon name="book-outline" size={24} color="#3F51B5" />
                <Text style={styles.label}> Attempted Units: </Text>
                <Text style={styles.value}>{studDetail.attempt}</Text>
              </View>
              <Divider style={styles.divider} />

              <View style={styles.progressRow}>
                <Icon name="refresh-circle" size={24} color="#FF5722" />
                <Text style={styles.label}> Repeated Units: </Text>
                <Text style={styles.value}>{studDetail.repeat}</Text>
              </View>
              <Divider style={styles.divider} />

              <View style={styles.progressRow}>
                <Icon name="clock-outline" size={24} color="#9E9E9E" />
                <Text style={styles.label}> Incomplete Units: </Text>
                <Text style={styles.value}>{studDetail.incomplete}</Text>
              </View>
            </Card>
          </View>
        </ScrollView>
      </SafeAreaView>
    </Layout>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F9FC",
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#555",
  },
  value: {
    fontSize: 16,
    fontWeight: "400",
    color: "#333",
  },
  headerContainer: {
    alignItems: "center",
  },
  textContainer: {
    flex: 1,
    marginLeft: 12,
  },
  contactLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#555",
  },
  contactValue: {
    fontSize: 16,
    fontWeight: "400",
    color: "#333",
  },
  safeArea: {
    flex: 1,
  },
  contactRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
  headerBackground: {
    width: "100%",
    height: 180,
    justifyContent: "center",
    alignItems: "center",
  },
  profileContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  profileAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
    borderColor: "#fff",
    borderWidth: 2,
  },
  progressRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 6,
  },
  groundedText: {
    color: "red",
    fontWeight: "bold",
    fontSize: 16,
  },
  profileName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2E3A59",
  },
  buttonGroup: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginVertical: 12,

  },
  actionButton: {
    flex: 1,
    marginHorizontal: 6,
    marginRight: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center", // Ensures both icon and text are centered
  },
  sectionContainer: {
    marginVertical: 8,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#4A5568",
    marginBottom: 8,
  },
  card: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 6,
  },
  cardText: {
    fontSize: 14,
    marginLeft: 8,
    color: "#333",
  },
  divider: {
    marginVertical: 8,
  },
});
export default StudentDetailScreen;
