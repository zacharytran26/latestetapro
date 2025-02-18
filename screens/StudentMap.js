import React, { useState,useEffect} from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Animated, SafeAreaView } from 'react-native';
import { useNavigation, useRoute } from "@react-navigation/native";
import { handleFetchError,Chevron } from "./ExtraImports";
import { useAuth } from "./ThemeContext";
import { useSharedValue, withTiming, useAnimatedStyle } from "react-native-reanimated";


const AccordionItem = ({ title, content }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [animationValue] = useState(new Animated.Value(0)); // Animated height value
  const navigation = useNavigation();
  const progress = useSharedValue(0);

  const toggleAccordion = () => {
    Animated.timing(animationValue, {
      toValue: isOpen ? 0 : 1, // Toggle between open (1) and closed (0)
      duration: 300,
      useNativeDriver: false, // Use layout animations
    }).start(() => {
      // Update Chevron rotation
      progress.value = isOpen ? withTiming(0) : withTiming(1);
    });
    setIsOpen(!isOpen);
  };
  const handlePress = (item) => {
    navigation.navigate("StudentMapDetails", { units: item.units, lesson: item.lesson });
  };

  const animatedHeight = animationValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 33 * content.length], // Adjust based on number of content items
  });

  return (
    <View style={styles.accordionItem}>
      <TouchableOpacity onPress={toggleAccordion} style={styles.header}>
        <Text style={styles.headerText}>{title}</Text>
        <Chevron progress={progress} />
      </TouchableOpacity>
      
      <Animated.View style={[styles.body, { height: animatedHeight }]}>
        <View style={styles.bodyContent}>
        {content.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.itemTouchable}
              onPress={() => handlePress(item)}
            >
              <Text style={styles.bodyText}>{item.lesson}</Text>
              
            </TouchableOpacity>
          ))}
        </View>
      </Animated.View>
    </View>
  );
};

const StudentMap = () => {
  const route = useRoute();
  const { course } = route.params;
  const [stages, setStages] = useState([]);
  const [content, setContent] = useState([]);
  const [sections, setSections] = useState([]);
  const { authUser, setAuthUser, setIsLoggedIn } = useAuth();
  useEffect(() => {
    fetchMap();
  }, []);
  const fetchMap = async () => {
    try {
      const response = await fetch(
        `${authUser.host}` +
          `content?module=home&page=m&reactnative=1&uname=${
            authUser.uname
          }&password=${authUser.upwd}&customer=eta${
            authUser.schema
          }&session_id=${
            authUser.sessionid
          }&mode=getcoursemap&etamobilepro=1&nocache=${
            Math.random().toString().split(".")[1]
          }&persid=${authUser.currpersid}&persregid=${course.ID}`
      );
      const data = await response.json();
      // data.stages.forEach((stage) => {
      //   stage.lessons.forEach((lesson) => {
      //     console.log(`Units :`, lesson.units); // Log the units object
      //   });
      // });

      if (handleFetchError(data, setAuthUser, setIsLoggedIn)) {
        return; // Stop further processing if an error is handled
      }
      const stageNames = data.stages.map((stage) => stage.stage);
    // Extract only the lesson names from each stage
    const stageContent = data.stages.map((stage) =>
      stage.lessons.map((lesson) => lesson.lesson) // Extract only the 'lesson' property
    );
  
  const formattedSection = data.stages.map((stage, index) => ({
    title: stage.stage, // Stage name
    content: stage.lessons.map((lesson) => ({
      lesson: lesson.lesson,
      units: lesson.units,
    })), // Pass full lesson and units
  }));
      setContent(stageContent);
      setStages(stageNames);
      setSections(formattedSection);
    } catch (error) {
      console.error("Error fetching map data:", error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {sections.map((section, index) => (
        <AccordionItem
          key={index}
          title={section.title}
          content={section.content}
        />
      ))}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F5F5F5',
  },
  accordionItem: {
    marginBottom: 12,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#FFF',
    elevation: 2,
  },
  header: {
    padding: 16,
    backgroundColor: '#4A90E2',
    borderRadius: 8,
    flexDirection: 'row', // Align Chevron and title in a row
    justifyContent: 'space-between', // Add space between title and Chevron
    alignItems: 'center', // Align items vertically
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
  },
  body: {
    overflow: 'hidden',
  },
  bodyContent: {
    padding: 16,
    backgroundColor: '#EAEAEA',
  },
  bodyText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
  },
});

export default StudentMap;
