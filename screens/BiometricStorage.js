import ReactNativeBiometrics from "react-native-biometrics";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";
import { EtaAlert } from "./ExtraImports";

const rnBiometrics = new ReactNativeBiometrics({
    allowDeviceCredentials: true, // Allows Face ID / Touch ID
});

// 🔹 Check Biometric Availability and Authenticate
export const handleBiometricAuth = async (message = "Authenticate with Biometrics") => {
    try {
        const { available, biometryType } = await rnBiometrics.isSensorAvailable();
        if (!available) {
            return false;
        }

        const { success } = await rnBiometrics.simplePrompt({
            promptMessage: message,
        });

        return success;
    } catch (error) {
        //Alert.alert("Biometric Authentication Error:", error);
        EtaAlert(
             "Biometric Authentication Error:",
              error,
              "Ok",
              ""
            );
        return false;
    }
};

export const storeCredentials = async (username, password, accesscode) => {
    try {

        // Store credentials directly in AsyncStorage (No Face ID needed)
        const credentialData = { username, password, accesscode };
        await AsyncStorage.setItem("biometricCredentials", JSON.stringify(credentialData));
    } catch (error) {
        console.error("❌ Biometric Storage Error:", error);
    }
};


export const retrieveCredentials = async () => {
    try {
        const storedData = await AsyncStorage.getItem("biometricCredentials");

        if (!storedData) {
            return null;
        }

        const { username, password, accesscode } = JSON.parse(storedData);

        return { username, password, accesscode };
    } catch (error) {
        return null;
    }
};


// 🔹 Delete Stored Credentials and Biometric Keys
export const deleteBiometricData = async () => {
    try {
        await AsyncStorage.removeItem("biometricCredentials");
        const { keysDeleted } = await rnBiometrics.deleteKeys();

        if (keysDeleted) {
            //Alert.alert("Success", "Biometric keys and credentials deleted.");
            EtaAlert(
                "Success",
                 "Biometric keys and credentials deleted.",
                 "Ok",
                 ""
               );
        } else {
            //Alert.alert("Warning", "Credentials deleted, but biometric keys not found.");
            EtaAlert(
                "Warning",
                 "Credentials deleted, but biometric keys not found.",
                 "Ok",
                 ""
               );
        }
    } catch (error) {
        console.log("Error deleting biometric data:", error);
    }
};
