import React, {useState, useEffect, useRef} from 'react';
import {
  StyleSheet,
  Alert,
  TouchableOpacity,
  Image,
  Platform,
  View,
  Linking,
  StatusBar,
  KeyboardAvoidingView,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import {
  Input,
  Button,
  Layout,
  Text,
  Spinner,
  ProgressBar,
} from '@ui-kitten/components';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {WebView} from 'react-native-webview';
import {useAuth} from './ThemeContext';
import {useFocusEffect, useRoute} from '@react-navigation/native';
import messaging from '@react-native-firebase/messaging';
import {PermissionsAndroid} from 'react-native';
import {
  handleBiometricAuth,
  storeCredentials,
  retrieveCredentials,
} from './BiometricStorage';
import {EtaAlert} from './ExtraImports';
var ssoLogin = 0;
var faceIDLogin = 0; //whenever a screen re-renders, the value is reverted back to the original value
var logIn = 0;
const LoginScreen = ({navigation}) => {
  const [accesscode, setAccesscode] = useState('');
  const [passedData, setPassedData] = useState([]);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginLabel, setLoginLabel] = useState('LOGIN');
  const [loading, setLoading] = useState(false); // Loading state
  const [progress, setProgress] = useState(0); // Progress state
  const [isSelected, setIsSelected] = useState(false);
  const [etaPushToken, setEtaPushToken] = useState('');
  const [isLoginEnabled, setIsLoginEnabled] = useState(false);
  const [isInputEnabled, setIsInputEnabled] = useState(false);
  const route = useRoute();
  const webViewRef = useRef(null);
  const BiometricAuthRef = useRef(false);
  const isAutoFillRef = useRef(false);

  const [urlview, setUrlview] = useState(
    'https://apps5.talonsystems.com/tseta/tc.htm',
  );
  const [isTermsAccepted, setIsTermsAccepted] = useState(false);
  const url = 'https://apps5.talonsystems.com/tseta/tc.htm';

  const handleAutoFillAndAuth = async () => {
    if (BiometricAuthRef.current) return; // Already authenticated

    const isAuthenticated = await handleBiometricAuth(
      'Authenticate to Autofill Credentials',
    );
    const storedCredentials = await retrieveCredentials();
    // ✅ Only proceed if stored credentials exist
    if (
      storedCredentials?.username &&
      storedCredentials?.password &&
      storedCredentials?.accesscode
    ) {
      if (!isAuthenticated) return;

      BiometricAuthRef.current = true;
      isAutoFillRef.current = true;

      // Auto-fill credentials
      setAccesscode(storedCredentials.accesscode);
      setUsername(storedCredentials.username);
      setPassword(storedCredentials.password);
    } else {
      // Don't alert anything – silently ignore for first-time users
      return;
    }
  };

  // whenever I change the three fields, it will trigger fLogin(). Need to find a way that allows the user to input own
  // data that does not call the fLogin() whenever it changes
  // useEffect(() => {
  //   if (username && password && accesscode) {
  //     fLogin();
  //   }

  // }, [username, password, accesscode]); //anything inside the dependency array with trigger useEffect
  useEffect(() => {
    if (faceIDLogin === 0) {
      handleAutoFillAndAuth();
      faceIDLogin = 1;
    }
  }, []);

  useEffect(() => {
    if (logIn === 0 && isAutoFillRef.current) {
      if (username && password && accesscode && faceIDLogin === 1) {
        fLogin();
        // setIsAutoFill(false); // Reset flag after auto-login
        logIn = 1;
        isAutoFillRef.current = false; // Reset flag
      }
    }
  }, [username, password, accesscode]);

  useEffect(() => {
    checkAlertStatus();
    loadAccessCode();
    messaging()
      .getToken()
      .then(mytoken => {
        setEtaPushToken(mytoken);
      });
  }, []);

  const {
    setUrl,
    authUser,
    setAuthUser,
    isLoggedIn,
    setIsLoggedIn,
    chgPwd,
    onetime,
    setOneTime,
    setPinFormat,
    setPwdFormat,
  } = useAuth();
  useEffect(() => {
    if (authUser?.chgpwd === '1') {
      navigation.navigate('ChgPwd');
    }
  }, [authUser, navigation]); // Run this effect whenever `authUser` changes

  const CreateTermsAndConditionAlert = () => {
    Alert.alert('Terms & Conditions', 'Please review our terms:', [
      {
        text: 'View',
        onPress: () => setIsTermsAccepted(true), // Show WebView
      },
    ]);
  };
  // const CreateTermsAndConditionAlert = () => {
  //   const onViewPress = () => setIsTermsAccepted(true); // Show WebView

  //   EtaAlert(
  //     "Terms & Conditions",
  //     "Please review our terms:",
  //     "view",
  //     "",
  //     onViewPress,
  //     null // No cancel button needed
  //   );
  // };

  const checkAlertStatus = async () => {
    const termsAcknowledged = await AsyncStorage.getItem('termsAcknowledged');
    if (!termsAcknowledged) {
      // Show the alert to view terms if not acknowledged
      CreateTermsAndConditionAlert();
    } else {
      // Enable login if terms have already been acknowledged
      setIsLoginEnabled(true);
    }
  };

  const handleWebViewError = syntheticEvent => {
    const {nativeEvent} = syntheticEvent;
    Alert.alert('WebView Error', nativeEvent.description);
  };

  const handleAcknowledge = async () => {
    // Set the terms acknowledged flag and hide the WebView
    await AsyncStorage.setItem('termsAcknowledged', 'true');
    setIsTermsAccepted(false); // Return to login page
    setIsLoginEnabled(true); // Enable login button
  };

  const handlePressIn = () => {
    setIsSelected(true);
  };

  const handlePressOut = () => {
    setIsSelected(false);
  };

  const loadAccessCode = async () => {
    try {
      const savedAccessCode = await AsyncStorage.getItem('accesscode');
      if (savedAccessCode !== null) {
        setAccesscode(savedAccessCode);
        fCheckAccessCode(savedAccessCode);
      }
    } catch (error) {
      console.error('Failed to load access code', error);
    }
  };

  const saveAccessCode = async acode => {
    try {
      await AsyncStorage.setItem('accesscode', acode);
    } catch (error) {
      console.error('Failed to save access code', error);
    }
  };

  const saveUsername = async user => {
    try {
      await AsyncStorage.setItem('username', user);
      //const data = await AsyncStorage.removeItem("accesscode"); // ✅ Add semicolon
      //console.log("Stored Data:", data);
    } catch (error) {
      console.error('Failed to save username', error);
    }
  };

  function fCheckAccessCode(acode) {
    var ucode = acode.toUpperCase();
    if (ucode.indexOf('SSO') != -1) {
      setIsInputEnabled(true);
      setLoginLabel('SSO LOGIN');
      ssoLogin = 1;
    } else {
      setIsInputEnabled(false);
      setLoginLabel('LOGIN');
      ssoLogin = 0;
    }
    if (Platform.OS === 'ios') {
      setAccesscode(ucode);
    } else {
      setAccesscode(acode);
    }
  }

  async function fLogin() {
    if (accesscode === '' && ssoLogin === 0) {
      // Alert.alert("You must specify an Access Code.");
      EtaAlert('Alert', 'You must specify an Access Code.', 'Ok', '');
      return;
    }
    if (username === '' && ssoLogin === 0) {
      //Alert.alert("You must specify a User Name.");
      EtaAlert('Alert', 'You must specify a User Name.', 'Ok', '');
      return;
    }
    if (password === '' && ssoLogin === 0) {
      //Alert.alert("You must specify a Password.");
      EtaAlert('Alert', 'You must specify a Password.', 'Ok', '');
      return;
    }
    if (accesscode.length == 10 ||(accesscode.length == 13 && accesscode.indexOf('SSO'))) {
      saveAccessCode(accesscode);
    } else {
      EtaAlert(
        'Failure',
        'The Access Code is Invalid. Please Try Again',
        'Ok',
        '',
      );
      return;
    }

    setLoading(true);
    setProgress(0.3);

    const conn = ''; //checkConnection();

    if (conn === 'No network connection' || conn === 'Unknown connection') {
      //Alert.alert("You do not have an internet connection!");
      EtaAlert('Alert', 'You do not have an internet connection!', 'Ok', '');
      setLoading(false);
      setProgress(0);
    } else {
      const svr = accesscode.substring(0, 2).replace('0', '');
      const talProd = 'https://apps' + svr + '.talonsystems.com/';
      const localAcode = accesscode;
      var schema = '';

      // ERAU DEV
      if (localAcode.substring(0, 3).toUpperCase() === 'ERD') {
        schema = '';
      } else if (localAcode.substring(0, 3).toUpperCase() === 'ERQ') {
        schema = '';
      } else if (localAcode.substring(0, 3).toUpperCase() === 'ERP') {
        schema = '';
      } else if (localAcode.substring(0, 6).toUpperCase() === 'TALDEV') {
        schema = '';
      } else if (localAcode.substring(0, 6).toUpperCase() === 'TALTST') {
        schema = '';
      } else {
        schema = localAcode.substring(2, 6);
      }

      if (ssoLogin === 0 && isNaN(accesscode)) {
        // Alert.alert(
        //   "You have entered an invalid access code. Only numeric characters are allowed."
        // );
        EtaAlert(
          'Alert',
          'You have entered an invalid access code. Only numeric characters are allowed.',
          'Ok',
          '',
        );
        setLoading(false);
        setProgress(0);
      } else {
        var url = talProd + 'tseta/servlet/';
        var sHost = talProd + 'tseta/servlet/';

        var sHostResURL =
          sHost +
          'content?module=home&page=m&reactnative=1&accesscode=' +
          accesscode +
          '&customer=eta' +
          schema +
          '&etamobilepro=1&ssologin=' +
          ssoLogin;
        var getURL =
          sHostResURL +
          '&mode=mLogin' +
          '&uname=' +
          username +
          '&password=' +
          password +
          '&pushtoken=' +
          encodeURIComponent(etaPushToken);
        fetch(getURL)
          .then(response => response.json())
          .then(async json => {
            if (json.ssologin == '1' && json.validated == '0') {
              json.host = sHostResURL;
              json.schema = schema;
              navigation.navigate('LoginSSO', {json});
              return json;
            }
            setLoading(false);
            setProgress(1);

            if (json.validated == '1') {
              json.host = sHost;
              json.schema = schema;
              if (json.svr == '') {
                json.svr = 'TS' + svr + 'P';
              }
              setAuthUser(json);
              setPinFormat(json.pinformat);
              setPwdFormat(json.pwdformat);
              setPassedData(json);
              setIsLoggedIn(true);
              saveUsername(username);
              // Store Credentials with Face ID for Future Logins
              await storeCredentials(username, password, accesscode);
            } else {
              // Alert.alert(json.msg);
              EtaAlert('Failure', json.msg, 'Ok', '');
              setIsLoggedIn(false);
              setAuthUser(json);
            }
            return json;
          })
          .catch(error => {
            setLoading(false);
            setProgress(0);
            //Alert.alert(error.message);
            EtaAlert('Error1', error.message, 'Ok', '');
            console.error(error.message);
          });
      }
    }
    setIsSelected(false);
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{flex: 1}}>
      <StatusBar style="dark-content" />

      <KeyboardAwareScrollView
        contentContainerStyle={{flexGrow: 1}}
        enableOnAndroid={true}
        enableAutomaticScroll={true}
        keyboardShouldPersistTaps="handled" // ✅ Ensures button remains clickable
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <Layout style={{flex: 1}}>
            {isTermsAccepted ? (
              <View style={{flex: 1, width: '100%', height: '100%'}}>
                <Button style={styles.backButton} onPress={handleAcknowledge}>
                  Acknowledge
                </Button>
                <WebView
                  scrollEnabled={true}
                  nestedScrollEnabled={true}
                  ref={webViewRef}
                  source={{uri: urlview}}
                  onError={handleWebViewError}
                  style={{flex: 1}}
                />
              </View>
            ) : (
              <Layout style={styles.container}>
                <Image
                  style={styles.image}
                  source={require('../assets/login_logo.png')}
                />

                <Input
                  style={styles.input}
                  value={accesscode}
                  label="Access Code"
                  placeholder="Enter your access code"
                  returnKeyType={Platform.OS === 'ios' ? 'done' : 'next'}
                  onChangeText={text => fCheckAccessCode(text)}
                />

                <Input
                  style={styles.input}
                  value={username}
                  label="Username"
                  placeholder="Enter your username"
                  returnKeyType={Platform.OS === 'ios' ? 'done' : 'next'}
                  onChangeText={text => setUsername(text)}
                  autoCapitalize="none"
                  disabled={isInputEnabled}
                  //onFocus={handleAutoFillAndAuth}
                />

                <Input
                  style={styles.input}
                  value={password}
                  label="Password"
                  placeholder="Enter your password"
                  secureTextEntry={true}
                  returnKeyType={Platform.OS === 'ios' ? 'done' : 'next'}
                  onChangeText={text => setPassword(text)}
                  autoCapitalize="none"
                  disabled={isInputEnabled}
                  //onFocus={handleAutoFillAndAuth}
                />

                {loading && (
                  <ProgressBar
                    style={styles.progressBar}
                    progress={progress}
                    status="primary"
                  />
                )}
                <Button
                  style={[styles.button, isSelected && styles.buttonSelected]}
                  onPressIn={handlePressIn}
                  onPressOut={handlePressOut}
                  onPress={fLogin}
                  testID='loginButton'
                  disabled={!isLoginEnabled}>
                  {loginLabel}
                </Button>
              </Layout>
            )}
          </Layout>
        </TouchableWithoutFeedback>
      </KeyboardAwareScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  image: {
    width: 370, // Fixed width
    height: undefined, // Let the height adjust automatically
    aspectRatio: 0.9, // Maintains the correct aspect ratio (adjust as needed)
    resizeMode: 'contain', // Ensures the image is not distorted
    alignSelf: 'center', // Centers the image
    marginVertical: 20, // Adds spacing above and below
    marginTop: -80,
    ...(Platform.OS === 'android' ? {alignSelf: 'center'} : {}),
  },
  input: {
    marginVertical: 8,
    width: '100%',
  },
  progressBar: {
    marginVertical: 16,
    width: '100%',
  },
  button: {
    marginTop: 16,
    width: '100%',
    backgroundColor: '#2b4d9c',
    borderColor: '#2b4d9c',
  },
  sso: {
    marginTop: 8,
    color: '#b6daf2',
  },
  buttonSelected: {
    backgroundColor: '#5a8db0', // Darker shade when selected
    borderColor: '#5a8db0',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 5},
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
});

export default LoginScreen;
