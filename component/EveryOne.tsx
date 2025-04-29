import React, { useEffect, useState } from "react";
import { View, Text, Image, StyleSheet, FlatList } from "react-native";
import Header from "./Header";
import { useRoute } from "@react-navigation/native";
import FooterBar from "../navigation/FooterBar";
import axios from 'axios'; // Đảm bảo bạn đã cài đặt axios

const EveryOneScreen = ({ navigation }) => {
  const route = useRoute();
  const activeTab = route.params?.activeTab || "users";
  const classId = route.params?.classId;

  const [teacher, setTeacher] = useState(null);
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const teacherRes = await axios.get(`http://10.10.10.10:3000/teacher/class/${classId}`);
        const fetchedTeacher = teacherRes.data.teacher;
  
        // Fetch avatar teacher
        const teacherImage = await fetchTeacherAvatar(fetchedTeacher._id);
        setTeacher({ ...fetchedTeacher, image: teacherImage });
  
        const studentsRes = await axios.get(`http://10.10.10.10:3000/students/class/${classId}`);
        const fetchedStudents = studentsRes.data.students || [];
  
        // Fetch avatar students
        const studentsWithImages = await Promise.all(
          fetchedStudents.map(async (student) => {
            const studentImage = await fetchStudentAvatar(student._id);
            return { ...student, image: studentImage };
          })
        );
  
        setStudents(studentsWithImages);
      } catch (error) {
        console.error('❌ Lỗi khi fetch dữ liệu lớp:', error);
        setStudents([]);
      }
    };
  
    fetchAllData();
  }, [classId]);
  
  const fetchTeacherAvatar = async (teacherId) => {
    try {
      const response = await axios.get(`http://10.10.10.10:3000/user/${teacherId}`);
      return response.data.image || null;
    } catch (error) {
      console.error('❌ Lỗi khi lấy avatar giáo viên:', error);
      return null;
    }
  };
  const fetchStudentAvatar = async (studentId) => {
    try {
      const response = await axios.get(`http://10.10.10.10:3000/user/${studentId}`);
      return response.data.image || null;
    } catch (error) {
      console.error('❌ Lỗi khi lấy avatar học viên:', error);
      return null;
    }
  };
    
  return (
    <View style={styles.container}>
      <Header />

      {/* Giáo viên */}
      <View style={styles.section}>
        <Text style={styles.title}>Giáo viên</Text>
        {teacher ? (
          <View style={styles.row}>
            <Image
  style={styles.imageuser}
  source={
    teacher?.image
      ? { uri: teacher.image }
      : require("../assets/images/usernobackgr.png")
  }
/>

            <Text style={styles.userName}>{teacher.fullname}</Text>
          </View>
        ) : (
          <Text>Đang tải thông tin giảng viên...</Text>
        )}
      </View>

      {/* Học viên */}
      <View style={styles.section}>
        <Text style={styles.title}>Học viên</Text>
        {students.length > 0 ? (
          <FlatList
            data={students}
            keyExtractor={(item) => item._id} // Sử dụng _id của học viên
            renderItem={({ item }) => (
              <View style={styles.row}>
                <Image
  style={styles.imageuser}
  source={
    item?.image
      ? { uri: item.image }
      : require("../assets/images/usernobackgr.png")
  }
/>

                <Text style={styles.userName}>{item.fullname}</Text>
              </View>
            )}
          />
        ) : (
          <Text>Không có học viên nào trong lớp học.</Text>
        )}
      </View>

      <FooterBar activeTab={activeTab} classId={classId} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#e7f3ff" },
  section: { paddingHorizontal: 20, paddingTop: 10 },
  imageuser: { width: 50, height: 50, borderRadius: 25 },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#0961F5",
    marginBottom: 10,
    fontFamily: "Jost_400Regular",
    borderBottomWidth: 1,
    paddingBottom: 10,
    borderBottomColor: "#333",
  },
  row: { flexDirection: "row", alignItems: "center", marginBottom: 10, gap: 10 },
  userName: { fontSize: 16, fontFamily: "Jost_400Regular", color: '#333' },
});

export default EveryOneScreen;