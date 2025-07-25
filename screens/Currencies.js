import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  SafeAreaView,
  View,
  TextInput,
  TouchableOpacity,
  StatusBar,
  Modal,
  TouchableWithoutFeedback,
  Image,
  Alert,
  ScrollView,
  RefreshControl,
  Dimensions,
  Button,
} from 'react-native';
import {
  Layout,
  Text,
  Icon,
  Spinner,
  Card,
  CheckBox,
} from '@ui-kitten/components';
import {launchImageLibrary} from 'react-native-image-picker';
import {useAuth} from './ThemeContext';
import {useNavigation} from '@react-navigation/native';
import {FlashList} from '@shopify/flash-list';
import {handleFetchError, EtaAlert} from './ExtraImports';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

const CurrencyScreen = () => {
  const [currencies, setCurrencies] = useState([]);
  const [selectedCurry, setSelectedCurry] = useState({});
  const [currURIs, setCurrURIs] = useState({});
  const [localCurrURIs, setLocalCurrURIs] = useState({});
  const [expcurrencies, setExpcurrencies] = useState([]);
  const [imageUploaded, setImageUploaded] = useState(false);
  const [currcount, setCurrCount] = useState(0);
  const [expirecurrcount, setExpiredCurrCount] = useState(0);
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showExpired, setShowExpired] = useState(false);
  const [uploadedImageUri, setUploadedImageUri] = useState(null);
  const [previewVisible, setPreviewVisible] = useState(false);
  const {authUser, setAuthUser, setIsLoggedIn, setCountCurrency} = useAuth();
  const navigation = useNavigation();
  const [isModalPINVisible, setModalPINVisible] = useState(false);
  const [PINValue, setPINValue] = useState('');
  const toggleModalPINVisibility = () => {
    setModalPINVisible(!isModalPINVisible);
  };

  const fValidatePIN = async () => {
    const response = await fetch(
      `${authUser.host}content?module=home&page=m&reactnative=1&uname=${
        authUser.uname
      }&password=${authUser.upwd}&customer=eta${authUser.schema}&session_id=${
        authUser.sessionid
      }&mode=uploadpin&etamobilepro=1&nocache=${
        Math.random().toString().split('.')[1]
      }&pin=${PINValue}&persid=${authUser.currpersid}`,
      {
        method: 'POST',
        headers: {
          Accept: 'application/txt',
          'Content-Type': 'application/txt',
        },
      },
    )
      .then(response => response.json())
      .then(json => {
        if (json.valid === 1) {
          toggleModalPINVisibility();

          // Ensure modal is fully dismissed before picker opens
          setTimeout(() => {
            openImagePickerC(selectedCurry);
          }, 300);
        } else {
          Alert.alert('Please enter a valid PIN.');
        }
      })
      .catch(error => {
        Alert.alert(
          'Unable to validate your PIN.  Please contact your ETA administrator for further assistance.',
        );
        console.log('fValidatePIN() - error', error);
        toggleModalPINVisibility();
        setSelectedCurry({});
      });

    return;
  };

  useEffect(() => {
    fetchCurrencies();
    setImageUploaded(false);
  }, [imageUploaded]);

  const fetchCurrencies = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${authUser.host}content?module=home&page=m&reactnative=1&session_id=${
          authUser.sessionid
        }&mode=getcurrency&etamobilepro=1&nocache=${
          Math.random().toString().split('.')[1]
        }&persid=${authUser.currpersid}`,
      );
      const data = await response.json();
      if (handleFetchError(data, setAuthUser, setIsLoggedIn)) {
        return; // Stop further processing if an error is handled
      }
      setCurrencies(data.currencies);
      setCurrCount(data.currencies.length);
      const serverURIs = {};
      data.currencies.forEach(cid => {
        if (cid.SYSDOCID > 0) {
          serverURIs[cid.CID] = `${authUser.host.replace(
            'servlet/',
            '',
          )}php/upload/view.php?imgRes=10&viewPers=${
            authUser.currpersid
          }&rorwwelrw=rw&curuserid=${authUser.currpersid}&id=${
            cid.SYSDOCID
          }&svr=${authUser.svr}&s=${authUser.sessionid}&c=eta${
            authUser.schema
          }`;
        } else {
          serverURIs[cid.CID] = null;
        }
      });

      const mergedURIs = {...serverURIs, ...localCurrURIs};
      setCurrURIs(mergedURIs);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const openImagePickerC = async selectedCurr => {
    const options = {
      mediaType: 'photo',
      includeBase64: false,
      maxHeight: 2000,
      maxWidth: 2000,
    };
    var selectedImage = 0;
    var imageUri;
    launchImageLibrary(options, result => {
      if (result.didCancel) {
        //Alert.alert('User cancelled image picker');
        return;
      } else if (result.error) {
        //Alert.alert('Image picker error: ', result.error);
        EtaAlert('Alert', 'Image picker error: ', result.error, 'Ok', '');
      } else {
        imageUri = result.uri || result.assets?.[0]?.uri;
        selectedImage = 1;
        setUploadedImageUri(imageUri);

        if (selectedImage == 1) {
          const formData = new FormData();
          formData.append('photo', {
            uri: imageUri,
            type: 'image/png',
            name: result.assets[0].fileName,
          });
          formData.append('pers_id', `${authUser.currpersid}`);
          formData.append('pers_type', `${authUser.perstype}`);
          formData.append('any_type', 'crncy_id');
          formData.append('doc_type', '');
          if (authUser.perstype == 'instructor') {
            formData.append('doc_type', 'instCrncy');
            formData.append('title', 'Instructor Currency');
          } else if (authUser.perstype == 'student') {
            formData.append('doc_type', 'studCrncy');
            formData.append('title', 'Student Currency');
          }
          formData.append('file_type', result.assets[0].type);
          formData.append('etaaction', 'new');
          formData.append('any_id', selectedCurr.CID);

          const myurl = `${authUser.host}uploadBlobETAAll?`;
          fetch(myurl, {
            method: 'POST',
            body: formData,
            headers: {
              'Content-Type': 'multipart/form-data;',
            },
          })
            .then(response => {
              if (response.ok) {
                setLocalCurrURIs(prevURIs => ({
                  ...prevURIs,
                  [selectedCurr.CID]: imageUri,
                }));
                setImageUploaded(true);
                //Alert.alert("Image uploaded successfully!");
                EtaAlert('Success', 'Image uploaded successfully!', 'Ok', '');
              } else {
                //Alert.alert("Image upload failed.");
                EtaAlert('Failure', 'Image upload failed.', 'Ok', '');
              }
            })
            .catch(error => {
              console.log('error', error);
            });
        }
      }
    });
  };

  const getURi = currency =>
    currencies.length > 0
      ? `${authUser.host.replace(
          'servlet/',
          '',
        )}php/upload/view.php?imgRes=10&viewPers=${
          authUser.currpersid
        }&rorwwelrw=rw&curuserid=${authUser.currpersid}&id=${
          currency.SYSDOCID
        }&svr=${authUser.svr}&s=${authUser.sessionid}&c=eta${authUser.schema}`
      : '';

  const fetchExpCurr = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${authUser.host}content?module=home&page=m&reactnative=1&uname=${
          authUser.uname
        }&password=${authUser.upwd}&customer=eta${authUser.schema}&session_id=${
          authUser.sessionid
        }&mode=getcurrency&etamobilepro=1&nocache=${
          Math.random().toString().split('.')[1]
        }&persid=${authUser.currpersid}&showexp=1`,
      );
      const data = await response.json();
      setExpcurrencies(data.currencies);
      setExpiredCurrCount(data.currencies.length);
      const serverURIs = {};
      data.currencies.forEach(curr => {
        if (curr.SYSDOCID > 0) {
          serverURIs[curr.CID] = `${authUser.host.replace(
            'servlet/',
            '',
          )}php/upload/view.php?imgRes=10&viewPers=${
            authUser.currpersid
          }&rorwwelrw=rw&curuserid=${authUser.currpersid}&id=${
            curr.SYSDOCID
          }&svr=${authUser.svr}&s=${authUser.sessionid}&c=eta${
            authUser.schema
          }`;
        } else {
          serverURIs[curr.CID] = null;
        }
      });
      if (handleFetchError(serverURIs)) {
        // If an authentication error occurred, stop further processing
        return;
      }
      // Merge server URIs with locally stored URIs
      const mergedURIs = {...serverURIs, ...localCurrURIs};
      setCurrURIs(mergedURIs); // Update the state with the merged URIs
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchCurrencies();
    if (showExpired) {
      await fetchExpCurr();
    }
  };

  const handleAlertPress = async () => {
    if (!showExpired) {
      await fetchExpCurr();
    }
    setShowExpired(!showExpired);
  };

  const handleLongPress = item => {
    const urinew = getURi(item) || uploadedImageUri;
    setUploadedImageUri(urinew);
    //setPreviewImage(urinew);
    setPreviewVisible(true);
  };

  const renderCurrency = ({item}) => {
    const uri = currURIs[item.CID];
    let backgroundColor = '#e9fa00'; // Expiring Soon by default

    if (item.expiration === '1') {
      backgroundColor = '#e61717'; // Expired
    } else if (item.expiration === '0') {
      backgroundColor = '#08a818'; // Active
    }

    return (
      <Card
        style={styles.card}
        header={() => (
          <View style={[styles.cardHeader, {backgroundColor}]}>
            <Text style={styles.cardHeaderText}>{item.title}</Text>
            <View style={styles.cardHeaderIcon}>
              {uri ? (
                <TouchableOpacity
                  style={styles.cardHeaderIcon}
                  onPress={() =>
                    navigation.navigate('Image', {
                      imageUri: uri, // Use the valid URI for navigation
                    })
                  }
                  onLongPress={() => handleLongPress(item)}>
                  <Icon
                    name="external-link-outline" // Icon for valid URI
                    width={18}
                    height={18}
                    fill={'#3366FF'}
                  />
                </TouchableOpacity>
              ) : authUser.upcurr == 'rw' ? (
                <TouchableOpacity
                  style={styles.cardHeaderIcon}
                  onPress={() => {
                    setSelectedCurry(item);
                    toggleModalPINVisibility();
                  }} // Open image picker if no URI
                >
                  <Icon
                    name="plus-circle" // Icon when there is no valid URI
                    width={18}
                    height={18}
                    fill={'#3366FF'}
                  />
                </TouchableOpacity>
              ) : (
                <></>
              )}
            </View>
          </View>
        )}>
        <Text category="s1" style={styles.date}>
          Expiration Date: {item.expire}
        </Text>
        <Text category="s2" style={styles.from}>
          Award Date: {item.award}
        </Text>
        <Text category="p1" style={styles.message}>
          Duration: {item.duration} {item.DUR_UNITS}
        </Text>
        <Text category="p1" style={styles.message}>
          Description: {item.descrip}
        </Text>
        <Text category="s1" style={styles.date}>
          By: {item.by}
        </Text>
      </Card>
    );
  };

  const displayedCurrencies = (showExpired ? expcurrencies : currencies).filter(
    currency => {
      const year = currency.AWARD_DATE
        ? currency.AWARD_DATE.split(' ')[2]
        : null;
      return (
        currency.title.toLowerCase().includes(filter.toLowerCase()) || // Match title
        (year && year.includes(filter)) || // Match year
        currency.descrip.toLowerCase().includes(filter.toLowerCase()) // Match description
      );
    },
  );

  if (loading && !refreshing) {
    return (
      <Layout style={styles.loadingContainer}>
        <Spinner size="giant" />
      </Layout>
    );
  }

  return (
    <Layout style={styles.container}>
      <SafeAreaView style={{flex: 1}}>
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
                colors={['#3366FF']} // Optional: Android spinner colors
              />
            }>
            <View style={styles.headerContainer}>
              <Text category="h5" style={styles.counterText}>
                Currencies
              </Text>
            </View>

            <View style={styles.header}>
              <TextInput
                style={styles.input}
                placeholder="Search"
                value={filter}
                onChangeText={setFilter}
                placeholderTextColor="#8F9BB3"
              />
            </View>

            <CheckBox
              checked={showExpired}
              onChange={handleAlertPress}
              style={styles.radio}>
              <Text style={styles.toggleText}>Show Expired</Text>
            </CheckBox>

            <FlashList
              data={displayedCurrencies}
              renderItem={renderCurrency}
              keyExtractor={item => item.CID.toString()}
              refreshing={refreshing}
              //onRefresh={handleRefresh}
              contentContainerStyle={styles.list}
              estimatedItemSize={129}
            />

            {uploadedImageUri && (
              <Modal
                animationType="slide"
                transparent={true}
                visible={previewVisible}
                onRequestClose={() => setPreviewVisible(false)}>
                <TouchableWithoutFeedback
                  onPress={() => setPreviewVisible(false)}>
                  <View style={styles.modalOverlay}>
                    <TouchableOpacity
                      style={styles.modalView}
                      onPress={() => {
                        setPreviewVisible(false);
                        navigation.navigate('Image', {
                          imageUri: uploadedImageUri,
                        });
                      }}>
                      <Image
                        source={{uri: uploadedImageUri}}
                        style={styles.imagePreview}
                      />
                    </TouchableOpacity>
                  </View>
                </TouchableWithoutFeedback>
              </Modal>
            )}

            <Modal
              animationType="slide"
              transparent
              visible={isModalPINVisible}
              presentationStyle="overFullScreen"
              //onDismiss={toggleModalPINVisibility}
            >
              <View style={styles.dialogPIN}>
                <View style={styles.modalView}>
                  <TextInput
                    placeholder="Enter PIN to upload"
                    placeholderTextColor={'grey'}
                    secureTextEntry={true}
                    value={PINValue}
                    style={styles.textInput}
                    onChangeText={value => setPINValue(value)}
                  />
                  <View style={styles.buttonContainer}>
                    <Button title="Continue" onPress={() => fValidatePIN()} />
                    <Button
                      title="Cancel"
                      onPress={() => toggleModalPINVisibility()}
                    />
                  </View>
                </View>
              </View>
            </Modal>
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

