import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  SafeAreaView,
  Platform,
  Modal,
} from 'react-native';
import { Text, Button, Input, Toggle, Icon } from '@ui-kitten/components';
import DateTimePicker from '@react-native-community/datetimepicker';
import { SelectList } from 'react-native-dropdown-select-list';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const RequestAdmin = () => {
  const [requestDate, setRequestDate] = useState(new Date());
  const [selectedSite, setSelectedSite] = useState(null);
  const [selectedInstructor, setSelectedInstructor] = useState(null);
  const [selectedObserver1, setSelectedObserver1] = useState(null);
  const [selectedObserver2, setSelectedObserver2] = useState(null);
  const [selectedResourceType, setSelectedResourceType] = useState(null);
  const [destination, setDestination] = useState('');
  const [comments, setComments] = useState('');
  const [authorizationComments, setAuthorizationComments] = useState('');
  const [chargeCode, setChargeCode] = useState('');
  const [adminReason, setAdminReason] = useState('');
  const [authorizePIN, setAuthorizePIN] = useState('');
  const [submitToScheduling, setSubmitToScheduling] = useState(false);

  const instructorOptions = [
    { key: '1', value: 'Duser, D.*' },
    { key: '2', value: 'Sample, A.' },
  ];

  const siteOptions = [
    { key: '1', value: 'Dallas A' },
    { key: '2', value: 'Tokyo B' },
  ];

  const observerOptions = [
    { key: '1', value: 'Observer 1' },
    { key: '2', value: 'Observer 2' },
  ];

  const resourceOptions = [
    { key: '1', value: 'Simulator A' },
    { key: '2', value: 'Aircraft B' },
  ];

  const handleDateChange = (event, selectedDate) => {
    if (selectedDate) setRequestDate(selectedDate);
  };

  const handleSubmit = () => {
    const payload = {
      requestDate,
      selectedSite,
      selectedInstructor,
      selectedObserver1,
      selectedObserver2,
      selectedResourceType,
      destination,
      comments,
      authorizationComments,
      chargeCode,
      adminReason,
      authorizePIN,
      submitToScheduling,
    };
    console.log('Submitting:', payload);
  };

  return (
    <KeyboardAwareScrollView
      enableAutomaticScroll={true}
      contentContainerStyle={styles.scrollcontainer}>
      <SafeAreaView style={{ flex: 1, padding: 20 }}>
        <View style={styles.card}>
          <Text category="h6" style={styles.heading}>New Admin Schedule Request</Text>

          <Text>Request Date:</Text>
          <DateTimePicker
            value={requestDate}
            mode="date"
            display="default"
            onChange={handleDateChange}
          />
        </View>

        <View style={styles.card}>
          <Text>Site:</Text>
          <SelectList
            data={siteOptions}
            setSelected={setSelectedSite}
            placeholder="Select Site"
            boxStyles={styles.selectListBox}
          />

          <Text>PIC/Inst:</Text>
          <SelectList
            data={instructorOptions}
            setSelected={setSelectedInstructor}
            placeholder="Select Instructor"
            boxStyles={styles.selectListBox}
          />

          <Text>Observer 1:</Text>
          <SelectList
            data={observerOptions}
            setSelected={setSelectedObserver1}
            placeholder="Select Observer 1"
            boxStyles={styles.selectListBox}
          />

          <Text>Observer 2:</Text>
          <SelectList
            data={observerOptions}
            setSelected={setSelectedObserver2}
            placeholder="Select Observer 2"
            boxStyles={styles.selectListBox}
          />

          <Text>Resource Type:</Text>
          <SelectList
            data={resourceOptions}
            setSelected={setSelectedResourceType}
            placeholder="Select Resource"
            boxStyles={styles.selectListBox}
          />

          <Text>Destination:</Text>
          <Input
            value={destination}
            onChangeText={setDestination}
            placeholder="Destination"
            style={styles.input}
          />
        </View>

        <View style={styles.card}>
          <Text>Comments:</Text>
          <Input
            value={comments}
            onChangeText={setComments}
            placeholder="Enter Comments"
            multiline
            style={styles.input}
          />

          <View style={styles.toggleContainer}>
            <Text style={styles.toggleText}>Submit to Scheduling</Text>
            <Toggle checked={submitToScheduling} onChange={setSubmitToScheduling} />
          </View>
        </View>

        <View style={styles.card}>
          <Text>Charge Code:</Text>
          <Input
            value={chargeCode}
            onChangeText={setChargeCode}
            placeholder="Charge Code"
            style={styles.input}
          />

          <Text>Admin Reason:</Text>
          <Input
            value={adminReason}
            onChangeText={setAdminReason}
            placeholder="Admin Reason"
            style={styles.input}
          />

          <Text>Authorize PIN:</Text>
          <Input
            value={authorizePIN}
            onChangeText={setAuthorizePIN}
            placeholder="Authorize PIN"
            secureTextEntry
            style={styles.input}
            accessoryRight={props => <Icon {...props} name="lock-outline" />}
          />

          <Text>Authorization Comments:</Text>
          <Input
            value={authorizationComments}
            onChangeText={setAuthorizationComments}
            placeholder="Authorization Comments"
            multiline
            style={styles.input}
          />
        </View>

        <Button onPress={handleSubmit} style={styles.submitButton}>Save</Button>
      </SafeAreaView>
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  scrollcontainer: {
    paddingBottom: 20,
  },
  heading: {
    fontSize: 20,
    marginBottom: 12,
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  input: {
    marginVertical: 8,
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 12,
  },
  toggleText: {
    fontSize: 16,
  },
  submitButton: {
    marginBottom: 20,
  },
  selectListBox: {
    marginVertical: 8,
    borderColor: '#ccc',
  },
});

export default RequestAdmin;
