import React, { useState, useEffect } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import {
  Button,
  Portal,
  Dialog,
  Paragraph,
  TextInput as PaperTextInput,
  IconButton,
  Card,
} from "react-native-paper";
import { useFormik } from "formik";
import * as yup from "yup";
import { createTrip, updateTrip, deleteTrip } from "../../api/trip";
import ImageUploader from "../../components/ImageUploader";
import { useNavigation } from "@react-navigation/native";

const validationSchema = yup.object({
  title: yup.string("输入标题").required("标题必须填写"),
  content: yup.string("输入内容").required("内容必须填写"),
  images: yup.array().min(1, "至少上传一张图片哦").required("图片是必须的"),
  location: yup.string(),
  travelMonth: yup.string().nullable(), // 改为字符串类型，可为空
  cost: yup.number().min(0, "人均费用不能为负"), 
  days: yup.number().min(0, "出行天数不能为负"), 
});

const months = [
  "1月", "2月", "3月", "4月", "5月", "6月",
  "7月", "8月", "9月", "10月", "11月", "12月"
];

const TripForm = ({ route }) => {
  const isEdit = route.params?._id; // id是否存在，如果有表示编辑现有游记，否则是创建新的游记
  const [isFormChanged, setIsFormChanged] = useState(false); // 使用 useState 跟踪表单是否被修改（初始为 false）
  const navigation = useNavigation(); // 通过 useNavigation 钩子获取导航功能，用于页面跳转（如返回上一页）

  const formik = useFormik({
    initialValues: {
      title: route.params?.title || "",
      content: route.params?.content || "",
      images: route.params?.images || [],
      location: route.params?.location || "",
      travelMonth: route.params?.travelMonth || null,
      cost: route.params?.cost || 0,
      days: route.params?.days || 0,
      // 新增：初始化 status 字段
      auditStatus: route.params?.status || "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      const action = isEdit ? updateTrip : createTrip; //根据isEdit的值判断是创建还是更新
      // 新增：如果编辑被拒绝的游记，将状态设为 "wait"
      const submissionValues = {
        ...values,
        _id: isEdit ? route.params._id : undefined,
        // 如果当前状态为 "reject"，更新为 "wait"
        auditStatus: isEdit && values.auditStatus === "reject" ? "wait" : values.auditStatus,
      };
      // if (isEdit) {
      //   values._id = route.params._id;
      // }
      // console.log("提交的表单值:", submissionValues); // 调试：检查提交时的 status
      action(submissionValues)
        .then(() => {
          formik.resetForm();
          navigation.goBack(); // 成功后重置表单并返回上一页
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    },
  });

  // 选择出行月份
  const [selectedMonth, setSelectedMonth] = useState(() => {
    return route.params?.travelMonth|| ""; 
  });
  const handleMonthChange = (month) => {
    formik.setFieldValue("travelMonth", month); 
    setSelectedMonth(month);
  };

// 检查必填字段是否已填写
  useEffect(() => {
    const isRequiredFieldsFilled = 
      formik.values.title.trim() !== "" &&
      formik.values.content.trim() !== "" &&
      formik.values.images.length > 0;
    setIsFormChanged(isRequiredFieldsFilled);
    // console.log('当前表单值:', formik.values);
  }, [formik.values]);

  const [visible, setVisible] = useState(false);

  // 显示删除确认对话框
  const showDialog = () => setVisible(true);
  const hideDialog = () => setVisible(false);
  
  const handleConfirmDelete = () => {
    deleteTrip(route.params._id)
      .then(() => {
        navigation.goBack();
      })
      .catch((error) => {
        console.error("Error deleting:", error);
      });
    hideDialog();
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}> 
      {/* 键盘避免视图，当键盘出现时，自动调整页面布局 */}
      <ScrollView style={styles.container}>
      <View style={styles.labelContainer}>
          <Text style={styles.label}>上传图片</Text>
          <Text style={styles.requiredLabel}>*</Text>
        </View>
        <View style={styles.imageSection}>
          <ImageUploader
            images={formik.values.images}
            setImages={(images) => formik.setFieldValue("images", images)}
          />
        </View>

        <View style={styles.labelContainer}>
            <Text style={styles.label}>标题</Text>
            <Text style={styles.requiredLabel}>*</Text>
          </View>
        <PaperTextInput
          mode="flat"
          placeholder="请输入标题"
          placeholderTextColor="#666"
          value={formik.values.title}
          onChangeText={formik.handleChange("title")}
          style={styles.textInput}
          underlineColor="transparent"
          theme={{ colors: { primary: "#76aede" } }}
        />

        <View style={styles.labelContainer}>
            <Text style={styles.label}>内容</Text>
            <Text style={styles.requiredLabel}>*</Text>
          </View> 
        <PaperTextInput
          mode="flat"
          placeholder="请输入内容"
          placeholderTextColor="#666"
          value={formik.values.content}
          onChangeText={formik.handleChange("content")}
          multiline
          numberOfLines={4}
          style={[styles.textInput, styles.contentInput]}
          underlineColor="transparent"
          theme={{ colors: { primary: "#76aede" } }}
        />

        <PaperTextInput
          mode="flat"
          placeholder="请输入出行地点"
          placeholderTextColor="#666"
          value={formik.values.location}
          onChangeText={formik.handleChange("location")}
          style={styles.textInput}
          underlineColor="transparent"
          theme={{ colors: { primary: "#76aede" } }}
        />

        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.monthLabel}>出行时间</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.monthPicker}>
              {months.map((month) => (
                <TouchableOpacity
                  key={month}
                  style={[
                    styles.monthButton,
                    selectedMonth === month && styles.selectedMonth
                  ]}
                  onPress={() => handleMonthChange(month)}
                >
                  <Text style={styles.monthText}>{month}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </Card.Content>
        </Card>

       {/* 新增的 人均费用 和 出行天数 */}
       <Card style={styles.card}>
          <Card.Content>
            <View style={styles.formRow}>
              <Text style={styles.formLabel}>人均费用</Text>
              <View style={styles.stepper}>
                <IconButton
                  icon="minus"
                  size={20}
                  onPress={() =>
                    formik.setFieldValue("cost", Math.max(formik.values.cost - 1, 0))
                  }
                />
                <PaperTextInput
                  mode="outlined"
                  value={formik.values.cost.toString()} // 转换为字符串以适配 TextInput
                  onChangeText={(text) => {
                    const num = parseInt(text) || 0; // 转换为数字，默认为 0
                    formik.setFieldValue("cost", num);
                  }}
                  keyboardType="numeric" // 限制为数字键盘
                  style={styles.numberinput} // 自定义输入框样式
                  outlineStyle={{ borderRadius: 10 }} // 调整边框样式
                  theme={{ colors: { primary: "#76aede" } }}
                />
                <IconButton
                  icon="plus"
                  size={20}
                  onPress={() => formik.setFieldValue("cost", formik.values.cost + 1)}
                />
                <Text>元</Text>
              </View>
            </View>

            <View style={styles.formRow}>
              <Text style={styles.formLabel}>出行天数</Text>
              <View style={styles.stepper}>
                <IconButton
                  icon="minus"
                  size={20}
                  onPress={() =>
                    formik.setFieldValue("days", Math.max(formik.values.days - 1, 0))
                  }
                />
                <PaperTextInput
                  mode="outlined"
                  value={formik.values.days.toString()} // 转换为字符串以适配 TextInput
                  onChangeText={(text) => {
                    const num = parseInt(text) || 0; // 转换为数字，默认为 0
                    formik.setFieldValue("days", num);
                  }}
                  keyboardType="numeric" // 限制为数字键盘
                  style={styles.numberinput} // 自定义输入框样式
                  outlineStyle={{ borderRadius: 10 }} // 调整边框样式
                  theme={{ colors: { primary: "#76aede" } }}
                />
                <IconButton
                  icon="plus"
                  size={20}
                  onPress={() => formik.setFieldValue("days", formik.values.days + 1)}
                />
                <Text>天</Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        <View style={styles.buttonContainer}>
          <Button
            mode="contained"  
            onPress={formik.handleSubmit}
            disabled={!isFormChanged}
            style={styles.publishButton}
            theme={{ colors: { primary: "#76aede" } }}
          >
            {isEdit ? "保存修改" : "发布游记"}
          </Button>
          {isEdit && (
            <Button mode="outlined" onPress={showDialog} style={styles.publishButton} theme={{ colors: { primary: "#76aede" } }}>
              删除游记
            </Button>
          )}
        </View>
        <Portal>
          <Dialog visible={visible} onDismiss={hideDialog}>
            <Dialog.Title>确认删除</Dialog.Title>
            <Dialog.Content>
              <Paragraph>确认删除此条游记？该操作不可逆！</Paragraph>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={hideDialog}>取消</Button>
              <Button onPress={handleConfirmDelete} color="red">
                删除
              </Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  imageSection: {
    margin: 10,
    backgroundColor: "white",
    padding: 5,
    borderRadius: 10,
  },
  textInput: {
    backgroundColor: "white",
    margin: 10,
    borderRadius: 10,
    paddingHorizontal: 10,
  },
  contentInput: {
    minHeight: 100,
  },
  card: {
    margin: 10,
    backgroundColor: "white",
    borderRadius: 10,
  },
  monthLabel: {
    fontSize: 16,
    marginBottom: 10,
  },
  monthPicker: {
    flexDirection: "row",
  },
  monthButton: {
    marginRight: 10,
    padding: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 20,
  },
  selectedMonth: {
    backgroundColor: "#d4e5f5",

  },
  monthText: {
    color: "#333",
  },
  formRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  formLabel: {
    fontSize: 16,
    color: "#333",
  },
  numberinput: {
    width: 80, // 控制输入框宽度
    height: 40,
    textAlign: "center", // 居中显示数值
    backgroundColor: "transparent", // 使背景透明，与现有样式一致
  },
  unit: {
    marginLeft: 5,
    fontSize: 16,
  },
  stepper: {
    flexDirection: "row",
    alignItems: "center",
  },
  value: {
    marginHorizontal: 10,
    fontSize: 16,
  },
  publishButton: {
    margin: 20,
    borderRadius: 30,
    paddingVertical: 8,
  },
  labelContainer: {
    flexDirection: "row",
    alignItems: "center", // 垂直居中对齐
    marginLeft: 15,
    marginTop: 10,
  },
  label: {
    fontSize: 16,
    color: "#333",
  },
  requiredLabel: {
    fontSize: 16,
    color: "red",
    marginLeft: 2, // 标题和星号之间的间距
  },
});

export default TripForm;

