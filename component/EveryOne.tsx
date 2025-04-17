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
    const fetchTeacher = async () => {
      try {
        const response = await axios.get(`http://10.0.2.2:3000/teacher/class/${classId}`);
        setTeacher(response.data.teacher);
      } catch (error) {
        console.error("Lỗi khi lấy thông tin giảng viên:", error);
      }
    };

    const fetchStudents = async () => {
      try {
        const response = await axios.get(`http://10.0.2.2:3000/students/class/${classId}`);
        setStudents(response.data.students || []);
      } catch (error) {
        // Không in lỗi ra console nữa
        setStudents([]); // vẫn set mảng rỗng để UI hoạt động bình thường
      }
    };
    

    fetchTeacher();
    fetchStudents();
  }, [classId]);

  return (
    <View style={styles.container}>
      <Header />

      {/* Giáo viên */}
      <View style={styles.section}>
        <Text style={styles.title}>Giáo viên</Text>
        {teacher ? (
          <View style={styles.row}>
            <Image style={styles.imageuser} source={require("../assets/images/usernobackgr.jpg")} />
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
                <Image style={styles.imageuser} source={require("../assets/images/usernobackgr.jpg")} />
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
  container: { flex: 1, backgroundColor: "#fff" },
  section: { paddingHorizontal: 20, paddingTop: 10 },
  imageuser: { width: 50, height: 50, borderRadius: 25 },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#0641F0",
    marginBottom: 10,
    fontFamily: "Nunito_400Regular",
    borderBottomWidth: 1,
    paddingBottom: 10,
    borderBottomColor: "#5f6368",
  },
  row: { flexDirection: "row", alignItems: "center", marginBottom: 10, gap: 10 },
  userName: { fontSize: 16, fontFamily: "Nunito_400Regular" },
});

export default EveryOneScreen;