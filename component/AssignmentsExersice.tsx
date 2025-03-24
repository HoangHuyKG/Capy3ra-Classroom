import React from 'react';
import { View, Text, TouchableOpacity, Image, FlatList, StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import Header from './Header';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

const data = [
  { id: '1', name: 'Nguyễn Duy Đạt', date: '12:00, 13 thg 1, 2025' },
  { id: '2', name: 'Hoàng Gia Huy', date: '12:00, 13 thg 1, 2025' },
  { id: '3', name: 'Hoàng Gia Huy', date: '12:00, 13 thg 1, 2025' },
  { id: '4', name: 'Hoàng Gia Huy', date: '12:00, 13 thg 1, 2025' },
  { id: '5', name: 'Hoàng Gia Huy', date: '12:00, 13 thg 1, 2025' },
  { id: '6', name: 'Hoàng Gia Huy', date: '12:00, 13 thg 1, 2025' },
  { id: '7', name: 'Hoàng Gia Huy', date: '12:00, 13 thg 1, 2025' },
  { id: '8', name: 'Hoàng Gia Huy', date: '12:00, 13 thg 1, 2025' },
];

const AssignmentScreen = (props: any) => {
    const { navigation } = props;

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.itemContainer} onPress={()=>navigation.navigate('DetailSubmissions')}>
      <View style={styles.iconContainer}>
        <Ionicons name="document-text-outline" size={24} color="#fff" />
      </View>
      <View>
        <Text style={styles.nameText}>{item.name}</Text>
        <Text style={styles.dateText}>Ngày nộp: {item.date}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate("GiveExercise", { activeTab: 'clipboard' })}>
        <MaterialCommunityIcons name="keyboard-backspace" size={30} color="#5f6368" />
        </TouchableOpacity>
        <Text style={styles.title}>Học viên đã nộp bài</Text>

      </View>


      {/* List of Assignments */}
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#fff', // Thêm nền trắng cho header
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 8, // Tăng elevation lên cao hơn để dễ thấy bóng
    width: '100%'
  },
  buttonheader: { color: '#fff', backgroundColor: '#0641F0', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 10, alignItems: 'center', fontFamily: "Nunito_400Regular", },
  buttonText: { color: '#fff', fontSize: 16, fontFamily: "Nunito_400Regular", fontWeight: 'semibold' },
  title: {
    fontSize: 20,
    color: '#5f6368',
    fontFamily: "Nunito_400Regular",
    marginLeft: 50,
  },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#fff' },
  avatar: { width: 40, height: 40, borderRadius: 20 },

  itemContainer: {
    flexDirection: 'row',
    margin: 10,
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  iconContainer: { marginRight: 10, width: 40, height: 40, backgroundColor: '#0641F0', justifyContent: 'center', alignItems:'center', borderRadius: 20},
  nameText: { fontSize: 16, fontWeight: 'bold', color: '#333',fontFamily: "Nunito_400Regular",  },
  dateText: { fontSize: 14, color: '#555',fontFamily: "Nunito_400Regular",  },
});

export default AssignmentScreen;
