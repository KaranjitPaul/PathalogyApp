// CategoryDetails.tsx
import React, { useState } from 'react';
import {
  ScrollView,
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ALL_PACKAGES, Package } from './packageData';
import PackageCard from './Component/PackageCard';
import { RootStackParamList } from './App';

type Props = NativeStackScreenProps<RootStackParamList, 'CategoryDetailScreen'>;

const CategoryDetailScreen = ({ route, navigation }: Props) => {
  const { category } = route.params;

  const packagesForCategory = ALL_PACKAGES.filter(
    (pkg) => pkg.category === category
  );

  const [selectedPackages, setSelectedPackages] = useState<Package[]>([]);

  const togglePackageSelection = (pkg: Package) => {
    const isSelected = selectedPackages.some((p) => p.id === pkg.id);
    if (isSelected) {
      setSelectedPackages((prev) => prev.filter((p) => p.id !== pkg.id));
    } else {
      setSelectedPackages((prev) => [...prev, pkg]);
    }
  };

  const totalAmount = selectedPackages.reduce((sum, pkg) => sum + pkg.price, 0);
  const savedAmount = selectedPackages.reduce((sum, pkg) => sum + Math.round(pkg.price * 1.2), 0)

  const handleViewCart = () => {
    navigation.navigate('SelectedTestsScreen', {
      selectedPackages: selectedPackages.map((pkg) => pkg.name),
      totalPrice: totalAmount,
      saveMoney: savedAmount,
    });
  };

  return (
    <>
      <ScrollView>
        <Text style={styles.header}>{category} Packages</Text>

        {packagesForCategory.length === 0 ? (
          <Text style={styles.noPackages}>No packages found in this category.</Text>
        ) : (
          packagesForCategory.map((pkg) => (
            <PackageCard
              key={pkg.id}
              pkg={pkg}
              isSelected={selectedPackages.some((p) => p.id === pkg.id)}
              onToggleSelect={togglePackageSelection}
            />
          ))
        )}
      </ScrollView>

      {selectedPackages.length > 0 && (
        <View style={styles.cartBar}>
          <View>
            <Text style={styles.cartText}>
              {selectedPackages.length} item{selectedPackages.length > 1 ? 's' : ''} selected
            </Text>
            <Text style={styles.cartText}>Total: ₹{totalAmount}</Text>
          </View>
          <TouchableOpacity style={styles.cartButton} onPress={handleViewCart}>
            <Text style={styles.cartButtonText}>View Cart</Text>
          </TouchableOpacity>
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    margin: 16,
  },
  noPackages: {
    fontSize: 16,
    color: '#999',
    margin: 16,
  },
  cartBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderColor: '#ddd',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    elevation: 10,
  },
  cartText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  cartButton: {
    backgroundColor: '#0a7e5f',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 6,
  },
  cartButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default CategoryDetailScreen;
