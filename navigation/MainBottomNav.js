import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { View, Text, StyleSheet } from "react-native";
import {
  BottomNavigation,
  BottomNavigationTab,
  Icon,
} from "@ui-kitten/components";
import HomeDrawerNavigator from "./HomeDrawer";
import IssueDrawerNavigator from "./IssueDrawer";
import CurrencyDrawerNavigator from "./CurrencyDrawer";
import MessagesDrawerNavigator from "./MessagesDrawer";
import QualiDrawerNavigator from "./QualiDrawer"; // Assuming this exists
import { useAuth } from "../screens/ThemeContext"; // Assuming useAuth gives access to tabBarBadge

const { Navigator, Screen } = createBottomTabNavigator();

const BottomTabBar = ({ navigation, state }) => {
  const { tabBarBadge, CountCurr, ExpiringCurr } = useAuth(); // Fetch tabBarBadge from context
  // Function to dynamically determine icon color
  const getIconColor = (route, focused) => {
    let iconColor;

    if (route.name === "mHome") {
      iconColor = focused ? "blue" : "white";
    } else if (route.name === "mIssue") {
      iconColor = focused ? "red" : "red"; // Red when active
    } else if (route.name === "mQualifications") {
      iconColor = focused ? "blue" : "white"; // Yellow when active
    } else if (route.name === "mCurrency") {
      if (CountCurr > 0) {
        iconColor = "red"
      } else if (ExpiringCurr > 0) {
        iconColor = 'yellow'
      } else if (CountCurr == 0 && ExpiringCurr == 0) {
        iconColor = "white"
      }
    } else if (route.name === "mMessages") {
      iconColor = focused ? "blue" : "white"; // Orange when active
    }

    return iconColor;
  };

  // Custom function to render a badge only for the currency tab
  const renderIconWithBadge = (iconName, routeName, index) => (props) => {
    const isFocused = state.index === index;
    const iconColor = getIconColor({ name: routeName }, isFocused);

    return (
      <View style={styles.iconContainer}>
        <Icon {...props} name={iconName} fill={iconColor} />
        {routeName === "mMessages" && tabBarBadge > 0 && (
          <View style={styles.badgeContainer}>
            <Text style={styles.badgeText}>{tabBarBadge}</Text>
          </View>
        )}
      </View>
    );
  };

  // Handle tab selection logic
  const handleSelect = (index) => {
    const selectedTab = state.routeNames[index];
    const isCurrentTab = state.index === index;

    if (isCurrentTab) {
      navigation.reset({
        index: 0,
        routes: [{ name: selectedTab }],
      });
    } else {
      navigation.navigate(selectedTab);
    }
  };

  // Render each tab with the appropriate icon and color (badge only for mCurrency)
  return (
    <BottomNavigation
      selectedIndex={state.index}
      onSelect={handleSelect}
      style={styles.bottomnav}
    >
      <BottomNavigationTab
        icon={renderIconWithBadge("home-outline", "mHome", 0)}
        style={{ width: 48, height: 24 }}
      />
      <BottomNavigationTab
        icon={renderIconWithBadge("alert-triangle-outline", "mIssue", 1)}
        style={{ width: 48, height: 24 }}
      />
      <BottomNavigationTab
        icon={renderIconWithBadge("checkmark-square-2-outline", "mQualifications", 2)}
        style={{ width: 48, height: 24 }}
      />
      <BottomNavigationTab
        icon={renderIconWithBadge("sync-outline", "mCurrency", 3)}
        style={{ width: 48, height: 24 }}
      />
      <BottomNavigationTab
        icon={renderIconWithBadge("message-circle-outline", "mMessages", 4)}
        style={{ width: 48, height: 24 }}
      />
    </BottomNavigation>
  );
};

//export default function MainBottomNav() {
const MainBottomNav = () => {
  const { tabBarBadge } = useAuth(); // Fetch tabBarBadge from context

  return (
    <Navigator
      tabBar={(props) => <BottomTabBar {...props} />} // Pass props to custom BottomTabBar
      screenOptions={{ headerShown: false }} // Hide header for all screens
    >
      <Screen name="mHome" component={HomeDrawerNavigator} />
      <Screen name="mIssue" component={IssueDrawerNavigator} />
      <Screen name="mQualifications" component={QualiDrawerNavigator} />
      <Screen name="mCurrency" component={CurrencyDrawerNavigator} />
      <Screen
        name="mMessages"
        component={MessagesDrawerNavigator}
        options={{
          tabBarBadge: tabBarBadge > 0 ? tabBarBadge : null, // Badge logic for screen
          tabBarBadgeStyle: { backgroundColor: "red" },
        }}
      />
    </Navigator>
  );
};

export default MainBottomNav;

const styles = StyleSheet.create({
  iconContainer: {
    position: "relative",
    width: 24, // Adjust based on your icon size
    height: 24,
  },
  bottomnav: {
    height: 80, // Increase the Bottom Navigation Bar height
    paddingVertical: 10, // Add padding for better spacing
    backgroundColor: "#5d95e8",
  },
  badgeContainer: {
    position: "absolute",
    top: -4,
    right: -4,
    backgroundColor: "red",
    borderRadius: 8,
    paddingHorizontal: 4,
    paddingVertical: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: {
    color: "white",
    fontSize: 10,
    fontWeight: "bold",
  },
});
