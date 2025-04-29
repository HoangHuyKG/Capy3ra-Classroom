import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useRoute } from '@react-navigation/native';
import axios from 'axios'; // Dùng axios để gọi API

const AssignmentScreen = ({ navigation }) => {
  const route = useRoute();
  const classId = route.params?.classId;
  const exerciseId = route.params?.exerciseId;

  const [submissionsData, setSubmissionsData] = useState([]);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const response = await axios.get(`http://10.10.10.10:3000/exercise-submissions?exerciseId=${exerciseId}`);
        const submissions = response.data.submissions;
  
        const mapped = submissions.map(sub => ({
          id: sub.submissionId,
          name: sub.fullname || "Không rõ",
          date: new Date(sub.submittedAt).toLocaleString('vi-VN')
        }));
  
        setSubmissionsData(mapped);
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu:", error);
      }
    };
  
    fetchSubmissions();
  }, [exerciseId]);
  

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.itemContainer} onPress={() => navigation.navigate('DetailSubmissions', {
      classId,
      submissionId: item.id,
      exerciseId
    })}
    >
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
        <TouchableOpacity onPress={() => navigation.navigate("GiveExercise", { activeTab: 'clipboard', classId })}>
          <MaterialCommunityIcons name="keyboard-backspace" size={30} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>Học viên đã nộp bài</Text>
      </View>
      <View style={styles.containersmall}>
        <FlatList
          data={submissionsData}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
        />
      </View>
    </View>
  );
};


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#e7f3ff' },
  containersmall: { flex: 1, backgroundColor: '#e7f3ff', paddingHorizontal: 10 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 8,
    width: '100%'
  },
  buttonheader: { color: '#fff', backgroundColor: '#0961F5', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 10, alignItems: 'center', fontFamily: "Jost_400Regular" },
  buttonText: { color: '#fff', fontSize: 16, fontFamily: "Jost_400Regular", fontWeight: 'semibold' },
  title: {
    fontSize: 20,
    color: '#333',
    fontFamily: "Jost_400Regular",
    marginLeft: 50,
    fontWeight: 'bold'
  },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#fff' },
  avatar: { width: 40, height: 40, borderRadius: 20 },

  itemContainer: {
    flexDirection: 'row',
    marginTop: 10,
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
  iconContainer: { marginRight: 20, width: 40, height: 40, backgroundColor: '#0961F5', justifyContent: 'center', alignItems: 'center', borderRadius: 20 },
  nameText: { fontSize: 16, fontWeight: 'bold', color: '#333', fontFamily: "Jost_400Regular", },
  dateText: { fontSize: 14, color: '#555', fontFamily: "Jost_400Regular", },
});

export default AssignmentScreen;
