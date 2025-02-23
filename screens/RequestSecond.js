import React, { useState, useCallback } from "react";
import {
    StyleSheet,
    View,
    SafeAreaView,
    TouchableOpacity,
    Platform,
    Alert
} from "react-native";
import { Text, Button, IndexPath, Toggle } from "@ui-kitten/components";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useNavigation, useRoute } from "@react-navigation/native";
import { SelectList } from "react-native-dropdown-select-list";

const RequestSecondStudent = ({ navigation }) => {
    const route = useRoute();
    const { passeddata } = route.params;
    const [modifiedData, setModifiedData] = useState(passeddata);
    const [schedDate, setSchedDate] = useState(new Date());
    const [selectedIndex, setSelectedIndex] = useState(new IndexPath(0)); // Default index
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [filterByInst, setFilterByInst] = useState("");
    const [filterBySite, setFilterBySite] = useState("");
    const [isToggled, setisToggled] = useState(false)

    const options = ["Option 1", "Option 2", "Option 3"];
    const siteOptions = ["Site A", "Site B", "Site C"];
    const chargeOptions = ["Refund", "Fun", "Loser"];

    const handleToggleChange = (isChecked) => {
        setisToggled(isChecked);
        setModifiedData({ ...modifiedData, secondStudent: isChecked });

    };

    const handleConfirm = () => {
        navigation.navigate("RequestConfirm", { alldata: modifiedData });
    };

    return (
        <SafeAreaView style={{ flex: 1, padding: 20 }}>
            {/* Select Option Dropdown */}
            <SelectList
                data={options.map((item) => ({ key: item, value: item }))}
                setSelected={(value) => setModifiedData({ ...modifiedData, selectedOption: value })}
                placeholder="Select Student"
                boxStyles={styles.selectListBox}
            />

            <SelectList
                data={siteOptions.map((item) => ({ key: item, value: item }))}
                setSelected={(value) => setModifiedData({ ...modifiedData, unit: value })}
                placeholder="Select Unit"
                boxStyles={styles.selectListBox}
            />
            <SelectList
                data={chargeOptions.map((item) => ({ key: item, value: item }))}
                setSelected={(value) => setModifiedData({ ...modifiedData, chargeReason: value })}
                placeholder="Charge Reason"
                boxStyles={styles.selectListBox}
            />
            <View style={styles.toggleContainer}>
                <Text style={styles.toggleText}>Second Student</Text>
                <Toggle
                    checked={isToggled}
                    onChange={handleToggleChange} />

            </View>

            {/* Submit Button */}
            <Button onPress={handleConfirm}>Next</Button>
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
    toggleContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginVertical: 16,
        paddingHorizontal: 8,
    },
    toggleText: {
        fontWeight: "bold",
        color: "#8F9BB3",
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

export default RequestSecondStudent;
