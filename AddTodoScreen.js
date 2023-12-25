import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Switch } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCaretDown, faCaretUp, faBell, faList } from '@fortawesome/free-solid-svg-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as Notifications from 'expo-notifications';
import { useNavigation } from '@react-navigation/native';

const categoryColors = {
  Shopping: 'yellow',
  Work: '#FF5733',
  Personal: '#1aa3ff',
  Entertainment: 'pink',
  'No Category': 'white',
};

const AddTodoScreen = ({ route }) => {
  const { onAddTodo, todoToEdit, todos } = route.params;
  const navigation = useNavigation();
  const [todo, setTodo] = useState(todoToEdit ? todoToEdit.todo : '');
  const [showReminderDialog, setShowReminderDialog] = useState(false);
  const [reminderDateTime, setReminderDateTime] = useState(
    todoToEdit && todoToEdit.reminderDateTime ? new Date(todoToEdit.reminderDateTime) : new Date()
  );
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showCategoryDropDown, setShowCategoryDropDown] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(
    todoToEdit && todoToEdit.category ? todoToEdit.category : 'No Category'
  );
  const [isImportant, setIsImportant] = useState(todoToEdit ? todoToEdit.isImportant : false);

  const handleAddTodo = useCallback(() => {
    const isValidReminder = reminderDateTime > new Date();
  
    if (todo.trim() === '') {
      Alert.alert('No Task Entered', 'Please enter a to-do before adding.');
      return;
    }
    console.log('Reminder DateTime:', reminderDateTime);

    if (!reminderDateTime) {
      Alert.alert('Reminder not set', 'Please set a reminder.');
      return;
    }
    const hasReminder = true; // Since reminderDateTime exists
    console.log('Has Reminder:', hasReminder);
    console.log('Is Valid Reminder:', isValidReminder);
     const editedTodo = {
      ...todoToEdit,
      todo,
      selectedCategory,
      isImportant,
      reminderDateTime: hasReminder && isValidReminder ? reminderDateTime.toISOString() : null,
      completed: todoToEdit && todoToEdit.completed !== undefined ? todoToEdit.completed : false
    };
    console.log('Edited Todo:', editedTodo);
    if (todoToEdit) {
      navigation.navigate('TodoScreen', { updatedTodo: editedTodo });
    } else if (onAddTodo && typeof onAddTodo === 'function') {
      onAddTodo(editedTodo);
      navigation.goBack();
    } else {
      console.error('Function not provided or invalid.');
    }
  }, [navigation, onAddTodo, todo, todoToEdit, selectedCategory, reminderDateTime, isImportant]);


  const handleSetReminder = async () => {
    if (reminderDateTime > new Date()) {
      try {
        console.log('Reminder date and time:', reminderDateTime);
        await scheduleNotification(todo, reminderDateTime.getTime()); // Ensure conversion to milliseconds
        Alert.alert('Reminder Set!', 'Reminder is set.');
        setShowReminderDialog(false);
      } catch (error) {
        console.error('Failed to schedule the notification:', error);
        Alert.alert('Failed to Set Reminder', 'Error scheduling the notification.');
      }
    } else {
      Alert.alert('Invalid Date', 'Please set a valid future date for the reminder.');
    }
  };

  const scheduleNotification = async (task, dateTime) => {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Reminder',
          body: `Don't forget: ${task}`,
        },
        trigger: {
          seconds: Math.floor(dateTime / 1000), // Convert milliseconds to seconds
        },
      });
    } catch (error) {
      throw new Error('Failed to schedule the notification. Invalid value provided as date of trigger.');
    }
  };
  


  const handleDateChange = (event, selectedDate) => {
    if (event.type === 'set') {
      const currentDate = selectedDate || reminderDateTime;
      setReminderDateTime(currentDate); // Update the reminderDateTime state
      setShowDatePicker(false);
    } else {
      setShowDatePicker(false);
    }
  };
  const handleTimeChange = (event, selectedTime) => {
    if (event.type === 'set') {
      const currentTime = selectedTime || reminderDateTime;
      setReminderDateTime(currentTime); // Update the reminderDateTime state
      setShowTimePicker(false);
    } else {
      setShowTimePicker(false);
    }
  };

  const toggleCategoryDropDown = () => {
    setShowCategoryDropDown(!showCategoryDropDown);
  };

  const selectCategory = (category) => {
    setSelectedCategory(category);
    setShowCategoryDropDown(false);
  };

  const toggleImportance = () => {
    setIsImportant((prev) => !prev);
  };

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={handleAddTodo}>
          <Text>{todoToEdit ? 'Save To-Do' : 'Add'}</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation, handleAddTodo, todoToEdit]);

  useEffect(() => {
    if (todoToEdit) {
      setTodo(todoToEdit.todo);
      setSelectedCategory(todoToEdit.selectedCategory);
      setIsImportant(todoToEdit.isImportant);
      setReminderDateTime(
        todoToEdit.reminderDateTime ? new Date(todoToEdit.reminderDateTime) : new Date()
      );
    }
  }, [todoToEdit]);


  return (
    <View style={styles.container}>
      <View style={styles.categoryDropDown}>
        <TouchableOpacity
          style={[
            styles.categoryButton,
            {
              backgroundColor: selectedCategory === 'No Category' ? '#D3D3D3' : categoryColors[selectedCategory],
            },
          ]}
          onPress={toggleCategoryDropDown}
        >
          <Text style={styles.categoryButtonText}>
            {selectedCategory === 'No Category' ? 'No Category' : selectedCategory}
          </Text>
          <FontAwesomeIcon icon={showCategoryDropDown ? faCaretUp : faCaretDown} size={20} color="#4A2D20" />
        </TouchableOpacity>
        {showCategoryDropDown && (
          <View style={styles.categoryListContainer}>
            <TouchableOpacity style={styles.categoryItem} onPress={() => selectCategory('Shopping')}>
              <FontAwesomeIcon icon={faList} size={20} color="yellow" />
              <Text style={styles.categoryItemText}>Shopping</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.categoryItem} onPress={() => selectCategory('Work')}>
              <FontAwesomeIcon icon={faList} size={20} color="red" />
              <Text style={styles.categoryItemText}>Work</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.categoryItem} onPress={() => selectCategory('Personal')}>
              <FontAwesomeIcon icon={faList} size={20} color="#1aa3ff" />
              <Text style={styles.categoryItemText}>Personal</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.categoryItem} onPress={() => selectCategory('Entertainment')}>
              <FontAwesomeIcon icon={faList} size={20} color="pink" />
              <Text style={styles.categoryItemText}>Entertainment</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.categoryItem} onPress={() => selectCategory('No Category')}>
              <FontAwesomeIcon icon={faList} size={20} color="white" />
              <Text style={styles.categoryItemText}>No Category</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Write To-Do Task</Text>
        <TextInput
          style={styles.input}
          placeholder="Type to do here"
          placeholderTextColor="#4A2D20"
          value={todo}
          onChangeText={setTodo}
        />
      </View>
      <TouchableOpacity style={styles.reminderButton} onPress={() => setShowReminderDialog(true)}>
        <FontAwesomeIcon icon={faBell} size={20} color="white" />
        <Text style={styles.reminderButtonText}>ADD REMINDER!</Text>
      </TouchableOpacity>
      {showReminderDialog && (
        <View style={styles.dialogBox}>
          <TouchableOpacity style={styles.setDateButton} onPress={() => setShowDatePicker(true)}>
            <Text style={styles.setDateText}>Set Date</Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker value={reminderDateTime} mode="date" display="default"  onChange={handleDateChange} />
          )}
          <TouchableOpacity style={styles.setTimeButton} onPress={() => setShowTimePicker(true)}>
            <Text style={styles.setTimeText}>Set Time</Text>
          </TouchableOpacity>
          {showTimePicker && (
            <DateTimePicker value={reminderDateTime} mode="time" display="default" onChange={handleTimeChange} />
          )}
          <View style={styles.buttonsContainer}>
            <TouchableOpacity style={styles.cancelButton} onPress={() => setShowReminderDialog(false)}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.setReminderButton} onPress={handleSetReminder}>
              <Text style={styles.setReminderButtonText}>Set Reminder</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      <View style={styles.importanceContainer}>
        <Text style={styles.importantText}>
          <Text style={[styles.exclamationText, isImportant && styles.exclamationTextRed]}>
            !
          </Text>{' '}
          Mark as important
        </Text>
        <Switch
          trackColor={{ false: "#767577", true: "#81b0ff" }}
          thumbColor={isImportant ? "#f4f3f4" : "#f4f3f4"}
          ios_backgroundColor="#3e3e3e"
          onValueChange={toggleImportance}
          value={isImportant}
        />
      </View>
      <TouchableOpacity style={styles.addToDoButton} onPress={handleAddTodo}>
        <Text style={styles.addToDoButtonText}>{todoToEdit ? 'Save To-Do' : 'Add to-do'}</Text>
      </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e6c6af',
    paddingHorizontal: 20,
    paddingVertical: 40,
    elevation: 5, // Box shadow
  },
  categoryDropDown: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  categoryButton: {
    backgroundColor: '#8B4513',
    borderRadius: 5,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryButtonText: {
    color: '#4A2D20',
    marginRight: 5,
  },
  categoryListContainer: {
    backgroundColor: '#8B4513',
    borderRadius: 5,
    padding: 10,
    position: 'absolute',
    top: 40,
    zIndex: 1,
    elevation: 5,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  categoryItemText: {
    color: '#4A2D20',
    marginLeft: 5,
  },
  inputContainer: {
    backgroundColor: '#993300',
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 15,
    marginBottom: 20,
    width: '100%',
    elevation: 5, // Box shadow
  },
  label: {
    fontSize: 20,
    color: 'white',
  },
  input: {
    fontSize: 16,
    color: 'white',
    borderWidth: 1,
    borderColor: '#4A2D20',
    borderRadius: 5,
    marginTop: 10,
    paddingHorizontal: 10,
  },
  reminderButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#993300',
    borderRadius: 10,
    padding: 10,
    width: '100%',
    elevation: 5, // Box shadow
  },
  reminderButtonText: {
    color: 'navy',
    marginLeft: 20,
  },
  dialogBox: {
    backgroundColor: '#3e2723',
    borderRadius: 15,
    padding: 20,
    width: '80%', // Adjust the width as needed
    elevation: 5, // Box shadow
  },
  setDateButton: {
    marginBottom: 10,
    backgroundColor: '#a1887f',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  setDateText: {
    color: '#FFDAB9',
    fontSize: 18,
    fontWeight: 'bold',
  },
  setTimeButton: {
    marginBottom: 10,
    backgroundColor: '#a1887f',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  setTimeText: {
    color: '#FFDAB9',
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  cancelButton: {
    backgroundColor: '#795548',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginRight: 10,
  },
  cancelButtonText: {
    color: 'white',
    textAlign: 'center',
  },
  setReminderButton: {
    backgroundColor: '#8B4513',
    padding: 10,
    borderRadius: 5,
    flex: 1,
  },
  setReminderButtonText: {
    color: 'white',
    textAlign: 'center',
  },
  addToDoButton: {
    backgroundColor: '#662200',
    padding: 15,
    borderRadius: 5,
    width: '80%',
    alignItems: 'center',
    marginTop: 20,
  },
  addToDoButtonText: {
    color: 'white',
    fontSize: 18,
  },
  categoryDropDown: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    alignSelf: 'flex-start', // Aligns the dropdown to the left
  },
  categoryButton: {
    backgroundColor: '#8B4513',
    borderRadius: 5,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  importanceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
    width: "100%",
    backgroundColor: '#993300',
    paddingLeft: 10,
    borderRadius: 10,
    elevation: 5,
  },
  importantText: {
    fontSize: 18,
    color: '#fff', // Default color for the text
  },
  exclamationText: {
    fontWeight: 'bold',
  },
  exclamationTextRed: {
    color: 'red',
  },
});

export default AddTodoScreen;


 
