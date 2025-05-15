import React, { useState } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  KeyboardAvoidingView,
  Platform,
  Image
} from "react-native";
import {
  Button,
  TextInput as PaperTextInput,
  Card,
  ActivityIndicator,
  Provider as PaperProvider,
} from "react-native-paper";
import { useFormik } from "formik";
import * as yup from "yup";
import * as ImagePicker from "expo-image-picker";
import { useNavigation } from "@react-navigation/native";
import { base64ToFile } from "@/utils/upload";
import { updateAvatar, register } from "@/api/user";
import Toast from "react-native-toast-message";

const theme = {
  colors: {
    primary: '#76aede',
    accent: '#76aede',
    background: '#FFFFFF',
    surface: '#FFFFFF',
    text: '#333333',
    error: '#df2319',
  }
}; 
const validationSchema = yup.object({
  username: yup
    .string()
    .required("用户名是必填项")
    .min(3, "用户名至少需要3个字符")
    .max(20, "用户名不能超过20个字符"),
  password: yup
    .string()
    .required("密码是必填项")
    .min(6, "密码至少需要6个字符"),
  confirmPassword: yup
    .string()
    .required("请确认密码")
    .oneOf([yup.ref("password")], "两次输入的密码不一致"),
});

const defaultAvatar =
  "http://oss-cn-shu.oss-cn-shanghai.aliyuncs.com/HiTrip/images/b35a2c81594bcde2ac61b2ebe4f1e281.jpg";


