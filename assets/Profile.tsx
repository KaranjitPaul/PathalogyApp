import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Animated,
  TouchableOpacity,
  Image,
  TextInput,
  Dimensions,
  Platform
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';

type Props = NativeStackScreenProps<RootStackParamList, 'Profile'>;

const { width } = Dimensions.get('window');

// Updated color palette for premium green theme
const PRIMARY_COLOR = '#0a4a07'; // Deep forest green
const PRIMARY_LIGHT = '#5cb85c'; // Fresh green
const PRIMARY_DARK = '#083306'; // Darker green
const WHITE = '#FFFFFF';
const LIGHT_GRAY = '#f8f9f8'; // Very light gray with green tint
const DARK_GRAY = '#2a2a2a';
const GRAY = '#6a7a6a'; // Gray with green tint
const LIGHT_TEXT = '#9aaf9a'; // Light greenish gray

const UserProfileScreen = ({ navigation }: Props) => {
  const [editMode, setEditMode] = useState(false);
  const [profileData, setProfileData] = useState({
    name: 'Rushabh Patel',
    email: 'ceo@wolfsoft.in',
    phone: '+91 99239 32993',
    address: '123 Medical Tower, Health Street',
    city: 'Mumbai',
    pincode: '400001',
    bloodGroup: 'A+',
    height: '5.9 feet',
    weight: '70 Kg',
    dob: '18/04/1992',
    gender: 'Male'
  });

  const scrollY = useRef(new Animated.Value(0)).current;
  const headerHeight = scrollY.interpolate({
    inputRange: [0, 140],
    outputRange: [280, 100],
    extrapolate: 'clamp',
  });

  const profileImageOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const profileNameFontSize = scrollY.interpolate({
    inputRange: [0, 140],
    outputRange: [24, 18],
    extrapolate: 'clamp',
  });

  const profileNameMarginTop = scrollY.interpolate({
    inputRange: [0, 140],
    outputRange: [15, 5],
    extrapolate: 'clamp',
  });

  const handleInputChange = (field: any, value: any) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const saveChanges = () => {
    setEditMode(false);
  };

  const userStats = [
    { label: 'Tests Taken', value: '24', icon: 'analytics' },
    { label: 'Reports', value: '18', icon: 'document-text' },
    { label: 'Appointments', value: '5', icon: 'calendar' },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <Animated.View style={[styles.header, { height: headerHeight }]}>
        <View style={styles.headerBackground}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color={WHITE} />
          </TouchableOpacity>
          
          <Animated.Image
            source={{ uri: 'https://randomuser.me/api/portraits/men/32.jpg' }}
            style={[styles.profileImage, { opacity: profileImageOpacity }]}
          />
          <Animated.Text style={[styles.profileName, { 
            fontSize: profileNameFontSize,
            marginTop: profileNameMarginTop 
          }]}>
            {profileData.name}
          </Animated.Text>
          <Animated.Text style={styles.profileSubtitle}>
            Patient ID: MED20230045
          </Animated.Text>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => editMode ? saveChanges() : setEditMode(true)}
          >
            <Ionicons 
              name={editMode ? 'checkmark-sharp' : 'create-outline'} 
              size={20} 
              color={WHITE} 
            />
          </TouchableOpacity>
        </View>
      </Animated.View>

      <ScrollView
        style={styles.content}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
      >
        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          {userStats.map((stat, index) => (
            <View key={index} style={styles.statCard}>
              <View style={styles.statIcon}>
                <Ionicons name={stat.icon} size={20} color={PRIMARY_COLOR} />
              </View>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        <View style={styles.detailsContainer}>
          <DetailsSection
            title="Basic Information"
            icon="information-circle-outline"
            fields={[
              { icon: 'person-outline', label: 'Name', value: profileData.name, key: 'name' },
              { icon: 'calendar-outline', label: 'Date of Birth', value: profileData.dob, key: 'dob' },
              { icon: 'transgender-outline', label: 'Gender', value: profileData.gender, key: 'gender' },
              { icon: 'water-outline', label: 'Blood Group', value: profileData.bloodGroup, key: 'bloodGroup' },
              { icon: 'accessibility-outline', label: 'Height', value: profileData.height, key: 'height' },
              { icon: 'barbell-outline', label: 'Weight', value: profileData.weight, key: 'weight' },
            ]}
            editable={editMode}
            onChange={handleInputChange}
          />
          <DetailsSection
            title="Contact Information"
            icon="call-outline"
            fields={[
              { icon: 'mail-outline', label: 'Email', value: profileData.email, key: 'email' },
              { icon: 'call-outline', label: 'Phone', value: profileData.phone, key: 'phone' },
              { icon: 'location-outline', label: 'City', value: profileData.city, key: 'city' },
              { icon: 'home-outline', label: 'Address', value: profileData.address, key: 'address' },
              { icon: 'navigate-outline', label: 'Pincode', value: profileData.pincode, key: 'pincode' },
            ]}
            editable={editMode}
            onChange={handleInputChange}
          />
        </View>

        {/* Options Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="settings-outline" size={20} color={PRIMARY_COLOR} style={styles.sectionIcon} />
            <Text style={styles.sectionTitle}>Account Settings</Text>
          </View>
          <View style={styles.sectionContent}>
            <ProfileField 
              icon="lock-closed-outline" 
              title="Change Password" 
              value="" 
              editable={false} 
              onChange={() => {}} 
            />
            <ProfileField 
              icon="notifications-outline" 
              title="Notification Settings" 
              value="" 
              editable={false} 
              onChange={() => {}} 
            />
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="help-circle-outline" size={20} color={PRIMARY_COLOR} style={styles.sectionIcon} />
            <Text style={styles.sectionTitle}>Support</Text>
          </View>
          <View style={styles.sectionContent}>
            <ProfileField 
              icon="help-buoy-outline" 
              title="Help & Support" 
              value="" 
              editable={false} 
              onChange={() => {}} 
            />
            <ProfileField 
              icon="information-circle-outline" 
              title="About App" 
              value="" 
              editable={false} 
              onChange={() => {}} 
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const DetailsSection = ({ title, icon, fields, editable, onChange }) => (
  <View style={styles.section}>
    <View style={styles.sectionHeader}>
      <Ionicons name={icon} size={20} color={PRIMARY_COLOR} style={styles.sectionIcon} />
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
    <View style={styles.sectionContent}>
      {fields.map((f: { key: React.Key | null | undefined; icon: unknown; label: unknown; value: unknown; }) => (
        <ProfileField
          key={f.key}
          icon={f.icon}
          title={f.label}
          value={f.value}
          editable={editable}
          onChange={(val: any) => onChange(f.key, val)}
        />
      ))}
    </View>
  </View>
);

const ProfileField = ({ icon, title, value, editable, onChange }) => (
  <View style={styles.fieldRow}>
    <View style={styles.fieldIconContainer}>
      <Ionicons name={icon} size={18} color={PRIMARY_COLOR} />
    </View>
    <View style={styles.fieldContent}>
      <Text style={styles.fieldLabel}>{title}</Text>
      {editable ? (
        <TextInput
          style={styles.fieldInput}
          value={value}
          onChangeText={onChange}
          placeholder={'Enter ' + title}
          placeholderTextColor={LIGHT_TEXT}
        />
      ) : value ? (
        <Text style={styles.fieldValue} numberOfLines={1} ellipsizeMode="tail">{value}</Text>
      ) : (
        <TouchableOpacity style={styles.fieldAction}>
          <Text style={styles.fieldActionText}>Tap to change</Text>
          <Ionicons name="chevron-forward" size={16} color={GRAY} />
        </TouchableOpacity>
      )}
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: LIGHT_GRAY
  },
  header: {
    backgroundColor: PRIMARY_DARK,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    overflow: 'hidden',
    shadowColor: PRIMARY_DARK,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 15,
    zIndex: 1,
  },
  headerBackground: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: Platform.OS === 'ios' ? 50 : 30,
    backgroundColor: PRIMARY_COLOR,
  },
  backButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 30,
    left: 20,
    zIndex: 2,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: 'rgba(255,255,255,0.3)',
    marginBottom: 10,
    shadowColor: PRIMARY_DARK,
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
  },
  profileName: {
    fontWeight: '700',
    color: WHITE,
    letterSpacing: 0.5,
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  profileSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.85)',
    fontWeight: '400',
    marginTop: 5,
  },
  editButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 40,
    right: 25,
    backgroundColor: 'rgba(255,255,255,0.2)',
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
  },
  content: {
    flex: 1,
    marginTop: 20,
  },
  detailsContainer: {
    paddingHorizontal: 15,
    paddingTop: 5,
  },
  section: {
    backgroundColor: WHITE,
    borderRadius: 14,
    padding: 20,
    marginVertical: 10,
    marginHorizontal: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
    paddingBottom: 12,
  },
  sectionIcon: {
    marginRight: 10,
  },
  sectionTitle: {
    fontSize: 16,
    color: PRIMARY_DARK,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  sectionContent: { },
  fieldRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 12,
  },
  fieldIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(12, 84, 10, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  fieldContent: {
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    paddingBottom: 12,
  },
  fieldLabel: {
    color: GRAY,
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 2,
    letterSpacing: 0.3,
  },
  fieldValue: {
    fontSize: 15,
    color: DARK_GRAY,
    fontWeight: '500',
  },
  fieldInput: {
    fontSize: 15,
    color: PRIMARY_DARK,
    fontWeight: '500',
    backgroundColor: 'rgba(12, 84, 10, 0.05)',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: 'rgba(12, 84, 10, 0.2)',
    marginTop: 5,
  },
  fieldAction: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 5,
  },
  fieldActionText: {
    fontSize: 15,
    color: GRAY,
    fontWeight: '500',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: WHITE,
    marginBottom: 10,
    borderRadius: 14,
    marginHorizontal: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
  },
  statCard: {
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
  },
  statIcon: {
    backgroundColor: 'rgba(92, 184, 92, 0.1)',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: PRIMARY_COLOR,
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: GRAY,
    textAlign: 'center',
  },
});

export default UserProfileScreen;