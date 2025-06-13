import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  CalendarBody,
  CalendarContainer,
  CalendarHeader,
  parseDateTime,
  ResourceHeaderItem,
  DraggableEvent,
} from '@howljs/calendar-kit';
import {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  TextComponent,
  useColorScheme,
  View,
} from 'react-native';
import {useSharedValue} from 'react-native-reanimated';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {
  useNavigation,
  useRoute,
  useFocusEffect,
} from '@react-navigation/native';
import {useAuth} from './ThemeContext';
import {handleFetchError} from './ExtraImports';

//TODO: allow for new created event to edit the time and resource

const INITIAL_DATE = new Date().toISOString();

const CALENDAR_THEME = {
  light: {
    colors: {
      primary: '#1a73e8',
      onPrimary: '#fff',
      background: '#fff',
      onBackground: '#000',
      border: '#dadce0',
      text: '#000',
      surface: '#ECECEC',
    },
  },
  dark: {
    colors: {
      primary: '#4E98FA',
      onPrimary: '#FFF',
      background: '#1A1B21',
      onBackground: '#FFF',
      border: '#46464C',
      text: '#FFF',
      surface: '#545454',
    },
  },
};

const TOTAL_RESOURCES = 5;

const randomColor = () => {
  const letters = '0123456789ABCDEF';
  return (
    '#' +
    Array.from({length: 6}, () => letters[Math.floor(Math.random() * 16)]).join(
      '',
    )
  );
};

const minDate = new Date(
  new Date().getFullYear(),
  new Date().getMonth() - 4,
  new Date().getDate(),
);

