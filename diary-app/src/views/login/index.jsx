import React, { useState, useEffect } from "react";
import { View, StyleSheet, Text, ActivityIndicator, Alert, Image } from "react-native";
import {
  Button,
  TextInput,
  Card,
  Provider as PaperProvider,
} from "react-native-paper";
import { Formik } from "formik";
import * as Yup from "yup";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../../auth/contexts/Auth";

const LoginSchema = Yup.object().shape({
  username: Yup.string().required("用户名是必填项"),
  password: Yup.string().required("密码是必填项"),
});

const theme = {
  colors: {
    primary: '#FFFFFF',      // 主色调，用于应用的主要操作按钮、导航栏等
    accent: '#76aede',       // 强调色，用于浮动操作按钮(FAB)和交互元素
    background: '#FFFFFF',   // 背景色，用于屏幕的主要背景
    surface: '#FFFFFF',      // 表面色，用于卡片、对话框等组件的背景
    text: '#333333',         // 文本色，用于主要文本内容
    error: '#df2319',        // 错误色，用于表单验证错误和错误状态提示
  }
};

const Login = ({ route }) => {
  const auth = useAuth();
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [actionType, setActionType] = useState("");

  const handleAction = async (values) => {
    setLoading(true);
    try {
      if (actionType === "login") {
        await auth.signIn(values);
        console.log("Login successful");
      } else if (actionType === "register") {
        navigation.navigate("Register");
        setLoading(false);
        return;
      }
    } catch (error) {
      console.error(`${actionType} failed:`, error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PaperProvider theme={theme}>
      <View style={styles.container}>
        <Card style={styles.card}>
          <View style={styles.titleContainer}>
            <Image source={require('../../assets/login-logo.png')} style={styles.logo} />
            <Text style={styles.mainTitle}>HiTrip</Text>
          </View>

          <Text style={styles.subTitle}>Journeys Meet Memories</Text>
          <Formik
            initialValues={{ username: "", password: "", remember: false }}
            validationSchema={LoginSchema}
            onSubmit={(values) => {
              handleAction(values);
            }}
          >
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              values,
              errors,
              touched,
            }) => (
              <>
                <TextInput
                  mode="outlined"
                  label="用户名"
                  value={values.username}
                  onChangeText={handleChange("username")}
                  onBlur={handleBlur("username")}
                  style={styles.input}
                  error={touched.username && errors.username}
                  outlineColor="#a4a0a0"
                  activeOutlineColor="#333333"
                />
                {touched.username && errors.username && (
                  <Text style={styles.errorText}>{errors.username}</Text>
                )}
                <TextInput
                  mode="outlined"
                  label="密码"
                  secureTextEntry
                  value={values.password}
                  onChangeText={handleChange("password")}
                  onBlur={handleBlur("password")}
                  style={styles.input}
                  error={touched.password && errors.password}
                  outlineColor="#a4a0a0"
                  activeOutlineColor="#333333"
                />
                {touched.password && errors.password && (
                  <Text style={styles.errorText}>{errors.password}</Text>
                )}
                <Button
                  mode="contained"
                  onPress={() => {
                    setActionType("login");
                    handleSubmit();
                  }}
                  disabled={loading}
                  style={styles.button}
                >
                  {loading && actionType === "login" ? <ActivityIndicator size={24}/> : "登录"}
                </Button>
                <Button
                  mode="outlined"
                  onPress={() => navigation.navigate("Register")}
                  disabled={loading}
                  style={styles.button}
                >
                  {loading && actionType === "register" ? <ActivityIndicator size={24} /> : "注册"}
                </Button>
              </>
            )}
          </Formik>
        </Card>
      </View>
    </PaperProvider>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#94c3ea', 
  },
  card: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  logo: {
    width: 42,
    height: 42,
    marginRight: 8,
  },
  mainTitle: {
    fontSize: 40,
    color: "#303133",
    fontWeight: "bold",
  },
  subTitle: {
    fontSize: 22,
    color: "#FFD700",
    textAlign: "center",
    fontWeight: "bold",
    marginBottom: 16,
  },
  input: {
    marginBottom: 10,
  },
  button: {
    marginTop: 10,
  },
  errorText: {
    color: "#df2319",
    fontSize: 12,
    marginBottom: 4,
  },
});