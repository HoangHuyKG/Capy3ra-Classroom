import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

const FooterBar = ({ activeTab, classId }) => {
  const navigation = useNavigation();

  

  return (
    <View style={styles.footerBar}>
      <TouchableOpacity
        style={styles.footerItem}
        onPress={() => navigation.navigate("DetailClassroom", { activeTab: 'message', classId })} // Truyền classId
      >
        <MaterialCommunityIcons name="comment-text-multiple-outline" size={24} color={activeTab === 'message' ? '#0961F5' : '#333'}/>
        <Text style={activeTab === 'message' ? styles.activeText : styles.inactiveText}>Bảng tin</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.footerItem}
        onPress={() => navigation.navigate("GiveExercise", { activeTab: 'clipboard', classId })} // Truyền classId
      >
        <MaterialCommunityIcons name="clipboard-text-outline" size={24} color={activeTab === 'clipboard' ? '#0961F5' : '#333'} />
        <Text style={activeTab === 'clipboard' ? styles.activeText : styles.inactiveText}>Bài tập trên lớp</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.footerItem}
        onPress={() => navigation.navigate("EveryOneScreen", { activeTab: 'users', classId })} // Truyền classId
      >
        <MaterialCommunityIcons name="account-multiple" size={24} color={activeTab === 'users' ? '#0961F5' : '#333'} />
        <Text style={activeTab === 'users' ? styles.activeText : styles.inactiveText}>Mọi người</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  footerBar: {
    flexDirection: 'row', 
    justifyContent: 'space-around', 
    backgroundColor: '#fff', 
    paddingVertical: 10,
    borderColor: '#ddd', 
    position: 'absolute', 
    bottom: 0, 
    width: '100%', 
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -10 }, 
    shadowOpacity: 0.4, 
    shadowRadius: 3, 
    elevation: 10,
    borderTopWidth: 1, 
    borderTopColor: '#5f6368'
  },
  footerItem: { alignItems: 'center' },
  activeText: { fontWeight: 'bold', color: '#0961F5', fontFamily: "Jost_400Regular" },
  inactiveText: { color: '#333', fontFamily: "Jost_400Regular", fontWeight: 'bold' },
});

export default FooterBar;