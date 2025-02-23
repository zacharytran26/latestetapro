import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { Text, Layout, Divider, Card } from "@ui-kitten/components";
import { useAuth } from "./ThemeContext";
import { useRoute } from "@react-navigation/native";
import { handleFetchError } from "./ExtraImports";

const StudentMapDetails = ({ navigation }) => {
  const route = useRoute();
  const { units } = route.params;
  const [lineItem, setLineItem] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredUnits, setFilteredUnits] = useState(units);
  const { authUser, setAuthUser, setIsLoggedIn } = useAuth();

  useEffect(() => {
    if (units && units.length > 0) {
      fetchLineItem(units[0].id); // Fetch line item for the first unit as an example
    }
  }, [units]);

  useEffect(() => {
    if (searchQuery === "") {
      setFilteredUnits(units);
    } else {
      const filtered = units.filter((unit) =>
        unit.unit.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredUnits(filtered);
    }
  }, [searchQuery, units]);

  const fetchLineItem = async (unitId) => {
    try {
      const response = await fetch(
        `${authUser.host}` +
          `content?module=home&page=m&reactnative=1&uname=${
            authUser.uname
          }&password=${authUser.upwd}&customer=eta${
            authUser.schema
          }&session_id=${
            authUser.sessionid
          }&mode=getcoursemapli&etamobilepro=1&nocache=${
            Math.random().toString().split(".")[1]
          }&persid=${authUser.currpersid}&currlvl4id=${unitId}`
      );
      const data = await response.json();
      if (handleFetchError(data, setAuthUser, setIsLoggedIn)) {
        return; // Stop further processing if an error is handled
      }
      if (handleFetchError(data)) {
        // If an authentication error occurred, stop further processing
        return;
      }
      setLineItem(data);
    } catch (error) {
      console.log("Error fetching line item:", error);
    }
  };

  const handlePress = async (unitId) => {
    await fetchLineItem(unitId); // Fetch the line items
    navigation.navigate("LineItem", { data: lineItem }); // Pass the fetched data to the LineItem screen
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search units..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
      <Divider />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Layout style={styles.content} level="1">
          {filteredUnits.map((unit, index) => (
            <View key={index}>
              <Card style={styles.unitCard}>
                <Text category="s1">
                  {unit.unit} - {unit.dur} {unit.acttp}
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    handlePress(unit.id);
                  }}
                  style={styles.button}
                >
                  <Text status="primary" style={styles.buttonText}>
                    View Line Items
                  </Text>
                </TouchableOpacity>
              </Card>
            </View>
          ))}
        </Layout>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7f9fc",
  },
  searchContainer: {
    padding: 16,
    backgroundColor: "#f7f9fc",
  },
  searchInput: {
    height: 40,
    borderWidth: 1,
    borderRadius: 8,
    paddingLeft: 8,
    borderColor: "#E4E9F2",
    backgroundColor: "#ffffff",
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f7f9fc",
  },
  unitCard: {
    marginBottom: 16,
  },
  button: {
    marginTop: 8, // Minimal margin above the button
    paddingVertical: 4, // Reduced vertical padding
    paddingHorizontal: 8, // Reduced horizontal padding
    paddingLeft: 10,
    borderRadius: 4, // Smaller border radius
    backgroundColor: "#ffffff",
    alignItems: "center",
  },
  buttonText: {
    color: "#3366FF",
    fontSize: 16,
  },
});

export default StudentMapDetails;