const Register = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
      confirmPassword: "",
      avatar: null,
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const formData = {
          username: values.username,
          password: values.password,
        };

        // 如果选择了头像，先上传头像
        if (values.avatar) {
          try {
            const avatarFormData = new FormData();
            if (values.avatar.startsWith("data:")) {
              const file = base64ToFile(values.avatar);
              avatarFormData.append("avatar", file);
            } else {
              let filename = values.avatar.split("/").pop();
              let match = /\.(\w+)$/.exec(filename);
              let type = match ? `image/${match[1]}` : `image`;
              avatarFormData.append("avatar", {
                uri: values.avatar,
                name: filename,
                type,
              });
            }
            const response = await updateAvatar(avatarFormData);
            if (response && response.url) {
              formData.avatar = response.url;
            }
          } catch (error) {
            console.error("Avatar upload failed:", error);
            // 上传失败但继续注册，使用默认头像
          }
        }

        // 调用 register API
        await register(formData);

        // 显示注册成功的Toast消息
        Toast.show({
          type: "success",
          position: "top",
          text1: "注册成功",
          visibilityTime: 2000,
          autoHide: true,
          topOffset: 30,
          onHide: () => {
            // Toast消息隐藏后再导航到登录页面
            navigation.reset({
              index: 0,
              routes: [{ name: "Login" }]
            });
          }
        });
      } catch (error) {
        console.error("Registration failed:", error);
        setLoading(false); // 停止加载状态
        
        if (error.response && error.response.status === 409) {
          // 用户名已存在，清空表单
          formik.resetForm({
            values: {
              username: '',
              password: '',
              confirmPassword: '',
              avatar: values.avatar // 保留头像选择
            }
          });
          
          setErrorMessage("用户名已存在，请更换其他用户名");
          formik.setFieldTouched("username", true);
          formik.setFieldError("username", "用户名已存在");
        } else {
          setErrorMessage(
            error.response?.data?.message || "注册失败，请稍后重试"
          );
        }
      }
    },
  });

  const handleAvatarSelection = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("请允许访问相册权限");
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      base64: true,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      formik.setFieldValue("avatar", result.assets[0].uri);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >

      <PaperProvider theme={theme}>
        <ScrollView style={styles.container}>
          <Card style={styles.card}>
            <Card.Title title="用户注册" titleStyle={styles.cardTitle} />
            <Card.Content>
              <View style={styles.avatarContainer}>
                <Image
                  source={{
                    uri: formik.values.avatar || defaultAvatar,
                  }}
                  style={styles.avatar}
                />
                <Button
                  mode="outlined"
                  onPress={handleAvatarSelection}
                  style={styles.avatarButton}
                >
                  {formik.values.avatar ? "更换头像" : "选择头像"}
                </Button>
                <Text style={styles.avatarHint}>不上传将使用默认头像</Text>
              </View>

              <View style={styles.labelContainer}>
                <Text style={styles.label}>用户名</Text>
                <Text style={styles.requiredLabel}>*</Text>
              </View>
              <PaperTextInput
                mode="outlined"
                placeholder="请输入用户名（3-20个字符）"
                value={formik.values.username}
                onChangeText={formik.handleChange("username")}
                onBlur={formik.handleBlur("username")}
                style={styles.textInput}
                error={formik.touched.username && formik.errors.username}
              />
              {formik.touched.username && formik.errors.username ? (
                <Text style={styles.errorText}>{formik.errors.username}</Text>
              ) : null}

              <View style={styles.labelContainer}>
                <Text style={styles.label}>密码</Text>
                <Text style={styles.requiredLabel}>*</Text>
              </View>
              <PaperTextInput
                mode="outlined"
                placeholder="请输入密码（至少6个字符）"
                secureTextEntry
                value={formik.values.password}
                onChangeText={formik.handleChange("password")}
                onBlur={formik.handleBlur("password")}
                style={styles.textInput}
                error={formik.touched.password && formik.errors.password}
              />
              {formik.touched.password && formik.errors.password ? (
                <Text style={styles.errorText}>{formik.errors.password}</Text>
              ) : null}

              <View style={styles.labelContainer}>
                <Text style={styles.label}>确认密码</Text>
                <Text style={styles.requiredLabel}>*</Text>
              </View>
              <PaperTextInput
                mode="outlined"
                placeholder="请再次输入密码"
                secureTextEntry
                value={formik.values.confirmPassword}
                onChangeText={formik.handleChange("confirmPassword")}
                onBlur={formik.handleBlur("confirmPassword")}
                style={styles.textInput}
                error={
                  formik.touched.confirmPassword && formik.errors.confirmPassword
                }
              />
              {formik.touched.confirmPassword && formik.errors.confirmPassword ? (
                <Text style={styles.errorText}>{formik.errors.confirmPassword}</Text>
              ) : null}

              {errorMessage ? (
                <Text style={styles.formErrorText}>{errorMessage}</Text>
              ) : null}

              <Button
                mode="contained"
                onPress={formik.handleSubmit}
                disabled={loading || !(formik.isValid && formik.dirty)}
                style={[
                  styles.registerButton,
                  {
                    backgroundColor: 
                      (loading || !(formik.isValid && formik.dirty)) 
                      ? '#cccccc' 
                      : theme.colors.primary
                  }
                ]}
                loading={loading}
              >
                {loading ? <ActivityIndicator color="white" /> : "注册"}
              </Button>

              <Button
                mode="text"
                onPress={() =>
                  navigation.reset({
                    index: 0,
                    routes: [{ name: "Login" }],
                  })
                }
                style={styles.loginButton}
              >
                已有账号？返回登录
              </Button>
            </Card.Content>
          </Card>
        </ScrollView>
      </PaperProvider>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#94c3ea',
  },
  card: {
    margin: 16,
    borderRadius: 12,
    elevation: 3,
    backgroundColor: '#ffffff',
  },
  cardTitle: {
    textAlign: "center",
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 16,
  },
  avatarContainer: {
    alignItems: "center",
    marginVertical: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: '#76aede',
  },
  avatarButton: {
    marginTop: 10,
    borderRadius: 20,
    width: 120,
  },
  avatarHint: {
    fontSize: 12,
    color: "#888",
    marginTop: 5,
    textAlign: "center",
  },
  labelContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
    marginBottom: 4,
  },
  label: {
    fontSize: 16,
    color: "#333",
  },
  requiredLabel: {
    fontSize: 16,
    color: "red",
    marginLeft: 2,
  },
  textInput: {
    backgroundColor: "white",
    marginBottom: 6,
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginBottom: 8,
  },
  formErrorText: {
    color: "red",
    fontSize: 14,
    marginTop: 10,
    marginBottom: 10,
    textAlign: "center",
  },
  registerButton: {
    marginTop: 24,
    borderRadius: 30,
    paddingVertical: 6,
  },
  loginButton: {
    marginTop: 12,
    marginBottom: 16,
  },
});

export default Register;