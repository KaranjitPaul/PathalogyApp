import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';

interface TestPackage {
  id: string;
  title: string;
  featuresLeft: string[];
  featuresRight: string[];
  reports: string;
  price: number;
  originalPrice: string;
  savings: string;
}

interface CategoryTestsScreenProps {
  category?: string;
  onViewCart?: (selectedPackages: string[], category: string, totalPrice: number) => void;
}

const PREMIUM_CATEGORY_IDS = ['3', 'n2', 'h2', 't2', 'hp1', 'bt2', 'e2', 'l2'];

const CategoryTestsScreen: React.FC<CategoryTestsScreenProps> = ({ 
  category: initialCategory = 'Full Body',
  onViewCart 
}) => {
  const [selectedPackages, setSelectedPackages] = useState<Record<string, boolean>>({});
  const [totalPrice, setTotalPrice] = useState(0);
  const [category, setCategory] = useState(initialCategory);
  const [packages, setPackages] = useState<TestPackage[]>([]);

  useEffect(() => {
    setCategory(initialCategory);
    loadPackagesForCategory(initialCategory);
  }, [initialCategory]);

  const loadPackagesForCategory = (categoryName: string) => {
    setSelectedPackages({});
    setTotalPrice(0);

    let categoryPackages: TestPackage[] = [];

    switch (categoryName) {
      case 'Full Body':
        categoryPackages = [
          {
            id: '1',
            title: 'Fit India Full Body Checkup with Free HbA1c',
            featuresLeft: ['Diabetes (HbA1c)', 'Lipid', 'Liver', 'Kidney'],
            featuresRight: ['Infection', 'Thyroid'],
            reports: '14 Hours | Tests 89',
            price: 1099,
            originalPrice: '₹5233',
            savings: '₹4134 saved'
          },
          {
            id: '2',
            title: 'Fit India Full Body Checkup With Vitamin Screening with Free HSCRP',
            featuresLeft: ['Heart', 'Diabetes (HbA1c)', 'Lipid', 'Liver'],
            featuresRight: ['Kidney', 'Infection', 'Thyroid'],
            reports: '14 Hours | Tests 92',
            price: 1299,
            originalPrice: '₹5899',
            savings: '₹4600 saved'
          },
          {
            id: '3',
            title: 'Advance Plus Full Body Checkup with Free HSCRP',
            featuresLeft: ['Heart', 'Vitamins', 'Liver', 'Kidney'],
            featuresRight: ['Diabetes / Sugar', 'Bone / Joints', 'Thyroid'],
            reports: '14 Hours | Tests 98',
            price: 1599,
            originalPrice: '₹6899',
            savings: '₹5300 saved'
          }
        ];
        break;

      // Other categories remain the same...
      // (Keep all your existing category cases here)
      // ...

      default:
        categoryPackages = [];
    }

    setPackages(categoryPackages);
  };

  const handleAddPackage = (packageId: string) => {
    const newSelectedPackages = { ...selectedPackages };

    if (newSelectedPackages[packageId]) {
      delete newSelectedPackages[packageId];
    } else {
      newSelectedPackages[packageId] = true;
    }

    setSelectedPackages(newSelectedPackages);

    let sum = 0;
    Object.keys(newSelectedPackages).forEach(id => {
      const pkg = packages.find(p => p.id === id);
      if (pkg) sum += pkg.price;
    });
    setTotalPrice(sum);
  };

  const handleViewCart = () => {
    if (onViewCart) {
      onViewCart(Object.keys(selectedPackages), category, totalPrice);
    }
  };

  const classicPackages = packages.filter(p => !PREMIUM_CATEGORY_IDS.includes(p.id));
  const premiumPackages = packages.filter(p => PREMIUM_CATEGORY_IDS.includes(p.id));

  const PackageCard = ({ pkg, isPremium }: { pkg: TestPackage, isPremium: boolean }) => (
    <View key={pkg.id} style={[styles.card, isPremium && styles.premiumCard]}>
      {isPremium && <View style={styles.premiumBadge}><Text style={styles.premiumBadgeText}>Premium</Text></View>}
      
      <Text style={styles.cardTitle}>{pkg.title}</Text>
      
      <View style={styles.featuresContainer}>
        <View style={styles.featuresColumn}>
          {pkg.featuresLeft.map((feature, i) => (
            <Text key={`left-${i}`} style={styles.featureText}>• {feature}</Text>
          ))}
        </View>
        <View style={styles.featuresColumn}>
          {pkg.featuresRight.map((feature, i) => (
            <Text key={`right-${i}`} style={styles.featureText}>• {feature}</Text>
          ))}
        </View>
      </View>
      
      <View style={styles.divider} />
      
      <View style={styles.cardFooter}>
        <View>
          <Text style={styles.reportsText}>{pkg.reports}</Text>
          <View style={styles.priceContainer}>
            <Text style={styles.currentPrice}>₹{pkg.price}</Text>
            <Text style={styles.originalPrice}>{pkg.originalPrice}</Text>
          </View>
          <Text style={styles.savingsText}>{pkg.savings}</Text>
        </View>
        
        <TouchableOpacity
          style={[styles.addButton, selectedPackages[pkg.id] && styles.removeButton]}
          onPress={() => handleAddPackage(pkg.id)}
        >
          <Text style={styles.addButtonText}>
            {selectedPackages[pkg.id] ? 'Remove' : 'Add'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>
            {category} Packages
          </Text>
          <Text style={styles.subHeaderText}>
            {packages.length} packages available
          </Text>
        </View>

        {classicPackages.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Standard Packages</Text>
            {classicPackages.map(pkg => (
              <PackageCard key={pkg.id} pkg={pkg} isPremium={false} />
            ))}
          </>
        )}

        {premiumPackages.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Premium Packages</Text>
            {premiumPackages.map(pkg => (
              <PackageCard key={pkg.id} pkg={pkg} isPremium={true} />
            ))}
          </>
        )}

        {packages.length === 0 && (
          <Text style={styles.emptyText}>No packages available for this category</Text>
        )}
      </ScrollView>

      {totalPrice > 0 && (
        <View style={styles.footer}>
          <View style={styles.footerContent}>
            <View>
              <Text style={styles.totalItemsText}>{Object.keys(selectedPackages).length} items</Text>
              <Text style={styles.totalPriceText}>₹{totalPrice}</Text>
            </View>
            <TouchableOpacity style={styles.cartButton} onPress={handleViewCart}>
              <Text style={styles.cartButtonText}>View Cart</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5faf7',
    marginVertical:20,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  headerContainer: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    marginTop: 10,
  },
  headerText: {
    fontSize: 22,
    fontWeight: '600',
    color: '#1b5e20',
    marginBottom: 4,
  },
  subHeaderText: {
    fontSize: 15,
    color: '#4c8c4a',
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '500',
    color: '#2e7d32',
    marginTop: 8,
    marginBottom: 12,
    paddingLeft: 8,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#2e7d32',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#e8f5e9',
  },
  premiumCard: {
    borderColor: '#689f38',
    backgroundColor: '#f1f8e9',
  },
  premiumBadge: {
    position: 'absolute',
    top: -10,
    right: 16,
    backgroundColor: '#689f38',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
  },
  premiumBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1b5e20',
    marginBottom: 12,
  },
  featuresContainer: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  featuresColumn: {
    flex: 1,
  },
  featureText: {
    fontSize: 14,
    color: '#33691e',
    marginBottom: 6,
  },
  divider: {
    height: 1,
    backgroundColor: '#c8e6c9',
    marginVertical: 8,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  reportsText: {
    fontSize: 13,
    color: '#4c8c4a',
    marginBottom: 4,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  currentPrice: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2e7d32',
    marginRight: 8,
  },
  originalPrice: {
    fontSize: 14,
    color: '#a5d6a7',
    textDecorationLine: 'line-through',
  },
  savingsText: {
    fontSize: 13,
    color: '#2e7d32',
    fontWeight: '500',
  },
  addButton: {
    backgroundColor: '#43a047',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  removeButton: {
    backgroundColor: '#e53935',
  },
  addButtonText: {
    color: 'white',
    fontWeight: '500',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#e8f5e9',
    borderTopWidth: 1,
    borderTopColor: '#c8e6c9',
    padding: 16,
    shadowColor: '#2e7d32',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  footerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalItemsText: {
    fontSize: 14,
    color: '#4c8c4a',
  },
  totalPriceText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1b5e20',
  },
  cartButton: {
    backgroundColor: '#2e7d32',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 6,
  },
  cartButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  emptyText: {
    textAlign: 'center',
    color: '#81c784',
    marginTop: 40,
    fontSize: 16,
  },
});

export default CategoryTestsScreen;