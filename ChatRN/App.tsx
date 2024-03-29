import React from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from './pages/Home';
import Chat from './pages/Chat';
import { SWRConfig } from 'swr';
import Register from './pages/Register';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Search from './pages/Search';
import Notification from './pages/Notification';
import { TContactsData } from './lib/interface/response/IContactsResponse';

export type RootNativeStackParamList = {
  Login: undefined;
  Register: undefined;
  Home: undefined;
  Profile: undefined;
  Search: undefined;
  Notification: undefined;
  'Chat/Username': Omit<TContactsData, 'latest_message'>;
};

const Stack = createNativeStackNavigator<RootNativeStackParamList>();

const App = () => {
  return (
    <SWRConfig>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen
            name="Register"
            options={{
              title: 'Register',
              headerShown: false,
            }}
            component={Register}
          />
          <Stack.Screen
            name="Login"
            options={{
              title: 'Login',
              headerShown: false,
            }}
            component={Login}
          />
          <Stack.Screen
            name="Home"
            options={{
              title: 'Chat App',
              headerShown: false,
            }}
            component={Home}
          />
          <Stack.Screen
            name="Profile"
            options={{
              title: 'Profile',
              headerShown: false,
            }}
            component={Profile}
          />
          <Stack.Screen
            name="Search"
            options={{
              title: 'Search Friend',
              headerShown: false,
            }}
            component={Search}
          />
          <Stack.Screen
            name="Notification"
            options={{
              title: 'Notification',
              headerShown: false,
            }}
            component={Notification}
          />
          <Stack.Screen
            name="Chat/Username"
            options={{
              title: 'Chat App | Username',
              headerShown: false,
            }}
            component={Chat}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SWRConfig>
  );
};

export default App;
