import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from './App';

type Props = NativeStackScreenProps<RootStackParamList, 'PaymentScreen'>;

const PaymentScreen = ({route, navigation}: Props) => {
  const { selectedPackages, totalPrice, saveMoney } = route.params;
  const discount = totalPrice*0.1;
  const grandTotal = (totalPrice+89+299+500+99)-discount;
  const saved = discount+(saveMoney-totalPrice);

  const [selectedPayment, setSelectedPayment] = useState('online'); // 'online' or 'cash'

  const handleContinue = () =>{
    if(selectedPayment === 'online')
    {navigation.navigate('OnlinePaymentScreen');}
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#2E7D32" barStyle="light-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Payment</Text>
      </View>

      {/* Progress Indicator */}
      <View style={styles.progressContainer}>
        <View style={styles.progressItem}>
          <View style={styles.progressIcon}>
            <Icon name="assignment" size={20} color="#fff" />
          </View>
        </View>
        <View style={styles.progressLine} />
        <View style={styles.progressItem}>
          <View style={styles.progressIcon}>
            <Icon name="person" size={20} color="#fff" />
          </View>
        </View>
        <View style={styles.progressLine} />
        <View style={styles.progressItem}>
          <View style={styles.progressIcon}>
            <Icon name="date-range" size={20} color="#fff" />
          </View>
        </View>
        <View style={styles.progressLine} />
        <View style={styles.progressItem}>
          <View style={[styles.progressIcon, styles.activeProgress]}>
            <Icon name="credit-card" size={20} color="#fff" />
          </View>
        </View>
      </View>

      <ScrollView style={styles.content}>

        {/* Payment Method Section */}
        <View style={[styles.section, styles.shadowCard]}>
          <Text style={styles.sectionHeader}>Payment Method</Text>
          
          <TouchableOpacity 
            style={[
              styles.paymentOption, 
              selectedPayment === 'online' && styles.selectedPaymentOption
            ]}
            onPress={() => setSelectedPayment('online')}
          >
            <View style={styles.paymentOptionContent}>
              <Icon 
                name="credit-card" 
                size={24} 
                color={selectedPayment === 'online' ? '#2E7D32' : '#555'} 
              />
              <Text style={[
                styles.paymentOptionText,
                selectedPayment === 'online' && styles.selectedPaymentOptionText
              ]}>
                Online Payment
              </Text>
            </View>
            {selectedPayment === 'online' && (
              <Icon name="check-circle" size={24} color="#2E7D32" />
            )}
          </TouchableOpacity>

          <TouchableOpacity 
            style={[
              styles.paymentOption, 
              selectedPayment === 'cash' && styles.selectedPaymentOption
            ]}
            onPress={() => setSelectedPayment('cash')}
          >
            <View style={styles.paymentOptionContent}>
              <Icon 
                name="attach-money" 
                size={24} 
                color={selectedPayment === 'cash' ? '#2E7D32' : '#555'} 
              />
              <Text style={[
                styles.paymentOptionText,
                selectedPayment === 'cash' && styles.selectedPaymentOptionText
              ]}>
                Cash on Delivery
              </Text>
            </View>
            {selectedPayment === 'cash' && (
              <Icon name="check-circle" size={24} color="#2E7D32" />
            )}
          </TouchableOpacity>
        </View>

        {/* Review Bookings Section */}
        <View style={[styles.section, styles.shadowCard]}>
          <Text style={styles.sectionHeader}>Review Bookings</Text>
          <View style={styles.optionItem}>
            <Icon name="add-circle-outline" size={20} color="#555" />
            <Text style={styles.optionText}>Add Hard Copy Reports @ 150</Text>
          </View>
          <View style={styles.optionItem}>
            <Icon name="local-offer" size={20} color="#555" />
            <Text style={styles.optionText}>Select a coupon code</Text>
          </View>
        </View>

        <View style={styles.divider} />

        {/* Offers Section */}
        <View style={[styles.section, styles.shadowCard]}>
          <Text style={styles.sectionHeader}>Offers</Text>
          <View style={styles.offerCard}>
            <Text style={styles.offerTitle}>VIP Membership Added @₹99</Text>
            <Text style={styles.offerDescription}>
              Get 10% off with every booking & more
            </Text>
          </View>
        </View>

        <View style={styles.divider} />

        {/* Price Details Section */}
        <View style={[styles.section, styles.shadowCard]}>
          <Text style={styles.sectionHeader}>Price Details</Text>

          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Total Amount</Text>
            <View style={styles.priceValues}>
              <Text style={styles.oldPrice}>₹{saveMoney}</Text>
              <Text style={styles.currentPrice}>₹{totalPrice}</Text>
            </View>
          </View>

          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Diagnostic Fee</Text>
            <View style={styles.priceValues}>
              <Text style={styles.currentPrice}>₹89</Text>
            </View>
          </View>

          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Report Consultation</Text>
            <View style={styles.priceValues}>
              <Text style={styles.currentPrice}>₹299</Text>
            </View>
          </View>

          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Diet & Calorie Tracker</Text>
            <View style={styles.priceValues}>
              <Text style={styles.currentPrice}>₹500</Text>
            </View>
          </View>

          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>VIP Discount (10%)</Text>
            <View style={styles.priceValues}>
              <Text style={styles.discountPrice}>₹{discount}</Text>
            </View>
          </View>

          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>VIP membership fee</Text>
            <View style={styles.priceValues}>
              <Text style={styles.currentPrice}>₹99</Text>
            </View>
          </View>

          <View style={[styles.priceRow, styles.totalAmountRow]}>
            <Text style={styles.priceLabel}>Amount to be paid</Text>
            <View style={styles.priceValues}>
              <Text style={styles.currentPrice}>₹{grandTotal}</Text>
            </View>
          </View>
        </View>

        <View style={styles.divider} />

        {/* Savings Section */}
        <View style={styles.savingsContainer}>
          <Text style={styles.savingsText}>You Saved ₹{saved} on this booking</Text>
        </View>

        <View style={styles.divider} />

        {/* Grand Total Section */}
        <View style={[styles.grandTotalContainer, styles.shadowCard]}>
          <Text style={styles.grandTotalLabel}>Grand Total</Text>
          <Text style={styles.grandTotalAmount}>₹{grandTotal}</Text>
        </View>

        {/* Confirm & Pay Button */}
        <TouchableOpacity style={styles.payButton} onPress={handleContinue}>
          <Text style={styles.payButtonText}>
            {selectedPayment === 'online' ? 'Confirm & Pay' : 'Confirm Booking'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  // Header styles
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
  // Progress Indicator styles
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
    backgroundColor: '#1B5E20',
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeProgress: {
    backgroundColor: '#1B5E20',
  },
  progressLine: {
    flex: 1,
    height: 2,
    backgroundColor: '#1B5E20',
    marginHorizontal: 8,
  },
  // Content styles
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 16,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  // Payment Method styles
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginBottom: 12,
  },
  selectedPaymentOption: {
    borderColor: '#2E7D32',
    backgroundColor: '#E8F5E9',
  },
  paymentOptionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paymentOptionText: {
    fontSize: 16,
    marginLeft: 12,
    color: '#555',
  },
  selectedPaymentOptionText: {
    color: '#2E7D32',
    fontWeight: 'bold',
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  optionText: {
    fontSize: 16,
    marginLeft: 8,
    color: '#555',
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 12,
  },
  offerCard: {
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
  },
  offerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  offerDescription: {
    fontSize: 14,
    color: '#666',
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  totalAmountRow: {
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingTop: 8,
    marginTop: 8,
  },
  priceLabel: {
    fontSize: 16,
    color: '#555',
  },
  priceValues: {
    flexDirection: 'row',
  },
  oldPrice: {
    fontSize: 16,
    color: '#999',
    textDecorationLine: 'line-through',
    marginRight: 8,
  },
  currentPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  discountPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'green',
  },
  savingsContainer: {
    alignItems: 'center',
    marginVertical: 12,
  },
  savingsText: {
    fontSize: 16,
    color: 'green',
    fontWeight: 'bold',
  },
  grandTotalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 12,
  },
  grandTotalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  grandTotalAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  payButton: {
    backgroundColor: '#4CAF50',
    padding: 16,
    borderRadius: 20,
    alignItems: 'center',
    marginVertical: 50,
  },
  payButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  // Green shadow/highlight card style
  shadowCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    // iOS shadow
    shadowColor: '#2E7D32',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    // Android elevation
    elevation: 5,
    marginBottom: 16,
  },
});

export default PaymentScreen;