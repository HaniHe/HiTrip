import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  SafeAreaView,
  Modal,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Swiper from "react-native-swiper";
import icon_share from "../../assets/icon/icon_share.png";
import { IconButton } from "react-native-paper";
import { likeTrip, unlikeTrip } from "../../api/trip";
import { useAuth } from "../../auth/contexts/Auth";
import ImageViewer from 'react-native-image-zoom-viewer';

const TripDetail = ({ route }) => {
  const navigation = useNavigation();
  const { authData } = useAuth();
  const currentUserId = authData?.user?.userId || "";

  const {
    title,
    content,
    username,
    avatar,
    images,
    createTime,
    _id,
    likedUsers: initialLikedUsers,
    likeCount: initialLikeCount,
    cost,
    days,
    location,
    travelMonth,
  } = route.params;

  const [activeIndex, setActiveIndex] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(new Array(images.length).fill(false));
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(initialLikeCount || 0);
  const [likedUsers, setLikedUsers] = useState(initialLikedUsers || []);
  const [dataChanged, setDataChanged] = useState(false);
  const [isImageModalVisible, setIsImageModalVisible] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // 初始化点赞状态
  useEffect(() => {
    if (currentUserId && likedUsers) {
      setIsLiked(likedUsers.includes(currentUserId));
    }
  }, [currentUserId, likedUsers]);

  // 仅在返回时通知首页刷新
  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', (e) => {
      if (dataChanged) {
        try {
          //console.log("准备返回首页，传递更新数据:", _id, likeCount);

          const updatedTripData = {
            _id,
            likeCount,
            likedUsers,
            title,
            content,
            username,
            avatar,
            images,
            createTime,
            cost,
            days,
            location,
            travelMonth,
          };

          navigation.navigate({
            name: 'Home',
            params: {
              updatedTrip: updatedTripData
            },
            merge: true,
          });
        } catch (error) {
          //console.error("返回首页传递数据失败:", error);
        }
      }
    });
    return unsubscribe;
  }, [navigation, dataChanged, _id, likeCount, likedUsers, title, content, username, avatar, images, createTime]);

  const handleLike = async () => {
    if (!currentUserId) {
      //console.log("未登录，无法点赞");
      return;
    }
    try {
      let newLikeCount = likeCount;
      let newLikedUsers = [...likedUsers];

      if (isLiked) {
        // 取消点赞
        const response = await unlikeTrip(_id);
        //console.log("取消点赞响应:", response);
        newLikeCount = likeCount - 1;
        setLikeCount(newLikeCount);
        newLikedUsers = likedUsers.filter(id => id !== currentUserId);
        setLikedUsers(newLikedUsers);
      } else {
        // 点赞
        const response = await likeTrip(_id);
        // console.log("点赞响应:", response);
        newLikeCount = likeCount + 1;
        setLikeCount(newLikeCount);
        newLikedUsers = [...likedUsers, currentUserId];
        setLikedUsers(newLikedUsers);
      }

      setIsLiked(!isLiked);
      setDataChanged(true);

      // 更新数据对象
      const updatedTripData = {
        _id,
        likeCount: newLikeCount,
        likedUsers: newLikedUsers,
        title,
        content,
        username,
        avatar,
        images,
        createTime,
        cost,
        days,
        location,
        travelMonth,
      };

      // 1. 更新当前页面的路由参数
      //console.log("更新当前页面参数");
      navigation.setParams({
        ...route.params,
        likeCount: newLikeCount,
        likedUsers: newLikedUsers
      });

      // 2. 直接设置全局变量，保存更新的游记数据
      // console.log("将游记数据保存到全局");
      global.updatedTripData = updatedTripData;

      // 3. 尝试使用父导航设置参数
      const parent = navigation.getParent();
      parent.setParams({
        updatedTrip: updatedTripData
      });
    } catch (error) {
      //console.error("点赞操作失败:", error);
    }
  };

  const onIndexChanged = (index) => {
    setActiveIndex(index);
  };

  const handleImageLoad = (index) => {
    const updatedLoaded = [...imageLoaded];
    updatedLoaded[index] = true;
    setImageLoaded(updatedLoaded);
  };

  const onShare = async () => {
    // 分享功能
  };

  // 动态决定显示的字段
  const tripInfoItems = [
    { label: "出行地点", value: location, shouldShow: location !== "" },
    { label: "出发时间", value: travelMonth, shouldShow: travelMonth !== null },
    { label: "行程天数", value: `${days}天`, shouldShow: days !== 0 },
    { label: "人均花费", value: `${cost}`, shouldShow: cost !== 0 },
  ];

  // 过滤出需要显示的字段
  const visibleItems = tripInfoItems.filter((item) => item.shouldShow);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.mainContainer}>
        <ScrollView style={styles.scrollContainer}>
          {/* 图片轮播区 */}
          <View style={styles.swiperContainer}>
            <Swiper
              loop={true}
              autoplay={false}
              showsPagination={true}
              dotColor={"#CCCCCC"}
              activeDotColor={"green"}
              paginationStyle={styles.paginationStyle}
              showsButtons
              onIndexChanged={onIndexChanged}
            >
              {images.map((image, index) => (
                <TouchableOpacity
                  key={index}
                  style={{ flex: 1, justifyContent: "center" }}
                  onPress={() => {
                    setSelectedImageIndex(index);
                    setIsImageModalVisible(true);
                  }}
                >
                  <Image
                    source={{ uri: image }}
                    style={{ width: "100%", height: "100%" }}
                    onLoad={() => handleImageLoad(index)}
                  />
                </TouchableOpacity>
              ))}
            </Swiper>
          </View>

          {/* 图片放大模态框 */}
          <Modal
            visible={isImageModalVisible}
            transparent={true}
            animationType="fade"
            onRequestClose={() => setIsImageModalVisible(false)}
          >
            <ImageViewer
              imageUrls={images.map((image) => ({ url: image }))}
              index={selectedImageIndex} 
              onChange={(index) => setSelectedImageIndex(index)}
              onClick={() => setIsImageModalVisible(false)}
              enableSwipeDown // 支持下拉关闭
              onSwipeDown={() => setIsImageModalVisible(false)} 
              saveToLocalByLongPress={false} 
              backgroundColor="rgba(0, 0, 0, 0.9)" 
            />
          </Modal>

          {/* 标题 */}
          <Text style={styles.title}>{title}</Text>

          {/* 行程信息卡片 - 动态渲染 */}
          {visibleItems.length > 0 && (
            <View
              style={[
                styles.tripInfoContainer,
                visibleItems.length === 1
                  ? styles.tripInfoContainerSingle
                  : visibleItems.length === 2
                    ? styles.tripInfoContainerDouble
                    : null,
              ]}
            >
              {visibleItems.map((item, index) => (
                <View key={item.label} style={styles.tripInfoItemWrapper}>
                  <View style={styles.tripInfoItem}>
                    <Text style={styles.tripInfoValue}>{item.value}</Text>
                    <Text style={styles.tripInfoLabel}>{item.label}</Text>
                  </View>
                  {/* 在非最后一个可见项后添加分隔线，但仅当字段数大于 1 时 */}
                  {visibleItems.length > 1 && index < visibleItems.length - 1 && (
                    <View style={styles.tripInfoDivider} />
                  )}
                </View>
              ))}
            </View>
          )}

          {/* 内容 */}
          <Text style={styles.content}>{content}</Text>

          {/* 底部填充 */}
          <View style={styles.bottomSpacer} />
        </ScrollView>

        {/* 固定在底部的作者和操作栏 */}
        <View style={styles.footer}>
          <View style={styles.authorInfo}>
            <Image source={{ uri: avatar }} style={styles.avatar} />
            <View style={styles.authorTextContainer}>
              <Text style={styles.authorName}>{username}</Text>
              <Text style={styles.createdAt}>{createTime.slice(0, 10)}</Text>
            </View>
          </View>

          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.actionButton} onPress={handleLike}>
              <IconButton
                icon={isLiked ? "heart" : "heart-outline"}
                size={24}
                iconColor={isLiked ? "#FF4D4F" : "#666"}
                onPress={handleLike}
              />
              <Text style={styles.actionText}>{likeCount}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton} onPress={onShare}>
              <Image source={icon_share} style={styles.shareIcon} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  mainContainer: {
    flex: 1,
    position: "relative",
  },
  scrollContainer: {
    flex: 1,
  },
  swiperContainer: {
    height: 200,
    width: "100%",
  },
  paginationStyle: {
    bottom: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 16,
  },
  tripInfoContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around", // 均匀分布
    marginHorizontal: 16,
    marginBottom: 20,
    paddingVertical: 16,
    paddingHorizontal: 12,
    backgroundColor: "#F8F8F8",
    borderRadius: 16,
    flexWrap: "wrap", // 允许换行
  },
  tripInfoContainerSingle: {
    justifyContent: "center", // 单个字段时居中
  },
  tripInfoContainerDouble: {
    justifyContent: "center", // 两个字段时居中
    paddingHorizontal: 20, // 稍微增加内边距
  },
  tripInfoItemWrapper: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10, // 增加间距
  },
  tripInfoItem: {
    alignItems: "center",
    paddingHorizontal: 15, // 调整内边距
  },
  tripInfoValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  tripInfoLabel: {
    fontSize: 12,
    color: "#999",
    marginTop: 4,
  },
  tripInfoDivider: {
    width: 1,
    height: "60%",
    backgroundColor: "#E5E5E5",
    alignSelf: "center",
    marginHorizontal: 10, // 分隔线与字段之间的间距
  },
  content: {
    fontSize: 16,
    lineHeight: 24,
    color: "#333",
    marginHorizontal: 16,
    marginBottom: 24,
  },
  bottomSpacer: {
    height: 60,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
    backgroundColor: "#FFFFFF",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  authorInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 8,
  },
  authorTextContainer: {
    flex: 1,
  },
  authorName: {
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
  },
  createdAt: {
    fontSize: 12,
    color: "#999999",
  },
  actionButtons: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 16,
  },
  actionText: {
    fontSize: 14,
    color: "#666",
    marginLeft: -4,
  },
  shareIcon: {
    width: 24,
    height: 24,
  },
});

export default TripDetail;