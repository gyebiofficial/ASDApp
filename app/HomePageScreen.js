import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, Image, TouchableOpacity, Pressable } from 'react-native';

const menuData = [
  { key: '1', label: 'Profile' },
  { key: '2', label: 'Dashboard' },
  { key: '3', label: 'About' },
];

export default function HomePageScreen() {
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const handleMenuPress = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const handleMenuItemPress = (item) => {
    setDropdownVisible(false);
    // Add navigation or actions here
    alert(`You selected: ${item.label}`);
  };

  const renderItem = ({ item }) => (
    <Pressable style={styles.dropdownItem} onPress={() => handleMenuItemPress(item)}>
      <Text style={styles.menuLabel}>{item.label}</Text>
    </Pressable>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleMenuPress} style={styles.menuIconContainer}>
          <Image
            source={require('C:/Users/gyebi/Desktop/Autism Detection App/ASDApp/assets/images/menu.jpg')}
            style={styles.menuIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerText}>AutiScan</Text>
        </View>
        {/* Empty view for spacing */}
        <View style={{ width: 40 }} />
      </View>
      {dropdownVisible && (
        <View style={styles.dropdown}>
          <FlatList
            data={menuData}
            renderItem={renderItem}
            keyExtractor={item => item.key}
          />
        </View>
      )}
      <View style={styles.content}>
        <Text style={styles.contentText}>Welcome to the Home Page!</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f6f8fc',
  },
  header: {
    width: '100%',
    height: 65,
    backgroundColor: '#1565c0',
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 4,
  },
  menuIconContainer: {
    padding: 8,
    width: 40,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  menuIcon: {
    width: 32,
    height: 32,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    letterSpacing: 1,
    textAlign: 'center',
  },
  dropdown: {
    position: 'absolute',
    top: 65,
    left: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 5,
    zIndex: 10,
    width: 160,
    paddingVertical: 8,
  },
  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  menuLabel: {
    fontSize: 18,
    color: '#1565c0',
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 30,
  },
  contentText: {
    fontSize: 18,
    color: '#333',
    marginBottom: 20,
  },
});