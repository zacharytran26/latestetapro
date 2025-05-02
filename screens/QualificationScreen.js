import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  SafeAreaView,
  TouchableOpacity,
  Modal,
  TextInput,
  TouchableWithoutFeedback,
  Image,
  Alert
} from "react-native";
import { Layout, Text, Icon, Spinner, Card } from "@ui-kitten/components";
import { useAuth } from "./ThemeContext";
import { launchImageLibrary } from 'react-native-image-picker';
import { handleFetchError, EtaAlert } from "./ExtraImports";
import { FlashList } from "@shopify/flash-list";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const QualiScreen = ({ navigation }) => {
  const [quali, setQuali] = useState([]);
  const [qualURIs, setQualURIs] = useState({});
  const [localQualURIs, setLocalQualURIs] = useState({});
  const [imageUploaded, setImageUploaded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [qualicount, setQualicount] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [imageURI, setImageURI] = useState(null);
  const [previewVisible, setPreviewVisible] = useState(false);
  const { authUser, setAuthUser, setIsLoggedIn, setTabBarBadge } = useAuth();
  const [filter, setFilter] = useState("");
  const [currentAsOf, setCurrentAsOf] = useState("");

  useEffect(() => {
    fetchQuali();
    setImageUploaded(false);
  }, [imageUploaded]);

  // Fetch the qualifications from the server
  const fetchQuali = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${authUser.host
        }content?module=home&page=m&reactnative=1&accesscode=&session_id=${authUser.sessionid
        }&customer=&mode=getqualification&etamobilepro=1&nocache=${Math.random().toString().split(".")[1]
        }&persid=${authUser.currpersid}`
      );
      const data = await response.json();
      if (handleFetchError(data, setAuthUser, setIsLoggedIn)) {
        return; // Stop further processing if an error is handled
      }
      setCurrentAsOf(data.currentasof);
      setQuali(data.qualifications);
      if (data.openmsg > 0) {
        setTabBarBadge(jsonData.openmsg);
      }
      setQualicount(data.qualifications.length);

      const serverURIs = {};
      data.qualifications.forEach((qual) => {
        if (qual.SYSDOCID > 0) {
          serverURIs[qual.QID] = `${authUser.host.replace(
            "servlet/",
            ""
          )}php/upload/view.php?imgRes=10&viewPers=${authUser.currpersid
            }&rorwwelrw=rw&curuserid=${authUser.currpersid}&id=${qual.SYSDOCID
            }&svr=${authUser.svr}&s=${authUser.sessionid}&c=eta${authUser.schema
            }`;
        } else {
          serverURIs[qual.QID] = null;
        }
      });

      // Merge server URIs with locally stored URIs
      const mergedURIs = { ...serverURIs, ...localQualURIs };
      setQualURIs(mergedURIs); // Update the state with the merged URIs
    } catch (error) {
      console.error("Error fetching or parsing data:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchQuali();
  };

  const handleLongPress = (item) => {
    const uri = qualURIs[item.QID];
    if (uri) {
      setImageURI(uri);
      setPreviewVisible(true);
    }
  };

  const openImagePickerQ = async (selectedQual) => {
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
          "Failure",
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


  const renderQuali = ({ item }) => {
    const uri = qualURIs[item.QID];

    return (
      <Card
        style={styles.card}
        header={() => (
          <View style={styles.cardHeader}>
            <Text style={styles.cardHeaderText}>{item.QUAL}</Text>
            {uri ? (
              <TouchableOpacity
                style={styles.cardHeaderIcon}
                onPress={() => navigation.navigate("Image", { imageUri: uri })}
                onLongPress={() => handleLongPress(item)}
              >
                <Icon
                  name={"external-link-outline"}
                  width={18}
                  height={18}
                  fill={"#3366FF"}
                />
              </TouchableOpacity>
            ) : authUser.upqual == "rw" ? (
              <TouchableOpacity
                style={styles.cardHeaderIcon}
                onPress={() => openImagePickerQ(item)}
              >
                <Icon
                  name={"plus-circle"}
                  width={18}
                  height={18}
                  fill={"#3366FF"}
                />
              </TouchableOpacity>
            ) : (
              <></>
            )}
          </View>
        )}
      >
        <Text style={styles.cardText}>
          <Text style={styles.label}>Award Date:</Text> {item.AWARD_DATE}
        </Text>
        <Text style={styles.cardText}>
          <Text style={styles.label}>Description:</Text> {item.DESCRP}
        </Text>
        <Text style={styles.cardText}>
          <Text style={styles.label}>By:</Text> {item.BY}
        </Text>
      </Card>
    );
  };

  if (loading && !refreshing) {
    return (
      <Layout style={styles.loadingContainer}>
        <Spinner />
      </Layout>
    );
  }

  const filteredQualis = quali.filter((quali) => {
    const year = quali.AWARD_DATE.split(" ")[2];

    return (
      quali.QUAL.toLowerCase().includes(filter.toLowerCase()) ||
      (year && year.includes(filter)) // Check if year exists and matches the filter
    );
  });

  return (
    <Layout style={styles.container}>
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.screenWrapper}>

        {/* Scrollable Section */}
        <KeyboardAwareScrollView
          enableAutomaticScroll={true}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.headerContainer}>
            <Text category="h5" style={styles.headerText}>
              Qualifications
            </Text>
          </View>
          <View style={styles.header}>
            <View style={styles.searchContainer}>
              <TextInput
                style={styles.input}
                placeholder="Search"
                value={filter}
                onChangeText={setFilter}
                placeholderTextColor="#8F9BB3"
              />
            </View>
          </View>

          <FlashList
            data={filteredQualis}
            renderItem={renderQuali}
            keyExtractor={(item, index) => index.toString()}
            refreshing={refreshing}
            onRefresh={handleRefresh}
            contentContainerStyle={styles.list}
          />

          {imageURI && (
            <Modal
              animationType="slide"
              transparent={true}
              visible={previewVisible}
              onRequestClose={() => setPreviewVisible(false)}
            >
              <TouchableWithoutFeedback onPress={() => setPreviewVisible(false)}>
                <View style={styles.modalOverlay}>
                  <TouchableOpacity
                    style={styles.modalView}
                    onPress={() => {
                      setPreviewVisible(false);
                      navigation.navigate("Image", { imageUri: imageURI });
                    }}
                  >
                    <Image source={{ uri: imageURI }} style={styles.imagePreview} />
                  </TouchableOpacity>
                </View>
              </TouchableWithoutFeedback>
            </Modal>
          )}
        </KeyboardAwareScrollView>

        {/* Fixed Bottom */}
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
    backgroundColor: "#F7F9FC",
  },
  scrollcontainer: {
    flexGrow: 1,
    paddingBottom: 20,
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
    marginVertical: 10,
    marginTop: -10
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    marginBottom: 16,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    height: 40,
    borderColor: "#E4E9F2",
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 16,
    paddingLeft: 12,
    flex: 1,
    backgroundColor: "#ffffff",
  },
  headerText: {
    fontWeight: "bold",
    color: "#2E3A59",
    marginTop: 10,
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
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardHeaderText: {
    fontWeight: "bold",
    color: "#2E3A59",
    fontSize: 16,
  },
  cardHeaderIcon: {
    alignItems: "flex-end",
    marginLeft: "auto",
  },
  imagePreview: {
    width: 200,
    height: 200,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  list: {
    paddingBottom: 16,
  },
  cardText: {
    fontSize: 16,
    marginBottom: 4,
    color: "#2E3A59",
  },
  label: {
    fontWeight: "600",
    color: "#8F9BB3",
  },
});

export default QualiScreen;
