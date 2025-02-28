import React, { useState } from "react";
import {
    StyleSheet,
    View,
    SafeAreaView,
    TouchableOpacity,
    Platform,
    Alert,
    Modal,
    TextInput
} from "react-native";
import { Text, Button, Card, Toggle, Radio, RadioGroup, Input } from "@ui-kitten/components";
import DateTimePicker from "@react-native-community/datetimepicker";
import { SelectList } from "react-native-dropdown-select-list";

const RequestRental = ({ navigation }) => {
    const [schedDate, setSchedDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [modifiedData, setModifiedData] = useState({});
    const [filterBySite, setFilterBySite] = useState("");
    const [selectedInstructor, setSelectedInstructor] = useState("");
    const [selectedResourceType, setSelectedResourceType] = useState("");
    const [selectedEventStart, setSelectedEventStart] = useState("");
    const [selectedActivityStart, setSelectedActivityStart] = useState("");
    const [activityDuration, setActivityDuration] = useState("");
    const [selectedActivityStop, setSelectedActivityStop] = useState("");
    const [selectedEventStop, setSelectedEventStop] = useState("");
    const [comments, setComments] = useState("");
    const [submissionType, setSubmissionType] = useState(0);
    const [selectedRefresherType, setSelectedRefresherType] = useState("");
    const [selectedChargeCode, setSelectedChargeCode] = useState("");
    const [selectedRefresherReason, setSelectedRefresherReason] = useState("");
    const [authComments, setAuthComments] = useState("");
    const [authPin, setAuthPin] = useState("");
    const siteOptions = ["Dallas A", "Site B", "Site C"];
    const instructorOptions = ["Duser, D.", "Instructor B", "Instructor C"];
    const resourceOptions = ["Resource A", "Resource B", "Resource C"];
    const timeOptions = ["08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM"];
    const refresherTypes = ["Type A", "Type B", "Type C"];
    const chargeCodes = ["Code A", "Code B", "Code C"];
    const refresherReasons = ["Reason A", "Reason B", "Reason C"];

    const handleDateChange = (event, selectedDate) => {
        if (Platform.OS === "android") setShowDatePicker(false);
        if (selectedDate) setSchedDate(selectedDate);
    };

    const handleRequestData = () => {
        const dataToSend = {
            requestDate: schedDate.toDateString(),
            site: filterBySite,
            instructor: selectedInstructor,
            resourceType: selectedResourceType,
            eventStart: selectedEventStart,
            activityStart: selectedActivityStart,
            activityDuration,
            activityStop: selectedActivityStop,
            eventStop: selectedEventStop,
            comments,
            submissionType: submissionType === 0 ? "Submit to Scheduling" : "Do Not Submit to Scheduling",
            refresherType: selectedRefresherType,
            chargeCode: selectedChargeCode,
            refresherReason: selectedRefresherReason,
            authorizationComments: authComments,
            authorizePin: authPin,
        };

        navigation.navigate("RequestConfirm", { alldata: dataToSend });
    };
    return (
        <SafeAreaView>
            {showDatePicker && (
                <Modal transparent={true} animationType="fade" visible={showDatePicker}>
                    <View style={styles.modalBackground}>
                        <View style={styles.datePickerContainer}>
                            <DateTimePicker
                                value={schedDate}
                                mode="date"
                                display={Platform.OS === "ios" ? "inline" : "default"}
                                onChange={handleDateChange}
                            />
                            <Button onPress={() => setShowDatePicker(false)}>Confirm</Button>
                        </View>
                    </View>
                </Modal>
            )}
            <SelectList data={timeOptions.map((item) => ({ key: item, value: item }))}
                setSelected={setSelectedActivityStart}
                placeholder="Pilot 2 / Observer 1"
                boxStyles={styles.selectListBox} />
            <SelectList data={timeOptions.map((item) => ({ key: item, value: item }))}
                setSelected={setSelectedActivityStart}
                placeholder="Observer 2"
                boxStyles={styles.selectListBox} />

            <SelectList data={timeOptions.map((item) => ({ key: item, value: item }))}
                setSelected={setSelectedActivityStart}
                placeholder="Activity Start"
                boxStyles={styles.selectListBox} />

            <Input
                label="Activity Duration"
                placeholder="Enter Duration"
                value={activityDuration}
                onChangeText={setActivityDuration}
                style={styles.input}
            />

            <SelectList data={timeOptions.map((item) => ({ key: item, value: item }))}
                setSelected={setSelectedActivityStop}
                placeholder="Activity Stop"
                boxStyles={styles.selectListBox} />

            <SelectList data={refresherTypes.map((item) => ({ key: item, value: item }))}
                setSelected={setSelectedRefresherType} placeholder="Request Type" boxStyles={styles.selectListBox} />

            <SelectList data={chargeCodes.map((item) => ({ key: item, value: item }))}
                setSelected={setSelectedChargeCode} placeholder="Charge Code" boxStyles={styles.selectListBox} />

            <SelectList data={refresherReasons.map((item) => ({ key: item, value: item }))}
                setSelected={setSelectedRefresherReason} placeholder="Rental Reason" boxStyles={styles.selectListBox} />

            <Input label="Authorization Comments" value={authComments} onChangeText={setAuthComments} style={styles.input} />
            <Input label="Authorize PIN" value={authPin} onChangeText={setAuthPin} style={styles.input} />

            <Button onPress={handleRequestData}>Next</Button>

        </SafeAreaView>
    );

};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#F7F9FC",
    },
    card: {
        padding: 20,
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    headerText: {
        textAlign: "center",
        fontWeight: "bold",
        marginBottom: 15,
    },
    datepickerButton: {
        padding: 12,
        alignItems: "center",
        backgroundColor: "#E4E9F2",
        borderRadius: 8,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: "#C5CEE0",
    },
    datepickerText: {
        fontSize: 16,
        fontWeight: "600",
        color: "#222B45",
    },
    selectListBox: {
        marginBottom: 15,
    },
    button: {
        marginTop: 10,
        borderRadius: 8,
    },
    secondaryButton: {
        backgroundColor: "#8F9BB3",
        borderColor: "#8F9BB3",
    },
    modalBackground: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.4)",
    },
    datePickerContainer: {
        backgroundColor: "rgba(0, 0, 0, 0.4)",
        padding: 20,
        borderRadius: 10,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
    },
});

export default RequestRental;
