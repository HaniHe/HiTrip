import * as React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { View, TouchableOpacity, StyleSheet, Alert } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Home from "@views/home/index";
import User from "@views/user/index";
import CardPublish from "@/views/publish/index";
import TripDetail from "@/views/trip/tripDetail";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "@/auth/contexts/Auth";

const Tab = createBottomTabNavigator();
const ListStack = createNativeStackNavigator();
const UserStack = createNativeStackNavigator();
const AppStack = createNativeStackNavigator(); // 新增全局堆栈导航器

// ListStackScreen：管理 Home 和 TripDetail
function ListStackScreen() {
  return (
    <ListStack.Navigator>
      <ListStack.Screen
        name="List"
        component={Home}
        options={{
          title: "Home",
          headerShown: false,
        }}
      />
      <ListStack.Screen name="Detail" component={TripDetail} options={{ title: "游记详情" }} />
    </ListStack.Navigator>
  );
}

// UserStackScreen：管理 User 页面
function UserStackScreen() {
  return (
    <UserStack.Navigator>
      <UserStack.Screen
        name="UserPage"
        component={User}
        options={{
          title: "User",
          headerShown: false,
        }}
      />
    </UserStack.Navigator>
  );
}

// TabNavigator：底部标签导航
function TabNavigator() {
  const navigation = useNavigation();
  const { authData } = useAuth();

  const handleAddPress = () => {
    if (!authData?.user?.userId) {
      Alert.alert("未登录", "请先登录以发布游记");
      return;
    }
    // 跳转到全局的 TripForm 页面
    navigation.navigate("TripForm");
  };

  return (
    <>
      <Tab.Navigator screenOptions={{ tabBarActiveTintColor: "#76aede" }}>
        <Tab.Screen
          name="首页"
          component={ListStackScreen}
          options={{
            headerShown: false,
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="home" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen
          name="我的"
          component={UserStackScreen}
          options={{
            headerShown: false,
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="account" color={color} size={size} />
            ),
          }}
        />
      </Tab.Navigator>
      {/* 自定义加号按钮 */}
      <TouchableOpacity style={styles.fab} onPress={handleAddPress}>
        <MaterialCommunityIcons name="plus" color="#FFFFFF" size={30} />
      </TouchableOpacity>
    </>
  );
}

// AppStackScreen：全局导航器
function AppStackScreen() {
  return (
    <AppStack.Navigator>
      <AppStack.Screen
        name="Main"
        component={TabNavigator}
        options={{ headerShown: false }}
      />
      <AppStack.Screen
        name="TripForm"
        component={CardPublish}
        options={{ title: "发布游记" }}
      />
      <AppStack.Screen name="Detail" component={TripDetail} options={{ title: "游记详情" }} />
    </AppStack.Navigator>
  );
}

export default AppStackScreen;

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    bottom: 20,
    alignSelf: "center",
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#76aede",
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
});