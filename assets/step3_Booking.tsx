import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Platform,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from './App';

type Props = NativeStackScreenProps<RootStackParamList, 'CombinedScreen'>;

const slots = [
  ['6:00 AM-7:00 AM', '7:00 AM-8:00 AM'],
  ['8:00 AM-9:00 AM', '9:00 AM-10:00 AM'],
  ['10:00 AM-11:00 AM', '11:00 AM-12:00 PM'],
  ['12:00 PM-1:00 PM', '1:00 PM-2:00 PM'],
  ['2:00 PM-3:00 PM'],
];

const GREEN = '#27ae60';
const DARK_GREEN = '#219150';
const LIGHT_GREEN = '#d4f3df';

export default function CombinedScreen({route, navigation}: Props) {

  const { selectedPackages, totalPrice, saveMoney } = route.params;

  const generateNext7Days = () => {
    const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
    const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

    const nextDates = [];

    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);

      nextDates.push({
        day: daysOfWeek[date.getDay()],
        date: date.getDate(),
        month: months[date.getMonth()],
        fullDate: date, // if needed for display
      });
    }

    return nextDates;
  };


  // todayIdx should represent the index of "today" in your dates array
const todayIdx = 0; // assuming your static list starts from 4th index as "today"
const dates = generateNext7Days();

