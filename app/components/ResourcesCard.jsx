import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Linking, Alert, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';

const ResourcesCard = ({ riskLevel }) => {
  const [showAllHospitals, setShowAllHospitals] = useState(false);

  // Major children's hospitals and clinics in Ghana with autism/developmental services
  const hospitals = [
    // Greater Accra Region
    {
      name: "Korle-Bu Teaching Hospital",
      address: "Korle-Bu, Accra, Ghana",
      phone: "+233 30 202 4401",
      specialty: "Child Development Unit",
      region: "Greater Accra",
      website: "https://kbth.gov.gh",
      notes: "Leading pediatric developmental services"
    },
    {
      name: "37 Military Hospital",
      address: "37 Station, Accra, Ghana",
      phone: "+233 30 277 6621",
      specialty: "Pediatric Neurology Department",
      region: "Greater Accra",
      website: "https://37militaryhospital.gov.gh",
      notes: "Specialized autism assessment services"
    },
    {
      name: "Princess Marie Louise Children's Hospital",
      address: "Christiansborg, Accra, Ghana",
      phone: "+233 30 266 4194",
      specialty: "Child Psychiatry Unit",
      region: "Greater Accra",
      website: "N/A",
      notes: "Specialized children's mental health services"
    },
   

    // Ashanti Region
    {
      name: "Komfo Anokye Teaching Hospital",
      address: "Bantama, Kumasi, Ghana",
      phone: "+233 32 202 2308",
      specialty: "Pediatric Neurology Unit",
      region: "Ashanti",
      website: "https://kathhsp.org",
      notes: "Regional center for developmental disorders"
    },
    {
      name: "Kumasi Children's Hospital",
      address: "Kumasi, Ashanti Region, Ghana",
      phone: "+233 32 202 4567",
      specialty: "Child Development Services",
      region: "Ashanti",
      website: "N/A",
      notes: "Dedicated children's developmental care"
    },

    // Northern Region
    {
      name: "Tamale Teaching Hospital",
      address: "Tamale, Northern Region, Ghana",
      phone: "+233 37 202 7621",
      specialty: "Pediatric Department",
      region: "Northern",
      website: "https://tth.gov.gh",
      notes: "Northern region's main pediatric center"
    },

    // Western Region
    {
      name: "Effia-Nkwanta Regional Hospital",
      address: "Sekondi-Takoradi, Western Region, Ghana",
      phone: "+233 31 202 8945",
      specialty: "Child Health Unit",
      region: "Western",
      website: "N/A",
      notes: "Regional pediatric and developmental services"
    },

    // Central Region
    {
      name: "Cape Coast Teaching Hospital",
      address: "Cape Coast, Central Region, Ghana",
      phone: "+233 33 213 2735",
      specialty: "Pediatric Unit",
      region: "Central",
      website: "https://ccth.gov.gh",
      notes: "Central region pediatric care"
    },

    // Eastern Region
    {
      name: "Eastern Regional Hospital",
      address: "Koforidua, Eastern Region, Ghana",
      phone: "+233 34 202 2109",
      specialty: "Pediatric Services",
      region: "Eastern",
      website: "N/A",
      notes: "Eastern region pediatric care"
    },

    // Upper East Region
    {
      name: "Upper East Regional Hospital",
      address: "Bolgatanga, Upper East Region, Ghana",
      phone: "+233 38 202 3456",
      specialty: "Child Health Unit",
      region: "Upper East",
      website: "N/A",
      notes: "Upper East region pediatric services"
    },

    // Private Hospitals with Autism Services
    {
      name: "Trust Hospital",
      address: "Cantonments, Accra, Ghana",
      phone: "+233 30 270 1929",
      specialty: "Child Development Centre",
      region: "Greater Accra",
      website: "https://trusthospital.com.gh",
      notes: "Private hospital with autism assessment services"
    },
    {
      name: "Alpha Medical Centre",
      address: "East Legon, Accra, Ghana",
      phone: "+233 30 281 4660",
      specialty: "Pediatric Psychology Unit",
      region: "Greater Accra",
      website: "https://alphamedicalcentre.com",
      notes: "Private practice with developmental assessments"
    }
  ];

  const makeCall = (phoneNumber) => {
    const cleanNumber = phoneNumber.replace(/[^\d+]/g, '');
    if (cleanNumber.length >= 3) {
      Linking.openURL(`tel:${phoneNumber}`);
    } else {
      Alert.alert('Unable to call', 'Please dial this number manually: ' + phoneNumber);
    }
  };

  const openWebsite = (url) => {
    if (url === "N/A" || !url) {
      Alert.alert('No Website', 'This facility does not have a website available.');
      return;
    }
    Linking.openURL(url).catch(() => {
      Alert.alert('Error', 'Unable to open website');
    });
  };

  const openMaps = (address) => {
    const encodedAddress = encodeURIComponent(address);
    const url = `https://maps.google.com/?q=${encodedAddress}`;
    Linking.openURL(url).catch(() => {
      Alert.alert('Error', 'Unable to open maps');
    });
  };

  if (riskLevel === "Low") {
    return null; // Don't show resources for low risk
  }

  const displayedHospitals = showAllHospitals ? hospitals : hospitals.slice(0, 6);

  return (
    <View style={styles.resourcesContainer}>
      <LinearGradient
        colors={riskLevel === "High" ? ['#FEF2F2', '#FEE2E2'] : ['#FFF7ED', '#FED7AA']}
        style={styles.resourcesCard}
      >
        <View style={styles.resourcesHeader}>
          <Feather 
            name={riskLevel === "High" ? "alert-circle" : "alert-triangle"} 
            size={24} 
            color={riskLevel === "High" ? "#DC2626" : "#D97706"} 
          />
          <Text style={[styles.resourcesTitle, { 
            color: riskLevel === "High" ? "#DC2626" : "#D97706" 
          }]}>
            Ghana Healthcare Resources
          </Text>
        </View>

        <Text style={styles.resourcesDescription}>
          {riskLevel === "High" 
            ? "Immediate professional consultation is recommended. Here are Ghana-based resources to help:"
            : "Consider following up with professionals. Here are helpful resources in Ghana:"
          }
        </Text>

        {/* Ghana Hospitals Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Feather name="map-pin" size={20} color="#1E40AF" />
            <Text style={styles.sectionTitle}>Ghana Hospitals with Child Development Services</Text>
          </View>
          
          {displayedHospitals.map((hospital, index) => (
            <View key={index} style={styles.hospitalCard}>
              <View style={styles.hospitalHeader}>
                <Text style={styles.hospitalName}>{hospital.name}</Text>
                <Text style={styles.hospitalRegion}>{hospital.region}</Text>
              </View>
              <Text style={styles.hospitalSpecialty}>{hospital.specialty}</Text>
              <Text style={styles.hospitalAddress}>{hospital.address}</Text>
              {hospital.notes && (
                <Text style={styles.hospitalNotes}>{hospital.notes}</Text>
              )}
              
              <View style={styles.hospitalActions}>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => makeCall(hospital.phone)}
                >
                  <Feather name="phone" size={14} color="#1E40AF" />
                  <Text style={styles.actionButtonText}>Call</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => openMaps(hospital.address)}
                >
                  <Feather name="map-pin" size={14} color="#1E40AF" />
                  <Text style={styles.actionButtonText}>Directions</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => openWebsite(hospital.website)}
                >
                  <Feather name="external-link" size={14} color="#1E40AF" />
                  <Text style={styles.actionButtonText}>Website</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}

          {hospitals.length > 6 && (
            <TouchableOpacity
              style={styles.showMoreButton}
              onPress={() => setShowAllHospitals(!showAllHospitals)}
            >
              <Text style={styles.showMoreText}>
                {showAllHospitals ? 'Show Less' : `Show ${hospitals.length - 6} More Hospitals`}
              </Text>
              <Feather 
                name={showAllHospitals ? "chevron-up" : "chevron-down"} 
                size={16} 
                color="#1E40AF" 
              />
            </TouchableOpacity>
          )}
        </View>

        {/* Additional Information for Ghana */}
        {/* <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Feather name="info" size={20} color="#1E40AF" />
            <Text style={styles.sectionTitle}>Important Information (Ghana)</Text>
          </View>
         
        </View> */}

        {/* Local Support Organizations */}
        {/* <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Feather name="users" size={20} color="#1E40AF" />
            <Text style={styles.sectionTitle}>Ghana Support Organizations</Text>
          </View> */}
          
          {/* <View style={styles.organizationCard}>
            <Text style={styles.organizationName}>Ghana Autism Spectrum Disorder Foundation</Text>
            <Text style={styles.organizationDescription}>
              Local advocacy and support for families affected by autism
            </Text>
            <TouchableOpacity
              style={styles.organizationButton}
              onPress={() => makeCall("+233 24 466 9982")}
            >
              <Text style={styles.organizationButtonText}>Contact: +233 24 466 9982</Text>
            </TouchableOpacity>
          </View> */}

          {/* <View style={styles.organizationCard}>
            <Text style={styles.organizationName}>Mental Health Authority Ghana</Text>
            <Text style={styles.organizationDescription}>
              Government agency for mental health services and policy
            </Text>
            <TouchableOpacity
              style={styles.organizationButton}
              onPress={() => makeCall("+233 30 222 1629")}
            >
              <Text style={styles.organizationButtonText}>Contact: +233 30 222 1629</Text>
            </TouchableOpacity>
          </View>
        </View> */}
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  resourcesContainer: {
    marginTop: 24,
    marginBottom: 16,
  },
  resourcesCard: {
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  resourcesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  resourcesTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  resourcesDescription: {
    fontSize: 16,
    color: '#374151',
    marginBottom: 20,
    lineHeight: 22,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E40AF',
    flex: 1,
  },
  hospitalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  hospitalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  hospitalName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    flex: 1,
    marginRight: 8,
  },
  hospitalRegion: {
    fontSize: 12,
    color: '#6B7280',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  hospitalSpecialty: {
    fontSize: 14,
    color: '#1E40AF',
    fontWeight: '600',
    marginBottom: 8,
  },
  hospitalAddress: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
    lineHeight: 18,
  },
  hospitalNotes: {
    fontSize: 13,
    color: '#059669',
    fontStyle: 'italic',
    marginBottom: 12,
  },
  hospitalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#EFF6FF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#DBEAFE',
    gap: 4,
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1E40AF',
  },
  showMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    gap: 4,
  },
  showMoreText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E40AF',
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  infoText: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
  organizationCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  organizationName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
  },
  organizationDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 12,
    lineHeight: 18,
  },
  organizationButton: {
    backgroundColor: '#EFF6FF',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  organizationButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E40AF',
    textAlign: 'center',
  },
});

export default ResourcesCard;