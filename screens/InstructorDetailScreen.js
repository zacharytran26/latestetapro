import React, { useState, useEffect, useCallback} from "react";
import {
  StyleSheet,
  SafeAreaView,
  ScrollView,
  View,
  TouchableOpacity,
  Alert,
  Linking,
  Platform,
} from "react-native";
import {
  Layout,
  Text,
  Avatar,
  Card,
  Button,
  Divider,
} from "@ui-kitten/components";
import { useRoute } from "@react-navigation/native";
import { useAuth } from "./ThemeContext";
import { handleFetchError, EtaAlert } from "./ExtraImports";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Contacts from "react-native-contacts";
import { launchImageLibrary } from 'react-native-image-picker';
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useFocusEffect } from "@react-navigation/native";

const InstructorList = ({ navigation }) => {
  const route = useRoute();
  const { detail } = route.params;
  const { authUser, setAuthUser, setIsLoggedIn } = useAuth();
  const [image, setImage] = useState(null);
  const [instDetail, setInstDetail] = useState({});
  const [imageError, setImageError] = useState(false); // Track image loading error
  const [imageURI, setImageURI] = useState(null);
  const [imageUploaded, setImageUploaded] = useState(false);



  useEffect(() => {
    FetchInstructorDetail();
    // (async () => {
    //   try {
    //     const { status } = await Contacts.requestPermission();
    //     if (status !== "granted") {
    //       Alert.alert("Permission denied", "Unable to access contacts.");
    //     }
    //   } catch (error) {
    //     console.error("Error requesting permissions:", error);
    //     Alert.alert("Error", "An error occurred while requesting permissions.");
    //   }
    // })();
  }, []);

  useEffect(() => {
    //if (instDetail.SYSDOCID){
      const uri = `${authUser.host.replace(
        "servlet/",
        ""
      )}/php/upload/view.php?imgRes=10&viewPers=${authUser.currpersid
        }&rorwwelrw=rw&curuserid=${authUser.currpersid}&id=${instDetail.SYSDOCID
        }&svr=${authUser.svr}&s=${authUser.sessionid}&c=eta${authUser.schema}`;

      setImage(uri || imageURI||image);
    //}else{
      //console.log("imageURI",imageURI);
      //setImage(imageURI);
    //}
  }, [instDetail]);

  useFocusEffect(
    useCallback(() => {
      // Run this when screen comes back into focus
      if (imageUploaded) {
        FetchInstructorDetail(); // Refresh details
        setImageUploaded(false); // Reset the flag so it only runs once
      }
    }, [imageUploaded])
  );

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

  const addContact = async () => {
    const contact = {
      familyName: instDetail.DISNAME || "Unknown",
      //givenName:'',
      emailAddresses: [{ label: 'work', email: instDetail.EMAIL }],
      phoneNumbers: [{ label: 'mobile', number: instDetail.PHONE }],
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
        EtaAlert(
          "Error",
          'User cancelled image picker',
          "Ok",
          ""
        );
      } else if (result.error) {
        //Alert.alert('Image picker error: ', result.error);
        EtaAlert(
          "Error",
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
          formData.append("pers_id", `${detail.ID}`);
          formData.append("pers_type", `${authUser.perstype}`);
          formData.append("doc_type", "instProfilePic");
          formData.append("title", "PersonProfile");
          formData.append("file_type", result.assets[0].type);
          formData.append("etaaction", "new");
          formData.append("curuserid", `${authUser.currpersid}`);
          formData.append("chg_tstamp", new Date());

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
                setImage(imageUri);
                setImageUploaded(true);
                EtaAlert("Success","Image uploaded successfully!","Ok",
          "");
              } else {
                EtaAlert("Failure","Image upload failed.","Ok",
          "");
              }
            })
            .catch((error) => {
              console.log("error", error);
            });
        }

      }
    });

  };

  const DeleteImage = async () => {
    try{
      const request = await fetch(`${authUser.host}content?module=home&page=m&reactnative=1&uname=${authUser.uname
      }&password=${authUser.upwd}&customer=eta${authUser.schema}&session_id=${authUser.sessionid
      }&mode=delimage&etamobilepro=1&nocache=${Math.random().toString().split(".")[1]
      }&persid=${authUser.currpersid}&persinstid=${picId}`);

      /*
      front end:
      sends a request to the middleware/backend via a url from a fetch. 
      needs to specify the path to the correct route handler, specify what stored procedure to execute, and all the parameters that
      the stored proceudre needs 
      once done, it will wait for the middleware/backend to execute and is expecting a response from the DB in a 
      form of a json formatted string to parse

      middleware: java database connectivity (jdbc) connect to, query, and manipulate an oracle DB
      acts like a bridge between Java applications and DBMS

      backend:
      oracle DB running PostgreSQL

      once 'translated' from middleware will call a stored procedure that would execute a code block
      based on the solution. 
      the stored procedure will contain SQL code to either create, read, update, or delete data.
      Will then return a json formatted string back to application
      
      
      */
      const data = await request.json();
      if (handleFetchError(data, setAuthUser, setIsLoggedIn)) {
        return; // Stop further processing if an error is handled
      }
      if (handleFetchError(data)) {
        // If an authentication error occurred, stop further processing
        return;
      }
      setInstDetail(prev => ({
        ...prev,
        SYSDOCID: data.SYSDOCID,
      }));
      
    }catch(error){
      console.error("Error deleting an image.", error)
    }
    
  };

  //from home cal screen : ${detail.ID}  == ${detail.picid}
  var picId = 0;
  detail.picid ? (picId = detail.picid) : (picId = detail.ID);
  const FetchInstructorDetail = async () => {
    try {
      const response = await fetch(
        `${authUser.host}content?module=home&page=m&reactnative=1&uname=${authUser.uname
        }&password=${authUser.upwd}&customer=eta${authUser.schema}&session_id=${authUser.sessionid
        }&mode=getinstructordetail&etamobilepro=1&nocache=${Math.random().toString().split(".")[1]
        }&persid=${authUser.currpersid}&persinstid=${picId}`
      );
      const data = await response.json();
      if (handleFetchError(data, setAuthUser, setIsLoggedIn)) {
        return; // Stop further processing if an error is handled
      }
      if (handleFetchError(data)) {
        // If an authentication error occurred, stop further processing
        return;
      }
      setInstDetail(data);
      
    } catch (error) {
      console.error("Error fetching instructor details:", error);
    }
  };

  let avatarSource;
  if (instDetail.SYSDOCID === ""){
    avatarSource = require("../assets/person-icon.png");
  }else{
    avatarSource = { uri: image };
  }

  return (
    <KeyboardAwareScrollView enableAutomaticScroll={true} contentContainerStyle={styles.scrollcontainer}>

      <Layout style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.profileSection}>
              {authUser.perstype === "instructor" ? (
                <TouchableOpacity onPress={() => openImagePickerI()} onLongPress={() => console.log("delete image")}>
                <Avatar
                  source={avatarSource}
                  style={styles.profileAvatar}
                  onError={() => setImageError(true)} // Handle image load error
                />
              </TouchableOpacity>) : (<Avatar
                source={avatarSource}
                style={styles.profileAvatar}
                onError={() => setImageError(true)} // Handle image load error
              />)}

              <Text category="h1" style={styles.profileName}>
                {instDetail.DISNAME}
              </Text>
              <Button
                onPress={addContact}
                accessoryLeft={() => (
                  <Icon name="account-plus" size={20} color="#fff" />
                )}
                style={styles.actionButton}
              >
                Add Contact
              </Button>
            </View>
            <View style={styles.sectionContainer}>
              <Text category="h5" style={styles.sectionHeader}>
                Instructor Information
              </Text>
              <Card style={styles.card}>
                {/* Email Row */}
                {instDetail.EMAIL === "*not set*" || instDetail.EMAIL === "" ? (
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
                      <Text style={styles.contactValue}>{instDetail.EMAIL}</Text>
                    </View>
                    <Icon name="chevron-right" size={24} color="#AAA" />
                  </TouchableOpacity>
                )}
                <Divider style={styles.divider} />

                {/* Phone Row */}
                {instDetail.PHONE === "*not set*" || instDetail.PHONE === "" ? (
                  <View style={styles.contactRow}>


                    <Icon name="phone-outline" size={24} color="#3F51B5" />
                    <View style={styles.textContainer}>
                      <Text style={styles.contactLabel}>Phone</Text>
                      <Text style={styles.contactValue}>{instDetail.PHONE}</Text>
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
              </Card>
            </View>
            <View style={styles.currentasof}>
              <Text>Current as of: {authUser.currentasof}</Text>
            </View>
          </ScrollView>
        </SafeAreaView>
      </Layout>
    </KeyboardAwareScrollView>
  );
};

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F9FC",
    padding: 16,
  },
  scrollcontainer: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  currentasof: {
    alignItems: 'center',
    marginTop: 30
  },
  safeArea: {
    flex: 1,
    backgroundColor: "#F7F9FC",
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
  textContainer: {
    flex: 1,
    marginLeft: 12,
  },
  contactRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
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
    color: "#124adb",
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

export default InstructorList;
