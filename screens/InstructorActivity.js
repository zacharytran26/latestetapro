import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  SafeAreaView,
  ScrollView,
  View,
  TouchableOpacity,
  Alert,
  Platform,
  Linking,
} from "react-native";
import {
  Layout,
  Text,
  Avatar,
  Card,
  Button,
  Icon,
  Divider,
} from "@ui-kitten/components";
import { useRoute } from "@react-navigation/native";
import { useAuth } from "./ThemeContext";
import Contacts from "react-native-contacts";
import { handleFetchError, EtaAlert } from "./ExtraImports";
import { launchImageLibrary } from 'react-native-image-picker';
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const InstructorActivity = ({ navigation }) => {
  const route = useRoute();
  const { activity } = route.params;
  const { authUser, setAuthUser, setIsLoggedIn } = useAuth();
  const [image, setImage] = useState(null);
  const [imageUri, setImageUri] = useState(null);
  const [instDetail, setInstDetail] = useState({});
  const [imageError, setImageError] = useState(false);
  const [imageURI, setImageURI] = useState(null);
  const [localQualURIs, setLocalQualURIs] = useState({});
  const [imageUploaded, setImageUploaded] = useState(false);
  useEffect(() => {
    FetchInstructorDetail();
  }, []);

  useEffect(() => {
    if (instDetail.SYSDOCID) {
      const uri = `${authUser.host.replace(
        "servlet/",
        ""
      )}/php/upload/view.php?imgRes=10&viewPers=${authUser.currpersid
        }&rorwwelrw=rw&curuserid=${authUser.currpersid}&id=${instDetail.SYSDOCID
        }&svr=${authUser.svr}&s=${authUser.sessionid}&c=eta${authUser.schema}`;

      setImage(uri);
    }
  }, [instDetail]);

  const openImagePickerI = async (selected) => {
    const options = {
      mediaType: 'photo',
      includeBase64: false,
      maxHeight: 2000,
      maxWidth: 2000,
    };
    var selectedImage = 0;
    var imageUri;
    launchImageLibrary(options, (result) => {
      if (result.didCancel) {
        //Alert.alert('User cancelled image picker');
        return;
      } else if (result.error) {
        //Alert.alert('Image picker error: ', result.error);
        EtaAlert(
          "Alert",
          'Image picker error: ', result.error,
          "Ok",
          ""
        );
      } else {
        imageUri = result.uri || result.assets?.[0]?.uri;
        selectedImage = 1;
        setImageURI(imageUri);

        if (selectedImage == 1) {
          const formData = new FormData();
          formData.append("photo", {
            uri: imageUri,
            type: "image/png",
            name: result.assets[0].fileName,
          });
          formData.append("pers_id", `${authUser.currpersid}`);
          formData.append("pers_type", `${authUser.perstype}`);
          formData.append("any_type", "qual_id");
          formData.append("any_id", selectedQual.QID);
          if (authUser.perstype === "instructor") {
            formData.append("doc_type", "instQual");
            formData.append("title", "Instructor Qualification");
          } else if (authUser.perstype === "student") {
            formData.append("doc_type", "studQual");
            formData.append("title", "Student Qualification");
          }
          formData.append("file_type", result.assets[0].type);
          formData.append("etaaction", "new");

          const myurl = `${authUser.host}uploadBlobETAAll?`;
          fetch(myurl, {
            method: "POST",
            body: formData,
            headers: {
              "Content-Type": "multipart/form-data;",
            },
          })
            .then((response) => {
              if (response.ok) {
                setLocalQualURIs((prevURIs) => ({
                  ...prevURIs,
                  [selectedQual.QID]: imageUri,
                }));
                setImageUploaded(true);
                alert("Image uploaded successfully!");
              } else {
                alert("Image upload failed.");
              }
            })
            .catch((error) => {
              console.log("error", error);
            });
        }

      }
    });

  };


  const addContact = async () => {
    const contact = {
      familyName: instDetail.DISNAME || "Unknown",
      emailAddresses: [{ label: 'work', email: instDetail.EMAIL1 }],
      phoneNumbers: [{ label: 'mobile', number: instDetail.PHONE }],
    };

    try {
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
              "Failed",
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

  function callPhoneNumber() {
    const phoneNumber = `${Platform.OS !== "android" ? "telprompt" : "tel"}:${instDetail.PHONE
      }`;

    Linking.canOpenURL(phoneNumber)
      .then((supported) => {
        if (supported) Linking.openURL(phoneNumber);
      })
      .catch((error) => console.log(error));
  }

  function openAndFormatEmail() {
    const link = `mailto:${instDetail.EMAIL}`;

    Linking.canOpenURL(link)
      .then((supported) => {
        if (supported) Linking.openURL(link);
      })
      .catch((err) => console.log(error));
  }

  useEffect(() => {
    FetchInstructorDetail();
  }, []);

  const FetchInstructorDetail = async () => {
    try {
      const response = await fetch(
        `${authUser.host}content?module=home&page=m&reactnative=1&uname=${authUser.uname
        }&password=${authUser.upwd}&customer=eta${authUser.schema}&session_id=${authUser.sessionid
        }&mode=getinstructordetail&etamobilepro=1&nocache=${Math.random().toString().split(".")[1]
        }&persid=${authUser.currpersid}&persinstid=${activity.picid}`
      );
      const data = await response.json();
      if (handleFetchError(data, setAuthUser, setIsLoggedIn)) {
        return; // Stop further processing if an error is handled
      }
      setInstDetail(data);
    } catch (error) {
      console.error("Error fetching instructor details:", error);
    }
  };

  return (
    <KeyboardAwareScrollView enableAutomaticScroll={true} contentContainerStyle={styles.scrollcontainer} >
    <Layout style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.profileSection}>
            {authUser.perstype === "instructor" ? (<TouchableOpacity onPress={() => openImagePickerI()}>
              <Avatar
                source={
                  image
                    ? { uri: image }
                    : imageError || !instDetail.SYSDOCID
                      ? require("../assets/person-icon.png")
                      : { uri: image }
                }
                style={styles.profileAvatar}
                onError={() => setImageError(true)} // Handle image load error
              />
            </TouchableOpacity>) : (<Avatar
              source={
                image
                  ? { uri: image }
                  : imageError || !instDetail.SYSDOCID
                    ? require("../assets/person-icon.png")
                    : { uri: image }
              }
              style={styles.profileAvatar}
              onError={() => setImageError(true)} // Handle image load error
            />)}

            <Text category="h1" style={styles.profileName}>
              {instDetail.DISNAME}
            </Text>
            <Button
              onPress={addContact}
              style={styles.contactButton}
              accessoryLeft={(props) => (
                <Icon {...props} name="person-add-outline" />
              )}
            >
              Add to Contacts
            </Button>
          </View>
          <View style={styles.contactInfo}>
            <View style={styles.sectionContainer}>
              <Text category="h5" style={styles.sectionHeader}>
                Instructor Information
              </Text>
            </View>
            {instDetail.EMAIL === '*not set*' || instDetail.EMAIL === "" ? (
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
                  <Text style={styles.cardText}>Email</Text>
                  <Text style={styles.contactValue}>{instDetail.EMAIL}</Text>
                </View>
                <Icon name="chevron-right" size={24} color="#AAA" />
              </TouchableOpacity>
            )}
            <Divider style={styles.divider} />
            {instDetail.PHONE === "*not set*" || instDetail.PHONE === "" ? (
              <View style={styles.contactRow}>


                <Icon name="phone-outline" size={24} color="#3F51B5" />
                <View style={styles.textContainer}>
                  <Text style={styles.contactLabel}>Phone</Text>
                  <Text style={styles.contactValue}>*not set*</Text>
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
                  <Text style={styles.contactValue}>{instDetail.PHONE}</Text>
                </View>
                <Icon name="chevron-right" size={24} color="#AAA" />
              </TouchableOpacity>
            )}

          </View>
        </ScrollView>
      </SafeAreaView>
    </Layout>
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F9FC",
    padding: 16,
  },
  scrollcontainer: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  safeArea: {
    flex: 1,
    backgroundColor: "#F7F9FC",
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 16,
  },
  profileSection: {
    alignItems: "center",
    marginBottom: 24,
  },
  profileAvatar: {
    width: 150,
    height: 150,
    borderRadius: 75,
  },
  profileName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2E3A59",
    marginTop: 8,
    textAlign: "center",
  },
  contactButton: {
    marginTop: 16,
    width: "80%",
  },
  contactInfo: {
    marginBottom: 24,
  },
  contactInfoCard: {
    marginBottom: 16,
    padding: 16,
    borderRadius: 8,
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionHeader: {
    fontWeight: "bold",
    color: "#2E3A59",
    fontSize: 20,
  },
  contactInfoLabel: {
    fontWeight: "bold",
    marginBottom: 4,
    color: "#8F9BB3",
  },
  contactInfoValue: {
    fontSize: 16,
    color: "#2E3A59",
  },
  editButton: {
    alignItems: "center",
    justifyContent: "center",
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
});

export default InstructorActivity;
