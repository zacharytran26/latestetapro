import React, { useState, useEffect } from "react";
import { SafeAreaView, StyleSheet } from "react-native";
import { Input, Layout, ListItem } from "@ui-kitten/components";
import { useRoute } from "@react-navigation/native";
import { FlashList } from "@shopify/flash-list";

const LineItem = () => {
  const { params: { data } } = useRoute();
  const [filter, setFilter] = useState("");
  const [filteredItems, setFilteredItems] = useState(data.lineitems || []);

  useEffect(() => {
    setFilteredItems(
      data.lineitems.filter((item) =>
        item.lineitem.toLowerCase().includes(filter.toLowerCase())
      )
    );
  }, [filter, data.lineitems]);

  return (
    <SafeAreaView style={styles.container}>
      <Layout style={styles.searchContainer}>
        <Input
          placeholder="Search items"
          value={filter}
          onChangeText={setFilter}
          style={styles.input}
        />
      </Layout>
      <FlashList
        data={filteredItems}
        renderItem={({ item }) => (
          <ListItem
            title={item.lineitem}
            description={item.description || "No description"}
            style={styles.listItem}
          />
        )}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
        estimatedItemSize={70}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#F7F9FC" },
  searchContainer: { marginBottom: 12 },
  input: { borderRadius: 8, backgroundColor: "#FFF" },
  list: { paddingBottom: 16 },
  listItem: {
    backgroundColor: "#FFF",
    borderRadius: 8,
    marginVertical: 5,
    elevation: 2,
  },
});

export default LineItem;
