import ReactNativeBiometrics from "react-native-biometrics";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";

const rnBiometrics = new ReactNativeBiometrics({
    allowDeviceCredentials: true, // Allows Face ID / Touch ID
});

// 🔹 Check Biometric Availability and Authenticate
export const handleBiometricAuth = async (message = "Authenticate with Biometrics") => {
    try {
        const { available, biometryType } = await rnBiometrics.isSensorAvailable();
        if (!available) {
            console.log("Biometric Authentication Not Available");
            return false;
        }

        const { success } = await rnBiometrics.simplePrompt({
            promptMessage: message,
        });

        return success;
    } catch (error) {
        console.log("Biometric Authentication Error:", error);
        return false;
    }
};

export const storeCredentials = async (username, password, accesscode) => {
    try {
        console.log("🔹 Storing Credentials:", { username, password, accesscode });

        const payload = `${username}:${password}:${accesscode}`;

        // 🔹 Ensure biometric keys exist
        const { keysExist } = await rnBiometrics.biometricKeysExist();
        if (!keysExist) {
            console.log("🔹 Biometric keys not found. Creating new keys...");
            await rnBiometrics.createKeys();
        }

        // 🔹 Create a biometric signature
        const { success, signature } = await rnBiometrics.createSignature({
            promptMessage: "Authenticate to Store Credentials",
            payload,
        });

        if (success) {
            const credentialData = { signature, username, password, accesscode };
            await AsyncStorage.setItem("biometricCredentials", JSON.stringify(credentialData));

            // 🔹 Reset biometric scan requirement for next login
            await AsyncStorage.setItem("biometricScanned", "false");

            console.log("✅ Credentials stored successfully!");
        } else {
            Alert.alert("Error", "Failed to store credentials.");
        }
    } catch (error) {
        Alert.alert("Error", "Failed to store credentials: " + error.message);
        console.error("❌ Biometric Storage Error:", error);
    }
};


export const retrieveCredentials = async () => {
    try {
        const storedData = await AsyncStorage.getItem("biometricCredentials");
        console.log("📦 Retrieved stored data:", storedData);

        if (!storedData) {
            Alert.alert("Error", "No credentials found.");
            return null;
        }

        const { signature, username, password, accesscode } = JSON.parse(storedData);
        const payload = `${username}:${password}:${accesscode}`;
        console.log("✅ Stored credentials retrieved:", { username, password, accesscode });

        // 🔹 Check if biometric authentication is needed
        const biometricScanned = await AsyncStorage.getItem("biometricScanned");
        if (biometricScanned === "true") {
            console.log("🔹 Skipping biometric scan - User already authenticated this session.");
            return { username, password, accesscode };
        }

        // 🔹 Perform biometric authentication
        const { success, signature: newSignature } = await rnBiometrics.createSignature({
            promptMessage: "Authenticate to Retrieve Credentials",
            payload,
        });

        if (success && newSignature === signature) {
            await AsyncStorage.setItem("biometricScanned", "true"); // Mark as authenticated
            return { username, password, accesscode };
        } else {
            Alert.alert("Error", "Biometric verification failed.");
            return null;
        }
    } catch (error) {
        console.error("❌ Error retrieving credentials:", error.message);
        Alert.alert("Error", "Failed to retrieve credentials: " + error.message);
        return null;
    }
};

// 🔹 Delete Stored Credentials and Biometric Keys
export const deleteBiometricData = async () => {
    try {
        await AsyncStorage.removeItem("biometricCredentials");
        const { keysDeleted } = await rnBiometrics.deleteKeys();

        if (keysDeleted) {
            Alert.alert("Success", "Biometric keys and credentials deleted.");
        } else {
            Alert.alert("Warning", "Credentials deleted, but biometric keys not found.");
        }
    } catch (error) {
        console.log("Error deleting biometric data:", error);
    }
};
