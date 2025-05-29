import React, { useState, useCallback } from "react";
import {
    StyleSheet,
    View,
    SafeAreaView,
    TouchableOpacity,
    Platform,
    Alert
} from "react-native";
import { Text, Button, IndexPath } from "@ui-kitten/components";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useNavigation } from "@react-navigation/native";
import { SelectList } from "react-native-dropdown-select-list";

const RequestScreen = ({ navigation }) => {
    const [schedDate, setSchedDate] = useState(new Date());
    const [selectedIndex, setSelectedIndex] = useState(new IndexPath(0)); // Default index
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [filterByInst, setFilterByInst] = useState("");
    const [filterBySite, setFilterBySite] = useState("");

    const options = ["Course", "Admin", "Rental"];
    const siteOptions = ["Site A", "Site B", "Site C"];

    const handleDateChange = (event, selectedDate) => {
        setShowDatePicker(false);
        if (selectedDate) {
            setSchedDate(selectedDate);
        }
    };

    const handleRequestData = () => {
        const dataToSend = {
            selectedOption: options[selectedIndex.row],
            date: schedDate.toDateString(),
            site: filterBySite,
        };
        navigation.navigate("RequestStudent", { initdata: dataToSend });
        Alert.alert("Data Sent!", JSON.stringify(dataToSend, null, 2));
    };
    const handleQuickRequest = () => {
        const dataToSend = {
            selectedOption: options[selectedIndex.row],
            date: schedDate.toDateString(),
            site: filterBySite,
        };
        navigation.navigate("RequestQuicK", { initdata: dataToSend });
        Alert.alert("Data Sent!", JSON.stringify(dataToSend, null, 2));
    };

    return (
        <SafeAreaView style={{ flex: 1, padding: 20 }}>
            {/* Date Picker Button */}
            <TouchableOpacity
                onPress={() => setShowDatePicker(true)}
                style={styles.datepickerButton}
            >
                <Text style={styles.datepickerText}>
                    {schedDate.toDateString()}
                </Text>
            </TouchableOpacity>

            {/* Date Picker Modal */}
            {showDatePicker && (
                <View style={styles.datePickerWrapper}>
                    <DateTimePicker
                        value={schedDate}
                        mode="date"
                        display={Platform.OS === "ios" ? "inline" : "default"}
                        onChange={handleDateChange}
                    />
                </View>
            )}

            {/* Select Option Dropdown */}
            <SelectList
                data={options.map((item) => ({ key: item, value: item }))}
                setSelected={(value) => setSelectedIndex(new IndexPath(options.indexOf(value)))}
                placeholder="Select a Request Type"
                boxStyles={styles.selectListBox}
            />
            {/* Submit Button */}
            <Button onPress={handleRequestData}>Detailed Request</Button>
            <Button onPress={handleQuickRequest}>Quick Request</Button>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    datePickerWrapper: {
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#9c9ea1",
        marginVertical: 10,
    },
    datepickerText: {
        fontSize: 16,
        fontWeight: "600",
    },
    datepickerButton: {
        padding: 10,
        alignItems: "center",
        backgroundColor: "#E4E9F2",
        borderRadius: 5,
        marginBottom: 10,
    },
    selectListBox: {
        marginBottom: 10,
    },
});

export default RequestScreen;
