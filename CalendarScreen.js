import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, TextInput, Button, FlatList } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import ModalDropdown from 'react-native-modal-dropdown';

const CalendarScreen = () => {
  const navigation = useNavigation();
  const [selectedDate, setSelectedDate] = useState('');
  const [isModalVisible, setModalVisible] = useState(false);
  const [markedDates, setMarkedDates] = useState({});
  const [events, setEvents] = useState({});
  const [eventTitle, setEventTitle] = useState('');
  const [selectedReminder, setSelectedReminder] = useState('');

  const handleDayPress = (day) => {
    const updatedDates = { ...markedDates };

    if (selectedDate) {
      updatedDates[selectedDate] = { selected: false, selectedColor: undefined };
    }

    updatedDates[day.dateString] = { selected: true, selectedColor: 'blue' };
    setMarkedDates(updatedDates);
    setSelectedDate(day.dateString);
  };

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const handleAddEvent = () => {
    const updatedEvents = { ...events };

    if (!updatedEvents[selectedDate]) {
      updatedEvents[selectedDate] = [];
    }

    updatedEvents[selectedDate].push({
      title: eventTitle,
      reminder: selectedReminder,
    });

    setEvents(updatedEvents);
    toggleModal();
  };

  const handleDeleteEvent = () => {
    const updatedEvents = { ...events };

    if (updatedEvents[selectedDate]) {
      updatedEvents[selectedDate] = [];
    }

    setEvents(updatedEvents);
    toggleModal();
  };

  const handleEventBlockPress = () => {
    console.log(`Events for ${selectedDate}: `, events[selectedDate]);
  };

  const handleTodayButtonPress = () => {
    const todayString = new Date().toISOString().split('T')[0];
    handleDayPress({ dateString: todayString });
  };

  const reminderOptions = [
    'At time of event',
    '5 minutes before',
    '10 minutes before',
    '30 minutes before',
    '1 hour before',
    '1 day before',
    '1 week before',
  ];

  return (
    <View style={styles.container}>
      <Calendar onDayPress={handleDayPress} markedDates={markedDates} />

      <View style={styles.blueBox}>
        <Text style={{ color: 'black', fontSize: 20 }}>Events {selectedDate}</Text>
        {selectedDate && events[selectedDate] && (
          <TouchableOpacity style={styles.eventBlock} onPress={handleEventBlockPress}>
            <FlatList
              data={events[selectedDate]}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <View style={styles.eventItem}>
                  <Text>Title: {item.title}</Text>
                  <Text>Reminder: {item.reminder}</Text>
                </View>
              )}
            />
          </TouchableOpacity>
        )}

        <TouchableOpacity style={styles.calendarButton} onPress={handleTodayButtonPress}>
          <Icon name="calendar" size={30} color="white" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.floatingButton} onPress={toggleModal}>
          <Text style={{ color: 'white', fontSize: 50, lineHeight: 54 }}>+</Text>
        </TouchableOpacity>
      </View>

      <Modal visible={isModalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.formContainer}>
            <TouchableOpacity style={styles.cancelButton} onPress={toggleModal}>
              <Icon name="times" size={25} color="white" />
            </TouchableOpacity>
            <View style={styles.eventForm}>
              <Text style={styles.modalTitle}>Add Event for {selectedDate}</Text>

              <TextInput
                style={styles.input}
                placeholder="Event Title"
                value={eventTitle}
                onChangeText={setEventTitle}
              />

              <View style={styles.dropdownContainer}>
                <Text style={styles.dropdownLabel}>Select Reminder</Text>
                <ModalDropdown
                  options={reminderOptions}
                  defaultValue="Select Reminder"
                  onSelect={(index, value) => setSelectedReminder(value)}
                  style={styles.dropdown}
                />
              </View>

              <View style={styles.buttonContainer}>
                <Button title="Save Event" onPress={handleAddEvent} />
                <View style={styles.buttonSeparator} />
                <Button title="Delete Event" onPress={handleDeleteEvent} color="red" />
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = {
  container: {
    flex: 1,
    backgroundColor: '#e6c6af',
  },
  floatingButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#8B4513',
    borderRadius: 50,
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  eventBlock: {
    padding: 10,
    backgroundColor: '#e6c6af',
    marginTop: 10,
    alignItems: 'center',
  },
  eventItem: {
    marginBottom: 10,
  },
  blueBox: {
    position: 'absolute',
    marginTop: '90%',
    backgroundColor: '#e6c6af',
    padding: 80,
    width: '100%',
    height: '50%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  calendarButton: {
    position: 'absolute',
    bottom: 80,
    right: 20,
    backgroundColor: '#8B4513',
    borderRadius: 50,
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  formContainer: {
    backgroundColor: '#8B4513',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  cancelButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginVertical: 10,
    width: '80%',
    padding: 10,
  },
  eventForm: {
    backgroundColor: '#3498db',
    padding: 15,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'white',
  },
  dropdownContainer: {
    width: '80%',
    marginVertical: 10,
  },
  dropdownLabel: {
    color: 'white',
  },
  dropdown: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    backgroundColor: 'white',
    padding: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    marginTop: 15,
    right: 20, 
  },
  buttonSeparator: {
    width: 10,
  },
};

export default CalendarScreen;
