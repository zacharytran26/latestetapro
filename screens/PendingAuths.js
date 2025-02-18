import React, { useState, useEffect, useCallback,useRef } from "react";
import { StyleSheet, SafeAreaView, View, TouchableOpacity } from "react-native";
import { Layout, Text, Button, Card} from "@ui-kitten/components";
import { SelectList } from "react-native-dropdown-select-list";
import Swipeable from "react-native-gesture-handler/ReanimatedSwipeable";
import { useAuth } from "./ThemeContext";
import { FlashList } from "@shopify/flash-list";
import { handleFetchError } from "./ExtraImports";
import {
  useNavigation,
  useRoute,
  useFocusEffect,
} from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";


// const RenderAuth = React.memo(({ item, onPressTime, onPressAuth }) => {
//   const isAdditionalRepeats = item.REQST_TYPE === "Additional Repeats";
//   const isCompTime = item.REQST_TYPE === "Comp Time";
//   const hasNoStud1 = item.STUD1_DISNAME === "";
//   const hasNoStud2 = item.STUD2_DISNAME === "";

//   return (
//     <Swipeable
//       renderRightActions={() => (
//         <View style={styles.rightActionContainer}>
//           <Button
//             style={styles.actionButton}
//             appearance="ghost"
//             accessoryLeft={TimeIcon}
//             onPress={() => onPressTime(item)}
//           />
//           <Button
//             style={styles.actionButton}
//             appearance="ghost"
//             accessoryLeft={ApproveIcon}
//             onPress={() => onPressAuth(item)}
//           />
//         </View>
//       )}
//     >
//       <Card
//         style={styles.card}
//         header={() => (
//           <View style={styles.cardHeader}>
//             <Text style={styles.cardHeaderText}>
//               {item.value} - {item.HOUR}
//             </Text>
//           </View>
//         )}
//       >
//         <View style={styles.cardBody}>
//           {isAdditionalRepeats && (
//             <>
//               <Text style={styles.cardText}>
//                 <Text style={styles.label}>Reason:</Text> {item.REASON_DISNAME}
//               </Text>
//               <Text style={styles.cardText}>
//                 <Text style={styles.label}>Comment:</Text> {item.REQST_CMNT}
//               </Text>
//               <Text style={styles.cardText}>
//                 <Text style={styles.label}>Status:</Text> {item.STATUS_DISNAME}
//               </Text>
//               <Text style={styles.cardText}>
//                 <Text style={styles.label}>Date Submitted:</Text>{" "}
//                 {item.SUBMIT_DATE}
//               </Text>
//               <Text style={styles.cardText}>
//                 <Text style={styles.label}>By:</Text> {item.BY}
//               </Text>
//               <Text style={styles.cardText}>
//                 <Text style={styles.label}>Resource:</Text> {item.RES_TYPE}
//               </Text>
//               <Text style={styles.cardText}>
//                 <Text style={styles.label}>Student:</Text> {item.STUD1_DISNAME}
//               </Text>
//               <Text style={styles.cardText}>
//                 <Text style={styles.label}>Course:</Text> {item.S1COURSE}
//               </Text>
//               <Text style={styles.cardText}>
//                 <Text style={styles.label}>Unit:</Text> {item.S1UNIT}
//               </Text>
//             </>
//           )}

//           {isCompTime && (
//             <>
//               <Text style={styles.cardText}>
//                 <Text style={styles.label}>Request Date:</Text>{" "}
//                 {item.REQST_DATE}
//               </Text>
//               <Text style={styles.cardText}>
//                 <Text style={styles.label}>Comment:</Text> {item.REQST_CMNT}
//               </Text>
//               <Text style={styles.cardText}>
//                 <Text style={styles.label}>Reason:</Text> {item.REASON_DISNAME}
//               </Text>
//               <Text style={styles.cardText}>
//                 <Text style={styles.label}>Status:</Text> {item.STATUS_DISNAME}
//               </Text>
//               <Text style={styles.cardText}>
//                 <Text style={styles.label}>By:</Text> {item.BY}
//               </Text>
//               <Text style={styles.cardText}>
//                 <Text style={styles.label}>Student:</Text> {item.STUD1_DISNAME}
//               </Text>
//               <Text style={styles.cardText}>
//                 <Text style={styles.label}>Date Submitted:</Text>{" "}
//                 {item.SUBMIT_DATE}
//               </Text>
//               <Text style={styles.cardText}>
//                 <Text style={styles.label}>Resource:</Text> {item.RES_TYPE}
//               </Text>
//               <Text style={styles.cardText}>
//                 <Text style={styles.label}>Student:</Text> {item.STUD1_DISNAME}
//               </Text>
//               <Text style={styles.cardText}>
//                 <Text style={styles.label}>Course:</Text> {item.S1COURSE}
//               </Text>
//               <Text style={styles.cardText}>
//                 <Text style={styles.label}>Unit:</Text> {item.S1UNIT}
//               </Text>
//             </>
//           )}

