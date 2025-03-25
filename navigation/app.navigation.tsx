import React from "react";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../component/HomeScreen';
import LoginScreen from '../component/LoginScreen';
import CreateClassScreen from "../component/CreateCourse";
import JoinClassScreen from "../component/JoinClass";
import ClassroomList from "../component/ClassroomList";
import PostNotificationScreen from "../component/NotifyForClass";
import EditClassInfoScreen from "../component/EditSrceenClass";
import GiveExercise from "../component/GiveExercise";
import DetailExercise from "../component/DetailExcersice";
import EditExercise from "../component/EditExercise";
import AssignmentScreen from "../component/AssignmentsExersice";
import DetailSubmissions from "../component/Detailssubmissions";
import ProfileSettingsScreen from "../component/ProfileUser";
import ClassroomScreen from "../component/DetailClass";
import DetailClassroom from "../component/DetailClass";
import EveryOneScreen from "../component/EveryOne";
import EditNotifyScreen from "../component/EditNotify";
import LoginDetail from "../component/LoginDetail";
import SignUpDetail from "../component/SignUpDetail";

const HomeLayout = () => {
const Stack = createNativeStackNavigator();

    return (
            <Stack.Navigator>
                <Stack.Screen
                    name="Login"
                    component={LoginScreen}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="Home"
                    component={HomeScreen}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="CreateClassScreen"
                    component={CreateClassScreen}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="JoinClassScreen"
                    component={JoinClassScreen}
                    options={{ headerShown: false }}
                />
                 <Stack.Screen
                    name="ClassroomList"
                    component={ClassroomList}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="PostNotificationScreen"
                    component={PostNotificationScreen}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="EditClassInfoScreen"
                    component={EditClassInfoScreen}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="GiveExercise"
                    component={GiveExercise}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="DetailExercise"
                    component={DetailExercise}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="EditExercise"
                    component={EditExercise}
                    options={{ headerShown: false }}
                />
                 <Stack.Screen
                    name="AssignmentScreen"
                    component={AssignmentScreen}
                    options={{ headerShown: false }}
                />
                 <Stack.Screen
                    name="DetailSubmissions"
                    component={DetailSubmissions}
                    options={{ headerShown: false }}
                />
                 <Stack.Screen
                    name="ProfileSettingsScreen"
                    component={ProfileSettingsScreen}
                    options={{ headerShown: false }}
                />
                 <Stack.Screen
                    name="DetailClassroom"
                    component={DetailClassroom}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="EveryOneScreen"
                    component={EveryOneScreen}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="EditNotifyScreen"
                    component={EditNotifyScreen}
                    options={{ headerShown: false }}
                />
                 <Stack.Screen
                    name="LoginDetail"
                    component={LoginDetail}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="SignUpDetail"
                    component={SignUpDetail}
                    options={{ headerShown: false }}
                />
            </Stack.Navigator>
    )
}

export default HomeLayout