import React from 'react';
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
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from './App';

type Props = NativeStackScreenProps<RootStackParamList, 'SelectedTestsScreen'>;

const SelectedTestsScreen = ({ route, navigation }: Props) => {
  const { selectedPackages, totalPrice, saveMoney } = route.params;

  const handleNext = () => {
    navigation.navigate('MemberDetailsScreen', {
      selectedPackages,
      totalPrice,
      saveMoney
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#2E7D32" barStyle="light-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Selected Tests & Packages</Text>
      </View>

      {/* Progress Indicator */}
      <View style={styles.progressContainer}>
        <View style={styles.progressItem}>
          <View style={[styles.progressIcon, styles.activeProgress]}>
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
          <View style={styles.progressIcon}>
            <Icon name="credit-card" size={20} color="#fff" />
          </View>
        </View>
      </View>

      <ScrollView style={styles.content}>
        {/* Section Header */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Tests & Packages</Text>
          <TouchableOpacity>
            <Text style={styles.addMoreButton}>+ Add More Tests</Text>
          </TouchableOpacity>
        </View>

        {/* Free Consultation Card */}
        <View style={styles.freeCard}>
          <View style={styles.cardContent}>
            <View style={styles.doctorIconContainer}>
              <FontAwesome name="user-md" size={24} color="#2E7D32" />
            </View>
            <View style={styles.cardTextContainer}>
              <Text style={styles.cardTitle}>Yay! You've unlocked</Text>
              <Text style={styles.cardSubtitle}>Report Consultation & Diet Plan</Text>
              <Text style={styles.cardDescription}>with your booking</Text>
            </View>
            <View style={styles.priceContainer}>
              <Text style={styles.freeText}>FREE</Text>
              <Text style={styles.originalPrice}>₹799</Text>
            </View>
          </View>
        </View>

        {/* Main Test Package */}
        <View style={styles.testCard}>
          <TouchableOpacity style={styles.removeButton}>
            <Icon name="close" size={20} color="#666" />
          </TouchableOpacity>
          
          <View style={styles.testContent}>
            <Text style={styles.testTitle}>{selectedPackages.join(', ')}</Text>
            <View style={styles.parametersContainer}>
              <Text style={styles.parametersText}>Includes 89 Parameters</Text>
              <Icon name="keyboard-arrow-right" size={16} color="#666" />
            </View>
            <View style={styles.testPriceContainer}>
              <Text style={styles.currentPrice}>₹{totalPrice}</Text>
              <Text style={styles.originalTestPrice}>₹{saveMoney}</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Button */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity style={styles.nextButton} onPress={handleNext} >
          <Text style={styles.nextButtonText}>Next</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

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
  progressLine: {
    flex: 1,
    height: 2,
    backgroundColor: '#A5D6A7',
    marginHorizontal: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  addMoreButton: {
    color: '#2E7D32',
    fontSize: 14,
    fontWeight: '500',
    textDecorationLine: 'underline',
    textDecorationStyle: 'dotted',
  },
  freeCard: {
    backgroundColor: '#E8F5E8',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#C8E6C8',
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  doctorIconContainer: {
    width: 48,
    height: 48,
    backgroundColor: '#fff',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  cardTextContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  cardSubtitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  cardDescription: {
    fontSize: 12,
    color: '#666',
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  freeText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2E7D32',
  },
  originalPrice: {
    fontSize: 12,
    color: '#666',
    textDecorationLine: 'line-through',
  },
  testCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    position: 'relative',
  },
  removeButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  testContent: {
    paddingRight: 32,
  },
  testTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2E7D32',
    marginBottom: 8,
    lineHeight: 22,
  },
  parametersContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  parametersText: {
    fontSize: 14,
    color: '#666',
    marginRight: 4,
  },
  testPriceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  currentPrice: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginRight: 8,
  },
  originalTestPrice: {
    fontSize: 14,
    color: '#999',
    textDecorationLine: 'line-through',
  },
  bottomContainer: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 20,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  nextButton: {
    backgroundColor: '#2E7D32',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default SelectedTestsScreen;