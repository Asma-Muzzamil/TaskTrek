import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TouchableWithoutFeedback, ScrollView, Checkbox } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import { faAngleDown, faAngleUp, faClipboard, faListAlt, faPlus, faCircle, faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { useNavigation } from '@react-navigation/native';
import AddTodoScreen from './AddTodoScreen';
import * as Notifications from 'expo-notifications';
import { format } from 'date-fns';
import { getAuth } from 'firebase/auth';
const auth = getAuth(); 

const categoryColors = {
  Shopping: 'yellow',
  Work: '#FF5733',
  Personal: '#1aa3ff',
  Entertainment: 'pink',
  'No Category': 'white',
};

const Todo = ({ route }) => {
  const navigation = useNavigation();
  const [showTodos, setShowTodos] = useState(false);
  const [showAddTodoScreen, setShowAddTodoScreen] = useState(false);
  const [newTodo, setNewTodo] = useState('');
  const [todos, setTodos] = useState([]);
  const [addedToday, setAddedToday] = useState(false);
  const [completedTodos, setCompletedTodos] = useState([]); 2
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedTodoId, setSelectedTodoId] = useState(null);
  const [deleteForCompleted, setDeleteForCompleted] = useState(false);

  useEffect(() => {
    const getNotificationPermissions = async () => {
      const { status } = await Notifications.getPermissionsAsync();
      if (status !== 'granted') {
        const { status: newStatus } = await Notifications.requestPermissionsAsync();
        if (newStatus !== 'granted') {
          Alert.alert('Permission not granted for notifications');
        }
      }
    };

    getNotificationPermissions();
  }, []);

  useEffect(() => {
    if (route?.params?.updatedTodo !== undefined && todos.length > 0) {
      const updatedTodo = route.params.updatedTodo;
      const updatedTodos = todos.map((todo) =>
        todo.id === updatedTodo.id ? updatedTodo : todo
      );

      const isDifferent = JSON.stringify(updatedTodos) !== JSON.stringify(todos);

      if (isDifferent) {
        // Set the updated todos immediately without calling handleAddNewTodo
        setTodos(updatedTodos);
      }
    }
  }, [route?.params?.updatedTodo, todos]);

  useEffect(() => {
    // Avoid triggering handleAddNewTodo when the component mounts or when todos change
    if (route?.params?.updatedTodo !== undefined && todos.length > 0) {
      const updatedTodo = route.params.updatedTodo;
      const isEdited = todos.some((todo) => todo.id === updatedTodo.id);

      if (isEdited) {
        handleAddNewTodo({
          todo: updatedTodo.todo,
          selectedCategory: updatedTodo.selectedCategory,
          reminderDateTime: updatedTodo.reminderDateTime,
          isImportant: updatedTodo.isImportant,
          todoToEdit: updatedTodo,
        });
      }
    }
  }, [route?.params?.updatedTodo]);

  const handleAddNewTodo = useCallback(
    async ({ todo, selectedCategory, reminderDateTime, isImportant, todoToEdit }) => {
      console.log('handleAddNewTodo called with:', {
        todo,
        selectedCategory,
        reminderDateTime,
        isImportant,
        // todoToEdit,
      });
      try {
        let updatedTodos = [];
        if (todoToEdit) {
          updatedTodos = todos.map((existingTodo) =>
            existingTodo.id === todoToEdit.id
              ? {
                ...existingTodo,
                todo: todo !== '' ? todo : existingTodo.todo,
                // category: selectedCategory,
                selectedCategory,
                reminderDateTime,
                isImportant,
                completed: !existingTodo.completed // Preserve the completion status for edited todos
              }
              : existingTodo
          );
          console.log("edited one :" ,todoToEdit.completed)
          const editedTodoIndex = updatedTodos.findIndex((todo) => todo.id === todoToEdit.id);
          const editedTodo = updatedTodos[editedTodoIndex];
          console.log("Edited Todo for edited case:", editedTodo);

          if (editedTodo) {
            console.log("Reminder date and time for edited case:", reminderDateTime);
            if (reminderDateTime) {
              try {
                await scheduleNotification(todo, reminderDateTime);
                console.log('Notification scheduled successfully');
              } catch (error) {
                console.error('Error scheduling notification:', error);
              }
            } else {
              try {
                await cancelNotification(editedTodo);
                console.log('Notification canceled successfully');
              } catch (error) {
                console.error('Error canceling notification:', error);
              }
            }
          }
        } else {
          updatedTodos = [
            ...todos,
            {
              id: Math.random().toString(36).substr(2, 9),
              todo,
              // category: selectedCategory,
              selectedCategory,
              reminderDateTime,
              isImportant,
              completed: false,
            },
          ];
          setAddedToday(true);
          if (reminderDateTime) {
            try {
              await scheduleNotification(todo, reminderDateTime);
              console.log('Notification scheduled successfully');
            } catch (error) {
              console.error('Error scheduling notification:', error);
            }
          }
        }

        setTodos(updatedTodos);
      } catch (error) {
        console.error('Error while adding/updating todo:', error);
      }
    },
    [todos]
  );


  const scheduleNotification = async (task, dateTime) => {
    try {
      console.log('Scheduling notification for:', task);
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Reminder',
          body: `Don't forget: ${task}`,
        },
        trigger: {
          date: new Date(dateTime), // Ensure dateTime is a Date object
        },
      });
      console.log('Notification scheduled successfully');
    } catch (error) {
      console.error('Failed to schedule the notification:', error);
      throw new Error('Failed to schedule the notification. Invalid value provided as date of trigger.');
    }
  };

  const cancelNotification = async (task) => {
    try {
      await Notifications.cancelScheduledNotificationAsync(task.id);
    } catch (error) {
      console.error('Failed to cancel the notification:', error);
      throw new Error('Failed to cancel the notification.');
    }
  };

  const handleToggleTodos = () => {
    setShowTodos(!showTodos);
  };

  const handleAddTodoScreen = () => {
    navigation.navigate('AddTodo', { onAddTodo: handleAddNewTodo });
  };


  const handleCancelAddTodo = () => {
    setShowAddTodoScreen(false);
  };


  const getDateToday = () => {
    const today = new Date();
    return format(today, 'MM/dd/yy'); // Format today's date as MM/dd/yy
  };


  const handleToggleCompleted = (id) => {
    const todoToEdit = todos.find((todo) => todo.id === id);
    if (todoToEdit) {
      const updatedTodos = [...todos];
      updatedTodos.forEach((todo) => {
        if (todo.id === id) {
          console.log("UPDATED TODOS:", todo)
          todo.completed = !todoToEdit.completed;
        }
      });
      setTodos(updatedTodos);
    } else {
      const updatedTodos = todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      );
      setTodos(updatedTodos);
    }
  };

  
  console.log("after completed", todos)


  const handleDeleteConfirmed = () => {
    if (selectedTodoId !== null) {
      const updatedTodos = todos.filter((todo) => todo.id !== selectedTodoId);
      setTodos(updatedTodos);
      setShowDeleteModal(false);
      setSelectedTodoId(null);
    }
  };

  const handleDeleteCanceled = () => {
    setShowDeleteModal(false);
    setSelectedTodoId(null);
  };

  return (
    <TouchableWithoutFeedback onPress={() => setShowTodos(false)}>
      <View style={styles.container}>
        <View style={styles.spacer} />
        <TouchableOpacity onPress={handleToggleTodos} style={styles.header}>
          <Text style={styles.headerText}>All To-Dos</Text>
          <FontAwesomeIcon
            icon={showTodos ? faAngleUp : faAngleDown}
            size={20}
            color="black"
            style={styles.icon}
          />
        </TouchableOpacity>
        {showTodos && (
          <View style={styles.menuContainer}>
            {/* All Todos */}
            <View style={styles.menuItem}>
              <FontAwesomeIcon icon={faClipboard} size={20} color="black" />
              <Text style={styles.menuItemText}>All To-Dos</Text>
              <Text>{todos.length}</Text>
            </View>
            {/* Iterate through categoryColors for other categories */}
            {Object.keys(categoryColors).map(category => (
              <View
                key={category}
                style={styles.menuItem}
              >
                <FontAwesomeIcon icon={faListAlt} size={20} color={categoryColors[category]} />
                <Text style={styles.menuItemText}>{category}</Text>
                <Text>
                  {todos.filter(todo => todo.selectedCategory === category).length}
                </Text>
              </View>
            ))}
          </View>
        )}
        <TouchableOpacity onPress={handleAddTodoScreen} style={styles.addButton}>
          <FontAwesomeIcon icon={faPlus} size={30} color="#E1C78F" />
        </TouchableOpacity>
        {showAddTodoScreen && (
          <AddTodoScreen onAddTodo={handleAddNewTodo} onCancel={handleCancelAddTodo} />
        )}
        {todos.length === 0 && !showAddTodoScreen && (
          <View style={[styles.todosContainer]}>
            <Text style={styles.noTodosText}>Add something to the list here</Text>
          </View>
        )}

        <ScrollView>
          {todos.some((todo) => todo.completed) && (
            <View style={styles.completedTasks}>
              <Text style={styles.CompletedTask}>Completed Tasks</Text>
              {todos.map((todo) => (
                todo.completed && (
                  <TouchableOpacity key={todo.id} onLongPress={() => { setSelectedTodoId(todo.id); setDeleteForCompleted(todo.completed); setShowDeleteModal(true); }} >
                    <View style={{ marginTop: 10, marginBottom: 10 }}>
                      <Text style={styles.dateText}>{getDateToday()}</Text>
                      <View style={[styles.todoItem, { backgroundColor: categoryColors[todo.selectedCategory] }]}>
                        <BouncyCheckbox
                          isChecked={todo.completed}
                          onPress={() => handleToggleCompleted(todo.id)}
                          style={styles.checkbox}
                          fillColor="grey" // Change the fillColor to visually represent checked state
                        />
                        <View style={styles.todoText}>
                          {todo.isImportant && (
                            <Text style={{ fontWeight: 'bold', color: 'red' }}>!</Text>
                          )}
                          <Text style={styles.todoText}>
                            {console.log("in completetd:", todo.todo)}
                            {todo.todo}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                )
              ))}
            </View>
          )}
          {todos.some((todo) => !todo.completed) && (
            <View style={styles.onProgressTasks}>
              <Text style={styles.onProgress}>On Progress Tasks</Text>
              {todos.map((todo) => (
                !todo.completed && (
                  <TouchableOpacity
                    key={todo.id}
                    onLongPress={() => { setSelectedTodoId(todo.id); setDeleteForCompleted(todo.completed); setShowDeleteModal(true); }}
                    onPress={() => navigation.navigate('AddTodo', { todoToEdit: todo,  })}
                  >
                    {/* {console.log("inside edit:", todo ) } */}
                    <View style={{ marginTop: 10, marginBottom: 10 }}>
                      <Text style={styles.dateText}>{getDateToday()}</Text>
                      <View style={[styles.todoItem, { backgroundColor: categoryColors[todo.selectedCategory] }]}>
                        <BouncyCheckbox
                          isChecked={todo.completed}
                          onPress={() => handleToggleCompleted(todo.id)}
                          style={styles.checkbox}
                          fillColor="brown" // Change the fillColor to visually represent checked state
                        />
                        <View style={styles.todoText}>
                          {todo.isImportant && (
                            <Text style={{ fontWeight: 'bold', color: 'red' }}>!</Text>
                          )}
                          <Text style={styles.todoText}>
                            {console.log("in progress:", todo.todo)}
                            {todo.todo}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                )
              ))}
            </View>
          )}
        </ScrollView>
        {showDeleteModal && (
          <View style={styles.overlay}>
            <View style={styles.modal}>
              <Text style={styles.modalText}>
                {deleteForCompleted ? 'Do you want to delete this completed todo?' : 'Do you want to delete this in-progress todo?'}
              </Text>
              <View style={styles.buttonContainer}>
                <TouchableOpacity onPress={handleDeleteCanceled} style={styles.modalButton}>
                  <Text style={styles.buttonText}>No</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleDeleteConfirmed} style={styles.modalButton}>
                  <Text style={styles.buttonText}>Yes</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      </View>
    </TouchableWithoutFeedback >
  );
};
const styles = StyleSheet.create({
  // Todo screen styles
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#e6c6af',
  },
  spacer: {
    height: 50,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerText: {
    fontSize: 25,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  icon: {
    marginLeft: 7,
    marginTop: 5,
  },
  menuContainer: {
    backgroundColor: '#F5E9DC',
    borderRadius: 10,
    padding: 10,
    position: 'absolute',
    top: '15%',
    zIndex: 2,
    width: '90%',
    justifyContent: 'center',
    alignContent: 'center',
    left: '6%',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 5,
    padding: 5,
    width: '100%',
  },
  menuItemText: {
    marginLeft: 10,
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#8B4513',
    borderRadius: 50,
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  todosContainer: {
    marginTop: 20,
    alignItems: 'center',
    backgroundColor: '#8B4513',
    borderRadius: 10,
    height: '7%',
    zIndex: 0,
  },
  noTodosText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 10,
  },
  checkbox: {
    marginRight: 10,
  },
  todoItem: {
    flexDirection: 'row', // Display in a row
    alignItems: 'center', // Center align items
    padding: 10,
    marginBottom: 10,
    borderRadius: 10,
    width: '100%',
    backgroundColor: '#8B4513',
    height: 60,
    justifyContent: 'flex-start', // Align items from the start
  },
  todoText: {
    flexDirection: 'row', // Display in a row
    alignItems: 'center', // Center align items
    flex: 1, // Occupy remaining space
    paddingHorizontal: 4, // Add padding for better spacing
    fontWeight: 'bold',
  },
  exclamationText: {
    fontWeight: 'bold',
    fontSize: 20,
    marginRight: 5,
    color: 'red', // Change the color to red
  },
  todayTasks: {
    alignItems: 'left',
    marginTop: 20,
  },
  onProgress: {
    fontWeight: 'bold',
    fontSize: 20,
  },
  CompletedTask: {
    fontWeight: 'bold',
    fontSize: 20,
  },
  date: {
    marginTop: 5,
    fontSize: 16,
  },

  overlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: '#F5E9DC',
    padding: 20,
    borderRadius: 10,
    elevation: 5,
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: '#A67B51',
    padding: 10,
    borderRadius: 5,
    margin: 10,
    width: "45%"
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  buttonText: {
    fontSize: 16,
    textAlign: 'center',
  },


});

export default Todo;
