// PackageCard.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Package } from '../packageData';

interface Props {
  pkg: Package;
  isSelected: boolean;
  onToggleSelect: (pkg: Package) => void;
}

const PackageCard: React.FC<Props> = ({ pkg, isSelected, onToggleSelect }) => {
  const discountedPrice = pkg.price;
  const originalPrice = Math.round(pkg.price * 1.2); // Assume 20% discount
  const savings = originalPrice - discountedPrice;

  return (
    <View style={styles.card}>
      <Text style={styles.name}>{pkg.name}</Text>
      <Text style={styles.desc}>{pkg.description}</Text>

      {/* Pricing Info */}
      <View style={styles.priceRow}>
        <Text style={styles.discounted}>₹{discountedPrice}</Text>
        <Text style={styles.original}>₹{originalPrice}</Text>
        <Text style={styles.savings}>Save ₹{savings}</Text>
      </View>

      {/* Add / Remove Button */}
      <TouchableOpacity
        style={[styles.button, isSelected ? styles.removeButton : styles.addButton]}
        onPress={() => onToggleSelect(pkg)}
      >
        <Text style={styles.buttonText}>{isSelected ? 'Remove' : 'Add'}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    margin: 10,
    padding: 15,
    borderRadius: 10,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  name: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 4,
  },
  desc: {
    fontSize: 14,
    marginBottom: 6,
    color: '#444',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  discounted: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0a7e5f',
    marginRight: 10,
  },
  original: {
    fontSize: 14,
    textDecorationLine: 'line-through',
    color: '#888',
    marginRight: 10,
  },
  savings: {
    fontSize: 14,
    color: '#d32f2f',
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  addButton: {
    backgroundColor: '#0a7e5f',
  },
  removeButton: {
    backgroundColor: '#d32f2f',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default PackageCard;
