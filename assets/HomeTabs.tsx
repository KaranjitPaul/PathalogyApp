import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { RouteProp } from '@react-navigation/native';
import { View, Text, StyleSheet } from 'react-native';

import HomeScreen from './Dashboard';
import UserProfileScreen from './Profile';
import PathologyReportScreen from './Report';
import AppointmentScreen from './Appointments';

type HomeTabParamList = {
  Home: undefined;
  Reports: undefined;
  Appointments: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<HomeTabParamList>();

function HomeTabs() {
  return (
    <Tab.Navigator
      screenOptions={({
        route,
      }: {
        route: RouteProp<HomeTabParamList, keyof HomeTabParamList>;
      }) => ({
        tabBarIcon: ({ color, size, focused }) => {
          let iconName: string;

          switch (route.name) {
            case 'Home':
              iconName = 'home';
              break;
            case 'Reports':
              iconName = 'description';
              break;
            case 'Appointments':
              iconName = 'event';
              break;
            case 'Profile':
              iconName = 'person';
              break;
            default:
              iconName = 'circle';
          }

          return (
            <View style={focused ? styles.activeIconContainer : null}>
              <MaterialIcons 
                name={iconName} 
                size={size} 
                color={focused ? '#4CAF50' : '#888'} 
              />
            </View>
          );
        },
        tabBarActiveTintColor: '#4CAF50',
        tabBarInactiveTintColor: '#888',
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabBarLabel,
        tabBarItemStyle: styles.tabBarItem,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Reports" component={PathologyReportScreen} />
      <Tab.Screen name="Appointments" component={AppointmentScreen} />
      <Tab.Screen name="Profile" component={UserProfileScreen} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    width:390,
    marginLeft:10,
    marginRight:1,
    height: 80,
    bottom: 30,
    left: '5%',
    right: '5%',
    borderRadius: 50,
    elevation: 15,
    shadowOpacity: 0.3,
    shadowRadius: 20,
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 10 },
    backgroundColor: '#ffffffff',
  },
  tabBarLabel: {
    padding:5,
    marginVertical: 1,
    fontSize: 12,
  },
  tabBarItem: {
    flex: 1,
    marginVertical:9,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeIconContainer: {
    backgroundColor: 'rgba(76, 175, 80, 0.2)',
    marginVertical:10,
    width: 60,
    height: 70,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
  },
});

export default HomeTabs;