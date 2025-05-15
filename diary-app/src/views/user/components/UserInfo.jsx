import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Avatar, IconButton } from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import { updateAvatar } from "@/api/user";
import { base64ToFile } from "@/utils/upload";
import { useAuth } from "@/auth/contexts/Auth";

const initUserInfo = {
  username: "Guest",
  avatar:
  "http://oss-cn-shu.oss-cn-shanghai.aliyuncs.com/HiTrip/images/b35a2c81594bcde2ac61b2ebe4f1e281.jpg",
};

const UserInfo = () => {
  const { authData, updateAuthData } = useAuth();
  const userInfo = authData?.user || initUserInfo;

  const handleAvatarChange = async () => {
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
      let localUri = result.assets[0].uri;
      const parts = localUri.match(/^data:(.+);base64,(.+)$/);
      const formData = new FormData();
      if (parts) {
        const file = base64ToFile(localUri);
        formData.append("avatar", file);
      } else {
        let filename = localUri.split("/").pop();
        let match = /\.(\w+)$/.exec(filename);
        let type = match ? `image/${match[1]}` : `image`;
        formData.append("avatar", { uri: localUri, name: filename, type });
      }
      
      updateAvatar(formData)
        .then((response) => {
          // 更新用户信息
          if (authData) {
            // 创建更新后的authData对象
            const updatedAuthData = {
              ...authData,
              user: {
                ...authData.user,
                avatar: response.url
              }
            };
            
            // 使用updateAuthData方法更新全局状态和AsyncStorage
            updateAuthData(updatedAuthData);
          }
        })
        .catch((error) => {
          console.error("Error updating avatar:", error);
        });
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.avatarContainer}>
        <Avatar.Image source={{ uri: userInfo.avatar }} size={96} />
        <IconButton
          icon="pencil-circle"
          size={32}
          style={styles.iconButton}
          color="#6200ee"
          onPress={handleAvatarChange}
        />
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.username}>{userInfo.username}</Text>
        <Text style={styles.description}>个人简介</Text>
      </View>
    </View>
  );
};

export default UserInfo;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: 10,
    paddingHorizontal: 16,
  },
  avatarContainer: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  iconButton: {
    position: "absolute",
    right: -10,
    bottom: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  infoContainer: {
    marginLeft: 20,
    flex: 1,
  },
  username: {
    fontSize: 18,
    fontWeight: "bold",
    color: "black",
  },
  description: {
    fontSize: 14,
    color: "gray",
  },
});

