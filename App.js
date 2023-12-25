import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import SplashScreen from './SplashScreen';
import Signup from './Signup';
import Login from './Login';
import HomeScreen from './HomeScreen';
import Todo from './Todo';
import AddTodoScreen from './AddTodoScreen';
import ProfileScreen from './ProfileScreen';
import CalendarScreen from './CalendarScreen'
const Stack = createStackNavigator();

export default function App() {

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Splash"
          component={SplashScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Login"
          component={Login}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Signup"
          component={Signup}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="HomeScreen"
          component={HomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="TodoScreen"
          component={Todo}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="AddTodo"
          component={AddTodoScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="CalendarScreen"
          component={CalendarScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ProfileScreen"
          component={ProfileScreen }
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>

  );
}

