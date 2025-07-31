import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Alert,
  TextInput,
  Dimensions
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons'; // Vector icons import

const { width } = Dimensions.get('window');

const sampleAppointments = [
  {
    id: '1',
    date: '2025-07-25',
    time: '10:00 AM',
    title: 'Comprehensive Blood Analysis',
    type: 'Laboratory Testing',
    status: 'completed',
    labName: 'Metropolitan Diagnostic Center',
    address: '1250 Park Avenue, Medical District',
    token: 'MDC-1024',
    tests: ['Complete Blood Count', 'Comprehensive Metabolic Panel', 'Lipid Profile'],
    preparation: 'Fasting required for 12 hours prior to appointment',
    amount: 2850,
    paymentStatus: 'paid',
    doctor: 'Dr. Smith',
    estimatedDuration: '1 hour'
  },
  {
    id: '2',
    date: '2025-07-27',
    time: '3:00 PM',
    title: 'Executive Health Consultation',
    type: 'Consultation',
    status: 'upcoming',
    labName: 'Prestige Medical Clinic',
    address: '890 Executive Boulevard, Business District',
    token: 'PMC-1025',
    tests: ['Executive Physical Examination'],
    preparation: 'Please bring previous medical records',
    amount: 1500,
    paymentStatus: 'paid',
    doctor: 'Dr. Lee',
    estimatedDuration: '45 minutes'
  },
  {
    id: '3',
    date: '2025-07-28',
    time: '2:30 PM',
    title: 'Premium Health Assessment',
    type: 'Comprehensive Screening',
    status: 'missed',
    labName: 'Elite Wellness Center',
    address: '456 Wellness Plaza, Healthcare Quarter',
    token: 'EWC-1042',
    tests: ['Full Body Scan', 'Cardiac Assessment', 'Neurological Screening', 'Hormonal Panel'],
    preparation: 'Fasting required for 10-12 hours',
    amount: 8500,
    paymentStatus: 'paid',
    doctor: 'Dr. Patel',
    estimatedDuration: '2 hours'
  },
  {
    id: '4',
    date: '2025-07-30',
    time: '11:15 AM',
    title: 'Advanced Vision Assessment',
    type: 'Ophthalmology',
    status: 'upcoming',
    labName: 'Premier Vision Institute',
    address: '789 Ophthalmology Center, Vision District',
    token: 'PVI-1043',
    tests: ['Comprehensive Eye Examination', 'Retinal Imaging', 'Glaucoma Screening'],
    preparation: 'Avoid wearing contact lenses 24 hours prior',
    amount: 2200,
    paymentStatus: 'paid',
    doctor: 'Dr. Johnson',
    estimatedDuration: '1 hour'
  },
  {
    id: '5',
    date: '2025-08-05',
    time: '9:00 AM',
    title: 'Rehabilitation Consultation',
    type: 'Physical Therapy',
    status: 'upcoming',
    labName: 'Advanced Rehabilitation Center',
    address: '321 Recovery Avenue, Wellness Quarter',
    token: 'ARC-1044',
    tests: ['Musculoskeletal Assessment', 'Range of Motion Analysis'],
    preparation: 'Wear comfortable athletic clothing',
    amount: 3200,
    paymentStatus: 'pending',
    doctor: 'Dr. Kumar',
    estimatedDuration: '1 hour 30 minutes'
  }
];

