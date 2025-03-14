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

// 🔹 Create or Retrieve Biometric Key
export const createOrGetBiometricKey = async () => {
    try {
        const { keysExist } = await rnBiometrics.biometricKeysExist();

        if (keysExist) {
            console.log("Biometric keys already exist.");
            return true;
        }

        const { publicKey } = await rnBiometrics.createKeys();
        if (publicKey) {
            Alert.alert("Success", "Biometric Key Created!");
            return publicKey;
        } else {
            Alert.alert("Error", "Failed to generate biometric key.");
            return null;
        }
    } catch (error) {
        console.log("Error creating biometric key:", error);
        return null;
    }
};

// 🔹 Store Credentials Securely with Face ID
export const storeCredentials = async (username, password, accesscode) => {
    try {
        const payload = `${username}:${password}:${accesscode}`;

        // 🔹 Ensure biometric keys exist before signing credentials
        const { keysExist } = await rnBiometrics.biometricKeysExist();
        if (!keysExist) {
            console.log("Biometric keys do not exist. Creating new keys...");
            await rnBiometrics.createKeys();
        }

        // 🔹 Now create a signature with the biometric key
        const { success, signature } = await rnBiometrics.createSignature({
            promptMessage: "Authenticate to Store Credentials",
            payload,
        });

        if (success) {
            const credentialData = { signature, username, password, accesscode };
            await AsyncStorage.setItem("biometricCredentials", JSON.stringify(credentialData));
        } else {
            Alert.alert("Error", "Failed to store credentials.");
        }
    } catch (error) {
        Alert.alert("Error", "Failed to store credentials: " + error.message);
        console.error("Biometric Storage Error:", error);
    }
};



// export const retrieveCredentials = async () => {
//     try {
//         const storedData = await AsyncStorage.getItem("biometricCredentials");
//         console.log("sotred data", storedData);
//         if (!storedData) {
//             Alert.alert("Error", "No credentials found.");
//             return null;
//         }

//         const { signature, username, password } = JSON.parse(storedData);
//         const payload = `${username}:${password}`; // Must match the format used when storing
//         console.log("✅ Stored credentials retrieved:", { username, password });

//         const { success } = await rnBiometrics.createSignature({
//             promptMessage: "Authenticate to Retrieve Credentials",
//             payload,
//             signature,
//         });

//         if (success) {
//             Alert.alert("Success", `Welcome back, ${username}!`);
//             return username;
//         } else {
//             Alert.alert("Error", "Biometric verification failed.");
//             return null;
//         }
//     } catch (error) {
//         console.log("Error", "Failed to retrieve credentials: " + error.message);
//         return null;
//     }
// };
export const retrieveCredentials = async () => {
    try {
        const storedData = await AsyncStorage.getItem("biometricCredentials");
        console.log("📦 Retrieved stored data:", storedData);

        if (!storedData) {
            Alert.alert("Error", "No credentials found.");
            return null;
        }

        const { signature, username, password, accesscode } = JSON.parse(storedData);
        const payload = `${username}:${password}:${accesscode}`; // Must match format used when storing
        console.log("✅ Stored credentials retrieved:", { username, password, accesscode });

        // 🔹 Verify authentication using biometrics
        const { success, signature: newSignature } = await rnBiometrics.createSignature({
            promptMessage: "Authenticate to Retrieve Credentials",
            payload,
        });

        if (success && newSignature === signature) {
            return { username, password, accesscode }; // ✅ Return both username & password
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
