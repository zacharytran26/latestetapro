import React, {useState} from 'react';
import {Chevron} from './ExtraImports';
import {useSharedValue, withTiming} from 'react-native-reanimated';
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
import {Text, Button, Toggle, Radio, Input, Icon,} from '@ui-kitten/components';
import {SelectList} from 'react-native-dropdown-select-list';
const AccordionItem = ({
  title,
  content,
  unit,
  reason,
  setModalVisible,
  setActiveTimeField,
  resourcetype,
  setSelectedUnit,
  setNoChargeReason,
  noCharge,
  setNoCharge,
  selectedUnit
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [animationValue] = useState(new Animated.Value(0));
  const progress = useSharedValue(0);

  const toggleAccordion = () => {
    Animated.timing(animationValue, {
      toValue: isOpen ? 0 : 1,
      duration: 300,
      useNativeDriver: false,
    }).start(() => {
      progress.value = isOpen ? withTiming(0) : withTiming(1);
    });
    setIsOpen(!isOpen);
  };

  return (
    <View style={styles.accordionItem}>
      <TouchableOpacity onPress={toggleAccordion} style={styles.header}>
        <Text style={styles.headerText}>{title}</Text>
        <Chevron progress={progress} />
      </TouchableOpacity>
      {isOpen && (
        <View style={styles.bodyContent}>
          {content == null ? (
            <Text>No Information Available.</Text>
          ) : (
            Object.entries(content).map(([key, value]) => {
              if (key === 'Unit') {
                return (
                  <View key={key} style={{marginBottom: 10}}>
                    <Text style={styles.accordionText}>
                      {key.replace(/([A-Z])/g, ' $1')}:
                    </Text>
                    <SelectList
                      setSelected={val => setSelectedUnit(val)}
                      data={unit}
                      placeholder={selectedUnit || "Select a Unit"}
                      value={selectedUnit}
                    />
                  </View>
                );
              }
              if (key === 'noCharge') {
                return (
                  <View key={key} style={{marginBottom: 10}}>
                    <Text style={styles.accordionText}>
                      {key.replace(/([A-Z])/g, ' $1')}:
                    </Text>
                    <Radio checked={noCharge}
                     onChange={nextChecked => setNoCharge(nextChecked)}
                     />
                  </View>
                );
              }

              if (key === 'noChargeReason') {
                return (
                  <View key={key} style={{marginBottom: 10}}>
                    <Text style={styles.accordionText}>
                      {key.replace(/([A-Z])/g, ' $1')}:
                    </Text>
                    <SelectList
                      setSelected={val => setNoChargeReason(val)}
                      data={reason}
                      placeholder="Select Reason"
                    />
                  </View>
                );
              }
              if (
                key === 'eventStart' ||
                key === 'eventStop' ||
                key === 'actStart' ||
                key === 'actEnd'
              ) {
                const labelMap = {
                  eventStart: 'Event Start Time',
                  eventStop: 'Event Stop Time',
                  actStart: 'Activity Start Time',
                  actEnd: 'Activity End Time',
                };
                return (
                  <View key={key} style={{marginBottom: 10}}>
                    <Text style={styles.accordionText}>{labelMap[key]}:</Text>
                    <TouchableOpacity
                      onPress={() => {
                        setModalVisible(true);
                        setActiveTimeField(key); // 👈 Tell modal which field to update
                      }}>
                      <Text style={styles.accordionText}>
                        {value.toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </Text>
                    </TouchableOpacity>
                  </View>
                );
              }

              // default for all other keys
              return (
                <Text key={key} style={styles.accordionText}>
                  {key.replace(/([A-Z])/g, ' $1')}:{' '}
                  {typeof value === 'object' ? JSON.stringify(value) : value}
                </Text>
              );
            })
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    marginBottom: 10,
  },
  textArea: {
    minHeight: 64,
  },
  body: {
    overflow: 'hidden',
  },
  accordionText: {
    fontSize: 14,
    marginBottom: 4,
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 16,
    paddingHorizontal: 8,
  },
  toggleText: {
    fontWeight: 'bold',
    color: '#8F9BB3',
  },
  accordionItem: {
    marginBottom: 12,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#FFF',
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    padding: 10,
  },
  headerText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  bodyContent: {
    padding: 16,
    backgroundColor: '#EAEAEA',
  },
  selectListBox: {
    marginBottom: 10,
  },
});

export default AccordionItem;