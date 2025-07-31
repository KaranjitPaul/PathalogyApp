import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  SafeAreaView,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const OnlinePaymentScreen = () => {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');

  const paymentMethods = [
    { 
      id: 'upi', 
      name: 'UPI', 
      icon: 'cellphone', 
      type: 'MaterialCommunityIcons',
      subText: 'Pay via any UPI app',
      rightIcons: ['search', 'refresh', 'refresh']
    },
    { 
      id: 'famapp', 
      name: 'FamApp', 
      icon: 'account-multiple', 
      type: 'MaterialCommunityIcons',
      subText: 'Family payment app'
    },
    { 
      id: 'apps', 
      name: 'Apps & UPI ID', 
      icon: 'apps', 
      type: 'MaterialIcons',
      subText: 'Pay using UPI ID'
    },
    { 
      id: 'cards', 
      name: 'Cards', 
      icon: 'credit-card', 
      type: 'MaterialCommunityIcons',
      subText: 'Credit/Debit/ATM Cards',
      rightIcons: ['refresh', 'refresh']
    },
    { 
      id: 'emi', 
      name: 'EMI', 
      icon: 'calendar-multiple', 
      type: 'MaterialCommunityIcons',
      subText: 'Easy monthly installments',
      rightIcons: ['refresh']
    },
    { 
      id: 'netbanking', 
      name: 'Netbanking', 
      icon: 'bank', 
      type: 'MaterialCommunityIcons',
      subText: 'All major banks'
    },
    { 
      id: 'wallet', 
      name: 'Wallet', 
      icon: 'wallet', 
      type: 'MaterialCommunityIcons',
      subText: 'Paytm, PhonePe & more'
    },
    { 
      id: 'paylater', 
      name: 'Pay Later', 
      icon: 'clock', 
      type: 'MaterialCommunityIcons',
      subText: 'Pay within 14 days',
      rightIcon: 'chevron-right'
    },
  ];

  const renderIcon = (icon: string, type: string, size = 24, color = '#4CAF50') => {
    switch(type) {
      case 'MaterialCommunityIcons':
        return <MaterialCommunityIcons name={icon} size={size} color={color} />;
      default:
        return <Icon name={icon} size={size} color={color} />;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={[styles.header, styles.shadowCard]}>
          <View style={styles.brandContainer}>
            <Image 
              source={{ uri: ''}}
              resizeMode="contain"
            />
            <Text style={styles.brandName}>PathoCare</Text>
          </View>
          <View style={styles.trustBadge}>
            <Icon name="verified" size={16} color="#4CAF50" />
            <Text style={styles.trustText}>Secure Payment</Text>
          </View>
        </View>

        {/* Price Summary */}
        <View style={[styles.priceSummary, styles.shadowCard]}>
          <Text style={styles.priceSummaryTitle}>Total Amount</Text>
          <View style={styles.priceContainer}>
            <Text style={styles.priceAmount}>₹1,627</Text>
            <Icon name="info-outline" size={20} color="#757575" />
          </View>
        </View>

        {/* Phone Number Option */}
        <View style={[styles.phoneOption, styles.shadowCard]}>
          <View style={styles.phoneContainer}>
            <Icon name="sim-card" size={20} color="#4CAF50" />
            <Text style={styles.phoneOptionText}>Using as +91 87875 73726</Text>
          </View>
          <TouchableOpacity>
            <Text style={styles.changeText}>Change</Text>
          </TouchableOpacity>
        </View>

        {/* Payment Options */}
        <View style={styles.paymentOptions}>
          <Text style={styles.sectionTitle}>Payment Options</Text>
          <Text style={styles.allOptionsText}>All Payment Options</Text>

          {paymentMethods.map((method) => (
            <TouchableOpacity 
              key={method.id}
              style={[
                styles.paymentMethod,
                styles.shadowCard,
                selectedPaymentMethod === method.id && styles.selectedPaymentMethod
              ]}
              onPress={() => setSelectedPaymentMethod(method.id)}
            >
              <View style={styles.methodLeft}>
                <View style={styles.methodIconContainer}>
                  {renderIcon(method.icon, method.type)}
                </View>
                <View style={styles.methodTextContainer}>
                  <Text style={styles.methodName}>{method.name}</Text>
                  <Text style={styles.methodSubText}>{method.subText}</Text>
                </View>
              </View>
              <View style={styles.methodIcons}>
                {method.rightIcons?.map((icon, index) => (
                  <Icon 
                    key={index} 
                    name={icon} 
                    size={16} 
                    color="#757575" 
                    style={styles.methodIcon} 
                  />
                ))}
                {method.rightIcon && (
                  <Icon 
                    name={method.rightIcon} 
                    size={16} 
                    color="#757575" 
                    style={styles.methodIcon} 
                  />
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Footer */}
        <View style={[styles.footer, styles.shadowCard]}>
          <View style={styles.priceFooter}>
            <View>
              <Text style={styles.totalText}>Total Payable</Text>
              <Text style={styles.taxText}>Inclusive of all taxes</Text>
            </View>
            <Text style={styles.footerAmount}>₹1,627</Text>
          </View>
          <TouchableOpacity style={[styles.continueButton, styles.shadowButton]}>
            <Text style={styles.continueButtonText}>Proceed to Pay</Text>
            <MaterialCommunityIcons name="arrow-right" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingTop: 50,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  shadowCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    marginBottom: 16,
  },
  shadowButton: {
    shadowColor: '#2E7D32',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  brandName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 10,
  },
  trustBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  trustText: {
    fontSize: 12,
    color: '#4CAF50',
    marginLeft: 4,
    fontWeight: '500',
  },
  priceSummary: {
    alignItems: 'flex-start',
  },
  priceSummaryTitle: {
    fontSize: 14,
    color: '#757575',
    marginBottom: 4,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priceAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginRight: 8,
  },
  phoneOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  phoneContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  phoneOptionText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 10,
    fontWeight: '500',
  },
  changeText: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '500',
  },
  paymentOptions: {
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  allOptionsText: {
    fontSize: 14,
    color: '#757575',
    marginBottom: 16,
  },
  paymentMethod: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    marginBottom: 12,
  },
  selectedPaymentMethod: {
    borderWidth: 1,
    borderColor: '#4CAF50',
    backgroundColor: '#F1F8E9',
  },
  methodLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  methodIconContainer: {
    backgroundColor: '#E8F5E9',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  methodTextContainer: {
    flex: 1,
  },
  methodName: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  methodSubText: {
    fontSize: 12,
    color: '#757575',
    marginTop: 2,
  },
  methodIcons: {
    flexDirection: 'row',
  },
  methodIcon: {
    marginLeft: 12,
  },
  footer: {
    padding: 16,
    marginBottom: 30,
  },
  priceFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  totalText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  taxText: {
    fontSize: 12,
    color: '#757575',
    marginTop: 2,
  },
  footerAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  continueButton: {
    backgroundColor: '#4CAF50',
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  continueButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 8,
  },
  logo: {
    width: 40,
    height: 40,
    borderRadius: 8,
  },
});

export default OnlinePaymentScreen;