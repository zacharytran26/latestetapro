import React, { useState, useEffect } from "react";
import { SafeAreaView, StyleSheet } from "react-native";
import { Input, Layout, Divider, Icon, ListItem } from "@ui-kitten/components";
import { useRoute } from "@react-navigation/native";
import { FlashList } from "@shopify/flash-list";

const LineItem = () => {
  const route = useRoute();
  const { data } = route.params;

  const [filter, setFilter] = useState("");
  const [filteredLineItems, setFilteredLineItems] = useState(data.lineitems);

  useEffect(() => {
    if (data.lineitems && data.lineitems.length > 0) {
      setFilteredLineItems(
        data.lineitems.filter((item) =>
          item.lineitem.toLowerCase().includes(filter.toLowerCase())
        )
      );
    }
  }, [filter, data.lineitems]);

  const renderLineItem = ({ item }) => (
    <ListItem
      title={item.lineitem}
      description={item.description || "No description"}
      titleStyle={styles.itemTitle}
      descriptionStyle={styles.itemDescription}
      style={styles.listItem}
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      <Layout style={styles.header} level="1">
        <Input
          placeholder="Search items"
          value={filter}
          onChangeText={setFilter}
          style={styles.input}
          placeholderTextColor="#8F9BB3"
        />
      </Layout>
      <Divider style={styles.divider} />
      <FlashList
        data={filteredLineItems}
        renderItem={renderLineItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
        estimatedItemSize={70} // Adjust this size based on your list items
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F7F9FC",
  },
  header: {
    marginBottom: 16,
    backgroundColor: "transparent",
  },
  input: {
    height: 40,
    borderColor: "#E4E9F2",
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 16,
    paddingLeft: 12,
    flex: 1,
    backgroundColor: "#ffffff",
    marginTop: 20,
    marginRight: 10,
  },
  inputText: {
    fontSize: 16,
    color: "#333",
  },
  divider: {
    backgroundColor: "#E4E9F2",
    marginVertical: 10,
  },
  list: {
    paddingBottom: 16,
  },
  listItem: {
    backgroundColor: "#FFF",
    borderRadius: 8,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  itemTitle: {
    fontSize: 22, // Increased font size for title
    fontWeight: "600",
    color: "#222B45",
  },
  itemDescription: {
    fontSize: 18, // Increased font size for description
    color: "#8F9BB3",
  },
  icon: {
    width: 24,
    height: 24,
    color: "#8F9BB3",
  },
});

export default LineItem;
