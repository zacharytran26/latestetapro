import React from "react";
import { StyleSheet, SafeAreaView, View } from "react-native";
import {
  Button,
  ButtonGroup,
  Icon,
  Layout,
  IconRegistry,
} from "@ui-kitten/components";
import * as eva from "@eva-design/eva";

const TrashIcon = (props) => <Icon {...props} name="trash-2-outline" />;
const FolderIcon = (props) => <Icon {...props} name="folder-outline" />;
const ReplyIcon = (props) => <Icon {...props} name="corner-up-left-outline" />;

const BottomButtonGroup = () => (
  <Layout style={styles.container}>
    <View style={styles.contentContainer}></View>
    <View style={styles.buttonGroupContainer}>
      <ButtonGroup style={styles.buttonGroup} size="giant">
        <Button accessoryLeft={TrashIcon} />
        <Button accessoryLeft={FolderIcon} />
        <Button accessoryLeft={ReplyIcon} />
      </ButtonGroup>
    </View>
  </Layout>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
  },
  buttonGroupContainer: {
    justifyContent: "flex-end",
    padding: 16,
    alignItems: "center",
    backgroundColor: "#b6daf2",
  },
  buttonGroup: {
    margin: 2,
    backgroundColor: "#b6daf2",
  },
});

export default BottomButtonGroup;
