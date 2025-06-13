import React, {useEffect, useState, useRef} from 'react';
import {
  StyleSheet,
  View,
  SafeAreaView,
  Alert,
  ScrollView,
  TouchableOpacity,
  Animated,
  Modal,
} from 'react-native';
import {Text, Button, Toggle, Radio, Input} from '@ui-kitten/components';
import {SelectList} from 'react-native-dropdown-select-list';
import AccordionItem from '../screens/Accordion';
import {useAuth} from './ThemeContext';
import DateTimePicker from '@react-native-community/datetimepicker';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {handleFetchError} from './ExtraImports';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const useInputState = (initialValue = '') => {
  const [value, setValue] = useState(initialValue);
  return {value, onChangeText: setValue, reset: () => setValue(initialValue)};
};

/*
TO DO: 
1. change the resource type to unit selectlist in the first card,
2. make sure i am passing the formdata correctly 
3. handle hardwarn, softwarn, and success accordingly
4. add in details to students
5. complete other requests 
6. calendar pciker gantt style 

*/

const RequestCourseS = () => {
  const [isToggled, setIsToggled] = useState(false);
  const [hardWarnModalVisible, setHardWarnModalVisible] = useState(false);
  const [form, setForm] = useState({
    isToggled: false,
    hardWarnModalVisible: false,
    selectedStudent: [],
    selectedStudent2: [],
    selectedInstructor: null,
    selectedUnit: null,
    instructor: null,
    resourceType: null,
    noCharge: false,
    selectedUnit: null,
    selectedUnit2: null,
    site: null,
    pin: '',
    comment: '',
    // actstart: new Date(),
    // date: new Date(),
    modalVisible: false,
    activeTimeField: false,
  });
  //const [date, setDate] = useState(new Date());
  const updateForm = (key, value) => {
    setForm(prev => ({...prev, [key]: value}));
  };

  const {authUser, setAuthUser, setIsLoggedIn} = useAuth();
  const flashAnim = useRef(new Animated.Value(1)).current;

  /*Below is the data to store all the JSON strings */

  const [data, setData] = useState({
    studentdata: [],
    studentdetail: [],
    studentdetail2: [],
    requestdata: [],
    instructordata: [],
    unit: [],
    resourcetype: [],
    reasons: [],
    sites: [],
    observers: [],
    hardwarn: [],
    softwarn: [],
    times: {
      eventStart: new Date(),
      eventStop: new Date(),
      actStart: new Date(),
      actEnd: new Date(),
    },
  });
  const updateData = (key, value) => {
    setData(prev => ({...prev, [key]: value}));
  };
  const [date, setDate] = useState(new Date());
  const [actstart, setActStart] = useState(new Date());
  const formattedDate =
    date instanceof Date
      ? `${date.getDate().toString()}${(
          date.getMonth() + 1
        ).toString()}${date.getFullYear()}`
      : '';

  //console.log("formatted",formattedDate);

  const [activeTimeField, setActiveTimeField] = useState(null);
  const pinInputState = useInputState('');
  const commentInputState = useInputState('');

  useEffect(() => {
    FetchRequestData();
  }, []);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(flashAnim, {
          toValue: 0, // invisible
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(flashAnim, {
          toValue: 1, // fully visible
          duration: 500,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, []);

  // useEffect(() => {
  //   if (selectedStudent !== null) {
  //     FetchStudentDetail();
  //   }
  // }, [selectedStudent]);

  const studentOptions = data.studentdata.map(student => ({
    key: student.persregid,
    value: student.name,
  }));

  const instructorOptions = data.instructordata.map(item => ({
    key: item.persid,
    value: item.name,
  }));

  // const observerOptions = data.observers.map(item => ({
  //   key: item.id,
  //   value: item.disname,
  // }));
  // const siteOptions = data.site.map(item => ({
  //   key: item.siteid,
  //   value: item.name,
  // }));
  //   const unitOptions = unit.map((item, index) => ({
  //   key: index.toString(),
  //   value: item.unit
  // }));
  const unitOptions = data.unit.map((item, index) => ({
    key: index.toString(),
    value: item.unit,
  }));

  const resourceOptions = data.resourcetype.map((item, index) => ({
    key: item.restypeid,
    value: item.restype,
  }));

  const handleTimeChange = (event, selectedTime) => {
    if (selectedTime && form.activeTimeField) {
      updateData('times', {
        ...data.times,
        [form.activeTimeField]: selectedTime,
      });
    }

    updateForm('modalVisible', false);
    updateForm('activeTimeField', null);
  };

  // const handleDateChange = (event, selectedDate) => {
  //   if (selectedDate instanceof Date) {
  //     updateForm("date", selectedDate);
  //   }
  // };

  const handleDateChange = (event, selectedDate) => {
    if (selectedDate instanceof Date) {
      setDate(selectedDate);
    }
  };

  const handleActStartChange = (event, selectedTime) => {
    if (selectedTime) {
      setActStart(selectedTime);
    }
  };

  // const selectedStudentData2 =
  //   selectedStudent2 !== null
  //     ? (() => {
  //         const {name, ...rest} = studentdata[selectedStudent2];
  //         return rest;
  //       })()
  //     : null;

  // const studentNames = data.students.map((student) => student.name);
  // const studentContent = data.students.map(({name, ...content}) => content );

  const FetchRequestData = async () => {
    //setLoading(true);
    try {
      const request = await fetch(
        `${authUser.host}content?module=home&page=m&reactnative=1&uname=${
          authUser.uname
        }&password=${authUser.upwd}&customer=eta${authUser.schema}&session_id=${
          authUser.sessionid
        }&mode=getrequestdata&etamobilepro=1&nocache=${
          Math.random().toString().split('.')[1]
        }&persid=${authUser.currpersid}`,
      );
      const response = await request.text();
      console.log('Rqt Response', response);
      const data = JSON.parse(response);
      console.log('Rqt Data', data);
      if (handleFetchError(data, setAuthUser, setIsLoggedIn)) {
        return; // Stop further processing if an error is handled
      }
      updateData('requestdata', data);
      updateData('studentdata', data.students);
      updateData('instructordata', data.instructors);
      // setSite(data.sites);
    } catch (error) {
      console.error('Error fetching team data:', error);
      return null;
    }
  };

  const FetchStudentDetail = async (id, checker) => {
    try {
      const url = `${
        authUser.host
      }content?module=home&page=m&reactnative=1&uname=${
        authUser.uname
      }&password=${authUser.upwd}&customer=eta${authUser.schema}&session_id=${
        authUser.sessionid
      }&mode=getstudentdata&etamobilepro=1&nocache=${
        Math.random().toString().split('.')[1]
      }&persid=${authUser.currpersid}&persregid=${id}&reqdate=${formattedDate}`;
      const request = await fetch(url);
      console.log(request);
      const text = await request.text();
      console.log('text', text);
      const data = JSON.parse(text);
      console.log('data', data);
      if (checker == 1) {
        //setStudentDetail(data);
        updateData('studentdetail', data);
        //setSelectedUnit(data.Unit);
        updateData('unit', data.units);
        updateData('resourcetype', data.resourcetypes);
        //setResourceTypes(data.resourcetypes[0]);
        updateData('resourceType', data.resourcetypes[0]);
      } else {
        console.log('data2', data);
        // setStudentDetail2(data);
        updateData('studentdetail2', data);
        //setSelectedUnit2(data.Unit);
        updateData('unit', data.Unit);
      }

      if (handleFetchError(data, setAuthUser, setIsLoggedIn)) {
        return; // Stop further processing if an error is handled
      }
    } catch (error) {
      console.error('Error fetching student data:', error);
      return null;
    }
  };

  const handleConfirm = async () => {
    try {
      const formData = new FormData();
      formData.append("isToggled", form.isToggled);
      formData.append("selectedStudent", form.selectedStudent);
      formData.append("selectedResourceType", form.resourceType);
      formData.append("selectedInstructor", form.selectedInstructor);
      formData.append("selectedUnit", form.selectedUnit);
      formData.append("date", formattedDate);
      formData.append("actStart", form.actstart);

      const request = await fetch(
        `${authUser.host}content?module=home&page=m&reactnative=1&uname=${
          authUser.uname
        }&password=${authUser.upwd}&customer=eta${authUser.schema}&session_id=${
          authUser.sessionid
        }&mode=submitrequest&etamobilepro=1&nocache=${
          Math.random().toString().split('.')[1]
        }`,
        {
          method: 'POST',
          body: formData,
          headers: {
            Accept: 'application/txt',
            'Content-Type': 'application/txt',
          },
        },
      );
      const text = await request.text();
      const data = JSON.parse(text);
      setData('hardwarn', data);
      console.log('submit data', data);
      //mode=submitrequest

      //hard -
      /*
       */

      // if (handleFetchError(data, setAuthUser, setIsLoggedIn)) {
      //   return; // Stop further processing if an error is handled
      // }
    } catch (error) {
      console.error('Error submit confirm data:', error);
      return null;
    }
  };

  return (
    <KeyboardAwareScrollView
      enableAutomaticScroll={true}
      contentContainerStyle={styles.scrollcontainer}>
      <SafeAreaView style={{flex: 1, padding: 20}}>
        <ScrollView>
          <View style={styles.card}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <Text>Date:</Text>
              {data.hardwarn && data.hardwarn.length > 0 && (
                <Animated.View style={{opacity: flashAnim}}>
                  <TouchableOpacity
                    onPress={() => updateForm('hardWarnModalVisible', true)}>
                    <Icon name="alert-circle" size={30} color="#FF0000" />
                  </TouchableOpacity>
                </Animated.View>
              )}
            </View>
            <SafeAreaView>
              <DateTimePicker
                value={date}
                mode="date"
                display="default"
                onChange={handleDateChange}
              />
            </SafeAreaView>

            <View style={styles.card}>
              <Text>Resource Type</Text>
              <SelectList
                setSelected={val => updateForm('resourceType', val)}
                data={data.resourcetype.map((r, i) => ({
                  key: i.toString(),
                  value: r.restype,
                }))}
                placeholder={'Select Resource Type'}
                value={form.resourceType}
              />
              {/* <SafeAreaView>
                <Text>Activity Start:</Text>
                <DateTimePicker
                  value={form.actstart}
                  mode="time"
                  display="default"
                  onChange={handleActStartChange}
                />
              </SafeAreaView> */}

              <AccordionItem
                title={`Times`}
                content={data.times}
                setModalVisible={() => updateForm('modalVisible', true)}
                setActiveTimeField={form.activeTimeField}
              />
              <View style={styles.toggleContainer}>
                <Text style={styles.toggleText}>Submit to Scheduling</Text>
                <Toggle
                  checked={form.isToggled}
                  onChange={() => updateForm('isToggled', true)}
                />
              </View>
            </View>
          </View>

          <View style={styles.card}>
            <Text>PIC/INST:</Text>

            <SelectList
              data={instructorOptions}
              setSelected={val => updateForm('selectedInstructor', val)}
              placeholder="Select Instructor"
              boxStyles={styles.selectListBox}
              notFoundText="Instructor"
            />
          </View>
          <View style={styles.card}>
            <Text>Student 1:</Text>

            <SelectList
              data={studentOptions}
              setSelected={val => updateForm('selectedStudent', val)}
              placeholder="Select Student"
              boxStyles={styles.selectListBox}
              notFoundText="Student 1"
              onSelect={() => FetchStudentDetail(form.selectedStudent, 1)}
            />
            <Text>Unit:</Text>
            <SelectList
              setSelected={val => updateData('unit', val)}
              data={unitOptions}
              placeholder={form.selectedUnit || 'Select a Unit'}
              value={form.selectedUnit}
            />
            <AccordionItem
              title={`Student 1 Detail`}
              content={data.studentdetail}
              unit={data.unit}
              reason={data.reasons}
              resourcetype={data.resourcetype}
              noCharge={form.noCharge}
              setSelectedUnit={data.selectedUnit}
              setResourceTypes={form.resourceType}
              // setNoChargeReason={form.}
              // setNoCharge={form.n}
              selectedUnit={form.selectedUnit}
            />
          </View>

          <View style={styles.card}>
            <Text>Student 2:</Text>

            <SelectList
              data={studentOptions}
              setSelected={val => updateForm('selectedStudent2', val)}
              placeholder="Select Student"
              boxStyles={styles.selectListBox}
              notFoundText="Student 1"
              onSelect={() => FetchStudentDetail(form.selectedStudent, 1)}
            />
            <Text>Unit:</Text>
            <SelectList
              setSelected={val => updateData('unit', val)}
              data={unitOptions}
              placeholder={form.selectedUnit2 || 'Select a Unit'}
              value={form.selectedUnit2}
            />
            <AccordionItem
              title={`Student 2 Detail`}
              content={data.studentdetail2}
              unit={data.unit}
              reason={data.reasons}
              resourcetype={data.resourcetype}
              setSelectedUnit={data.selectedUnit}
              setResourceTypes={form.resourceType}
              // setNoChargeReason={setNoChargeReason}
              // setNoCharge={setNoCharge}
              selectedUnit={form.selectedUnit}
            />
          </View>
          {/* <View style={styles.card}>
            <Text>Site:</Text>

            <SelectList
              data={siteOptions}
              setSelected={setSelectedSite}
              placeholder="Site"
              boxStyles={styles.selectListBox}
              notFoundText="Site"
            />
          </View>
          <View style={styles.card}>
            <Text>Observer 1:</Text>

            <SelectList
              data={observerOptions}
              setSelected={setSelectedObserver1}
              placeholder="Select Observer"
              boxStyles={styles.selectListBox}
              notFoundText="Observer 1"
            />
            <Text>Observer 2:</Text>

            <SelectList
              data={observerOptions}
              setSelected={setSelectedObserver2}
              placeholder="Select Observer"
              boxStyles={styles.selectListBox}
              notFoundText="Observer 2"
            />
          </View> */}

          <View style={styles.card}>
            <Input
              multiline={false}
              textStyle={styles.textArea}
              placeholder="Pin"
              returnKeyType={Platform.OS === 'ios' ? 'done' : 'next'}
              {...pinInputState}
              secureTextEntry={true}
              style={styles.input}
              accessoryRight={() => (
                <Icon
                  name="lock"
                  size={24}
                  color="#8F9BB3"
                  style={{alignSelf: 'center'}}
                />
              )}
            />
            <Input
              multiline={true}
              textStyle={styles.textArea}
              placeholder="Comment"
              returnKeyType={Platform.OS === 'ios' ? 'done' : 'next'}
              {...commentInputState}
              style={styles.input}
            />
          </View>

          <Button
            onPress={handleConfirm}
            disabled={data.hardwarn && data.hardwarn.length > 0}>
            Submit
          </Button>
        </ScrollView>
        <Modal
          transparent={true}
          animationType="slide"
          visible={form.modalVisible}
          onRequestClose={() => updateForm('hardWarnModalVisible', false)}>
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              backgroundColor: 'rgba(0,0,0,0.3)',
            }}>
            <View
              style={{
                backgroundColor: '#808080',
                margin: 20,
                borderRadius: 10,
                padding: 20,
              }}>
              {form.activeTimeField && (
                <DateTimePicker
                  value={data.times[form.activeTimeField]}
                  mode="time"
                  display="spinner"
                  onChange={handleTimeChange}
                />
              )}
              <Button onPress={() => updateForm('modalVisible', false)}>
                Done
              </Button>
            </View>
          </View>
        </Modal>
        <Modal
          transparent
          visible={hardWarnModalVisible}
          animationType="slide"
          onRequestClose={() => updateForm('modalVisible', false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>Hard Warnings</Text>
              <ScrollView>
                {data.hardwarn.map((warn, index) => (
                  <Text key={index} style={styles.modalWarningText}>
                    • {warn.msg}
                  </Text>
                ))}
              </ScrollView>
              <Button
                onPress={() => updateForm('hardWarnModalVisible', false)}
                style={{marginTop: 16}}>
                Close
              </Button>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 4,
    elevation: 3,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
  },
  submitButton: {
    marginTop: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 12,
    width: '80%',
  },
});
export default RequestCourseS;
