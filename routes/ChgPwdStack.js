import * as React from "react";
import { SafeAreaView, TouchableOpacity, Text } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ChgPwdScreen from "../screens/ChgPwdScreen";
const Stack = createNativeStackNavigator();

export function ChgPwdStack() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={() => ({
          headerStyle: { height: 100 },
          headerBackTitleVisible: false,
        })}
      >
        <Stack.Screen
          name="ChgPwd"
          component={ChgPwdScreen}
          options={({ navigation }) => ({
            title: "",
            headerLeft: () => (
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Text style={{ marginLeft: 20, color: "#0000ff" }}>Back</Text>
              </TouchableOpacity>
            ),
          })}
        />
      </Stack.Navigator>
    </SafeAreaView>
  );
}
