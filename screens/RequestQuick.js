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

const RequestQuick = ({ navigation }) => {
    const [schedDate, setSchedDate] = useState(new Date());
    const [quickData, setQuickData] = useState({});
    const [selectedIndex, setSelectedIndex] = useState(new IndexPath(0)); // Default index
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [filterByInst, setFilterByInst] = useState("");
    const [filterBySite, setFilterBySite] = useState("");

    const options = ["Option 1", "Option 2", "Option 3"];
    const siteOptions = ["Site A", "Site B", "Site C"];
    const times = ["1", "2", "3"];
    const minutes = ["1", "2", "3"];

    const handleDateChange = (selectedDate) => {
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

    const handleConfirm = () => {
        Alert.alert('Confirmed!', JSON.stringify(quickData, null, 2));
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
                setSelected={(value) => setQuickData({ ...quickData, selectedOption: value })}
                placeholder="Select an Option"
                boxStyles={styles.selectListBox}
            />
            <SelectList
                data={times.map((item) => ({ key: item, value: item }))}
                setSelected={(value) => setQuickData({ ...quickData, ActivityStartHour: value })}
                placeholder="Activity Start"
                boxStyles={styles.selectListBox}
            />
            <SelectList
                data={minutes.map((item) => ({ key: item, value: item }))}
                setSelected={(value) => setQuickData({ ...quickData, ActivityStartMinute: value })}
                placeholder="Activity Start"
                boxStyles={styles.selectListBox}
            />
            <SelectList
                data={times.map((item) => ({ key: item, value: item }))}
                setSelected={(value) => setQuickData({ ...quickData, ActivityStopHour: value })}
                placeholder="Activity Stop"
                boxStyles={styles.selectListBox}
            />
            <SelectList
                data={minutes.map((item) => ({ key: item, value: item }))}
                setSelected={(value) => setQuickData({ ...quickData, ActivityStopMinute: value })}
                placeholder="Activity Stop"
                boxStyles={styles.selectListBox}
            />
            {/* Site Selection Dropdown */}
            <SelectList
                data={siteOptions.map((item) => ({ key: item, value: item }))}
                setSelected={(value) => setQuickData({ ...quickData, selectedSite: value })}
                placeholder={filterBySite || "Select a Site"}

                boxStyles={styles.selectListBox}
            />

            {/* Submit Button */}
            <Button onPress={handleConfirm}>Confirm</Button>
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

export default RequestQuick;