// const generateEvents = () => {
//   return new Array(50).fill(0).map((_, index) => {
//     const start = new Date(
//       minDate.getFullYear(),
//       minDate.getMonth(),
//       minDate.getDate() + Math.floor(index / 2),
//       Math.floor(Math.random() * 24),
//       Math.round((Math.random() * 60) / 15) * 15
//     );
//     const end = new Date(start.getTime() + 30 * 60 * 1000); // 30 mins
//     return {
//       id: `event_${index + 1}`,
//       start: { dateTime: start.toISOString() },
//       end: { dateTime: end.toISOString() },
//       title: `Event ${index + 1}`,
//       color: randomColor(),
//       resourceId: `resource_${(index % TOTAL_RESOURCES) + 1}`,
//     };
//   });
// };
/*
format of the events: [
    {
      id: '2',
      title: 'Meeting with Team',
      start: {dateTime: '2025-06-10T10:00:00'},
      end: {dateTime: '2025-06-10T11:00:00'},
      color: '#4285F4',
      resourceId: 'resource_1',
    },
    {
      id: '3',
      title: 'Meeting with Team3',
      start: {dateTime: '2025-06-10T10:00:00'},
      end: {dateTime: '2025-06-10T11:00:00'},
      color: '#4285F4',
      resourceId: 'resource_2',
    },
    {
      id: '4',
      title: 'Meeting with Client',
      start: {dateTime: '2025-06-10T09:00:00'},
      end: {dateTime: '2025-06-10T12:00:00'},
      color: '#4285F4',
      resourceId: 'resource_2',
    },
]
*/
const Calendar = () => {
  const [events, setEvents] = useState({});
  const {bottom} = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const calendarRef = useRef(null);
  const currentDate = useSharedValue(INITIAL_DATE);
  const [calendarWidth, setCalendarWidth] = useState(
    Dimensions.get('window').width,
  );
  const [draggingEventId, setDraggingEventId] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const navigation = useNavigation();
  const route = useRoute();
  const {authUser, setAuthUser, setIsLoggedIn} = useAuth();

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({window}) => {
      setCalendarWidth(window.width);
    });
    return () => subscription?.remove();
  }, []);

  useEffect(() => {
    console.log('Events updated:', events);
  }, [events]);

  useEffect(() => {
    FetchCalData();
  }, []);

  const resources = useMemo(() => {
    return Array.from({length: TOTAL_RESOURCES}, (_, index) => ({
      id: `resource_${index + 1}`,
      title: `Resource ${index + 1}`,
    }));
  }, []);

  // const handleCalFetch = async () => {
  //   try {
  //     const request = await fetch(
  //       `${authUser.host}content?module=home&page=m&reactnative=1&uname=${
  //         authUser.uname
  //       }&password=${authUser.upwd}&customer=eta${authUser.schema}&session_id=${
  //         authUser.sessionid
  //       }&mode=gettestdata&etamobilepro=1&nocache=${
  //         Math.random().toString().split('.')[1]
  //       }&persid=${authUser.currpersid}`,
  //     );
  //     const text = await request.text();
  //     console.log('Text', text);
  //     const data = JSON.parse(text);
  //     if (handleFetchError(data, setAuthUser, setIsLoggedIn)) {
  //       return; // Stop further processing if an error is handled
  //     }
  //     setEvents(data);
  //   } catch (error) {
  //     console.error('Error fetching calendar data:', error);
  //     return null;
  //   }
  // };

    const FetchCalData = async () => {
      try {
        const request = await fetch(
          `${authUser.host}content?module=home&page=m&reactnative=1&uname=${
            authUser.uname
          }&password=${authUser.upwd}&customer=eta${authUser.schema}&session_id=${
            authUser.sessionid
          }&mode=gettestdata&etamobilepro=1&nocache=${
            Math.random().toString().split('.')[1]
          }&persid=${
            authUser.currpersid
          }`,
        );
        console.log(request);
        const text = await request.text();
        console.log('text', text);
        const data = JSON.parse(text);
        console.log('data', data);
        setEvents(data.events);
  
        if (handleFetchError(data, setAuthUser, setIsLoggedIn)) {
          return; // Stop further processing if an error is handled
        }

      } catch (error) {
        console.error('Error fetching student data:', error);
        return null;
      }
    };

  const _renderResource = useCallback(
    resource => (
      <View style={styles.resourceContainer}>
        <Icon name="account-circle" size={24} color="black" />
        <Text>{resource.title}</Text>
      </View>
    ),
    [],
  );

  const _renderResourceHeaderItem = useCallback(
    item => {
      const start = parseDateTime(item.startUnix);
      const dateStr = start.toFormat('yyyy-MM-dd');

      return (
        <ResourceHeaderItem
          startUnix={item.startUnix}
          resources={item.extra.resources}
          renderResource={_renderResource}
          DateComponent={
            <View style={styles.dateContainer}>
              <Text style={{fontSize: 16, fontWeight: 'bold'}}>{dateStr}</Text>
            </View>
          }
        />
      );
    },
    [_renderResource],
  );

  const handleDragStart = event => {
    console.log('Started editing event:', event);
    setDraggingEventId(event.id);
  };

  const handleDragEnd = (event, newStart, newEnd, newResourceId) => {
    console.log('Event edited:', event.id, newStart, newEnd, newResourceId);

    const updatedEvents = events.map(ev => {
      if (ev.id === event.id) {
        return {
          ...ev,
          start: {dateTime: newStart.toISOString()},
          end: {dateTime: newEnd.toISOString()},
          resourceId: newResourceId || ev.resourceId, // update resourceId if moved across resources
        };
      }
      return ev;
    });

    setEvents(updatedEvents); // replace array to trigger re-render
  };

  return (
    <View style={styles.container}>
      <CalendarContainer
        ref={calendarRef}
        selectedEvent={selectedEvent}
        calendarWidth={calendarWidth}
        scrollByDay
        firstDay={1}
        locale="en"
        theme={
          colorScheme === 'light' ? CALENDAR_THEME.dark : CALENDAR_THEME.light
        }
        minDate={new Date().toISOString()}
        maxDate={new Date(2030, 0, 1).toISOString()}
        initialDate={INITIAL_DATE}
        events={events}
        dragStep={15}
        allowDragToEdit={true}
        allowDragToCreate={true}
        // onDragSelectedEventStart={handleDragStart}
        // onDragSelectedEventEnd={handleDragEnd}
        onDragEventStart={handleDragStart}
        onDragEventEnd={event => {
          const updated = events.map(e => (e.id === event.id ? event : e));
          setEvents(updated);
        }}
        resources={resources}
        onPressEvent={() => navigation.navigate('Request')}
        onDragCreateEventEnd={event => {
          const newEvent = {
            ...event,
            id: `event_${events.length + 1}`,
            title: `Event ${events.length + 1}`,
            color: '#4285F4',
          };
          setEvents([...events, newEvent]);
          setSelectedEvent(newEvent);
        }}>
        <CalendarHeader
          dayBarHeight={100}
          renderHeaderItem={_renderResourceHeaderItem}
        />
        <CalendarBody />
      </CalendarContainer>
    </View>
  );
};

export default Calendar;

const styles = StyleSheet.create({
  container: {flex: 1},
  resourceContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    gap: 8,
  },
  dateContainer: {
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingVertical: 8,
  },
});
