import React, { useEffect, useState } from "react";
import { StyleSheet, SafeAreaView, View, Switch, ScrollView } from "react-native";
import { Layout, Text, Card, Divider } from "@ui-kitten/components";
import { useRoute } from "@react-navigation/native";
import { useAuth } from "./ThemeContext";
import { FlashList } from "@shopify/flash-list";
import { handleFetchError } from "./ExtraImports";

const StudentCourse = () => {
  const route = useRoute();
  const { course } = route.params;
  const [units, setUnits] = useState([]);
  const [summary, setSummary] = useState({});
  const [showCompleted, setShowCompleted] = useState(true);
  const { authUser, setAuthUser, setIsLoggedIn } = useAuth();

  const getGradeColor = (grade) => {
    switch (grade) {
      case "S":
        return "#6DD47E"; // Green for Satisfactory
      case "I":
        return "#F2D388"; // Yellow for Incomplete
      case "F":
        return "#FF6B6B"; // Red for Fail
      default:
        return "#A0A0A0"; // Grey for others
    }
  };

  useEffect(() => {
    fetchUnits();
  }, []);

  const fetchUnits = async () => {
    try {
      const querystring =
        `${authUser.host}` +
        `content?module=home&page=m&reactnative=1&uname=${
          authUser.uname
        }&password=${authUser.upwd}&customer=eta${authUser.schema}&session_id=${
          authUser.sessionid
        }&mode=getcoursedetails&etamobilepro=1&nocache=${
          Math.random().toString().split(".")[1]
        }&persid=${authUser.currpersid}&persregid=${course.ID}`;
      const response = await fetch(querystring);
      const data = await response.json();
      if (handleFetchError(data, setAuthUser, setIsLoggedIn)) {
        return; // Stop further processing if an error is handled
      }
      if (handleFetchError(data)) {
        return;
      }
      setUnits(data.unit);
      setSummary({
        completed: data.completed,
        repeated: data.repeated,
        incomplete: data.incomplete,
        remaining: data.remaining,
        failures: data.failures,
        noshow: data.noshow,
      });
    } catch (error) {
      console.error("Error fetching units:", error);
    }
  };

  const renderUnit = ({ item }) => (
    <Card
      style={styles.card}
      status={item.grade === "F" ? "danger" : "basic"}
      header={() => (
        <View
          style={[
            styles.cardHeader,
            { backgroundColor: getGradeColor(item.grade) },
          ]}
        >
          <Text style={styles.cardHeaderText}>{item.title}</Text>
        </View>
      )}
    >
      <Text style={styles.cardText}>Date: {item.date}</Text>
      <Text style={styles.cardText}>Status: {item.status}</Text>
      <Text style={styles.cardText}>Grade: {item.grade}</Text>
      <Text style={styles.cardText}>Instructor: {item.inst}</Text>
      {item.reason && (
        <Text style={styles.cardText}>Reason: {item.reason}</Text>
      )}
    </Card>
  );

  const filteredUnits = showCompleted
    ? units.filter((unit) => unit.status.trim() === "Completed")
    : units;

  return (
    <ScrollView>
    <Layout style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.summaryContainer}>
          <Text style={styles.summaryText}>
            Completed Units: {summary.completed}
          </Text>
          <Text style={styles.summaryText}>
            Units Repeated: {summary.repeated}
          </Text>
          <Text style={styles.summaryText}>
            Incomplete Units: {summary.incomplete}
          </Text>
          <Text style={styles.summaryText}>
            Remaining Units: {summary.remaining}
          </Text>
          <Text style={styles.summaryText}>
            Unit Failures: {summary.failures}
          </Text>
          <Text style={styles.summaryText}>No Shows: {summary.noshow}</Text>
        </View>

        <Divider style={styles.divider} />

        <View style={styles.toggleContainer}>
          <Text style={styles.toggleText}>Show Completed Units</Text>
          <Switch
            value={showCompleted}
            onValueChange={(value) => setShowCompleted(value)}
          />
        </View>

        <FlashList
          data={filteredUnits}
          renderItem={renderUnit}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={styles.list}
          estimatedItemSize={100} // Adjust this value based on your item's average height
        />
      </SafeAreaView>
    </Layout>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7f9fc",
  },
  safeArea: {
    flex: 1,
  },
  summaryContainer: {
    padding: 16,
    backgroundColor: "#ffffff",
    borderRadius: 8,
    marginHorizontal: 16,
    marginTop: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryText: {
    marginBottom: 8,
    fontSize: 16,
    color: "#2E3A59",
  },
  divider: {
    marginVertical: 16,
  },
  toggleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 16,
    marginBottom: 16,
  },
  toggleText: {
    fontSize: 16,
    color: "#2E3A59",
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  card: {
    marginBottom: 16,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    backgroundColor: "#ffffff",
  },
  cardHeader: {
    padding: 12,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  cardHeaderText: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 16,
  },
  cardText: {
    marginBottom: 4,
    fontSize: 14,
    color: "#2E3A59",
  },
});

export default StudentCourse;
