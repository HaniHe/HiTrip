import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Login from "@/views/login";
import Register from "@/views/register";

const Stack = createStackNavigator();

export const AuthStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false, // 隐藏默认标题栏
      }}
    >
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Register" component={Register} />
    </Stack.Navigator>
  );
};
