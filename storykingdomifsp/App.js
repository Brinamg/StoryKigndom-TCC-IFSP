import * as React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

// Import screens
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import HomeScreen from './screens/HomeScreen';
import ForYouScreen from './screens/ForYouScreen';
import SettingsScreen from './screens/SettingsScreen';
import AccountSettingsScreen from './screens/AccountSettingsScreen';
import EditProfileScreen from './screens/EditProfileScreen';
import ParentalControlScreen from './screens/ParentalControlScreen';
import BookDetailsScreen from './screens/BookDetailsScreen';
import ReadBookScreen from './screens/ReadBookScreen';
import WriteReviewScreen from './screens/WriteReviewScreen';
import ReviewScreen from './screens/ReviewScreen';

// Create navigators
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Main tab configuration
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = 'home-outline';
          } else if (route.name === 'Para você') {
            iconName = 'star-outline';
          } else if (route.name === 'Configurações') {
            iconName = 'settings-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'gray',  // Set active icon color to gray
        tabBarInactiveTintColor: 'gray', // Set inactive icon color to gray
        tabBarStyle: {
          backgroundColor: '#ffffff',
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Para você" component={ForYouScreen} />
      <Tab.Screen name="Configurações" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

// Main app configuration
export default function App() {
  return (
    <PaperProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Login"
          screenOptions={{
            headerStyle: {
              backgroundColor: '#52F2F1',
            },
            headerTintColor: 'gray',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        >
          <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
          <Stack.Screen name="MainTabs" component={MainTabs} options={{ headerShown: false }} />
          <Stack.Screen name="AccountSettings" component={AccountSettingsScreen} />
          <Stack.Screen name="EditProfile" component={EditProfileScreen} />
          <Stack.Screen name="ParentalControl" component={ParentalControlScreen} />
          <Stack.Screen name="BookDetails" component={BookDetailsScreen} />
          <Stack.Screen name="ReadBookScreen" component={ReadBookScreen} />
          <Stack.Screen name="WriteReviewScreen" component={WriteReviewScreen} />
          <Stack.Screen name="ReviewScreen" component={ReviewScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}
