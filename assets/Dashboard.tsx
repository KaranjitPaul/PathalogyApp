import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  Platform,
  Modal,
  Animated,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Category } from './packageData';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from './App'; 

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'HomeScreen'>;

const { width } = Dimensions.get('window');

// Navigation tabs constant
const NAV_TABS = [
  { name: 'home', icon: 'home', label: 'Home' },
  { name: 'reports', icon: 'description', label: 'Reports' },
  { name: 'appointments', icon: 'event', label: 'Appointments' },
  { name: 'profile', icon: 'person', label: 'Profile' }
];

// Categories constant with 8 items
const CATEGORIES = [
  { id: 1, label: 'Neurologist', icon: 'psychology' },
  { id: 2, label: 'Heart', icon: 'favorite' },
  { id: 3, label: 'Full Body', icon: 'accessibility' },
  { id: 4, label: 'Thyroid', icon: 'coronavirus' }, 
  { id: 5, label: 'Histopathology', icon: 'biotech' },
  { id: 6, label: 'Blood Test', icon: 'bloodtype' },
  { id: 19, label: 'Eye Test', icon: 'visibility' },
  { id: 8, label: 'Liver Test', icon: 'liquor' },
];

// Split categories into two rows
const firstRowCategories = CATEGORIES.slice(0, 4);
const secondRowCategories = CATEGORIES.slice(4, 8);

