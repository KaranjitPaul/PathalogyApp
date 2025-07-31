import React, { useState } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  StyleSheet, 
  StatusBar,
  Alert
} from 'react-native';

// Classic icons for pathology app
const IconComponent = ({ type, size = 22, color = '#555' }) => {
  const getIcon = (type: any) => {
    switch (type) {
      case 'report': return '🧾';
      case 'test': return '🩺';
      case 'reminder': return '⏰';
      case 'offer': return '💸';
      case 'welcome': return '👋';
      default: return '🔔';
    }
  };
  return (
    <Text style={{ fontSize: size, color }}>{getIcon(type)}</Text>
  );
};

const NotificationScreen = () => {
  const [notifications] = useState([
    {
      id: 1,
      type: 'welcome',
      title: 'Welcome!',
      message: 'Thank you for choosing PathoLab. Track all your lab reports here.',
      time: 'Just now',
      icon: 'welcome',
      priority: 'low',
    },
    {
      id: 2,
      type: 'report',
      title: 'CBC Report Ready',
      message: 'Your Complete Blood Count (CBC) results are now available.',
      time: '10 min ago',
      icon: 'report',
      priority: 'high',
    },
    {
      id: 3,
      type: 'reminder',
      title: 'Lab Appointment Reminder',
      message: 'You have an appointment at PathoLab today at 11:00 AM.',
      time: '1 hour ago',
      icon: 'reminder',
      priority: 'medium',
    },
    {
      id: 4,
      type: 'test',
      title: 'New Test Result: Lipid Profile',
      message: 'Your Lipid Profile results are ready for review.',
      time: 'Yesterday',
      icon: 'test',
      priority: 'high',
    },
    {
      id: 5,
      type: 'offer',
      title: 'Special Offer',
      message: 'Get 20% OFF on Thyroid tests. Valid till July 31.',
      time: '2 days ago',
      icon: 'offer',
      priority: 'low',
    },
  ]);

  // Notification priority color (background)
  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case 'high': return '#FEE2E2'; // Light pink
      case 'medium': return '#FEF9C3'; // Light yellow
      default: return '#F3F4F6'; // Grayish
    }
  };

  const handleNotificationPress = (notification: { id?: number; type?: string; title: any; message: any; time?: string; icon?: string; priority?: string; }) => {
    Alert.alert(notification.title, notification.message);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <ScrollView style={styles.notificationsList}>
        {notifications.map((notification) => (
          <TouchableOpacity
            key={notification.id}
            style={[
              styles.notificationItem,
              { backgroundColor: getPriorityColor(notification.priority) }
            ]}
            onPress={() => handleNotificationPress(notification)}
          >
            <View style={styles.notificationRow}>
              <IconComponent type={notification.icon} size={26} />
              <View style={styles.notificationTextBlock}>
                <Text style={styles.title}>{notification.title}</Text>
                <Text style={styles.message}>{notification.message}</Text>
                <Text style={styles.time}>{notification.time}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  header: {
    marginVertical:40,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    backgroundColor: '#F3F4F6',
  },
  headerTitle: { 
    marginVertical:40,
    fontSize: 20, 
    fontWeight: '600', 
    color: '#323232',
  },
  notificationsList: { flex: 1, paddingHorizontal: 12, marginTop: 62 },
  notificationItem: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 10,
    paddingVertical: 12,
    paddingHorizontal: 12,
  },
  notificationRow: { flexDirection: 'row', alignItems: 'flex-start' },
  notificationTextBlock: { marginLeft: 12, flex: 1 },
  title: { fontSize: 15, fontWeight: '600', color: '#222' },
  message: { fontSize: 13, color: '#555', marginTop: 2 },
  time: { fontSize: 12, color: '#888', marginTop: 3 },
});

export default NotificationScreen;
