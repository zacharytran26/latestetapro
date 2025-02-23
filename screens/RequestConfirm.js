import React, { useState, useCallback } from "react";
import {
    StyleSheet,
    View,
    SafeAreaView,
    TouchableOpacity,
    Platform,
    Alert,

} from "react-native";
import { Text, Button, IndexPath, Toggle, Input } from "@ui-kitten/components";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useNavigation, useRoute } from "@react-navigation/native";
import { SelectList } from "react-native-dropdown-select-list";
import { ScrollView } from "react-native-gesture-handler";

const useInputState = (initialValue = "") => {
    const [value, setValue] = useState(initialValue);
    return { value, onChangeText: setValue, reset: () => setValue(initialValue) };
};

const RequestConfirmS = ({ navigation }) => {
    const route = useRoute();
    const { alldata } = route.params;
    const [modifiedData, setModifiedData] = useState(alldata);
    const [isToggled, setisToggled] = useState(false);
    const pinInputState = useInputState("");
    const durationInputState = useInputState("");
    const briefInputState = useInputState("");
    const commentInputState = useInputState("");
    const resource = ["Option 1", "Option 2", "Option 3"];
    const times = ["1", "2", "3"];
    const minutes = ["1", "2", "3"];

    const handleToggleChange = (isChecked) => {
        setisToggled(isChecked);
        setModifiedData({ ...modifiedData, secondStudent: isChecked });

    };

    const handleSecondStudent = () => {
        Alert.alert('Data Sent!', JSON.stringify(modifiedData, null, 2));
        if (modifiedData.secondStudent) {
            navigation.navigate("RequestSecondStudent", { passeddata: modifiedData });
        } else {
            navigation.navigate("RequestConfirm", { alldata: modifiedData });
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, padding: 20 }}>
            <ScrollView>
                <SelectList
                    data={resource.map((item) => ({ key: item, value: item }))}
                    setSelected={(value) => setModifiedData({ ...modifiedData, selectedOption: value })}
                    placeholder="Select Student"
                    boxStyles={styles.selectListBox}
                />
                <SelectList
                    data={times.map((item) => ({ key: item, value: item }))}
                    setSelected={(value) => setModifiedData({ ...modifiedData, selectedOption: value })}
                    placeholder="Event Start"
                    boxStyles={styles.selectListBox}
                />
                <SelectList
                    data={minutes.map((item) => ({ key: item, value: item }))}
                    setSelected={(value) => setModifiedData({ ...modifiedData, selectedOption: value })}
                    placeholder="Event Start"
                    boxStyles={styles.selectListBox}
                />
                <Input
                    label="Brief"
                    placeholder="Enter Brief"
                    keyboardType="numeric"
                    {...briefInputState}
                    style={styles.input}
                    returnKeyType={Platform.OS === "ios" ? "done" : "next"}
                />
                <SelectList
                    data={times.map((item) => ({ key: item, value: item }))}
                    setSelected={(value) => setModifiedData({ ...modifiedData, selectedOption: value })}
                    placeholder="Activity Start"
                    boxStyles={styles.selectListBox}
                />
                <SelectList
                    data={minutes.map((item) => ({ key: item, value: item }))}
                    setSelected={(value) => setModifiedData({ ...modifiedData, selectedOption: value })}
                    placeholder="Activity Start"
                    boxStyles={styles.selectListBox}
                />
                <Input
                    label="Duration"
                    placeholder="Duration"
                    keyboardType="numeric"
                    {...durationInputState}
                    style={styles.input}
                    returnKeyType={Platform.OS === "ios" ? "done" : "next"}
                />
                <SelectList
                    data={times.map((item) => ({ key: item, value: item }))}
                    setSelected={(value) => setModifiedData({ ...modifiedData, selectedOption: value })}
                    placeholder="Activity Stop"
                    boxStyles={styles.selectListBox}
                />
                <SelectList
                    data={minutes.map((item) => ({ key: item, value: item }))}
                    setSelected={(value) => setModifiedData({ ...modifiedData, selectedOption: value })}
                    placeholder="Activity Stop"
                    boxStyles={styles.selectListBox}
                />
                <Input
                    label="Debrief"
                    placeholder="Enter Debrief"
                    keyboardType="numeric"
                    {...briefInputState}
                    style={styles.input}
                    returnKeyType={Platform.OS === "ios" ? "done" : "next"}
                />
                <SelectList
                    data={times.map((item) => ({ key: item, value: item }))}
                    setSelected={(value) => setModifiedData({ ...modifiedData, selectedOption: value })}
                    placeholder="Event Stop"
                    boxStyles={styles.selectListBox}
                />
                <SelectList
                    data={minutes.map((item) => ({ key: item, value: item }))}
                    setSelected={(value) => setModifiedData({ ...modifiedData, selectedOption: value })}
                    placeholder="Event Stop"
                    boxStyles={styles.selectListBox}
                />
                <Input
                    label="Pin"
                    placeholder="Enter Pin"
                    keyboardType="numeric"
                    {...pinInputState}
                    style={styles.input}
                    returnKeyType={Platform.OS === "ios" ? "done" : "next"}
                />
                <Input
                    label="Comment"
                    placeholder="Enter Comment"
                    {...commentInputState}
                    style={styles.input}
                />

                <View style={styles.toggleContainer}>
                    <Text style={styles.toggleText}>Submit to Scheduling</Text>
                    <Toggle
                        checked={isToggled}
                        onChange={handleToggleChange} />

                </View>

                {/* Submit Button */}
                <Button onPress={handleSecondStudent}>Next</Button>
            </ScrollView>
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

export default RequestConfirmS;
