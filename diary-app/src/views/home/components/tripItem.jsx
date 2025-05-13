import React, { useEffect, useState } from "react";
import { Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { Card, useTheme, IconButton } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import formatDate from "@/utils/formatDate";
import { View } from "react-native";
import { likeTrip, unlikeTrip } from "@/api/trip";
import { useAuth } from "@/auth/contexts/Auth";

const TripItem = ({ trip, onRefresh }) => {
  const navigation = useNavigation();
  const theme = useTheme();
  const { authData } = useAuth() || {}; // 添加空值合并操作符
  const currentUserId = authData?.user?.userId || "";
  
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(trip.likeCount || 0);
  
  // 设置点赞状态
  useEffect(() => {
    if (currentUserId && trip.likedUsers) {
      setIsLiked(trip.likedUsers.includes(currentUserId));
    }
    // 重要：每当 trip 对象变化时，更新点赞数
    setLikeCount(trip.likeCount || 0);
  }, [currentUserId, trip.likedUsers, trip.likeCount]);

  // 新增：监听导航参数变化，更新点赞状态
  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      const updatedTrip = navigation.getState()?.params?.updatedTrip;
      if (updatedTrip && updatedTrip._id === trip._id) {
        console.log("TripItem - 收到更新:", updatedTrip.likeCount);
        setLikeCount(updatedTrip.likeCount);
        setIsLiked(updatedTrip.likedUsers.includes(currentUserId));
        
        // 更新本地 trip 对象属性（可能不生效，因为 props 是只读的）
        if (trip) {
          // 这种方式在某些环境下可能不生效，但值得一试
          trip.likeCount = updatedTrip.likeCount;
          trip.likedUsers = updatedTrip.likedUsers;
        }
      }
    });
    return unsubscribe;
  }, [navigation, trip._id, currentUserId]);
  
  const onPress = () => {
    navigation.push("Detail", {
      ...trip,
       likeCount: likeCount,
       likedUsers: trip.likedUsers
     });
   };
  
  const handleLike = async () => {
    // 确认有用户ID才能点赞
    if (!currentUserId) {
      console.log("未登录，无法点赞");
      return;
    }
    
    try {
      if (isLiked) {
        // 取消点赞
        await unlikeTrip(trip._id);
        setLikeCount(prev => prev - 1);
        
        // 更新本地点赞列表
        if (trip.likedUsers) {
          trip.likedUsers = trip.likedUsers.filter(id => id !== currentUserId);
        }
        
        setIsLiked(false);
      } else {
        // 点赞
        await likeTrip(trip._id);
        setLikeCount(prev => prev + 1);
        
        // 更新本地点赞列表
        if (trip.likedUsers) {
          trip.likedUsers.push(currentUserId);
        } else {
          trip.likedUsers = [currentUserId];
        }
        
        setIsLiked(true);
      }
     
      // 刷新列表
      if (onRefresh) {
        onRefresh();
      }
    } catch (error) {
      console.error("点赞操作失败:", error);
    }
  };
  
  
  return (
    <Card onPress={onPress} style={styles.card}>
      <Card.Cover source={{ uri: trip.images[0] }} style={styles.image} />
      <Card.Content>
        <Text style={styles.title}>{trip.title}</Text>
        <Text style={styles.date}>{formatDate(trip.createTime)}</Text>
        <View style={styles.authorContainer}>
          <Image
            source={{ uri: trip.avatar }}
            style={styles.avatar}
            resizeMode="cover"
          />
          <Text style={styles.authorName}>{trip.username}</Text>
          <View style={styles.likeContainer}>
            <IconButton
              icon={isLiked ? "heart" : "heart-outline"}
              size={20}
              iconColor={isLiked ? "#FF4D4F" : theme.colors.text}
              onPress={handleLike}    
            />
            <Text style={styles.likeCount}>{likeCount}</Text>
          </View>
        </View>
      </Card.Content>
    </Card>
  );
};

export default TripItem;

const styles = StyleSheet.create({
  card: {
    marginBottom: 8,
    borderRadius: 8,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  image: {
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginVertical: 4,
  },
  date: {
    fontSize: 12,
    marginVertical: 4,
  },
  authorContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  avatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 8,
  },
  authorName: {
    fontSize: 14,
    flex: 1,
  },
  likeContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  likeCount: {
    fontSize: 12,
    marginLeft: -8,
  },
});