//           {!isAdditionalRepeats && !isCompTime && (
//             <>
//               <Text style={styles.cardText}>{item.AUTH_REASON}</Text>
//               <Text style={styles.cardText}>
//                 <Text style={styles.label}>Request Date:</Text>{" "}
//                 {item.REQST_DATE}
//               </Text>
//               <Text style={styles.cardText}>
//                 <Text style={styles.label}>Status:</Text> {item.STATUS_DISNAME}
//               </Text>
//               <Text style={styles.cardText}>
//                 <Text style={styles.label}>Date Submitted:</Text>{" "}
//                 {item.SUBMIT_DATE}
//               </Text>
//               <Text style={styles.cardText}>
//                 <Text style={styles.label}>By:</Text> {item.BY}
//               </Text>
//               <Text style={styles.cardText}>
//                 <Text style={styles.label}>Resource:</Text> {item.RES_TYPE}
//               </Text>
//               {!hasNoStud1 && (
//                 <>
//                   <Text style={styles.cardText}>
//                     <Text style={styles.label}>Student 1:</Text>{" "}
//                     {item.STUD1_DISNAME}
//                   </Text>
//                   <Text style={styles.cardText}>
//                     <Text style={styles.label}>Course:</Text> {item.S1COURSE}
//                   </Text>
//                   <Text style={styles.cardText}>
//                     <Text style={styles.label}>Unit:</Text> {item.S1UNIT}
//                   </Text>
//                 </>
//               )}
//               {!hasNoStud2 && (
//                 <>
//                   <Text style={styles.cardText}>
//                     <Text style={styles.label}>Student 2:</Text>{" "}
//                     {item.STUD2_DISNAME}
//                   </Text>
//                   <Text style={styles.cardText}>
//                     <Text style={styles.label}>Course:</Text> {item.S2COURSE}
//                   </Text>
//                   <Text style={styles.cardText}>
//                     <Text style={styles.label}>Unit:</Text> {item.S2UNIT}
//                   </Text>
//                 </>
//               )}
//             </>
//           )}
//         </View>
//       </Card>
//     </Swipeable>
//   );
// });

