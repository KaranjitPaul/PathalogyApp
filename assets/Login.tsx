import React, { useRef, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Image,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  Animated,
  Easing,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Modal,
  TouchableWithoutFeedback,
  GestureResponderEvent
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from './App';
import Icon from 'react-native-vector-icons/MaterialIcons';

const { width, height } = Dimensions.get('window');
type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

const LoginScreen = ({ navigation }: Props) => {
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [isEmail, setIsEmail] = useState(false);
  const [errors, setErrors] = useState<{ loginId?: string; password?: string }>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [recoveryError, setRecoveryError] = useState('');

  // Animations
  const formTranslateY = useRef(new Animated.Value(300)).current;
  const formOpacity = useRef(new Animated.Value(0)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const modalTranslateY = useRef(new Animated.Value(height)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(formTranslateY, {
        toValue: 0,
        duration: 800,
        easing: Easing.out(Easing.back(1.2)),
        useNativeDriver: true,
      }),
      Animated.timing(formOpacity, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(textOpacity, {
        toValue: 1,
        duration: 800,
        delay: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const toggleForgotPasswordModal = () => {
    if (showForgotPasswordModal) {
      Animated.timing(modalTranslateY, {
        toValue: height,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setShowForgotPasswordModal(false));
    } else {
      setShowForgotPasswordModal(true);
      Animated.timing(modalTranslateY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  };

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handlePasswordRecovery = () => {
    if (!recoveryEmail.trim()) {
      setRecoveryError('Please enter your email');
      return;
    }
    
    if (!validateEmail(recoveryEmail)) {
      setRecoveryError('Please enter a valid email address');
      return;
    }

    // Here you would typically call your password recovery API
    Alert.alert('Password Reset', `Password reset link sent to ${recoveryEmail}`);
    toggleForgotPasswordModal();
    setRecoveryEmail('');
    setRecoveryError('');
  };

  const handleLogin = async () => {
    let hasError = false;
    let errorsObj: { loginId?: string; password?: string } = {};

    // Validate loginId
    if (!loginId) {
      errorsObj.loginId = 'Please enter your email or mobile number';
      hasError = true;
    } else if (loginId.includes('@')) {
      if (!validateEmail(loginId)) {
        errorsObj.loginId = 'Please enter a valid email address';
        hasError = true;
      }
    } else {
      if (!/^\d{10}$/.test(loginId)) {
        errorsObj.loginId = 'Please enter a valid 10-digit mobile number';
        hasError = true;
      }
    }

    // Validate password
    if (!password.trim()) {
      errorsObj.password = 'Please enter your password';
      hasError = true;
    }

    setErrors(errorsObj);

    if (hasError) return;

    // API call code remains the same
    try {
      const response = await fetch('http://192.168.29.52/pathalogy_api/login.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          input: loginId,
          password: password,
        }),
      });

      const data = await response.json();

      if (data.success) {
        const user = data.user;
        await AsyncStorage.setItem('user', JSON.stringify(user));
        navigation.replace('HomeScreen');
      } else {
        Alert.alert('Login Failed', data.message);
      }
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Network Error', 'Something went wrong. Please try again.');
    }
  };

  const handleTermsPress = (event: GestureResponderEvent): void => {
    // Navigate to Terms & Conditions screen or open in web browser
    // navigation.navigate('TermsAndConditions');
    console.log('Terms & Conditions pressed');
  };

  const handlePrivacyPress = (event: GestureResponderEvent): void => {
    // Navigate to Privacy Policy screen or open in web browser
    // navigation.navigate('PrivacyPolicy');
    console.log('Privacy Policy pressed');
  };

  const handleSignUpPress = (event: GestureResponderEvent): void => {
    // Navigate to Register/SignUp screen
    navigation.navigate('Register');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: 'https://idapgroup.com/blog/blog/wp-content/uploads/2017/09/image3.png' }}
          style={styles.doctorImage}
          resizeMode="cover"
        />
      </View>

      <View style={styles.middleSection}>
        <Animated.View style={{ opacity: textOpacity }}>
          <Text style={styles.welcomeText}>Welcome Back!</Text>
          <Text style={styles.subtitle}>Sign in to access your account</Text>
        </Animated.View>
      </View>

      <KeyboardAvoidingView
        style={styles.bottomSection}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <Animated.View
          style={[
            styles.formBox,
            {
              opacity: formOpacity,
              transform: [{ translateY: formTranslateY }],
            },
          ]}
        >
          {/* Login ID (email or phone) */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.inputField}
              placeholder="Enter Email or Mobile Number"
              placeholderTextColor="#aaa"
              keyboardType={isEmail ? 'email-address' : 'phone-pad'}
              value={loginId}
              onChangeText={(text) => {
                const cleanedText = text.trim();
                if (!cleanedText.includes('@') && /^\d+$/.test(cleanedText) && cleanedText.length > 10) return;
                setLoginId(cleanedText);
                const isPhone = /^\d+$/.test(cleanedText) && !cleanedText.includes('@');
                setIsEmail(!isPhone);
                setErrors(prev => ({ ...prev, loginId: undefined }));
              }}
              autoCapitalize="none"
              accessibilityLabel="Email or Mobile Number"
            />

            {!!errors.loginId && (
              <Text style={styles.errorText}>{errors.loginId}</Text>
            )}
          </View>

          {/* Password */}
          <View style={[styles.inputContainer, { marginTop: 15 }]}>
            <View style={styles.passwordContainer}>
              <TextInput
                style={[styles.inputField, { flex: 1 }]}
                placeholder="Enter Password"
                placeholderTextColor="#aaa"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  setErrors(prev => ({ ...prev, password: undefined }));
                }}
                autoCapitalize="none"
                accessibilityLabel="Password"
              />
              <TouchableOpacity 
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeIcon}
              >
                <Icon 
                  name={showPassword ? 'visibility-off' : 'visibility'} 
                  size={20} 
                  color="#aaa" 
                />
              </TouchableOpacity>
            </View>
            {!!errors.password && (
              <Text style={styles.errorText}>{errors.password}</Text>
            )}
          </View>

          <TouchableOpacity 
            onPress={toggleForgotPasswordModal}
            style={styles.forgotPasswordButton}
          >
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>

          <Text style={styles.terms}>
            By continuing, you agree to our{' '}
            <Text style={styles.link} onPress={handleTermsPress}>Terms & Conditions</Text> and{' '}
            <Text style={styles.link} onPress={handlePrivacyPress}>Privacy Policy</Text>
          </Text>

          <TouchableOpacity style={styles.loginButton} onPress={handleLogin} accessibilityLabel="Login">
            <Text style={styles.loginButtonText}>Login</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleSignUpPress} accessibilityLabel="Sign Up">
            <Text style={styles.signUpText}>
              New User? <Text style={styles.signUpLink}>Sign Up</Text>
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </KeyboardAvoidingView>

      {/* Forgot Password Modal */}
      <Modal
        visible={showForgotPasswordModal}
        transparent={true}
        animationType="none"
        onRequestClose={toggleForgotPasswordModal}
      >
        <TouchableWithoutFeedback onPress={toggleForgotPasswordModal}>
          <View style={styles.modalOverlay} />
        </TouchableWithoutFeedback>
        
        <Animated.View 
          style={[
            styles.modalContainer, 
            { transform: [{ translateY: modalTranslateY }] }
          ]}
        >
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Reset Password</Text>
            <TouchableOpacity onPress={toggleForgotPasswordModal}>
              <Icon name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>
          
          <Text style={styles.modalSubtitle}>
            Enter your email address to receive a OTP
          </Text>
          
          <View style={styles.modalInputContainer}>
            <TextInput
              style={styles.modalInput}
              placeholder="Enter your email"
              placeholderTextColor="#aaa"
              keyboardType="email-address"
              value={recoveryEmail}
              onChangeText={(text) => {
                setRecoveryEmail(text.trim());
                setRecoveryError('');
              }}
              autoCapitalize="none"
            />
            {!!recoveryError && (
              <Text style={styles.modalErrorText}>{recoveryError}</Text>
            )}
          </View>
          
          <TouchableOpacity 
            style={styles.resetButton} 
            onPress={handlePasswordRecovery}
          >
            <Text style={styles.resetButtonText}>Send OTP</Text>
          </TouchableOpacity>
        </Animated.View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  imageContainer: {
    marginTop: 30,
  },
  doctorImage: {
    marginTop: 60,
    width: '100%',
    height: 350,
  },
  middleSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    marginTop: -40,
  },
  bottomSection: {
    flex: 1.5,
    justifyContent: 'flex-end',
    paddingBottom: 30,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#828282',
    textAlign: 'center',
  },
  formBox: {
    backgroundColor: '#ffffff',
    padding: 25,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginHorizontal: 20,
    shadowColor: '#1b7714ff',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
  },
  inputContainer: {
    borderColor: '#0e4839',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 15,
    marginBottom: 5,
    backgroundColor: '#f8f8f8',
  },
  inputField: {
    height: 50,
    fontSize: 16,
    color: '#333333',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  eyeIcon: {
    padding: 10,
  },
  errorText: {
    color: 'red',
    marginBottom: 6,
    marginLeft: 2,
    fontSize: 13,
    textAlign: 'left',
  },
  forgotPasswordButton: {
    alignSelf: 'flex-end',
    marginTop: 5,
  },
  forgotPasswordText: {
    color: '#0e4839',
    fontSize: 14,
    fontWeight: '500',
  },
  terms: {
    fontSize: 12,
    color: '#828282',
    marginVertical: 10,
    textAlign: 'center',
    lineHeight: 18,
  },
  link: {
    color: '#2D9CDB',
    textDecorationLine: 'underline',
    fontWeight: '500',
  },
  loginButton: {
    backgroundColor: '#0e4839',
    paddingVertical: 15,
    borderRadius: 12,
    marginTop: 5,
    alignItems: 'center',
    shadowColor: '#0e4839',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 4,
  },
  loginButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  signUpText: {
    fontSize: 14,
    color: '#828282',
    textAlign: 'center',
    marginTop: 16,
  },
  signUpLink: {
    color: '#0e4839',
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 25,
    paddingBottom: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
  modalInputContainer: {
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 10,
  },
  modalInput: {
    height: 50,
    fontSize: 16,
    color: '#333',
  },
  modalErrorText: {
    color: 'red',
    fontSize: 13,
    marginTop: 5,
  },
  resetButton: {
    backgroundColor: '#0e4839',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  resetButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default LoginScreen;