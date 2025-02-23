import React from "react";
import { StyleSheet, SafeAreaView, View } from "react-native";
import { Layout, Text, Card } from "@ui-kitten/components";
import { useRoute } from "@react-navigation/native";
import { FlashList } from "@shopify/flash-list";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const Times = () => {
  const route = useRoute();
  const { times } = route.params;

  const renderTimeItem = ({ item }) => (
    <Card style={styles.card}>
      <View style={styles.cardRow}>
        <Icon name="calendar-clock" size={24} color="#4A5568" />
        <View style={styles.cardTextContainer}>
          <Text style={styles.cardTitle}>Event Start</Text>
          <Text style={styles.cardContent}>{item.eventStart}</Text>
        </View>
      </View>

      <View style={styles.cardRow}>
        <Icon name="clock-time-three" size={24} color="#4A5568" />
        <View style={styles.cardTextContainer}>
          <Text style={styles.cardTitle}>Brief Duration</Text>
          <Text style={styles.cardContent}>{item.briefDur}</Text>
        </View>
      </View>

      <View style={styles.cardRow}>
        <Icon name="flag-checkered" size={24} color="#4A5568" />
        <View style={styles.cardTextContainer}>
          <Text style={styles.cardTitle}>Activity Start</Text>
          <Text style={styles.cardContent}>{item.actStart}</Text>
        </View>
      </View>

      <View style={styles.cardRow}>
        <Icon name="clock-outline" size={24} color="#4A5568" />
        <View style={styles.cardTextContainer}>
          <Text style={styles.cardTitle}>Duration</Text>
          <Text style={styles.cardContent}>{item.actDur}</Text>
        </View>
      </View>

      <View style={styles.cardRow}>
        <Icon name="stop-circle-outline" size={24} color="#4A5568" />
        <View style={styles.cardTextContainer}>
          <Text style={styles.cardTitle}>Activity Stop</Text>
          <Text style={styles.cardContent}>{item.actStop}</Text>
        </View>
      </View>

      <View style={styles.cardRow}>
        <Icon name="timer" size={24} color="#4A5568" />
        <View style={styles.cardTextContainer}>
          <Text style={styles.cardTitle}>Debrief Duration</Text>
          <Text style={styles.cardContent}>{item.debriefDur}</Text>
        </View>
      </View>

      <View style={styles.cardRow}>
        <Icon name="calendar-remove" size={24} color="#4A5568" />
        <View style={styles.cardTextContainer}>
          <Text style={styles.cardTitle}>Event Stop</Text>
          <Text style={styles.cardContent}>{item.eventStop}</Text>
        </View>
      </View>
    </Card>
  );

  return (
    <Layout style={styles.container}>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.header}>
          <Text style={styles.title}>Event Times</Text>
        </View>
        <FlashList
          data={[times]}
          renderItem={renderTimeItem}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={styles.list}
          estimatedItemSize={200}
        />
      </SafeAreaView>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#F7F9FC",
  },
  header: {
    marginBottom: 16,
    alignItems: "center",
  },
  title: {
    fontWeight: "bold",
    fontSize: 26, // Slightly larger title
    color: "#1E3A8A",
    letterSpacing: 1.2, // Enhanced spacing for readability
  },
  list: {
    paddingBottom: 16,
  },
  card: {
    padding: 20,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: 16,
  },
  cardRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  cardTextContainer: {
    marginLeft: 12,
  },
  cardTitle: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#374151",
    marginBottom: 2,
  },
  cardContent: {
    fontSize: 15,
    color: "#4A5568",
  },
});

export default Times;