const {width} = Dimensions.get('window');
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f7f9fc',
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
  radio: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: -15,
    marginBottom: 10,
  },
  currentasof: {
    alignItems: 'center',
    marginTop: 30,
  },
  headerContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f7f9fc',
  },
  cardHeader: {
    padding: 12,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardHeaderText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  input: {
    height: 40,
    borderColor: '#E4E9F2',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 16,
    paddingLeft: 12,
    flex: 1,
    backgroundColor: '#ffffff',
  },
  toggleText: {
    marginLeft: 16,
    color: '#3366FF',
  },
  rightActionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  actionButton: {
    marginHorizontal: 5,
  },
  list: {
    paddingBottom: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    justifyContent: 'space-between',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  imagePreview: {
    width: 250,
    height: 250,
    borderRadius: 8,
  },
  cardHeaderIcon: {
    alignItems: 'flex-end',
  },
  date: {
    marginVertical: 4,
    fontSize: 14,
    color: '#8F9BB3',
  },
  from: {
    marginVertical: 4,
    fontSize: 14,
    color: '#8F9BB3',
  },
  message: {
    marginVertical: 4,
    fontSize: 14,
    color: '#2E3A59',
  },
  counterText: {
    fontWeight: 'bold',
    color: '#2E3A59',
  },

  dialogPIN: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  modalView: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: '50%',
    left: '60%',
    elevation: 5,
    transform: [{translateX: -(width * 0.4)}, {translateY: -90}],
    height: 150,
    width: width * 0.6,
    backgroundColor: '#fff',
    borderRadius: 7,
  },
  textInput: {
    width: '80%',
    borderRadius: 5,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderColor: 'rgba(0, 0, 0, 0.2)',
    borderWidth: 1,
    marginBottom: 8,
    color: 'black',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 15,
    marginTop: 20,
  },
});

export default CurrencyScreen;
