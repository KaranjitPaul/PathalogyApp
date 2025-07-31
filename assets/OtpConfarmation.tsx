import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Pressable,
  Animated,
  Easing,
  ImageBackground,
  Alert,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from './App';

type Props = NativeStackScreenProps<RootStackParamList, 'OtpConfirmation'>;

const OtpConfirmation = ({ navigation, route }: Props) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(30);
  const [resendEnabled, setResendEnabled] = useState(false);

  const fadeAnim = useState(new Animated.Value(0))[0];
  const scaleAnim = useState(new Animated.Value(0.9))[0];

  const { email } = route.params;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 800,
        easing: Easing.out(Easing.back(1.2)),
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  useEffect(() => {
    if (timer <= 0) return;

    const interval = setInterval(() => {
      setTimer((prev) => {
        const next = prev - 1;
        if (next === 0) setResendEnabled(true);
        return next;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  const handleResendOtp = async () => {
    setTimer(30);
    setResendEnabled(false);

    try {
      const response = await fetch(
        'http://192.168.29.52.170/pathalogy_api/resend_otp.php',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        }
      );

      const data = await response.json();

      if (data.success) {
        Alert.alert('Success', 'A new OTP has been sent to your email.');
      } else {
        Alert.alert('Failed', data.message || 'Unable to resend OTP.');
      }
    } catch (error) {
      console.error('Resend OTP Error:', error);
      Alert.alert('Error', 'Network error. Please try again.');
    }
  };

  const handleChangeText = (text: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    // Auto-submit if last digit entered
    if (index === 5 && text) {
      handleContinue();
    }
  };

  const handleContinue = async () => {
    const enteredOtp = otp.join('').trim();

    try {
      const response = await fetch(
        'http://192.168.29.52/pathalogy_api/verify_otp.php',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, otp: enteredOtp }),
        }
      );

      const data = await response.json();

      if (data.success) {
        Alert.alert('Success', 'OTP Verified', [
          { text: 'OK', onPress: () => navigation.replace('Login') },
        ]);
      } else {
        Alert.alert(
          'Invalid OTP',
          data.message || 'The OTP you entered is incorrect.'
        );
      }
    } catch (error) {
      console.error('OTP Verification Error:', error);
      Alert.alert('Error', 'Network error. Please try again.');
    }
  };

  return (
      <SafeAreaView style={styles.container}>
        <Animated.View
          style={[styles.card, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}
        >
          <View style={styles.header}>
            <Text style={styles.heading}>Verification Code</Text>
            <Text style={styles.subHeading}>Sent to {email || 'your email'}</Text>
          </View>

          <View style={styles.changeRow}>
            <Text style={styles.subText}>Not your email? </Text>
            <Pressable onPress={() => navigation.navigate('Login')}>
              <Text style={styles.change}>Change it</Text>
            </Pressable>
          </View>

          <View style={styles.otpRow}>
            {otp.map((value, index) => (
              <TextInput
                key={index}
                style={[
                  styles.otpInput,
                  value && styles.otpInputFilled,
                  index !== otp.length - 1 && { marginRight: 12 }, // gap between boxes
                ]}
                keyboardType="numeric"
                maxLength={1}
                value={value}
                onChangeText={(text) => handleChangeText(text, index)}
                selectTextOnFocus
                returnKeyType="done"
              />
            ))}
          </View>

          <View style={styles.footer}>
            {resendEnabled ? (
              <TouchableOpacity onPress={handleResendOtp} style={styles.resendButton}>
                <Text style={styles.resendActive}>Resend Code</Text>
              </TouchableOpacity>
            ) : (
              <Text style={styles.timerText}>Resend code in {timer}s</Text>
            )}

            <TouchableOpacity
              style={[
                styles.continueButton,
                !otp.every((d) => d) && styles.continueButtonDisabled,
              ]}
              onPress={handleContinue}
              disabled={!otp.every((d) => d)}
              activeOpacity={0.8}
            >
              <Text style={styles.continueText}>Verify & Continue</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </SafeAreaView>
  );
};

export default OtpConfirmation;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#E8F5E9',
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.97)',
    borderRadius: 20,
    paddingVertical: 30,
    paddingHorizontal: 35,
    shadowColor: '#2E7D32',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 18,
    elevation: 12,
  },
  header: {
    marginBottom: 28,
    alignItems: 'center',
  },
  heading: {
    fontSize: 26,
    fontWeight: '700',
    color: '#000000ff',
    marginBottom: 6,
    letterSpacing: 0.6,
  },
  subHeading: {
    fontSize: 15,
    color: '#000000ff',
    textAlign: 'center',
    lineHeight: 20,
  },
  changeRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 32,
  },
  subText: {
    fontSize: 14,
    color: '#000000ff',
  },
  change: {
    fontSize: 14,
    color: '#0e4839',
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  otpRow: {
    flexDirection: 'row',
    marginBottom: 40,
  },
  otpInput: {
    width: 40,
    height: 58,
    borderWidth: 1.5,
    borderRadius: 12,
    borderColor: '#b3c4b5',
    textAlign: 'center',
    fontSize: 26,
    fontWeight: '600',
    color: '#0e4839',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    shadowColor: '#0e4839',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  otpInputFilled: {
    borderColor: '#0e4839',
    backgroundColor: 'rgba(240, 247, 245, 0.98)',
  },
  timerText: {
    textAlign: 'center',
    color: '#e53935',
    fontSize: 14,
    marginBottom: 24,
  },
  resendButton: {
    marginBottom: 24,
    alignSelf: 'center',
  },
  resendActive: {
    color: '#0e4839',
    fontWeight: '600',
    fontSize: 15,
    textDecorationLine: 'underline',
  },
  footer: {
    marginTop: 16,
  },
  continueButton: {
    backgroundColor: '#0e4839',
    paddingVertical: 18,
    borderRadius: 14,
    alignItems: 'center',
    shadowColor: '#25D366',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 7,
  },
  continueButtonDisabled: {
    opacity: 0.5,
  },
  continueText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 17,
    letterSpacing: 0.5,
  },
});
