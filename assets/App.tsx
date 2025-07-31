import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// Import all screens
import SplashScreen from './SplashScreen';
import Login from './Login';
import OtpConfirmation from './OtpConfarmation';
import Register from './Register';
import SelectedTestsScreen from './Step1_Booking.tsx';
import MemberDetailsScreen from './step2_Booking';
import CombinedScreen from './step3_Booking';
import PaymentScreen from './step4_Booking';
import OnlinePaymentScreen from './online';
// import CategoryTestsScreen from './Component/CategoryTestScreen.tsx';
import CategoryDetailScreen from './CategoryDetails';
import { Category } from './packageData';
import HomeTabs from './HomeTabs';
import PathologyReportScreen from './Report';
import NotificationScreen from './Notification';



export type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
  Register: undefined;
  OtpConfirmation: { email: string };
  HomeScreen: undefined;
  NotificationScreen:undefined;
  SettingsScreen: undefined; 
  // CategoryTestsScreen: { category: string };
  SelectedTestsScreen: { 
    selectedPackages: string[];
    totalPrice: number;
    saveMoney: number;
  };
  MemberDetailsScreen: {
    selectedPackages: string[];
    totalPrice: number;
    saveMoney: number;

  };
    CombinedScreen: {
    selectedPackages: string[];
    totalPrice: number;
    bookingId: number;
    saveMoney: number;
  };

  PaymentScreen: {
    selectedPackages: string[];
    totalPrice: number;
    saveMoney: number;
  };
  OnlinePaymentScreen: undefined;
  CategoryDetailScreen: { category: Category };
  PathologyReports: undefined; // Add this route
};

type HomeTabParamList = {
  Home: undefined;
  Profile: undefined;
  Reports: undefined; // Optional: Add to tabs if you want reports in bottom nav
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<HomeTabParamList>();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash">
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
          name="Register"
          component={Register}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="OtpConfirmation"
          component={OtpConfirmation}
          options={{ title: 'OTP Confirmation' }}
        />
        {/* <Stack.Screen
          name="CategoryTestsScreen"
          component={CategoryTestsScreen}
          options={{ headerShown: false }}
        /> */}
        <Stack.Screen
          name="SelectedTestsScreen"
          component={SelectedTestsScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="MemberDetailsScreen"
          component={MemberDetailsScreen}
          options={{ headerShown: false }}
        />
         <Stack.Screen
          name="NotificationScreen"
          component={NotificationScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="CombinedScreen"
          component={CombinedScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="PaymentScreen"
          component={PaymentScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="OnlinePaymentScreen"
          component={OnlinePaymentScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="CategoryDetailScreen"
          component={CategoryDetailScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="PathologyReports" 
          component={PathologyReportScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="HomeScreen" 
          component={HomeTabs} 
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;