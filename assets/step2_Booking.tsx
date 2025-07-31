import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
  Animated,
  TextInput,
  ScrollView,
  Platform,
  Easing,
  Modal,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from './App';

type Props = NativeStackScreenProps<RootStackParamList, 'MemberDetailsScreen'>;

const MemberDetailsScreen = ({ navigation, route }: Props) => {
  const { selectedPackages, totalPrice, saveMoney } = route.params;  const [slideAnim] = useState(new Animated.Value(0));
  const [fadeAnim] = useState(new Animated.Value(1));
  const [headerHeight] = useState(new Animated.Value(120));
  const [formData, setFormData] = useState({
    fullName: '',
    gender: '',
    dob: '',
    relation: '',
    mobile: '',
    email: '',
  });
  const [showGenderOptions, setShowGenderOptions] = useState(false);
  const [showRelationOptions, setShowRelationOptions] = useState(false);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 1,
        duration: 600,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 400,
        delay: 200,
        useNativeDriver: true,
      }),
      Animated.timing(headerHeight, {
        toValue: 90,
        duration: 500,
        useNativeDriver: false,
      })
    ]).start();
  }, []);

  const handleChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    });
    if (name === 'gender') setShowGenderOptions(false);
    if (name === 'relation') setShowRelationOptions(false);
  };

  const handleSubmit = async () => {
  const bookingData = {
    fullName: formData.fullName,
    gender: formData.gender,
    dob: formData.dob,
    relation: formData.relation,
    mobile: formData.mobile,
    email: formData.email,
    selectedPackages: selectedPackages, // array of IDs
    totalPrice: totalPrice,
  };

  try {
    const response = await fetch('http://192.168.29.52/pathalogy_api/save_booking.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bookingData),
    });

    const result = await response.json();

    if (result.success) {
      // Navigate to step 3 and pass booking_id
      navigation.navigate('CombinedScreen', {
        selectedPackages,
        totalPrice,
        saveMoney,
        bookingId: result.booking_id, // needed for step 3 update
      });
    } else {
      Alert.alert('Error', result.message);
    }
  } catch (error) {
    console.error('Booking Error:', error);
    Alert.alert('Error', 'Something went wrong. Try again.');
  }
};


  const slideUp = {
    transform: [
      {
        translateY: slideAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [600, 0],
        }),
      },
    ],
  };

  const fadeOut = {
    opacity: fadeAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
    }),
    height: fadeAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 80],
    }),
  };

  const headerStyle = {
    height: headerHeight,
  };

  const GenderSelection = () => {
    const genders = [
      { label: 'Male', icon: 'male' },
      { label: 'Female', icon: 'female' },
      { label: 'Other', icon: 'transgender' },
      { label: 'Prefer not to say', icon: 'visibility-off' }
    ];

    return (
      <>
        <TouchableOpacity 
          style={styles.selectionTrigger}
          onPress={() => setShowGenderOptions(true)}
        >
          <Text style={styles.selectedOptionText}>
            {formData.gender || 'Select Gender'}
          </Text>
          <Icon name="arrow-drop-down" size={24} color="#4a5568" />
        </TouchableOpacity>

        <Modal
          visible={showGenderOptions}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowGenderOptions(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.optionsModal}>
              <Text style={styles.modalTitle}>Select Gender</Text>
              {genders.map((gender) => (
                <TouchableOpacity
                  key={gender.label}
                  style={styles.modalOption}
                  onPress={() => handleChange('gender', gender.label)}
                >
                  <Icon 
                    name={gender.icon} 
                    size={24} 
                    color={formData.gender === gender.label ? '#2b6e4a' : '#718096'} 
                  />
                  <Text style={[
                    styles.modalOptionText,
                    formData.gender === gender.label && styles.modalOptionTextSelected
                  ]}>
                    {gender.label}
                  </Text>
                  {formData.gender === gender.label && (
                    <Icon name="check" size={20} color="#2b6e4a" style={styles.checkIcon} />
                  )}
                </TouchableOpacity>
              ))}
              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={() => setShowGenderOptions(false)}
              >
                <Text style={styles.modalCloseButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </>
    );
  };

  const RelationSelection = () => {
    const relations = [
      { label: 'Self', icon: 'person' },
      { label: 'Spouse', icon: 'favorite' },
      { label: 'Mother', icon: 'woman' },
      { label: 'Father', icon: 'man' },
      { label: 'Child', icon: 'child-care' },
      { label: 'Other', icon: 'group' }
    ];

    return (
      <>
        <TouchableOpacity 
          style={styles.selectionTrigger}
          onPress={() => setShowRelationOptions(true)}
        >
          <Text style={styles.selectedOptionText}>
            {formData.relation || 'Select Relation'}
          </Text>
          <Icon name="arrow-drop-down" size={24} color="#4a5568" />
        </TouchableOpacity>

        <Modal
          visible={showRelationOptions}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowRelationOptions(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.optionsModal}>
              <Text style={styles.modalTitle}>Select Relation</Text>
              {relations.map((relation) => (
                <TouchableOpacity
                  key={relation.label}
                  style={styles.modalOption}
                  onPress={() => handleChange('relation', relation.label)}
                >
                  <Icon 
                    name={relation.icon} 
                    size={24} 
                    color={formData.relation === relation.label ? '#2b6e4a' : '#718096'} 
                  />
                  <Text style={[
                    styles.modalOptionText,
                    formData.relation === relation.label && styles.modalOptionTextSelected
                  ]}>
                    {relation.label}
                  </Text>
                  {formData.relation === relation.label && (
                    <Icon name="check" size={20} color="#2b6e4a" style={styles.checkIcon} />
                  )}
                </TouchableOpacity>
              ))}
              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={() => setShowRelationOptions(false)}
              >
                <Text style={styles.modalCloseButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#2b6e4a" barStyle="light-content" />
      
      {/* Header */}
      <Animated.View style={[styles.header, headerStyle]}>
        <View style={[StyleSheet.absoluteFill, styles.headerBackground]} />
        <TouchableOpacity style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Member Details</Text>
        <View style={styles.headerRight} />
      </Animated.View>

      {/* Progress Indicator */}
      <Animated.View style={[styles.progressContainer, fadeOut]}>
        <View style={[StyleSheet.absoluteFill, styles.progressBackground]} />
        <View style={styles.progressContent}>
          {['Tests', 'Details', 'Date', 'Payment'].map((step, index) => (
            <React.Fragment key={step}>
              <View style={styles.progressItem}>
                <View style={[
                  styles.progressIcon,
                  index < 1 ? styles.completedProgress : 
                  index === 1 ? styles.activeProgress : null
                ]}>
                  <Icon 
                    name={
                      index === 0 ? 'assignment' :
                      index === 1 ? 'person' :
                      index === 2 ? 'date-range' : 'credit-card'
                    } 
                    size={18} 
                    color="#fff" 
                  />
                </View>
                <Text style={[
                  styles.progressText,
                  index === 1 && styles.activeText
                ]}>
                  {step}
                </Text>
              </View>
              {index < 3 && <View style={styles.progressLine} />}
            </React.Fragment>
          ))}
        </View>
      </Animated.View>

      {/* Form Container */}
      <Animated.View style={[styles.formContainer, slideUp]}>
        <ScrollView 
          contentContainerStyle={styles.formContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.formHeader}>
            <Text style={styles.formTitle}>Member Information</Text>
            <View style={styles.stepIndicator}>
              <Text style={styles.stepText}>Step 2 of 4</Text>
            </View>
          </View>
          
          {/* Full Name Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Full Legal Name</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="John Doe"
                placeholderTextColor="#a0aec0"
                value={formData.fullName}
                onChangeText={(text) => handleChange('fullName', text)}
              />
              <Icon name="person" size={20} color="#a0aec0" style={styles.inputIcon} />
            </View>
          </View>
          
          {/* Gender Selection */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Gender</Text>
            <GenderSelection />
          </View>
          
          {/* Date of Birth Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Date of Birth</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="DD/MM/YYYY"
                placeholderTextColor="#a0aec0"
                value={formData.dob}
                onChangeText={(text) => handleChange('dob', text)}
                keyboardType="numeric"
              />
              <Icon name="event" size={20} color="#a0aec0" style={styles.inputIcon} />
            </View>
          </View>
          
          {/* Relation Selection */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Relation</Text>
            <RelationSelection />
          </View> 
          {/* Age Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Enter Your Age</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="Age"
                placeholderTextColor="#a0aec0"
                keyboardType="phone-pad"
                value={formData.mobile}
                onChangeText={(text) => handleChange('Age', text)}
              />
              <Icon name="account-child" size={20} color="#a0aec0" style={styles.inputIcon} />
            </View>
          </View>

          
          {/* Mobile Number Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Mobile Number (Optional)</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="+91"
                placeholderTextColor="#a0aec0"
                keyboardType="phone-pad"
                value={formData.mobile}
                onChangeText={(text) => handleChange('mobile', text)}
              />
              <Icon name="phone" size={20} color="#a0aec0" style={styles.inputIcon} />
            </View>
          </View>
          
          {/* Email Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email Address (Optional)</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="your@email.com"
                placeholderTextColor="#a0aec0"
                keyboardType="email-address"
                value={formData.email}
                onChangeText={(text) => handleChange('email', text)}
              />
              <Icon name="email" size={20} color="#a0aec0" style={styles.inputIcon} />
            </View>
          </View>
          
          {/* Information Note */}
          <View style={styles.noteContainer}>
            <Icon name="info" size={16} color="#4a5568" />
            <Text style={styles.note}>
              Stay informed, stay healthy! Provide your email address & mobile number to receive medical reports, health notifications, and exclusive offers.
            </Text>
          </View>
          
          {/* Submit Button */}
          <TouchableOpacity 
            style={styles.submitButton} 
            onPress={handleSubmit}
            activeOpacity={0.9}
          >
            <View style={styles.buttonBackground}>
              <Text style={styles.submitButtonText}>Continue to Booking</Text>
              <Icon name="arrow-forward" size={20} color="#fff" />
            </View>
          </TouchableOpacity>
        </ScrollView>
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7fafc',
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'android' ? 16 : 0,
    justifyContent: 'space-between',
    overflow: 'hidden',
  },
  headerBackground: {
    backgroundColor: '#2b6e4a',
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  headerRight: {
    width: 24,
  },
  progressContainer: {
    width: '100%',
    overflow: 'hidden',
  },
  progressBackground: {
    backgroundColor: '#3a8a5f',
  },
  progressContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  progressItem: {
    alignItems: 'center',
    width: 70,
  },
  progressIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#5a9a75',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  completedProgress: {
    backgroundColor: '#2b6e4a',
    borderWidth: 2,
    borderColor: '#fff',
  },
  activeProgress: {
    backgroundColor: '#2b6e4a',
    borderWidth: 2,
    borderColor: '#fff',
  },
  progressLine: {
    flex: 1,
    height: 2,
    backgroundColor: '#5a9a75',
    marginHorizontal: 8,
  },
  progressText: {
    color: '#c0d8c8',
    fontSize: 12,
    textAlign: 'center',
    fontWeight: '500',
  },
  activeText: {
    color: '#fff',
    fontWeight: '600',
  },
  formContainer: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -24,
    paddingTop: 24,
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  formContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  formHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  formTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#4CAF50',
    letterSpacing: 0.3,
  },
  stepIndicator: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  stepText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#022a1aff',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: '#08680bff',
    marginBottom: 8,
    fontWeight: '500',
    borderColor:'#4CAF50',
  },
  inputWrapper: {
    position: 'relative',
    justifyContent: 'center',
  },
  input: {
    backgroundColor: '#f3faf3ff',
    padding: 16,
    paddingLeft: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    fontSize: 16,
    color: '#4CAF50',
  },
  inputIcon: {
    position: 'absolute',
    left: 16,
  },
  selectionTrigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#f3faf3ff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  selectedOptionText: {
    fontSize: 16,
    color: '#4a5568',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionsModal: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    maxHeight: '70%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2b6e4a',
    marginBottom: 16,
    textAlign: 'center',
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  modalOptionText: {
    fontSize: 16,
    color: '#4a5568',
    marginLeft: 12,
    flex: 1,
  },
  modalOptionTextSelected: {
    color: '#2b6e4a',
    fontWeight: '500',
  },
  checkIcon: {
    marginLeft: 'auto',
  },
  modalCloseButton: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#2b6e4a',
    borderRadius: 8,
    alignItems: 'center',
  },
  modalCloseButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  noteContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 16,
    padding: 12,
    backgroundColor: '#f3faf3ff',
    borderRadius: 8,
  },
  note: {
    fontSize: 13,
    color: '#4CAF50',
    marginLeft: 8,
    flex: 1,
    lineHeight: 18,
  },
  submitButton: {
    marginTop: 24,
    borderRadius: 12,
    overflow: 'hidden',
  },
  buttonBackground: {
    backgroundColor: '#2b6e4a',
    padding: 18,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
});

export default MemberDetailsScreen;