const AppointmentScreen = () => {
  // State declarations
  const [appointments, setAppointments] = useState(sampleAppointments);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showModal, setShowModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [rescheduleModal, setRescheduleModal] = useState(false);
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [activeTab, setActiveTab] = useState('calendar');

  // Helper functions
  const getDaysInMonth = (date: Date) =>
    new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();

  const getFirstDayOfMonth = (date: Date) =>
    new Date(date.getFullYear(), date.getMonth(), 1).getDay();

  const formatDate = (date: Date) => date.toISOString().split('T')[0];

  // Check if a date has an appointment
  const hasAppointment = (date: Date) =>
    appointments.some(apt => apt.date === formatDate(date));

  // Get appointment status for a date (if any)
  const getAppointmentStatus = (date: Date) => {
    const apt = appointments.find(apt => apt.date === formatDate(date));
    return apt ? apt.status : null;
  };

  // Format date for display
  const formatDateDisplay = (dateString: string | number | Date) => {
    const date = new Date(dateString);
    const options = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
    return date.toLocaleDateString('en-US', options);
  };

  // Render the calendar grid
  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDay = getFirstDayOfMonth(currentMonth);
    const days = [];
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    // Day headers
    const dayHeaders = dayNames.map(day => (
      <View key={day} style={styles.dayHeader}>
        <Text style={styles.dayHeaderText}>{day}</Text>
      </View>
    ));

    // Empty cells for first weekday offset
    for (let i = 0; i < firstDay; i++) {
      days.push(<View key={`empty-${i}`} style={styles.dayCell} />);
    }

    // Days with appointments and highlighting
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      const hasApt = hasAppointment(date);
      const status = getAppointmentStatus(date);
      const isSelected = formatDate(date) === formatDate(selectedDate);
      const isToday = formatDate(date) === formatDate(new Date());

      days.push(
        <TouchableOpacity
          key={day}
          style={styles.dayCell}
          onPress={() => setSelectedDate(date)}
          activeOpacity={0.8}
        >
          {/* Show circles behind numbers */}
          {isSelected ? (
            <View style={styles.selectedDayCircle} />
          ) : isToday ? (
            <View style={styles.todayCircle} />
          ) : null}

          <Text
            style={[
              styles.dayText,
              isSelected && styles.selectedDayText,
              !isSelected && isToday && styles.todayText,
              hasApt && styles.appointmentDayText
            ]}
          >
            {day}
          </Text>

          {/* Small dot for appointment status */}
          {hasApt && (
            <View
              style={[
                styles.appointmentDot,
                status === 'completed'
                  ? styles.completedDot
                  : status === 'missed'
                  ? styles.missedDot
                  : styles.upcomingDot
              ]}
            />
          )}
        </TouchableOpacity>
      );
    }

    return (
      <View style={styles.calendar}>
        {/* Month navigation */}
        <View style={styles.monthHeader}>
          <TouchableOpacity
            onPress={() =>
              setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))
            }
            style={styles.monthButton}
          >
            <Ionicons name="chevron-back" size={26} color="#2E7D32" />
          </TouchableOpacity>
          <Text style={styles.monthTitle}>
            {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </Text>
          <TouchableOpacity
            onPress={() =>
              setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))
            }
            style={styles.monthButton}
          >
            <Ionicons name="chevron-forward" size={26} color="#2E7D32" />
          </TouchableOpacity>
        </View>

        {/* Weekday headers */}
        <View style={styles.dayHeaderRow}>{dayHeaders}</View>

        {/* Days */}
        <View style={styles.daysGrid}>{days}</View>
      </View>
    );
  };

  // Filter appointments based on tab
  const getAppointmentsForDate = (date: Date) =>
    appointments.filter(apt => apt.date === formatDate(date));

  const getFilteredAppointments = () => {
    if (activeTab === 'upcoming') {
      return appointments.filter(app => app.status !== 'completed');
    } else if (activeTab === 'history') {
      return appointments.filter(app => app.status === 'completed');
    }
    return appointments;
  };

  // Handlers for appointments
  const handleAppointmentPress = (appointment: React.SetStateAction<null>) => {
    setSelectedAppointment(appointment);
    setShowModal(true);
  };

  const handleReschedule = () => {
    setShowModal(false);
    setRescheduleModal(true);
    setNewDate(selectedAppointment.date);
    setNewTime(selectedAppointment.time);
  };

  const confirmReschedule = () => {
    if (!newDate || !newTime) {
      Alert.alert('Error', 'Please enter both new date and time.');
      return;
    }
    const updatedAppointments = appointments.map(apt =>
      apt.id === selectedAppointment.id ? { ...apt, date: newDate, time: newTime } : apt
    );
    setAppointments(updatedAppointments);
    setRescheduleModal(false);
    Alert.alert('Success', 'Appointment rescheduled successfully!');
  };

  const handleCancel = () => {
    Alert.alert(
      'Cancel Appointment',
      'Are you sure you want to cancel this appointment?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes',
          style: 'destructive',
          onPress: () => {
            setAppointments(appointments.filter(apt => apt.id !== selectedAppointment.id));
            setShowModal(false);
            Alert.alert('Success', 'Appointment cancelled successfully!');
          }
        }
      ]
    );
  };

  const handleDownloadReport = () => {
    Alert.alert('Download Report', 'Medical report download initiated.');
  };

  const handleDownloadInvoice = () => {
    Alert.alert('Download Invoice', 'Invoice PDF download initiated.');
  };

  const openDownloadOptions = (appointment: { id: string; date: string; time: string; title: string; type: string; status: string; labName: string; address: string; token: string; tests: string[]; preparation: string; amount: number; paymentStatus: string; doctor: string; estimatedDuration: string; }) => {
    Alert.alert(
      'Download',
      'Choose file to download:',
      [
        { text: 'Report PDF', onPress: () => handleDownloadReport() },
        { text: 'Invoice PDF', onPress: () => handleDownloadInvoice() },
        { text: 'Cancel', style: 'cancel' }
      ],
      { cancelable: true }
    );
  };

  const selectedDateAppointments = getAppointmentsForDate(selectedDate);
  const filteredAppointments = getFilteredAppointments();

  // Render tab content based on activeTab
  const renderTabContent = () => {
    if (activeTab === 'calendar') {
      return (
        <>
          {renderCalendar()}

          <View style={styles.legend}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, styles.completedDot]} />
              <Text style={styles.legendText}>Completed</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, styles.upcomingDot]} />
              <Text style={styles.legendText}>Upcoming</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, styles.missedDot]} />
              <Text style={styles.legendText}>Missed</Text>
            </View>
          </View>

          <View style={styles.appointmentSection}>
            <Text style={styles.sectionTitle}>
              Appointments for{' '}
              {selectedDate.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </Text>

            {selectedDateAppointments.length === 0 ? (
              <View style={styles.noAppointments}>
                <Ionicons name="calendar-outline" size={48} color="#1B5E20" style={{ marginBottom: 14 }} />
                <Text style={styles.noAppointmentsText}>No appointments scheduled</Text>
                <Text style={styles.noAppointmentsSubtext}>for this date</Text>
              </View>
            ) : (
              selectedDateAppointments.map(appointment => (
                <TouchableOpacity
                  key={appointment.id}
                  style={styles.appointmentCard}
                  onPress={() => handleAppointmentPress(appointment)}
                  activeOpacity={0.9}
                >
                  <View style={styles.appointmentHeader}>
                    <Text style={styles.appointmentTitle} numberOfLines={2}>
                      {appointment.title}
                    </Text>
                    <View
                      style={[
                        styles.statusBadge,
                        {
                          backgroundColor:
                            appointment.status === 'completed'
                              ? '#388E3C'
                              : appointment.status === 'missed'
                              ? '#D32F2F'
                              : '#4CAF50'
                        }
                      ]}
                    >
                      <Text style={styles.statusText}>{appointment.status.toUpperCase()}</Text>
                    </View>
                  </View>
                  <Text style={styles.appointmentTime}>{appointment.time}</Text>
                  <Text style={styles.appointmentDoctor}>{appointment.doctor}</Text>
                  <Text style={styles.appointmentType}>{appointment.type}</Text>
                  <View style={styles.appointmentFooter}>
                    <Text style={styles.appointmentToken}>Token: {appointment.token}</Text>
                    <Text style={styles.appointmentAmount}>₹{appointment.amount.toLocaleString()}</Text>
                  </View>
                </TouchableOpacity>
              ))
            )}
          </View>
        </>
      );
    } else {
      return (
        <ScrollView style={styles.listContainer} showsVerticalScrollIndicator={false}>
          {filteredAppointments.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="medkit-outline" size={72} color="#1B5E20" style={{ marginBottom: 20 }} />
              <Text style={styles.emptyText}>
                No {activeTab === 'upcoming' ? 'upcoming' : 'completed'} appointments
              </Text>
              <Text style={styles.emptySubtext}>
                {activeTab === 'upcoming' ? 'Schedule your next visit' : 'Your medical history will appear here'}
              </Text>
            </View>
          ) : (
            filteredAppointments.map(appointment => (
              <View key={appointment.id} style={styles.detailedCard}>
                <View style={styles.cardHeader}>
                  <View style={styles.cardHeaderLeft}>
                    <Text style={styles.appointmentTypeTitle} numberOfLines={2}>
                      {appointment.title}
                    </Text>
                    <View style={styles.dateTimeContainer}>
                      <Ionicons name="calendar" size={16} color="#689F38" style={{ marginRight: 8 }} />
                      <Text style={styles.dateTimeText}>
                        {formatDateDisplay(appointment.date)} • {appointment.time}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.tokenContainer}>
                    <Text style={styles.tokenLabel}>TOKEN</Text>
                    <Text style={styles.tokenNumber}>{appointment.token}</Text>
                  </View>
                </View>

                <View style={styles.statusChipContainer}>
                  <View
                    style={[
                      styles.statusChip,
                      {
                        backgroundColor:
                          appointment.status === 'completed'
                            ? '#388E3C'
                            : appointment.status === 'missed'
                            ? '#D32F2F'
                            : '#4CAF50'
                      }
                    ]}
                  >
                    <Text style={styles.statusChipText}>
                      {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                    </Text>
                  </View>
                </View>

                <View style={styles.labInfoContainer}>
                  <View style={styles.labIcon}>
                    <Ionicons name="business-outline" size={20} color="#4CAF50" />
                  </View>
                  <View style={styles.labTextContainer}>
                    <Text style={styles.labName}>{appointment.labName}</Text>
                    <Text style={styles.labAddress}>{appointment.address}</Text>
                  </View>
                </View>

                <View style={styles.section}>
                  <Text style={styles.sectionTitleSmall}>Medical Procedures</Text>
                  <View style={styles.testsContainer}>
                    {appointment.tests.map((test, index) => (
                      <View key={index} style={styles.testChip}>
                        <Text style={styles.testChipText}>{test}</Text>
                      </View>
                    ))}
                  </View>
                </View>

                <View style={styles.detailsContainer}>
                  <View style={styles.detailRow}>
                    <Ionicons
                      name="person-outline"
                      size={16}
                      color="#1B5E20"
                      style={styles.detailIcon}
                    />
                    <Text style={styles.detailText}>Physician: {appointment.doctor}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Ionicons
                      name="time-outline"
                      size={16}
                      color="#1B5E20"
                      style={styles.detailIcon}
                    />
                    <Text style={styles.detailText}>Duration: {appointment.estimatedDuration}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Ionicons
                      name="clipboard-outline"
                      size={16}
                      color="#1B5E20"
                      style={styles.detailIcon}
                    />
                    <Text style={styles.detailText}>Preparation: {appointment.preparation}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Ionicons
                      name="cash-outline"
                      size={16}
                      color="#1B5E20"
                      style={styles.detailIcon}
                    />
                    <Text style={styles.detailText}>
                      Fee: ₹{appointment.amount.toLocaleString()} •{' '}
                      {appointment.paymentStatus.toUpperCase()}
                    </Text>
                  </View>
                </View>

                <View style={styles.cardActions}>
                  {appointment.status === 'upcoming' && (
                    <>
                      <TouchableOpacity
                        style={styles.rescheduleButton}
                        onPress={() => {
                          setSelectedAppointment(appointment);
                          handleReschedule();
                        }}
                        activeOpacity={0.8}
                      >
                        <Text style={styles.buttonText}>RESCHEDULE</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.cancelButton}
                        onPress={() => {
                          setSelectedAppointment(appointment);
                          handleCancel();
                        }}
                        activeOpacity={0.8}
                      >
                        <Text style={styles.buttonText}>CANCEL</Text>
                      </TouchableOpacity>
                    </>
                  )}
                  {appointment.status === 'completed' && (
                    <>
                      <TouchableOpacity
                        style={styles.downloadButton}
                        onPress={() => openDownloadOptions(appointment)}
                        activeOpacity={0.8}
                      >
                        <Ionicons
                          name="document-text-outline"
                          size={18}
                          color="#FFFFFF"
                          style={{ marginRight: 6 }}
                        />
                        <Text style={styles.buttonText}>DOWNLOAD REPORT</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={[styles.downloadButton, { marginLeft: 10 }]}
                        onPress={handleDownloadInvoice}
                        activeOpacity={0.8}
                      >
                        <Ionicons
                          name="newspaper-outline"
                          size={18}
                          color="#FFFFFF"
                          style={{ marginRight: 6 }}
                        />
                        <Text style={styles.buttonText}>DOWNLOAD INVOICE</Text>
                      </TouchableOpacity>
                    </>
                  )}
                </View>
              </View>
            ))
          )}
        </ScrollView>
      );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerOverlay} />
        <Text style={styles.headerTitle}>Medical Appointments</Text>
        <View style={styles.headerSeparator} />
        <Text style={styles.headerSubtitle}>Manage Your Healthcare Schedule</Text>

        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'calendar' && styles.activeTab]}
            onPress={() => setActiveTab('calendar')}
            activeOpacity={0.8}
          >
            <Text style={[styles.tabText, activeTab === 'calendar' && styles.activeTabText]}>
              Calendar
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'upcoming' && styles.activeTab]}
            onPress={() => setActiveTab('upcoming')}
            activeOpacity={0.8}
          >
            <Text style={[styles.tabText, activeTab === 'upcoming' && styles.activeTabText]}>
              Upcoming
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'history' && styles.activeTab]}
            onPress={() => setActiveTab('history')}
            activeOpacity={0.8}
          >
            <Text style={[styles.tabText, activeTab === 'history' && styles.activeTabText]}>
              History
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.waveShape} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {renderTabContent()}
      </ScrollView>

      {/* Appointment Details Modal */}
      <Modal
        visible={showModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedAppointment && (
              <>
                <Text style={styles.modalTitle}>Appointment Details</Text>
                <View style={styles.modalDivider} />

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Procedure:</Text>
                  <Text style={styles.detailValue}>{selectedAppointment.title}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Date:</Text>
                  <Text style={styles.detailValue}>{formatDateDisplay(selectedAppointment.date)}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Time:</Text>
                  <Text style={styles.detailValue}>{selectedAppointment.time}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Physician:</Text>
                  <Text style={styles.detailValue}>{selectedAppointment.doctor}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Category:</Text>
                  <Text style={styles.detailValue}>{selectedAppointment.type}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Status:</Text>
                  <Text
                    style={[
                      styles.detailValue,
                      {
                        color:
                          selectedAppointment.status === 'completed'
                            ? '#388E3C'
                            : selectedAppointment.status === 'missed'
                            ? '#D32F2F'
                            : '#4CAF50',
                        fontWeight: 'bold'
                      }
                    ]}
                  >
                    {selectedAppointment.status.toUpperCase()}
                  </Text>
                </View>
                {selectedAppointment.status === 'upcoming' && (
                  <>
                    <View style={styles.modalDivider} />
                    <View style={styles.buttonRow}>
                      <TouchableOpacity
                        style={styles.rescheduleButton}
                        onPress={handleReschedule}
                        activeOpacity={0.8}
                      >
                        <Text style={styles.buttonText}>RESCHEDULE</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.cancelButton}
                        onPress={handleCancel}
                        activeOpacity={0.8}
                      >
                        <Text style={styles.buttonText}>CANCEL</Text>
                      </TouchableOpacity>
                    </View>
                  </>
                )}

                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setShowModal(false)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.closeButtonText}>CLOSE</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>

      {/* Reschedule Modal */}
      <Modal
        visible={rescheduleModal}
        transparent
        animationType="fade"
        onRequestClose={() => setRescheduleModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Reschedule Appointment</Text>
            <View style={styles.modalDivider} />

            <Text style={styles.inputLabel}>New Date:</Text>
            <TextInput
              style={styles.input}
              value={newDate}
              onChangeText={setNewDate}
              placeholder="YYYY-MM-DD"
              keyboardType="numeric"
              placeholderTextColor="#999"
            />

            <Text style={styles.inputLabel}>New Time:</Text>
            <TextInput
              style={styles.input}
              value={newTime}
              onChangeText={setNewTime}
              placeholder="HH:MM AM/PM"
              placeholderTextColor="#999"
            />

            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={styles.rescheduleButton}
                onPress={confirmReschedule}
                activeOpacity={0.8}
              >
                <Text style={styles.buttonText}>CONFIRM</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setRescheduleModal(false)}
                activeOpacity={0.8}
              >
                <Text style={styles.buttonText}>CANCEL</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FFF5'
  },
  header: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 30,
    position: 'relative',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    overflow: 'visible'
  },
  headerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#4CAF5033',
    borderRadius: 20,
    zIndex: 1
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    letterSpacing: 1,
    zIndex: 2
  },
  headerSeparator: {
    marginVertical: 8,
    height: 1,
    backgroundColor: '#A5D6A7',
    marginHorizontal: 60,
    borderRadius: 0.5,
    zIndex: 2
  },
  headerSubtitle: {
    fontSize: 15,
    color: '#C8E6C9',
    textAlign: 'center',
    fontStyle: 'normal',
    letterSpacing: 0.5,
    marginBottom: 20,
    zIndex: 2
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(200, 230, 201, 0.2)',
    borderRadius: 25,
    paddingVertical: 6,
    paddingHorizontal: 4,
    marginHorizontal: 20,
    marginBottom: 0,
    zIndex: 2
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 25
  },
  activeTab: {
    backgroundColor: '#FFFFFF',
    elevation: 3
  },
  tabText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.75)',
    fontWeight: '600',
    letterSpacing: 0.5
  },
  activeTabText: {
    color: '#2E7D32',
    fontWeight: '700'
  },
  scrollView: {
    flex: 1
  },
 waveShape: {
    position: 'absolute',
    bottom: -40,  // Increased to accommodate larger curve
    left: 0,
    right: 0,
    height: 50,   // Increased height for more pronounced curve
    backgroundColor: '#E8F5E9',  // Lighter green shade
    borderTopLeftRadius: 150,  // Large value for fully rounded
    borderTopRightRadius: 150, // Large value for fully rounded
    transform: [{ scaleX: 1.5 }],  // More horizontal stretch
    elevation: 8,
    shadowColor: '#1B5E20',      // Darker green shadow
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    zIndex: 1,
    overflow: 'hidden',  // Ensures rounded corners are clean
    // Optional gradient background instead of solid color
    /* backgroundImage: 'linear-gradient(to bottom, #E8F5E9, #C8E6C9)' */
},
  calendar: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    borderRadius: 10,
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: '#E8F5E9',
    shadowColor: '#2E7D32',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4
  },
  monthHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E8F5E9',
    paddingBottom: 8
  },
  monthButton: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: '#E8F5E9'
  },
  monthTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2E7D32',
    letterSpacing: 0.8
  },
  dayHeaderRow: {
    flexDirection: 'row',
    marginBottom: 10
  },
  dayHeader: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 4
  },
  dayHeaderText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#2E7D32',
    letterSpacing: 0.7
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start'
  },
  dayCell: {
    width: (width - 72) / 7,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 3,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    position: 'relative'
  },
  todayCircle: {
    backgroundColor: '#A5D6A7',
    width: 34,
    height: 34,
    borderRadius: 17,
    position: 'absolute',
    top: 5,
    left: '50%',
    marginLeft: -17,
    zIndex: 1
  },
  selectedDayCircle: {
    backgroundColor: '#2E7D32',
    width: 36,
    height: 36,
    borderRadius: 18,
    position: 'absolute',
    top: 4,
    left: '50%',
    marginLeft: -18,
    zIndex: 2
  },
  dayText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#388E3C',
    zIndex: 3
  },
  todayText: {
    color: '#2E7D32',
    fontWeight: '600'
  },
  selectedDayText: {
    color: '#FFFFFF',
    fontWeight: '700'
  },
  appointmentDayText: {
    fontWeight: '700'
  },
  appointmentDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    position: 'absolute',
    bottom: 6,
    left: '50%',
    marginLeft: -3,
    zIndex: 4
  },
  completedDot: {
    backgroundColor: '#052261'
  },
  upcomingDot: {
    backgroundColor: '#4CAF50'
  },
  missedDot: {
    backgroundColor: '#D32F2F'
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E8F5E9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 14
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 7
  },
  legendText: {
    fontSize: 13,
    color: '#424242',
    fontWeight: '600'
  },
  appointmentSection: {
    marginHorizontal: 16,
    marginBottom: 16
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1B5E20',
    marginBottom: 16,
    letterSpacing: 0.5
  },
  noAppointments: {
    backgroundColor: '#FFFFFF',
    padding: 32,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2
  },
  noAppointmentsIcon: {
    fontSize: 48,
    marginBottom: 14
  },
  noAppointmentsText: {
    fontSize: 16,
    color: '#1B5E20',
    fontWeight: '600',
    marginBottom: 6
  },
  noAppointmentsSubtext: {
    fontSize: 14,
    color: '#689F38',
    fontStyle: 'normal'
  },
  appointmentCard: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 10,
    marginBottom: 12,
    shadowColor: '#2E7D32',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50'
  },
  appointmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12
  },
  appointmentTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1B5E20',
    flex: 1,
    marginRight: 12,
    letterSpacing: 0.3
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    minWidth: 80,
    alignItems: 'center'
  },
  statusText: {
    fontSize: 11,
    color: '#FFFFFF',
    fontWeight: '700',
    letterSpacing: 0.5
  },
  appointmentTime: {
    fontSize: 15,
    color: '#2E7D32',
    fontWeight: '700',
    marginBottom: 5
  },
  appointmentDoctor: {
    fontSize: 14,
    color: '#1B5E20',
    marginBottom: 4,
    fontWeight: '600'
  },
  appointmentType: {
    fontSize: 13,
    color: '#689F38',
    marginBottom: 8,
    fontStyle: 'normal'
  },
  appointmentFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0'
  },
  appointmentToken: {
    fontSize: 12,
    color: '#689F38',
    fontWeight: '600'
  },
  appointmentAmount: {
    fontSize: 14,
    color: '#2E7D32',
    fontWeight: '700'
  },
  listContainer: {
    flex: 1,
    padding: 16
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    marginTop: 60
  },
  emptyIcon: {
    fontSize: 72,
    marginBottom: 20
  },
  emptyText: {
    fontSize: 18,
    color: '#1B5E20',
    textAlign: 'center',
    fontWeight: '700',
    marginBottom: 8
  },
  emptySubtext: {
    fontSize: 14,
    color: '#689F38',
    textAlign: 'center',
    fontStyle: 'normal'
  },
  detailedCard: {
    backgroundColor: '#FFFFFF',
    marginBottom: 20,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#2E7D32',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#E8F5E9'
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16
  },
  cardHeaderLeft: {
    flex: 1,
    marginRight: 16
  },
  appointmentTypeTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1B5E20',
    marginBottom: 6,
    letterSpacing: 0.3
  },
  dateTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  dateTimeIcon: {
    fontSize: 16,
    marginRight: 8
  },
  dateTimeText: {
    fontSize: 14,
    color: '#689F38',
    fontWeight: '600'
  },
  tokenContainer: {
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    borderRadius: 10,
    padding: 12,
    minWidth: 80,
    borderWidth: 1,
    borderColor: '#C8E6C9'
  },
  tokenLabel: {
    fontSize: 10,
    color: '#689F38',
    fontWeight: '700',
    letterSpacing: 1
  },
  tokenNumber: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1B5E20',
    marginTop: 2
  },
  statusChipContainer: {
    marginBottom: 18
  },
  statusChip: {
    alignSelf: 'flex-start',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10
  },
  statusChipText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '700',
    letterSpacing: 0.5
  },
  labInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: '#E8F5E9',
    padding: 18,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#C8E6C9'
  },
  labIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F1F8E9',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#4CAF50'
  },
  labIconText: {
    fontSize: 20
  },
  labTextContainer: {
    marginLeft: 18,
    flex: 1
  },
  labName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1B5E20',
    marginBottom: 6
  },
  labAddress: {
    fontSize: 13,
    color: '#689F38',
    lineHeight: 18
  },
  section: {
    marginBottom: 18
  },
  sectionTitleSmall: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 14,
    color: '#1B5E20',
    letterSpacing: 0.3
  },
  testsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  testChip: {
    marginRight: 10,
    marginBottom: 10,
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#4CAF50'
  },
  testChipText: {
    color: '#1B5E20',
    fontSize: 12,
    fontWeight: '600'
  },
  detailsContainer: {
    backgroundColor: '#E8F5E9',
    padding: 18,
    borderRadius: 14,
    marginBottom: 20
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    paddingVertical: 2
  },
  detailIcon: {
    fontSize: 16,
    marginRight: 14,
    width: 24,
    textAlign: 'center'
  },
  detailText: {
    fontSize: 14,
    color: '#1B5E20',
    flex: 1,
    lineHeight: 20,
    fontWeight: '600'
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10
  },
  rescheduleButton: {
    backgroundColor: '#388E3C',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
    marginRight: 10,
    shadowColor: '#1B5E20',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 3,
    flexDirection: 'row',
    alignItems: 'center'
  },
  cancelButton: {
    backgroundColor: '#D32F2F',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
    shadowColor: '#B71C1C',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
    flexDirection: 'row',
    alignItems: 'center'
  },
  downloadButton: {
    width:150,
    backgroundColor: '#388E3C',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 10,
    shadowColor: '#1B5E20',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 3,
    flexDirection: 'row',
    alignItems: 'center'
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    textAlign: 'center',
    fontSize: 14,
    letterSpacing: 0.6
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    margin: 20,
    borderRadius: 20,
    padding: 24,
    width: width - 40,
    maxHeight: '80%',
    shadowColor: '#2E7D32',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 10
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1B5E20',
    marginBottom: 16,
    textAlign: 'center',
    letterSpacing: 0.5
  },
  modalDivider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginBottom: 20
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2E7D32',
    width: 100,
    marginBottom: 14
  },
  detailValue: {
    fontSize: 14,
    color: '#424242',
    flex: 1,
    fontWeight: '600',
    marginBottom: 14
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    marginBottom: 12
  },
  closeButton: {
    backgroundColor: '#2E7D32',
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 10,
    marginTop: 20,
    shadowColor: '#1B5E20',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 5
  },
  closeButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    textAlign: 'center',
    fontSize: 16,
    letterSpacing: 0.6
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2E7D32',
    marginBottom: 10,
    marginTop: 20
  },
  input: {
    borderWidth: 2,
    borderColor: '#81C784',
    padding: 14,
    borderRadius: 10,
    fontSize: 14,
    backgroundColor: '#F1F8E9',
    color: '#1B5E20',
    fontWeight: '600'
  }
});

export default AppointmentScreen;
