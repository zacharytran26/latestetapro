import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  TextInput,
  SafeAreaView,
  TouchableOpacity,
  View,
} from "react-native";
import { Layout, Text, Spinner } from "@ui-kitten/components";
import { useAuth } from "./ThemeContext";
import { FlashList } from "@shopify/flash-list";
import { handleFetchError } from "./ExtraImports";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const InstructorItem = React.memo(({ item, onPress }) => (
  <TouchableOpacity onPress={() => onPress(item)}>
    <View style={styles.listItemContainer}>
      <Text style={styles.listItemLabel}>{item.value}</Text>
    </View>
  </TouchableOpacity>
));

const SectionHeader = ({ title }) => (
  <View style={styles.sectionHeaderContainer}>
    <Text style={styles.sectionHeaderLabel}>{title}</Text>
  </View>
);

const InstructorsScreen = ({ navigation }) => {
  const [filter, setFilter] = useState("");
  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { authUser, setAuthUser, setIsLoggedIn } = useAuth();

  useEffect(() => {
    fetchInstructors();
  }, []);

  const fetchInstructors = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${authUser.host}` +
          `content?module=home&page=m&reactnative=1&uname=${
            authUser.uname
          }&password=${authUser.upwd}&customer=eta${
            authUser.schema
          }&session_id=${
            authUser.sessionid
          }&mode=getinstructors&etamobilepro=1&nocache=${
            Math.random().toString().split(".")[1]
          }&persid=${authUser.currpersid}`
      );
      const data = await response.json();
      if (handleFetchError(data, setAuthUser, setIsLoggedIn)) {
        return; // Stop further processing if an error is handled
      }
      setInstructors(data.instructors);
    } catch (jsonError) {
      console.error("JSON Parse Error:", jsonError);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handlePress = (instructor) => {
    navigation.navigate("InstructorDetailScreen", {
      detail: instructor,
    });
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchInstructors();
  };

  const filteredInstructors = instructors
    .filter((instructor) =>
      instructor.DISNAME.toLowerCase().includes(filter.toLowerCase())
    )
    .sort((a, b) => a.DISNAME.localeCompare(b.DISNAME))
    .map((instructor) => ({
      key: instructor.ID,
      value: instructor.DISNAME,
      ...instructor,
    }));

  const groupedData = filteredInstructors.reduce((acc, instructor) => {
    const firstLetter = instructor.value.charAt(0).toUpperCase();
    if (!acc[firstLetter]) {
      acc[firstLetter] = [];
    }
    acc[firstLetter].push(instructor);
    return acc;
  }, {});

  // Convert grouped data into a flat array with section headers
  const sectionedData = Object.keys(groupedData)
    .sort()
    .reduce((acc, letter) => {
      acc.push({ type: "sectionHeader", title: letter });
      acc.push(...groupedData[letter]);
      return acc;
    }, []);

  if (loading && !refreshing) {
    return (
      <Layout style={styles.container}>
        <Spinner />
      </Layout>
    );
  }

  return (
    <KeyboardAwareScrollView enableAutomaticScroll={true} contentContainerStyle={styles.scrollcontainer}>

    <Layout style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <TextInput
          style={styles.input}
          placeholder="Search"
          placeholderTextColor={'grey'}
          value={filter}
          onChangeText={setFilter}
        />
        <View style={styles.listContainer}>
          <FlashList
            data={sectionedData}
            renderItem={({ item }) => {
              if (item.type === "sectionHeader") {
                return <SectionHeader title={item.title} />;
              }
              return <InstructorItem item={item} onPress={handlePress} />;
            }}
            estimatedItemSize={50}
            keyExtractor={(item, index) =>
              item.type === "sectionHeader" ? `header-${item.title}` : item.key
            }
            refreshing={refreshing}
            onRefresh={handleRefresh}
          />
        </View>
      </SafeAreaView>
    </Layout>
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f7f9fc",
  },
  scrollcontainer: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  safeArea: {
    flex: 1,
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 8,
    marginHorizontal: 16,
    marginTop: 10,
    zIndex: 1,
    backgroundColor: "#ffffff",
    borderColor: "#E4E9F2",
  },
  listContainer: {
    flex: 1,
    marginTop: 10,
  },
  listItemContainer: {
    padding: 16,
  },
  listItemLabel: {
    fontSize: 16,
  },
  sectionHeaderContainer: {
    backgroundColor: "#f0f0f0",
    padding: 8,
  },
  sectionHeaderLabel: {
    fontWeight: "bold",
    fontSize: 18,
  },
});

export default InstructorsScreen;