//const PendingAuth = ({ navigation }) => {

  const RenderAuth = React.memo(({ item, onPressTime, onPressAuth }) => {
    const isAdditionalRepeats = item.REQST_TYPE === "Additional Repeats";
    const isCompTime = item.REQST_TYPE === "Comp Time";
    const hasNoStud1 = item.STUD1_DISNAME === "";
    const hasNoStud2 = item.STUD2_DISNAME === "";
  
    return (
      <Card
        style={styles.card}
        header={() => (
          <View style={styles.cardHeader}>
            <Text style={styles.cardHeaderText}>
              {item.value} - {item.HOUR}
            </Text>
          </View>
        )}
      >
        <View style={styles.cardBody}>
          {isAdditionalRepeats && (
            <>
              <Text style={styles.cardText}>
                <Text style={styles.label}>Reason:</Text> {item.REASON_DISNAME}
              </Text>
              <Text style={styles.cardText}>
                <Text style={styles.label}>Comment:</Text> {item.REQST_CMNT}
              </Text>
              <Text style={styles.cardText}>
                <Text style={styles.label}>Status:</Text> {item.STATUS_DISNAME}
              </Text>
              <View style={styles.row}>
                <TouchableOpacity onPress={() => onPressAuth(item)} style={styles.button}>
                  <Icon name="check-bold" size={18} color="#07a61c" />
                  <Text style={styles.buttonText}>Approve</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.cardText}>
                <Text style={styles.label}>Date Submitted:</Text> {item.SUBMIT_DATE}
              </Text>
              <Text style={styles.cardText}>
                <Text style={styles.label}>By:</Text> {item.BY}
              </Text>
              <Text style={styles.cardText}>
                <Text style={styles.label}>Resource:</Text> {item.RES_TYPE}
              </Text>
              <View style={styles.row}>
                <TouchableOpacity onPress={() => onPressTime(item)} style={styles.button}>
                  <Icon name="timer" size={18} color="#FFC107" />
                  <Text style={styles.buttonText}>Times</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
  
          {isCompTime && (
            <>
              <Text style={styles.cardText}>
                <Text style={styles.label}>Request Date:</Text> {item.REQST_DATE}
              </Text>
              <Text style={styles.cardText}>
                <Text style={styles.label}>Comment:</Text> {item.REQST_CMNT}
              </Text>
              <Text style={styles.cardText}>
                <Text style={styles.label}>Reason:</Text> {item.REASON_DISNAME}
              </Text>
              <Text style={styles.cardText}>
                <Text style={styles.label}>Status:</Text> {item.STATUS_DISNAME}
              </Text>
              <View style={styles.row}>
                <TouchableOpacity onPress={() => onPressAuth(item)} style={styles.button}>
                  <Icon name="check-bold" size={18} color="#07a61c" />
                  <Text style={styles.buttonText}>Approve</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.cardText}>
                <Text style={styles.label}>By:</Text> {item.BY}
              </Text>
              <Text style={styles.cardText}>
                <Text style={styles.label}>Date Submitted:</Text> {item.SUBMIT_DATE}
              </Text>
              <Text style={styles.cardText}>
                <Text style={styles.label}>Resource:</Text> {item.RES_TYPE}
              </Text>
              <View style={styles.row}>
                <TouchableOpacity onPress={() => onPressTime(item)} style={styles.button}>
                  <Icon name="timer" size={18} color="#FFC107" />
                  <Text style={styles.buttonText}>Times</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
  
          {!isAdditionalRepeats && !isCompTime && (
            <>
              <Text style={styles.cardText}>{item.AUTH_REASON}</Text>
              <Text style={styles.cardText}>
                <Text style={styles.label}>Request Date:</Text> {item.REQST_DATE}
              </Text>
              <Text style={styles.cardText}>
                <Text style={styles.label}>Status:</Text> {item.STATUS_DISNAME}
              </Text>
              <View style={styles.row}>
                <TouchableOpacity onPress={() => onPressAuth(item)} style={styles.button}>
                  <Icon name="check-bold" size={18} color="#07a61c" />
                  <Text style={styles.buttonText}>Approve</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.cardText}>
                <Text style={styles.label}>Date Submitted:</Text> {item.SUBMIT_DATE}
              </Text>
              <Text style={styles.cardText}>
                <Text style={styles.label}>By:</Text> {item.BY}
              </Text>
              <Text style={styles.cardText}>
                <Text style={styles.label}>Resource:</Text> {item.RES_TYPE}
              </Text>
              <View style={styles.row}>
                <TouchableOpacity onPress={() => onPressTime(item)} style={styles.button}>
                  <Icon name="timer" size={18} color="#FFC107" />
                  <Text style={styles.buttonText}>Times</Text>
                </TouchableOpacity>
              </View>
              {!hasNoStud1 && (
                <>
                  <Text style={styles.cardText}>
                    <Text style={styles.label}>Student 1:</Text> {item.STUD1_DISNAME}
                  </Text>
                  <Text style={styles.cardText}>
                    <Text style={styles.label}>Course:</Text> {item.S1COURSE}
                  </Text>
                  <Text style={styles.cardText}>
                    <Text style={styles.label}>Unit:</Text> {item.S1UNIT}
                  </Text>
                </>
              )}
              {!hasNoStud2 && (
                <>
                  <Text style={styles.cardText}>
                    <Text style={styles.label}>Student 2:</Text> {item.STUD2_DISNAME}
                  </Text>
                  <Text style={styles.cardText}>
                    <Text style={styles.label}>Course:</Text> {item.S2COURSE}
                  </Text>
                  <Text style={styles.cardText}>
                    <Text style={styles.label}>Unit:</Text> {item.S2UNIT}
                  </Text>
                </>
              )}
            </>
          )}
        </View>
      </Card>
    );
  });
  const PendingAuth = () => {
  const [requests, setRequests] = useState([]);
  const [goFetch, setgoFetch] = useState(true);
  const [confirmedItems, setConfirmedItems] = useState(new Set());
  const [filterByTeam, setFilterByTeam] = useState("");
  const [teams, setTeams] = useState([]);
  const { authUser, setAuthUser, setIsLoggedIn } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const route = useRoute();
  const navigation = useNavigation();
  const PendRef = useRef(new Set());

  useEffect(() => {
    if(goFetch){
      fetchAuths();
    }
  }, [goFetch]);

  useFocusEffect(
    useCallback(()=>{
      if(route.params?.PendData){
        const { pdataid } = route.params.PendData;
        //console.log("Receieved",pdataid);

        const result = requests.find((item) => item.ID === pdataid);
        setConfirmedItems((prev) => new Set([...prev, result.ID]));
        PendRef.current.delete(result.ID);
        let newPendAuth = PendRef.current.filter(requests => {
          return requests.ID !== pdataid;
        });
        setRequests(newPendAuth);

      }
    },[route.params?.PendData])
  )

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchAuths();
  };

  const sanitizeJSON = (str) => {
    return str.replace(/[\u0000-\u001F\u007F-\u009F]/g, "");
  };

  const fetchAuths = async () => {
    try {
      const response = await fetch(
        `${authUser.host}content?module=home&page=m&reactnative=1&uname=${
          authUser.uname
        }&password=${authUser.upwd}&customer=eta${authUser.schema}&session_id=${
          authUser.sessionid
        }&mode=getpendauth&etamobilepro=1&nocache=${
          Math.random().toString().split(".")[1]
        }&persid=${authUser.currpersid}`
      );

      const responseText = await response.text();
      const sanitizedResponseText = sanitizeJSON(responseText);
      const data = JSON.parse(sanitizedResponseText);
      const pendAuthData = data.pendauthdata.reduce(
        (acc, item) => {
          if (item.pendauths) {
            acc.pendauths = acc.pendauths.concat(
              item.pendauths.map((pendauth) => ({
                key: pendauth.ID,
                value: pendauth.REQST_TYPE_DISNAME,
                requestid: pendauth.ID,
                eventStop: pendauth.EVENT_STOP,
                eventStart: pendauth.EVENT_START,
                hour: pendauth.HOUR,
                debriefDur: pendauth.DEBRIEF_DUR,
                briefDur: pendauth.BRIEF_DUR,
                actDur: pendauth.ACT_DUR,
                actStart: pendauth.ACT_START,
                actStop: pendauth.ACT_STOP,
                scheduleid: pendauth.SCH_ACT_ID,
                ...pendauth,
              }))
            );
          }
          if (item.teams) {
            acc.teams = acc.teams.concat(
              item.teams.map((team) => ({
                key: team.ID,
                value: team.DIS,
              }))
            );
          }
          return acc;
        },
        { pendauths: [], teams: [] }
      );
      console.log(pendAuthData.pendauths);
      setRequests(pendAuthData.pendauths);
      setTeams(pendAuthData.teams);
      if (handleFetchError(data, setAuthUser, setIsLoggedIn)) {
        return; // Stop further processing if an error is handled
      }
    } catch (error) {
      console.error("Error fetching and parsing data:", error);
    } finally {
      setRefreshing(false);
    }
  };

  const handlePressTime = useCallback(
    (item) => {
      const times = {
        eventStop: item.eventStop,
        eventStart: item.eventStart,
        hour: item.hour,
        debriefDur: item.debriefDur,
        briefDur: item.briefDur,
        actDur: item.actDur,
        actStart: item.actStart,
        actStop: item.actStop,
      };
      navigation.navigate("Times", { times });
    },
    [navigation]
  );

  const handlePressAuth = useCallback(
    (item) => {
      const pdata = {
        duration: item.ACT_DUR,
        hour: item.HOUR,
        acttype: item.SCH_REQST_TYPE,
        reqtype: item.REQST_TYPE,
        value: item.value,
        comment: item.AUTH_REASON,
        requestid: item.ID,
      };
      navigation.navigate("Auth", { pdata });
    },
    [navigation]
  );

  const handleTeamSelect = useCallback((value) => {
    setFilterByTeam(value);
  }, []);

  const filteredRequests = filterByTeam
    ? requests.filter((request) => request.teamId === filterByTeam)
    : requests;

  return (
    <Layout style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <SelectList
          data={[{ key: "", value: "All Teams" }, ...teams]}
          setSelected={handleTeamSelect}
          placeholder={filterByTeam || "Select a team"}
          boxStyles={styles.selectListBox}
          value={filterByTeam}
        />
        <FlashList
          data={filteredRequests}
          refreshing={refreshing}
          onRefresh={handleRefresh}
          renderItem={({ item }) => (
            <RenderAuth
              item={item}
              onPressTime={handlePressTime}
              onPressAuth={handlePressAuth}
            />
          )}
          keyExtractor={(item) => item.key.toString()}
          contentContainerStyle={styles.list}
          estimatedItemSize={100}
        />
      </SafeAreaView>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F9FC",
  },
  safeArea: {
    flex: 1,
    padding: 16,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  cardHeaderText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1E88E5",
    marginLeft: 8,
  },
  cardBody: {
    marginTop: 8,
  },
  cardText: {
    fontSize: 16,
    marginBottom: 8,
    color: "#4A5568",
  },
  label: {
    fontWeight: "bold",
    color: "#8F9BB3",
  },
  selectListBox: {
    marginBottom: 16,
    borderRadius: 8,
    backgroundColor: "#FFFFFF",
    borderColor: "#E4E9F2",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    marginTop: 10,
  },
  list: {
    paddingBottom: 16,
  },
  rightActionContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  actionButton: {
    marginHorizontal: 5,
  },
  card: {
    marginVertical: 8,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    padding: 12,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
  },
  buttonText: {
    marginLeft: 5,
    fontSize: 16,
    color: "#079cff",
  },
});

export default PendingAuth;