const HomeScreen = () => {
  const navigation = useNavigation<NavigationProp>();

  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentPackageSlide, setCurrentPackageSlide] = useState(0);
  const [currentWhySlide, setCurrentWhySlide] = useState(0);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showCameraModal, setShowCameraModal] = useState(false);
  const [user, setUser] = useState<{ name: string, email: string, phone: string } | null>(null);

  
  // Animation values for enhanced dropdown
  const [fadeAnim] = useState(new Animated.Value(0));
  const [scaleAnim] = useState(new Animated.Value(0.8));
  
  // Animation values for camera modal
  const [cameraFadeAnim] = useState(new Animated.Value(0));
  const [cameraScaleAnim] = useState(new Animated.Value(0.8));

  const onCategoryPress = (categoryLabel: Category) => {
    navigation.navigate('CategoryDetailScreen', { category: categoryLabel });
  };

  // Navigation function for notifications
  const handleNotificationPress = () => {
    // Navigate to notification screen
    navigation.navigate('NotificationScreen');
  };

  // Camera/Gallery selection functions
  const showCameraOptions = () => {
    setShowCameraModal(true);
    Animated.parallel([
      Animated.timing(cameraFadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.spring(cameraScaleAnim, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const hideCameraOptions = () => {
    Animated.parallel([
      Animated.timing(cameraFadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(cameraScaleAnim, {
        toValue: 0.8,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setShowCameraModal(false);
    });
  };

  const openCamera = () => {
    hideCameraOptions();
    const options = {
      mediaType: 'photo' as MediaType,
      includeBase64: false,
      maxHeight: 2000,
      maxWidth: 2000,
      quality: 0.8,
    };

    launchCamera(options, (response: ImagePickerResponse) => {
      if (response.didCancel || response.errorMessage) {
        return;
      }
      
      if (response.assets && response.assets[0]) {
        const imageUri = response.assets[0].uri;
        console.log('Camera image captured:', imageUri);
        // Handle the captured image here
        // You can navigate to a prescription upload screen or process the image
        handleImageSelected(imageUri);
      }
    });
  };

  const openGallery = () => {
    hideCameraOptions();
    const options = {
      mediaType: 'photo' as MediaType,
      includeBase64: false,
      maxHeight: 2000,
      maxWidth: 2000,
      quality: 0.8,
    };

    launchImageLibrary(options, (response: ImagePickerResponse) => {
      if (response.didCancel || response.errorMessage) {
        return;
      }
      
      if (response.assets && response.assets[0]) {
        const imageUri = response.assets[0].uri;
        console.log('Gallery image selected:', imageUri);
        // Handle the selected image here
        handleImageSelected(imageUri);
      }
    });
  };

  const handleImageSelected = (imageUri: string | undefined) => {
    if (imageUri) {
      // Show success message
      Alert.alert(
        'Success',
        'Prescription image captured successfully!',
        [
          {
            text: 'OK',
            onPress: () => {
              // Navigate to prescription upload screen or process the image
              // navigation.navigate('PrescriptionUploadScreen', { imageUri });
            }
          }
        ]
      );
    }
  };

  const appointments = [
    {
      id: 1,
      docName: 'Dr. Jennifer Smith',
      docDetails: 'Orthopedic Consultation (Foot & Ankle)',
      docImage: 'https://randomuser.me/api/portraits/women/44.jpg',
      date: 'Wed, 7 Sep 2024',
      time: '10:30 - 11:30 AM',
      bgColor: '#4CAF50',
    },
    {
      id: 2,
      docName: 'Dr. Michael Johnson',
      docDetails: 'Cardiology Checkup',
      docImage: 'https://randomuser.me/api/portraits/men/32.jpg',
      date: 'Thu, 8 Sep 2024',
      time: '02:15 - 03:00 PM',
      bgColor: '#2E7D32',
    },
    {
      id: 3,
      docName: 'Dr. Sarah Williams',
      docDetails: 'Neurology Follow-up',
      docImage: 'https://randomuser.me/api/portraits/women/63.jpg',
      date: 'Fri, 9 Sep 2024',
      time: '09:00 - 09:45 AM',
      bgColor: '#088555ff',
    }
  ];

  const healthPackages = [
    {
      id: 1,
      title: 'Fit India Full Body Checkup',
      subtitle: 'With Vitamin Screening & Free HsCRP',
      details: [
        { icon: 'access-time', text: '14 Hours Fasting' },
        { icon: 'description', text: '92 Parameters Tested' }
      ],
      tests: ['Heart', 'Diabetes', 'Lipid', 'Liver', 'Kidney'],
      originalPrice: '₹7614',
      discount: '79% OFF',
      currentPrice: '₹1599',
      vipPrice: '₹1439 With VIP',
      bgColor: '#E8F5E9'
    },
    {
      id: 2,
      title: 'Advanced Cardiac Care',
      subtitle: 'Complete Heart Health Assessment',
      details: [
        { icon: 'access-time', text: '12 Hours Fasting' },
        { icon: 'description', text: '64 Parameters Tested' }
      ],
      tests: ['Cholesterol', 'ECG', 'Echo', 'Stress', 'Angio'],
      originalPrice: '₹9540',
      discount: '72% OFF',
      currentPrice: '₹2699',
      vipPrice: '₹2429 With VIP',
      bgColor: '#E3F2FD'
    },
    {
      id: 3,
      title: 'Women Wellness Package',
      subtitle: 'Complete health check for women',
      details: [
        { icon: 'access-time', text: '10 Hours Fasting' },
        { icon: 'description', text: '78 Parameters Tested' }
      ],
      tests: ['Hormones', 'Thyroid', 'Vitamins', 'Bone', 'Cancer'],
      originalPrice: '₹6840',
      discount: '70% OFF',
      currentPrice: '₹2050',
      vipPrice: '₹1845 With VIP',
      bgColor: '#F3E5F5'
    }
  ];

  const whyBookWithUs = [
    {
      id: 1,
      title: "Accurate",
      description: "99.9% Precision",
      icon: "verified",
      bgColor: "#E8F5E9"
    },
    {
      id: 2,
      title: "Fast",
      description: "24h Reports",
      icon: "speed",
      bgColor: "#E3F2FD"
    },
    {
      id: 3,
      title: "Experts",
      description: "200+ Specialists",
      icon: "medical-services",
      bgColor: "#E8EAF6"
    },
    {
      id: 4,
      title: "Affordable",
      description: "Best Prices",
      icon: "price-check",
      bgColor: "#F1F8E9"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      const nextSlide = (currentSlide + 1) % appointments.length;
      setCurrentSlide(nextSlide);
    }, 3000);

    return () => clearInterval(interval);
  }, [currentSlide]);

  useEffect(() => {
    const packageInterval = setInterval(() => {
      const nextSlide = (currentPackageSlide + 1) % healthPackages.length;
      setCurrentPackageSlide(nextSlide);
    }, 4000);

    return () => clearInterval(packageInterval);
  }, [currentPackageSlide]);

  useEffect(() => {
    const whyInterval = setInterval(() => {
      const nextSlide = (currentWhySlide + 1) % whyBookWithUs.length;
      setCurrentWhySlide(nextSlide);
    }, 2000);

    return () => clearInterval(whyInterval);
  }, [currentWhySlide]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await AsyncStorage.getItem('user');
        if (userData) {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      }
    };

    fetchUser();
  }, []);



  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<MaterialIcons key={i} name="star" size={14} color="#FFC107" />);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<MaterialIcons key={i} name="star-half" size={14} color="#FFC107" />);
      } else {
        stars.push(<MaterialIcons key={i} name="star-border" size={14} color="#FFC107" />);
      }
    }
    
    return stars;
  };

  // Enhanced profile dropdown functions
  const showProfileModal = () => {
    setShowProfileDropdown(true);
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const hideProfileModal = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 0.8,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setShowProfileDropdown(false);
    });
  };

  const handleLogout = async () => {
  try {
    hideProfileModal(); // if you're using a modal
    await AsyncStorage.removeItem('user'); // clear saved user info
    console.log('User logged out');
    navigation.replace('Login'); // navigate to login screen or Splash
  } catch (error) {
    console.error('Logout error:', error);
  }
};

  const handleSettings = () => {
    hideProfileModal();
    // Navigate to settings screen
    console.log('Navigate to settings');
    // Example: navigation.navigate('SettingsScreen');
  };

  const handleEditProfile = () => {
    hideProfileModal();
    // Navigate to edit profile screen
    console.log('Navigate to edit profile');
    // Example: navigation.navigate('EditProfileScreen');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hello,</Text>
          <Text style={styles.username}>{user?.name}!</Text>
        </View>
        <View style={styles.headerRight}>
          {/* Updated notification button with press handler */}
          <TouchableOpacity 
            style={styles.iconContainer}
            onPress={handleNotificationPress}
            activeOpacity={0.7}
          >
            <MaterialIcons name="notifications" size={22} color="#333" />
            <View style={styles.notificationBadge} />
          </TouchableOpacity>
          
          {/* Enhanced Profile Picture Button */}
          <TouchableOpacity 
            onPress={showProfileModal}
            activeOpacity={0.8}
            style={styles.profileButton}
          >
            <Image
              source={{ uri: 'https://randomuser.me/api/portraits/men/75.jpg' }}
              style={styles.profileImage}
            />
            <View style={styles.onlineIndicator} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Enhanced Profile Dropdown Modal */}
      <Modal
        visible={showProfileDropdown}
        transparent={true}
        animationType="none"
        onRequestClose={hideProfileModal}
      >
        <Animated.View 
          style={[
            styles.modalOverlay,
            {
              opacity: fadeAnim,
            }
          ]}
        >
          <TouchableOpacity 
            style={styles.modalBackground}
            onPress={hideProfileModal}
            activeOpacity={1}
          >
            <Animated.View 
              style={[
                styles.profileDropdown,
                {
                  transform: [{ scale: scaleAnim }],
                  opacity: fadeAnim,
                }
              ]}
            >
              {/* Profile Header */}
              <View style={styles.profileHeader}>
                <View style={styles.profileImageContainer}>
                  <Image
                    source={{ uri: 'https://randomuser.me/api/portraits/men/75.jpg' }}
                    style={styles.profileDropdownImage}
                  />
                  <View style={styles.profileOnlineIndicator} />
                </View>
                <View style={styles.profileInfo}>
                  <Text style={styles.profileName}>{user?.name}</Text>
                  <Text style={styles.profileEmail}>{user?.email}</Text>
                  <Text style={styles.profilePhone}>{user?.phone}</Text>
                </View>
              </View>
              
              <View style={styles.dropdownDivider} />
              
              {/* Menu Items */}
              <View style={styles.menuContainer}>
                <TouchableOpacity style={styles.dropdownItem} onPress={handleSettings}>
                  <View style={styles.menuIconContainer}>
                    <MaterialIcons name="settings" size={20} color="#4CAF50" />
                  </View>
                  <Text style={styles.dropdownItemText}>Settings</Text>
                  <MaterialIcons name="chevron-right" size={20} color="#ccc" />
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.dropdownItem} onPress={() => {
                  hideProfileModal();
                  // Navigate to help screen
                }}>
                  <View style={styles.menuIconContainer}>
                    <MaterialIcons name="help-outline" size={20} color="#2196F3" />
                  </View>
                  <Text style={styles.dropdownItemText}>Help & Support</Text>
                  <MaterialIcons name="chevron-right" size={20} color="#ccc" />
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.dropdownItem} onPress={() => {
                  hideProfileModal();
                  // Navigate to privacy screen
                }}>
                  <View style={styles.menuIconContainer}>
                    <MaterialIcons name="privacy-tip" size={20} color="#FF9800" />
                  </View>
                  <Text style={styles.dropdownItemText}>Privacy Policy</Text>
                  <MaterialIcons name="chevron-right" size={20} color="#ccc" />
                </TouchableOpacity>
                
                <View style={styles.dropdownDivider} />
                
                <TouchableOpacity style={styles.dropdownItem} onPress={handleLogout}>
                  <View style={styles.menuIconContainer}>
                    <MaterialIcons name="logout" size={20} color="#FF5252" />
                  </View>
                  <Text style={[styles.dropdownItemText, { color: '#FF5252' }]}>Logout</Text>
                  <MaterialIcons name="chevron-right" size={20} color="#FF5252" />
                </TouchableOpacity>
              </View>
            </Animated.View>
          </TouchableOpacity>
        </Animated.View>
      </Modal>

      {/* Camera Options Modal */}
      <Modal
        visible={showCameraModal}
        transparent={true}
        animationType="none"
        onRequestClose={hideCameraOptions}
      >
        <Animated.View 
          style={[
            styles.cameraModalOverlay,
            {
              opacity: cameraFadeAnim,
            }
          ]}
        >
          <TouchableOpacity 
            style={styles.cameraModalBackground}
            onPress={hideCameraOptions}
            activeOpacity={1}
          >
            <Animated.View 
              style={[
                styles.cameraOptionsContainer,
                {
                  transform: [{ scale: cameraScaleAnim }],
                  opacity: cameraFadeAnim,
                }
              ]}
            >
              <View style={styles.cameraHeader}>
                <Text style={styles.cameraTitle}>Upload Prescription</Text>
                <Text style={styles.cameraSubtitle}>Choose an option to upload your prescription</Text>
              </View>
              
              <View style={styles.cameraOptionsWrapper}>
                <TouchableOpacity style={styles.cameraOption} onPress={openCamera}>
                  <View style={styles.cameraOptionIcon}>
                    <MaterialIcons name="camera-alt" size={30} color="#4CAF50" />
                  </View>
                  <Text style={styles.cameraOptionText}>Take Photo</Text>
                  <Text style={styles.cameraOptionSubtext}>Use camera to capture prescription</Text>
                </TouchableOpacity>
                
                <View style={styles.optionDivider} />
                
                <TouchableOpacity style={styles.cameraOption} onPress={openGallery}>
                  <View style={styles.cameraOptionIcon}>
                    <MaterialIcons name="photo-library" size={30} color="#2196F3" />
                  </View>
                  <Text style={styles.cameraOptionText}>Choose from Gallery</Text>
                  <Text style={styles.cameraOptionSubtext}>Select from existing photos</Text>
                </TouchableOpacity>
              </View>
              
              <TouchableOpacity style={styles.cancelButton} onPress={hideCameraOptions}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </Animated.View>
          </TouchableOpacity>
        </Animated.View>
      </Modal>

      {/* Search */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBox}>
          <MaterialIcons name="search" size={22} color="#4CAF50" />
          <TextInput 
            placeholder="Search for doctors, specialties..." 
            placeholderTextColor="#999"
            style={styles.input} 
          />
          <TouchableOpacity style={styles.cameraButton} onPress={showCameraOptions}>
            <MaterialIcons name="camera-alt" size={22} color="#4CAF50" />
          </TouchableOpacity>
        </View>
      </View>
      
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Categories Section - 2 Rows */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Categories</Text>
        </View>
        
        <View style={styles.twoRowsContainer}>
          {/* First Row Items */}
          {firstRowCategories.map((cat) => (
            <TouchableOpacity 
              key={`first-${cat.id}`} 
              style={styles.categoryItem} 
              onPress={() => onCategoryPress(cat.label as Category)}
            >
              <View style={styles.categoryIconContainer}>
                <MaterialIcons name={cat.icon} size={22} color="#4CAF50" />
              </View>
              <Text style={styles.categoryText}>{cat.label}</Text>
            </TouchableOpacity>
          ))}

          {/* Second Row Items */}
          {secondRowCategories.map((cat) => (
            <TouchableOpacity 
              key={`second-${cat.id}`} 
              style={styles.categoryItem}
              onPress={() => onCategoryPress(cat.label as Category)}
            >
              <View style={styles.categoryIconContainer}>
                <MaterialIcons name={cat.icon} size={22} color="#4CAF50" />
              </View>
              <Text style={styles.categoryText}>{cat.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Upcoming Appointment */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Upcoming Appointment</Text>
          <TouchableOpacity>
            <Text style={styles.viewAll}>View All</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.appointmentSlider}>
          <View style={[styles.appointmentCard, { 
            width: width - 40,
            backgroundColor: appointments[currentSlide].bgColor,
          }]}>
            <View style={styles.row}>
              <Image
                source={{ uri: appointments[currentSlide].docImage }}
                style={styles.docImage}
              />
              <View style={styles.docInfo}>
                <Text style={styles.docName}>{appointments[currentSlide].docName}</Text>
                <Text style={styles.docDetails}>{appointments[currentSlide].docDetails}</Text>
              </View>
            </View>
            <View style={styles.rowInfo}>
              <View style={styles.infoItem}>
                <MaterialIcons name="calendar-today" size={18} color="#fff" />
                <Text style={styles.infoText}>{appointments[currentSlide].date}</Text>
              </View>
              <View style={styles.infoItem}>
                <MaterialIcons name="access-time" size={18} color="#fff" />
                <Text style={styles.infoText}>{appointments[currentSlide].time}</Text>
              </View>
            </View>
            <View style={styles.appointmentBadge}>
              <Text style={styles.badgeText}>Upcoming</Text>
            </View>
          </View>
        </View>

        {/* Indicator dots */}
        <View style={styles.indicatorContainer}>
          {appointments.map((_, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => setCurrentSlide(index)}
            >
              <View 
                style={[
                  styles.indicatorDot,
                  index === currentSlide ? styles.activeDot : null
                ]}
              />
            </TouchableOpacity>
          ))}
        </View>

        {/* Recent Visit */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>My Recent Visit</Text>
          <TouchableOpacity>
            <Text style={styles.viewAll}>View All</Text>
          </TouchableOpacity>
        </View>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.recentContainer}
        >
          {[
            {
              name: 'Dr. Warner',
              specialty: 'Neurology',
              experience: '5 years experience',
              image: 'https://randomuser.me/api/portraits/men/20.jpg',
              rating: 4.5
            },
            {
              name: 'Dr. Rajesh',
              specialty: 'Cardiologist',
              experience: '10 years experience',
              image: 'https://randomuser.me/api/portraits/men/30.jpg',
              rating: 4.8
            },
            {
              name: 'Dr. Emily Chen',
              specialty: 'Dermatology',
              experience: '7 years experience',
              image: 'https://randomuser.me/api/portraits/women/45.jpg',
              rating: 4.2
            }
          ].map((doctor, index) => (
            <View key={index} style={styles.recentCard}>
              <Image
                source={{ uri: doctor.image }}
                style={styles.recentImage}
              />
              <Text style={styles.recentName}>{doctor.name}</Text>
              <Text style={styles.recentSpecialty}>{doctor.specialty}</Text>
              <Text style={styles.recentExperience}>{doctor.experience}</Text>
              <View style={styles.ratingContainer}>
                {renderStars(doctor.rating)}
                <Text style={styles.ratingText}>{doctor.rating}</Text>
              </View>
              <TouchableOpacity style={styles.bookBtn}>
                <Text style={styles.bookBtnText}>Book Again</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>

        {/* Top Booked Health Packages */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Top Booked Health Packages</Text>
          <TouchableOpacity>
            <Text style={styles.viewAll}>View All</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.packagesContainer}>
          <View style={[styles.packageCard, { 
            width: width - 32,
            backgroundColor: healthPackages[currentPackageSlide].bgColor
          }]}>
            <View style={styles.packageHeader}>
              <Text style={styles.packageTitle}>{healthPackages[currentPackageSlide].title}</Text>
              <Text style={styles.packageSubtitle}>{healthPackages[currentPackageSlide].subtitle}</Text>
            </View>
            
            <View style={styles.packageDetails}>
              {healthPackages[currentPackageSlide].details.map((detail, i) => (
                <View key={i} style={styles.detailItem}>
                  <MaterialIcons name={detail.icon} size={16} color="#4CAF50" />
                  <Text style={styles.detailText}>{detail.text}</Text>
                </View>
              ))}
            </View>
            
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              style={styles.testsContainer}
            >
              {healthPackages[currentPackageSlide].tests.map((test, i) => (
                <View key={i} style={styles.testPill}>
                  <Text style={styles.testText}>{test}</Text>
                </View>
              ))}
            </ScrollView>
            
            <View style={styles.priceContainer}>
              <View>
                <Text style={styles.originalPrice}>{healthPackages[currentPackageSlide].originalPrice}</Text>
                <Text style={styles.discount}>{healthPackages[currentPackageSlide].discount}</Text>
              </View>
              <Text style={styles.currentPrice}>{healthPackages[currentPackageSlide].currentPrice}</Text>
              <TouchableOpacity style={styles.bookButton}>
                <Text style={styles.bookButtonText}>Book</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.vipContainer}>
              <MaterialIcons name="star" size={14} color="#FFA000" />
              <Text style={styles.vipText}>{healthPackages[currentPackageSlide].vipPrice}</Text>
            </View>
          </View>

          {/* Package indicator dots */}
          <View style={styles.packageIndicatorContainer}>
            {healthPackages.map((_, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => setCurrentPackageSlide(index)}
              >
                <View 
                  style={[
                    styles.packageIndicatorDot,
                    index === currentPackageSlide ? styles.packageActiveDot : null
                  ]}
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Why Book With Us Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Why Book With Us?</Text>
        </View>
        
        <View style={styles.whySlider}>
          <View style={[styles.whyContent, { backgroundColor: whyBookWithUs[currentWhySlide].bgColor }]}>
            <View style={styles.whyIconContainer}>
              <MaterialIcons name={whyBookWithUs[currentWhySlide].icon} size={24} color="#4CAF50" />
            </View>
            <Text style={styles.whyTitle}>{whyBookWithUs[currentWhySlide].title}</Text>
            <Text style={styles.whyDescription}>{whyBookWithUs[currentWhySlide].description}</Text>
          </View>
        </View>
        
        {/* Stay Healthy Tips Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Stay Healthy Tips</Text>
        </View>

        <View style={styles.healthTipsContainer}>
          {/* Men's Health */}
          <View style={styles.genderTipsContainer}>
            <Text style={styles.genderTitle}>For Men</Text>
            <View style={styles.tipItem}>
              <MaterialIcons name="fitness-center" size={18} color="#2196F3" />
              <Text style={styles.tipText}>Regular exercise (30 mins/day)</Text>
            </View>
            <View style={styles.tipItem}>
              <MaterialIcons name="monitor-heart" size={18} color="#2196F3" />
              <Text style={styles.tipText}>Annual heart checkups after 30</Text>
            </View>
            <View style={styles.tipItem}>
              <MaterialIcons name="no-drinks" size={18} color="#2196F3" />
              <Text style={styles.tipText}>Limit alcohol to 2 drinks/day</Text>
            </View>
            <View style={styles.tipItem}>
              <MaterialIcons name="psychology" size={18} color="#2196F3" />
              <Text style={styles.tipText}>Manage stress with meditation</Text>
            </View>
          </View>

          {/* Women's Health */}
          <View style={styles.genderTipsContainer}>
            <Text style={styles.genderTitle}>For Women</Text>
            <View style={styles.tipItem}>
              <MaterialIcons name="pregnant-woman" size={18} color="#E91E63" />
              <Text style={styles.tipText}>Regular gynecological exams</Text>
            </View>
            <View style={styles.tipItem}>
              <MaterialIcons name="local-florist" size={18} color="#E91E63" />
              <Text style={styles.tipText}>Calcium-rich diet for bone health</Text>
            </View>
            <View style={styles.tipItem}>
              <MaterialIcons name="self-improvement" size={18} color="#E91E63" />
              <Text style={styles.tipText}>Yoga for hormonal balance</Text>
            </View>
            <View style={styles.tipItem}>
              <MaterialIcons name="mood" size={18} color="#E91E63" />
              <Text style={styles.tipText}>Prioritize mental health checkups</Text>
            </View>
          </View>
        </View>
        
        {/* Footer */}
        <View style={styles.footerContainer}>
          <Image 
            source={{ uri: '' }}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.careText}>We always care for your health</Text>
          <Text style={styles.madeInIndia}>Made in India</Text>
        </View>
        
        {/* Add spacing for content */}
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f8faff',
  },
  header: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  greeting: {
    fontSize: 18,
    color: '#444',
  },
  username: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#222',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    marginRight: 12,
    padding: 8,
    backgroundColor: '#eee',
    borderRadius: 50,
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: 5,
    right: 5,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF5252',
  },
  // Enhanced Profile Button Styles
  profileButton: {
    position: 'relative',
  },
  profileImage: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 2,
    borderColor: '#4CAF50',
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#4CAF50',
    borderWidth: 2,
    borderColor: '#fff',
  },
  // Enhanced Profile Dropdown Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingRight: 20,
  },
  profileDropdown: {
    backgroundColor: '#fff',
    borderRadius: 20,
    width: 320,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 12,
    overflow: 'hidden',
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#f8f9fa',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  profileImageContainer: {
    position: 'relative',
    marginRight: 16,
  },
  profileDropdownImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 3,
    borderColor: '#4CAF50',
  },
  profileOnlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#4CAF50',
    borderWidth: 3,
    borderColor: '#fff',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  profilePhone: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  editProfileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#E8F5E9',
    borderRadius: 16,
    alignSelf: 'flex-start',
  },
  editProfileText: {
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: '600',
    marginLeft: 4,
  },
  dropdownDivider: {
    height: 1,
    backgroundColor: '#e9ecef',
    marginHorizontal: 0,
  },
  menuContainer: {
    paddingVertical: 8,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: '#fff',
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  dropdownItemText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
    flex: 1,
  },
  // Camera Modal Styles
  cameraModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  cameraModalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  cameraOptionsContainer: {
    backgroundColor: '#fff',
    borderRadius: 20,
    width: '100%',
    maxWidth: 350,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 15,
    overflow: 'hidden',
  },
  cameraHeader: {
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    alignItems: 'center',
  },
  cameraTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  cameraSubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
  cameraOptionsWrapper: {
    paddingVertical: 16,
  },
  cameraOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 20,
    backgroundColor: '#fff',
  },
  cameraOptionIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  cameraOptionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  cameraOptionSubtext: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
    flex: 1,
  },
  optionDivider: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginHorizontal: 24,
  },
  cancelButton: {
    margin: 16,
    paddingVertical: 14,
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  searchContainer: {
    marginVertical: 15,
    paddingHorizontal: 20,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 12,
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  input: {
    marginLeft: 10,
    fontSize: 16,
    flex: 1,
    color: '#333',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  cameraButton: {
    marginLeft: 10,
    padding: 8,
    backgroundColor: '#E8F5E9',
    borderRadius: 20,
  },
  twoRowsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',    
    justifyContent: 'center',
    marginBottom: 16,
  },
  categoryItem: {
    alignItems: 'center',
    margin: 8,
    width: '20%',          
    minWidth: 80,           
  },
  categoryIconContainer: {
    backgroundColor: '#E8F5E9',
    borderRadius: 10,
    padding: 10,
    marginBottom: 4,
  },
  categoryText: {
    fontSize: 12,
    color: '#333',
    textAlign: 'center',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 12,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  viewAll: {
    color: '#4CAF50',
    fontSize: 14,
    fontWeight: '500',
  },
  whySlider: {
    height: 120,
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  whyContent: {
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  whyIconContainer: {
    backgroundColor: '#fff',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  whyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
  whyDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginTop: 4,
  },
  appointmentSlider: {
    marginBottom: 10,
    height: 180,
    paddingLeft: 20,
  },
  appointmentCard: {
    borderRadius: 16,
    padding: 20,
    marginRight: 20,
    justifyContent: 'space-between',
    height: 160,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  docInfo: {
    flex: 1,
  },
  docImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.5)',
  },
  docName: {
    fontSize: 18,
    color: '#fff',
    fontWeight: '600',
    marginBottom: 4,
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  docDetails: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    lineHeight: 20,
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  rowInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  infoText: {
    marginLeft: 6,
    color: '#fff',
    fontSize: 13,
    fontWeight: '500',
  },
  appointmentBadge: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 5,
  },
  indicatorDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E0E0E0',
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#4CAF50',
    width: 20,
  },
  recentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  recentCard: {
    width: 160,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginRight: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  recentImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#E8F5E9',
  },
  recentName: {
    fontWeight: '600',
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  },
  recentSpecialty: {
    color: '#4CAF50',
    fontSize: 14,
    fontWeight: '500',
    marginTop: 4,
    textAlign: 'center',
  },
  recentExperience: {
    fontSize: 12,
    color: '#777',
    marginVertical: 6,
    textAlign: 'center',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  ratingText: {
    marginLeft: 5,
    fontSize: 12,
    color: '#666',
  },
  bookBtn: {
    backgroundColor: '#4CAF50',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    width: '100%',
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  bookBtnText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  packagesContainer: {
    marginBottom: 20,
    paddingLeft: 20,
  },
  packageCard: {
    borderRadius: 16,
    padding: 20,
    marginRight: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  packageHeader: {
    marginBottom: 15,
  },
  packageTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  packageSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  packageDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    marginLeft: 6,
    fontSize: 13,
    color: '#555',
  },
  testsContainer: {
    marginBottom: 20,
  },
  testPill: {
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  testText: {
    color: '#4CAF50',
    fontSize: 12,
    fontWeight: '500',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  originalPrice: {
    fontSize: 14,
    color: '#999',
    textDecorationLine: 'line-through',
  },
  discount: {
    fontSize: 12,
    color: '#FF5722',
    fontWeight: 'bold',
    marginTop: 2,
  },
  currentPrice: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    marginLeft: 15,
  },
  bookButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 25,
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  bookButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  vipContainer: {
    backgroundColor: '#FFF8E1',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
  },
  vipText: {
    color: '#FFA000',
    fontSize: 13,
    fontWeight: '500',
    marginLeft: 5,
  },
  packageIndicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
  },
  packageIndicatorDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E0E0E0',
    marginHorizontal: 4,
  },
  packageActiveDot: {
    backgroundColor: '#4CAF50',
    width: 20,
  },
  healthTipsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  genderTipsContainer: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  genderTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  tipText: {
    marginLeft: 10,
    fontSize: 13,
    color: '#555',
    flexShrink: 1,
  },
  footerContainer: {
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 20,
    backgroundColor: '#F7F8FA',
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 16,
  },
  careText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4CAF50',
    marginBottom: 8,
    textAlign: 'center',
  },
  madeInIndia: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
});

export default HomeScreen;

function launchCamera(options: { mediaType: MediaType; includeBase64: boolean; maxHeight: number; maxWidth: number; quality: number; }, arg1: (response: ImagePickerResponse) => void) {
  throw new Error('Function not implemented.');
}


function launchImageLibrary(options: { mediaType: MediaType; includeBase64: boolean; maxHeight: number; maxWidth: number; quality: number; }, arg1: (response: ImagePickerResponse) => void) {
  throw new Error('Function not implemented.');
}
