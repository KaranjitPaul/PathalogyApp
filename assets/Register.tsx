import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Alert,
  Image,
  Animated,
  Easing,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from './App';

type Props = NativeStackScreenProps<RootStackParamList, 'Register'>;

const Register: React.FC<Props> = ({ navigation }) => {
  // Keep animation values between renders
  const logoScale = useRef(new Animated.Value(0.5)).current;
  const formOpacity = useRef(new Animated.Value(0)).current;
  const formTranslateY = useRef(new Animated.Value(30)).current;

  // Show/hide password fields
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);


  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    Animated.spring(logoScale, {
      toValue: 1.1,
      friction: 3,
      useNativeDriver: true,
    }).start();

    Animated.parallel([
      Animated.timing(formOpacity, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(formTranslateY, {
        toValue: 0,
        duration: 500,
        easing: Easing.out(Easing.back(1)),
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Validate each field (trim inputs)
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email.trim())) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone is required';
    } else if (!/^\d{10}$/.test(formData.phone.trim())) {
      newErrors.phone = 'Phone must be 10 digits';
    }
    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      setLoading(true);
      try {
        // Adjust to match your API endpoint and expected payload!
        const response = await fetch('http://192.168.29.52/pathalogy_api/send_otp.php', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            name: formData.name.trim(),
            email: formData.email.trim(),
            phone: formData.phone.trim(),
            password: formData.password.trim()
          })
        });

        const data = await response.json();

        if (response.ok) {
          // Registration successful!
          Alert.alert(
            'OTP Sent',
            'Check your email for the OTP.',
            [
              {
                text: 'OK',
                onPress: () =>
                  navigation.navigate('OtpConfirmation', {
                    email: formData.email.trim(),
                  }),
              },
            ]
        );
        } else {
          // Show backend error message, fallback in case it's missing
          Alert.alert('Registration Failed', data.message || 'Please try again later.');
        }
      } catch (error) {
        Alert.alert('Error', 'Network error. Please try again later.',);
      } finally {
        setLoading(false);
      }
    }
  };


  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#ffffff" barStyle="dark-content" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
          {/* Logo with animation */}
          <Animated.View style={[styles.logoContainer, { transform: [{ scale: logoScale }] }]}>
            <Image
              source={{
                uri: 'https://tuf.edu.pk/Main/frontend/images/departments/2025/1735728861.jpg',
              }}
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={styles.appName}>PathoCare</Text>
          </Animated.View>

          {/* Form with animation */}
          <Animated.View style={[
            styles.formContainer,
            { opacity: formOpacity, transform: [{ translateY: formTranslateY }] }
          ]}>
            <Text style={styles.title}>Create Account</Text>

            {/* Name */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Full Name *</Text>
              <TextInput
                style={[styles.input, errors.name && styles.inputError]}
                placeholder="Enter your full name"
                value={formData.name}
                onChangeText={(text) => handleChange('name', text)}
                autoCapitalize="words"
                accessibilityLabel="Full Name"
              />
              {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
            </View>

            {/* Email */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email *</Text>
              <TextInput
                style={[styles.input, errors.email && styles.inputError]}
                placeholder="Enter your email"
                keyboardType="email-address"
                autoCapitalize="none"
                value={formData.email}
                onChangeText={(text) => handleChange('email', text)}
                accessibilityLabel="Email Address"
              />
              {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
            </View>

            {/* Phone */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Phone Number *</Text>
              <TextInput
                style={[styles.input, errors.phone && styles.inputError]}
                placeholder="Enter phone number"
                keyboardType="number-pad"
                value={formData.phone}
                onChangeText={(text) => handleChange('phone', text.replace(/[^0-9]/g, ''))}
                maxLength={10}
                accessibilityLabel="Phone Number"
              />
              {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}
            </View>

            {/* Password */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Password *</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <TextInput
                  style={[
                    styles.input, 
                    { flex: 1 }, 
                    errors.password && styles.inputError
                  ]}
                  placeholder="Create password (min 6 characters)"
                  secureTextEntry={!showPassword}
                  value={formData.password}
                  onChangeText={(text) => handleChange('password', text)}
                  autoCapitalize="none"
                  accessibilityLabel="Password"
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(prev => !prev)}
                  style={{ marginLeft: 8, padding: 4 }}
                  accessibilityLabel={showPassword ? 'Hide password' : 'Show password'}
                >
                  <Text style={{ color: "#2E7D32", fontWeight: "bold" }}>
                    {showPassword ? "*_*" : "O_O"}
                  </Text>
                </TouchableOpacity>
              </View>
              {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
            </View>

            {/* Confirm Password */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Confirm Password *</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <TextInput
                  style={[
                    styles.input, 
                    { flex: 1 }, 
                    errors.confirmPassword && styles.inputError
                  ]}
                  placeholder="Confirm your password"
                  secureTextEntry={!showConfirm}
                  value={formData.confirmPassword}
                  onChangeText={(text) => handleChange('confirmPassword', text)}
                  autoCapitalize="none"
                  accessibilityLabel="Confirm Password"
                />
                <TouchableOpacity
                  onPress={() => setShowConfirm(prev => !prev)}
                  style={{ marginLeft: 8, padding: 4 }}
                  accessibilityLabel={showConfirm ? 'Hide confirm password' : 'Show confirm password'}
                >
                  <Text style={{ color: "#2E7D32", fontWeight: "bold" }}>
                    {showConfirm ? "*_*" : "O_O"}
                  </Text>
                </TouchableOpacity>
              </View>
              {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}
            </View>

            {/* Submit 
            <TouchableOpacity 
              style={styles.submitButton} 
              onPress={handleSubmit}
              activeOpacity={0.8}
              accessibilityLabel="Register"
            >
              <Text style={styles.submitButtonText}>Register</Text>
            </TouchableOpacity>
            */}

            <TouchableOpacity 
              style={[styles.submitButton, loading && { opacity: 0.6 }]} 
              onPress={handleSubmit}
              activeOpacity={0.8}
              disabled={loading}
              accessibilityLabel="Register"
            >
              <Text style={styles.submitButtonText}>
                {loading ? 'Registering...' : 'Register'}
              </Text>
            </TouchableOpacity>


            {/* Login Link */}
            <TouchableOpacity 
              onPress={() => navigation.navigate('Login')}
              style={styles.loginContainer}
              accessibilityLabel="Login"
            >
              <Text style={styles.loginText}>
                Already have an account? <Text style={styles.loginLink}>Login</Text>
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
  scrollContainer: {
    flexGrow: 1,
    padding: 24,
    paddingBottom: 40,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginLeft: 20,
    marginTop: 50,
    marginBottom: 15
  },
  logo: { width: 80, height: 80, marginRight: 10 },
  appName: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  formContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#1b7714ff',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 10,
  },
  title: {
    fontSize: 25,
    fontWeight: '600',
    color: '#4f0022d1',
    textAlign: 'center',
    marginBottom: 24,
  },//color: '#442a02ff'
  inputGroup: { marginBottom: 16 },
  label: { fontSize: 14, color: '#555555', marginBottom: 6, fontWeight: '500' },
  input: {
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 14,
    fontSize: 16,
    color: '#333333',
  },
  inputError: { borderColor: '#ff4444' },
  errorText: { color: '#ff4444', fontSize: 12, marginTop: 4 },
  submitButton: {
    backgroundColor: '#0e4839',
    padding: 16,
    borderRadius: 8,
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
  },
  submitButtonText: { color: '#ffffff', fontSize: 16, fontWeight: '600' },
  loginContainer: { marginTop: 20, alignItems: 'center' },
  loginText: { color: '#777777', fontSize: 14 },
  loginLink: { color: '#2E7D32', fontWeight: '600' },
});

export default Register;