const generateDateFromIndex = (index: number): string => {
  const today = new Date();
  const offset = index - todayIdx;

  const targetDate = new Date();
  targetDate.setDate(today.getDate() + offset);

  const yyyy = targetDate.getFullYear();
  const mm = String(targetDate.getMonth() + 1).padStart(2, '0');
  const dd = String(targetDate.getDate()).padStart(2, '0');

  return `${yyyy}-${mm}-${dd}`; // e.g., "2025-07-31"
};


  const [selectedDateIdx, setSelectedDateIdx] = useState(todayIdx);
  const [selectedSlot, setSelectedSlot] = useState([-1, -1]);

  

  const handleContinue = async () => {
  if (!selectedDateIdx || selectedSlot[0] === -1) {
    Alert.alert('Select date and time');
    return;
  }

  const appointmentDate = generateDateFromIndex(selectedDateIdx); // function to map to real date
  const appointmentTime = slots[selectedSlot[0]][selectedSlot[1]];
  const address = "address-city-pincode"; // from your state
  const bookingId = route.params.bookingId;
  const getDateFromIndex = (index: number): string => {
    const today = new Date();
    const futureDate = new Date(today.setDate(today.getDate() + (index - todayIdx)));
    return futureDate.toISOString().split('T')[0]; // YYYY-MM-DD
  };

  try {
    const res = await fetch('http://192.168.29.52/pathalogy_api/update_booking.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        booking_id: bookingId,
        appointment_date: appointmentDate,
        appointment_time: appointmentTime,
        address: address,
      }),
    });

    const json = await res.json();

    if (json.success) {
      navigation.navigate('PaymentScreen', {
        selectedPackages,
        totalPrice,
        saveMoney
      });
    } else {
      Alert.alert('Error', json.message);
    }
  } catch (err) {
    console.error(err);
    Alert.alert('Network Error', 'Could not update booking.');
  }
};

    

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#2E7D32" barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Address & Slot</Text>
      </View>

      {/* Progress Indicator - unchanged from original */}
      <View style={styles.progressContainer}>
        <View style={styles.progressItem}>
          <View style={[styles.progressIcon, styles.activeProgress]}>
            <Icon name="assignment" size={20} color="#fff" />
          </View>
        </View>
        <View style={[styles.progressLine, styles.activeProgressLine]} />
        <View style={styles.progressItem}>
          <View style={[styles.progressIcon, styles.activeProgress]}>
            <Icon name="person" size={20} color="#fff" />
          </View>
        </View>
        <View style={[styles.progressLine, styles.activeProgressLine]} />
        <View style={styles.progressItem}>
          <View style={[styles.progressIcon, styles.activeProgress]}>
            <Icon name="date-range" size={20} color="#fff" />
          </View>
        </View>
        <View style={styles.progressLine} />
        <View style={styles.progressItem}>
          <View style={styles.progressIcon}>
            <Icon name="credit-card" size={20} color="#fff" />
          </View>
        </View>
      </View>

      {/* Main content wrapped with white container having borderRadius */}
      <ScrollView contentContainerStyle={styles.scrollContentContainer} keyboardShouldPersistTaps="handled">
        <View style={styles.whiteContentContainer}>
          <Text style={styles.sectionLabel}>Sample Collection Time</Text>

          {/* Dates horizontal scroll */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.datesBar}
            contentContainerStyle={styles.datesBarContent}
          >
            {dates.map((d, idx) => {
              const selected = idx === selectedDateIdx;
              return (
                <TouchableOpacity
                  key={idx}
                  style={[
                    styles.dateBox,
                    selected && styles.selectedDateBox,
                    selected && styles.dateBoxGlow,
                  ]}
                  onPress={() => setSelectedDateIdx(idx)}
                  activeOpacity={0.86}
                >
                  {idx === todayIdx && (
                    <View style={styles.todayBadge}>
                      <Text style={styles.todayBadgeText}>Today</Text>
                    </View>
                  )}
                  <Text style={[styles.dateDay, selected && styles.selectedDateText]}>
                    {d.day}
                  </Text>
                  <Text style={[styles.dateNum, selected && styles.selectedDateText]}>
                    {d.date}
                  </Text>
                  <Text style={[styles.dateMonth, selected && styles.selectedDateText]}>
                    {d.month}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          <View style={styles.sectionDivider} />

          {/* Time slots */}
          <View style={styles.slotSection}>
            {slots.map((row, rowIndex) => (
              <View style={styles.slotRow} key={rowIndex}>
                {row.map((slot, colIndex) => {
                  const checked = selectedSlot[0] === rowIndex && selectedSlot[1] === colIndex;
                  return (
                    <TouchableOpacity
                      key={colIndex}
                      style={[
                        styles.slotBox,
                        checked && styles.slotBoxActive,
                        checked && styles.slotBoxGlow,
                      ]}
                      onPress={() => setSelectedSlot([rowIndex, colIndex])}
                      activeOpacity={0.82}
                    >
                      <View style={[styles.radio, checked && styles.radioActive]}>
                        {checked && <View style={styles.radioDot} />}
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.slotText}>{slot}</Text>
                        <Text style={styles.freeText}>Free</Text>
                      </View>
                    </TouchableOpacity>
                  );
                })}
                {row.length === 1 && <View style={[styles.slotBox, { backgroundColor: 'transparent', borderWidth: 0 }]} />}
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Address Bar */}
      <View style={styles.addressBar}>
        <MaterialCommunityIcons name="map-marker-outline" size={19} color={GREEN} style={{ marginRight: 4 }} />
        <Text style={styles.homeTag}>Location</Text>
        <Text numberOfLines={1} style={styles.addressText}>
          69, renters colony, 57, Abhay Nagar, Agartala, ...
        </Text>
        <TouchableOpacity>
          <Text style={styles.changeBtn}>Change</Text>
        </TouchableOpacity>
      </View>

      {/* Next button */}
      <TouchableOpacity
        style={[
          styles.nextBtn,
          selectedSlot[0] === -1 && styles.nextBtnDisabled,
          selectedSlot[0] !== -1 && styles.nextBtnShadow,
        ]}
        disabled={selectedSlot[0] === -1}
        activeOpacity={0.78}
        onPress={handleContinue}
      >
        <Text style={[
          styles.nextBtnTxt,
          selectedSlot[0] === -1 && styles.nextBtnTxtDisabled,
        ]}>Next</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#2E7D32',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 40,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },

  // Progress bar (unchanged from your original)
  progressContainer: {
    backgroundColor: '#2E7D32',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    paddingHorizontal: 40,
  },
  progressItem: {
    alignItems: 'center',
  },
  progressIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#A5D6A7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeProgress: {
    backgroundColor: '#1B5E20',
  },
  activeProgressLine: {
    backgroundColor: '#1B5E20',
  },
  progressLine: {
    flex: 1,
    height: 2,
    backgroundColor: '#A5D6A7',
    marginHorizontal: 8,
  },

  // ScrollView content container (wrapper for white container)
  scrollContentContainer: {
    paddingHorizontal: 18,
    paddingTop: 10,
    paddingBottom: 20,
    flexGrow: 1,
    backgroundColor: 'transparent',
  },

  // White content container with borderRadius & shadow
  whiteContentContainer: {
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingVertical: 18,
    paddingHorizontal: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
      },
      android: {
        elevation: 7,
      },
    }),
  },

  sectionLabel: {
    fontWeight: '800',
    fontSize: 16,
    marginBottom: 10,
    color: '#232323',
  },

  datesBar: {
    marginBottom: 20,
  },
  datesBarContent: {
    paddingHorizontal: 8,
  },
  dateBox: {
    minWidth: 65,
    height: 100,
    alignItems: 'center',
    borderRadius: 9,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    marginHorizontal: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
    position: 'relative',
  },
  selectedDateBox: {
    backgroundColor: GREEN,
    borderColor: DARK_GREEN,
  },
  dateBoxGlow: {
    ...Platform.select({
      ios: {
        shadowColor: GREEN,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  dateDay: {
    color: GREEN,
    fontSize: 13,
    fontWeight: 'bold',
  },
  dateNum: {
    color: GREEN,
    fontSize: 19,
    fontWeight: 'bold',
  },
  dateMonth: {
    color: GREEN,
    fontSize: 13,
  },
  selectedDateText: {
    color: '#fff',
  },
  todayBadge: {
    position: 'absolute',
    top: 6,
    left: 8,
    backgroundColor: '#fff',
    borderRadius: 7,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderColor: GREEN,
    borderWidth: 1,
    elevation: 2,
  },
  todayBadgeText: {
    color: GREEN,
    fontWeight: '700',
    fontSize: 10,
  },

  sectionDivider: {
    borderBottomColor: '#e5eae7',
    borderBottomWidth: 1.2,
    marginVertical: 18,
  },

  slotSection: {
    paddingBottom: 16,
  },
  slotRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 12,
  },
  slotBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 7,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    backgroundColor: '#fff',
    paddingVertical: 8,
    paddingHorizontal: 7,
    gap: 10,
  },
  slotBoxActive: {
    borderColor: GREEN,
    backgroundColor: '#d4f3df',
  },
  slotBoxGlow: {
    ...Platform.select({
      ios: {
        shadowColor: GREEN,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  radio: {
    width: 21,
    height: 21,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: GREEN,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 4,
  },
  radioActive: {
    backgroundColor: GREEN,
    borderColor: GREEN,
  },
  radioDot: {
    width: 11,
    height: 11,
    borderRadius: 6,
    backgroundColor: '#fff',
  },
  slotText: {
    fontSize: 15,
    color: '#232323',
    fontWeight: '500',
  },
  freeText: {
    fontSize: 13,
    color: DARK_GREEN,
    fontStyle: 'italic',
    fontWeight: '600',
    marginTop: -2,
  },

  addressBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: LIGHT_GREEN,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: GREEN,
    marginHorizontal: 10,
    marginTop: 7,
    marginBottom: 15,
    padding: 10,
    gap: 8,
  },
  homeTag: {
    fontSize: 13,
    backgroundColor: '#e7f9f0',
    color: GREEN,
    fontWeight: 'bold',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 4,
    overflow: 'hidden',
    marginRight: 4,
  },
  addressText: {
    color: '#111',
    fontSize: 14,
    flex: 1,
  },
  changeBtn: {
    color: GREEN,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
    fontSize: 13,
  },

  nextBtn: {
    margin: 13,
    borderRadius: 8,
    backgroundColor: GREEN,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
  },
  nextBtnShadow: {
    ...Platform.select({
      ios: {
        shadowColor: GREEN,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.25,
        shadowRadius: 10,
      },
      android: {
        elevation: 15,
      },
    }),
  },
  nextBtnDisabled: {
    backgroundColor: LIGHT_GREEN,
  },
  nextBtnTxt: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  nextBtnTxtDisabled: {
    color: GREEN,
    opacity: 0.45,
  },
});
