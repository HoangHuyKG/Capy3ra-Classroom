import React from "react";
import { View, Text, Image, StyleSheet, FlatList } from "react-native";
import Header from "./Header";
import { useRoute } from "@react-navigation/native";
import FooterBar from "../navigation/FooterBar";

const teachers = [
  { id: "1", name: "Nguyễn Văn A" },

];

const students = [
  { id: "1", name: "Lê Thị K" },
  { id: "2", name: "Nguyễn Văn L" },
  { id: "3", name: "Trần Văn M" },
  { id: "4", name: "Phạm Thị N" },
  { id: "5", name: "Hoàng Văn O" },
  { id: "6", name: "Bùi Thị P" },
  { id: "7", name: "Đỗ Văn Q" },
  { id: "8", name: "Vũ Thị R" },
  { id: "9", name: "Ngô Văn S" },
  { id: "10", name: "Tạ Thị T" },
];

const EveryOneScreen = ({ navigation }) => {
  const route = useRoute();
  const activeTab = route.params?.activeTab || "users";

  return (
    <View style={styles.container}>
      <Header />

      {/* Giáo viên */}
      <View style={styles.section}>
        <Text style={styles.title}>Giáo viên</Text>
        <FlatList
          data={teachers}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.row}>
              <Image style={styles.imageuser} source={require("../assets/images/usernobackgr.jpg")} />
              <Text style={styles.userName}>{item.name}</Text>
            </View>
          )}
        />
      </View>

      {/* Học viên */}
        <View style={styles.section}>
        <Text style={styles.title}>Học viên</Text>
        <FlatList
            contentContainerStyle={{ flexGrow: 1, paddingBottom: 320 }}
          data={students}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.row}>
              <Image style={styles.imageuser} source={require("../assets/images/usernobackgr.jpg")} />
              <Text style={styles.userName}>{item.name}</Text>
            </View>
          )}
        />
      </View>

      <FooterBar activeTab={activeTab} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  section: { paddingHorizontal: 20, paddingTop: 10},
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
