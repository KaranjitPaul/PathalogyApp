import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert, Platform, Linking } from 'react-native';
import { Card, Title, Paragraph, Text, Button, ProgressBar, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import RNFS from 'react-native-fs';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';

const PathologyReportScreen = () => {
  const theme = useTheme();
  const [downloading, setDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [reports, setReports] = useState([
    {
      id: '1',
      title: 'Complete Blood Count (CBC)',
      date: '2023-05-15',
      status: 'Completed',
      doctor: 'Dr. Smith',
      downloadUrl: 'https://example.com/reports/cbc_20230515.pdf',
      downloaded: false,
      localPath: '',
      downloading: false
    },
    {
      id: '2',
      title: 'Lipid Profile',
      date: '2023-05-10',
      status: 'Completed',
      doctor: 'Dr. Johnson',
      downloadUrl: 'https://example.com/reports/lipid_20230510.pdf',
      downloaded: false,
      localPath: '',
      downloading: false
    },
    {
      id: '3',
      title: 'Liver Function Test',
      date: '2023-04-28',
      status: 'Completed',
      doctor: 'Dr. Williams',
      downloadUrl: 'https://example.com/reports/liver_20230428.pdf',
      downloaded: false,
      localPath: '',
      downloading: false
    },
  ]);

  // Demo report data
  const demoReport = {
    id: 'demo-001',
    title: 'Demo Pathology Report',
    date: new Date().toISOString().split('T')[0],
    status: 'Completed',
    doctor: 'Dr. Demo',
    downloadUrl: '',
    downloaded: false,
    localPath: '',
    downloading: false
  };

  // Check for storage permission
  const checkPermission = async () => {
    let permission;
    if (Platform.OS === 'android') {
      permission = PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE;
    } else {
      permission = PERMISSIONS.IOS.MEDIA_LIBRARY;
    }

    try {
      const result = await check(permission);
      if (result === RESULTS.GRANTED) {
        return true;
      } else {
        const requestResult = await request(permission);
        return requestResult === RESULTS.GRANTED;
      }
    } catch (error) {
      console.error('Permission error:', error);
      return false;
    }
  };

  // Generate demo report content
  const generateDemoReport = () => {
    return `
      PATHOLOGY REPORT
      =================
      
      Patient: John Doe
      Age: 35
      Gender: Male
      ID: DEMO-001
      Date: ${new Date().toISOString().split('T')[0]}
      Referring Physician: Dr. Demo
      
      TEST RESULTS:
      -------------
      
      1. Complete Blood Count (CBC)
      - Hemoglobin: 14.2 g/dL (Normal: 13.5-17.5)
      - WBC Count: 6.5 x10^3/μL (Normal: 4.5-11.0)
      - Platelets: 250 x10^3/μL (Normal: 150-450)
      
      2. Basic Metabolic Panel
      - Glucose: 92 mg/dL (Normal: 70-99)
      - Sodium: 138 mEq/L (Normal: 135-145)
      - Potassium: 4.2 mEq/L (Normal: 3.5-5.1)
      
      3. Liver Function Tests
      - ALT: 28 U/L (Normal: 7-55)
      - AST: 25 U/L (Normal: 8-48)
      - Alkaline Phosphatase: 72 U/L (Normal: 40-129)
      
      IMPRESSION:
      -----------
      All values within normal limits.
      
      Pathologist: Dr. Demo
      Signature: _______________
      Date: ${new Date().toISOString().split('T')[0]}
    `;
  };

  // Download report
  const downloadReport = async (report: { id: any; title?: string; date?: string; status?: string; doctor?: string; downloadUrl: any; downloaded?: boolean; localPath?: string; downloading?: boolean; }) => {
    try {
      const hasPermission = await checkPermission();
      if (!hasPermission) {
        Alert.alert('Permission Required', 'Storage permission is needed to download reports');
        return;
      }

      // Update the report's downloading status
      const updatedReports = reports.map(r => {
        if (r.id === report.id) {
          return { ...r, downloading: true };
        }
        return r;
      });
      setReports(updatedReports);
      setDownloading(true);
      setDownloadProgress(0);

      let filePath;
      let content;
      
      if (report.id === 'demo-001') {
        // Generate demo report
        content = generateDemoReport();
        filePath = `${RNFS.DownloadDirectoryPath}/Pathology_Report_DEMO_${Date.now()}.txt`;
        
        await RNFS.writeFile(filePath, content, 'utf8');
      } else {
        // For real reports
        filePath = `${RNFS.DownloadDirectoryPath}/Pathology_Report_${report.id}_${Date.now()}.pdf`;
        
        const download = RNFS.downloadFile({
          fromUrl: report.downloadUrl,
          toFile: filePath,
          progress: (res) => {
            const progress = (res.bytesWritten / res.contentLength);
            setDownloadProgress(progress);
          },
          progressDivider: 1
        });

        await download.promise;
      }

      // Update the report in state with downloaded status
      const finalUpdatedReports = reports.map(r => {
        if (r.id === report.id) {
          return { ...r, downloaded: true, localPath: filePath, downloading: false };
        }
        return r;
      });
      
      setReports(finalUpdatedReports);
      setDownloading(false);
      
      Alert.alert(
        'Download Complete',
        `Report saved to: ${filePath}`,
        [
          { text: 'OK', onPress: () => {} },
          { text: 'Open', onPress: () => openReport(filePath) }
        ]
      );
    } catch (error) {
      setDownloading(false);
      // Reset downloading status for this report
      const errorUpdatedReports = reports.map(r => {
        if (r.id === report.id) {
          return { ...r, downloading: false };
        }
        return r;
      });
      setReports(errorUpdatedReports);
    }
  };

  // Open downloaded report
  const openReport = async (filePath: string) => {
    try {
      if (Platform.OS === 'android') {
        const fileUri = `file://${filePath}`;
        const supported = await Linking.canOpenURL(fileUri);
        
        if (supported) {
          await Linking.openURL(fileUri);
        } else {
          Alert.alert('Error', 'No app available to open this file');
        }
      } else {
        Alert.alert('Open in Files', 'Please check your Files app to view the downloaded report');
      }
    } catch (error) {
      Alert.alert('Error', 'Could not open the file');
    }
  };

  // Add demo report to the list when component mounts
  useEffect(() => {
    setReports(prev => [demoReport, ...prev]);
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: '#f5faf6' }]}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={[styles.sectionTitle, { color: '#2e7d32' }]}>Available Reports</Text>
        
        {reports.map((report) => {
          const currentReport = reports.find(r => r.id === report.id);
          const isDownloading = downloading && currentReport?.downloading;

          return (
            <Card key={report.id} style={[styles.card, { borderLeftWidth: 4, borderLeftColor: '#4caf50' }]}>
              <Card.Content>
                <View style={styles.cardHeader}>
                  <Title style={[styles.reportTitle, { color: '#1b5e20' }]}>{report.title}</Title>
                  {report.downloaded ? (
                    <Icon name="check-circle" size={24} color="#4caf50" />
                  ) : (
                    <Icon name="download-circle" size={24} color="#81c784" />
                  )}
                </View>
                
                <Paragraph style={styles.reportDetail}>
                  <Icon name="calendar" size={16} color="#2e7d32" /> {report.date}
                </Paragraph>
                <Paragraph style={styles.reportDetail}>
                  <Icon name="doctor" size={16} color="#2e7d32" /> {report.doctor}
                </Paragraph>
                <Paragraph style={styles.reportDetail}>
                  <Icon name="file-document" size={16} color="#2e7d32" /> Status: {report.status}
                </Paragraph>
                
                {report.id === 'demo-001' && (
                  <View style={[styles.demoBadge, { backgroundColor: '#c8e6c9' }]}>
                    <Text style={{ color: '#1b5e20', fontSize: 12 }}>
                      DEMO REPORT
                    </Text>
                  </View>
                )}
              </Card.Content>
              
              <Card.Actions style={styles.cardActions}>
                {report.downloaded ? (
                  <Button 
                    mode="contained" 
                    onPress={() => openReport(report.localPath)}
                    style={styles.actionButton}
                    labelStyle={{ color: 'white' }}
                    color="#4caf50"
                  >
                    <Icon name="eye" size={18} color="white" /> View
                  </Button>
                ) : (
                  <Button 
                    mode="outlined" 
                    onPress={() => downloadReport(report)}
                    disabled={downloading}
                    style={[styles.actionButton, { borderColor: '#4caf50' }]}
                    labelStyle={{ color: '#2e7d32' }}
                  >
                    <Icon name="download" size={18} color="#2e7d32" /> Download
                  </Button>
                )}
              </Card.Actions>
              
              {isDownloading && (
                <View style={styles.progressContainer}>
                  <ProgressBar 
                    progress={downloadProgress} 
                    color="#4caf50"
                    style={styles.progressBar}
                  />
                  <Text style={[styles.progressText, { color: '#2e7d32' }]}>
                    {Math.round(downloadProgress * 100)}% downloaded
                  </Text>
                </View>
              )}
            </Card>
          );
        })}
        
        <View style={[styles.infoBox, { backgroundColor: '#e8f5e9' }]}>
          <Icon name="information" size={24} color="#2e7d32" />
          <Text style={[styles.infoText, { color: '#1b5e20' }]}>
            Reports are typically available within 24-48 hours after sample collection.
            Contact the lab if you don't see your expected report.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    marginVertical:40,
    padding: 16,
    paddingBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    marginLeft: 8,
  },
  card: {
    backgroundColor: 'white',
    shadowColor:'green',
    marginBottom: 16,
    elevation: 5,
    shadowOpacity:5,
    borderRadius: 8,
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  reportTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
  },
  reportDetail: {
    marginBottom: 6,
    fontSize: 14,
    color: '#455a64',
  },
  demoBadge: {
    marginTop: 8,
    padding: 4,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  cardActions: {
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  actionButton: {
    borderRadius: 20,
    paddingHorizontal: 16,
  },
  progressContainer: {
    padding: 16,
    paddingTop: 8,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    marginBottom: 8,
    backgroundColor: '#e8f5e9',
  },
  progressText: {
    textAlign: 'center',
    fontSize: 12,
  },
  infoBox: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 8,
    marginTop: 16,
    alignItems: 'center',
  },
  infoText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 14,
  },
});

export default PathologyReportScreen;