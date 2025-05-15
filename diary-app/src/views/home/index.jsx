// Home.js
import React, { useState, useEffect, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { View, StyleSheet } from "react-native";
import WaterfallList from "./components/WaterfallList";
import { getAllPassTrips, searchTrips } from "@/api/trip";
import {
  Dialog,
  Portal,
  Button,
  Paragraph,
  Searchbar,
} from "react-native-paper";

const Home = ({ navigation }) => {
  const [trips, setTrips] = useState([]);
  const [visible, setVisible] = useState(false);
  const [keyword, setKeyword] = useState("");

  // 将 fetchInitialTrips 包装在 useCallback 中
  const fetchInitialTrips = useCallback(async () => {
    try {
      //console.log("正在获取游记列表...");
      const response = await getAllPassTrips();
      //console.log("获取游记成功，数量:", response.data.length);
      setTrips(response.data);
      return response.data;
    } catch (error) {
      //console.error("获取游记列表失败:", error);
      return [];
    }
  }, []);

  // 修改 useFocusEffect，确保每次进入页面时刷新数据
  useFocusEffect(
    useCallback(() => {
      //console.log("Home页面获得焦点");
      
      // 每次进入页面都刷新数据
      fetchInitialTrips();
      
      return () => {
        //console.log("Home页面失去焦点");
      };
    }, [fetchInitialTrips])
  );

  // 保留监听导航参数变化的 useEffect
  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      // 使用多种方式获取导航参数以确保能获取到
      const state = navigation.getState();
      const currentRoute = state?.routes[state.index];
      const updatedTrip = currentRoute?.params?.updatedTrip;
      
      //console.log("Home focus - 检查更新数据:", updatedTrip ? `游记ID:${updatedTrip._id}, 点赞数:${updatedTrip.likeCount}` : "无更新数据");
      
      if (updatedTrip) {
        //console.log("找到需要更新的游记:", updatedTrip._id, updatedTrip.likeCount);
        // 找到更新的游记在列表中的索引
        const tripIndex = trips.findIndex(trip => trip._id === updatedTrip._id);
        console.log("游记索引:", tripIndex);
        
        if (tripIndex !== -1) {
          // 重要: 创建新的数组，确保 React 能检测到变化
          const newTrips = [...trips];
          // 使用新的对象替换原对象，确保引用变化
          newTrips[tripIndex] = {
            ...newTrips[tripIndex],  // 保留原始属性
            likeCount: updatedTrip.likeCount, // 更新点赞数
            likedUsers: updatedTrip.likedUsers // 更新点赞用户列表
          };
          //console.log("更新后的游记:", newTrips[tripIndex].likeCount);
          setTrips(newTrips);
        }
        
        // 清除参数，避免重复更新
        navigation.setParams({ updatedTrip: undefined });
      }
    });

    return unsubscribe;
  }, [navigation, trips]);

  const handleSearch = async () => {
    console.log("handleSearch", keyword);
    if (!keyword) {
      return fetchInitialTrips();
    }
    try {
      const response = await searchTrips({ keyword });
      if (response.data.length === 0) {
        setVisible(true); // 打开对话框
        setKeyword(""); // 清空搜索关键词
      } else {
        setTrips(response.data);
      }
    } catch (error) {
      console.error("Error searching trips:", error);
      setTrips([]); // 在发生错误时清空列表
    }
  };

  const hideDialog = () => setVisible(false);

  return (
    <View style={styles.container}>
      <View style={styles.searchbar}>
        <Searchbar
          placeholder="搜索感兴趣的内容"
          onChangeText={setKeyword}
          value={keyword}
          onIconPress={handleSearch}
          style={{ backgroundColor: "#d4e5f5"}}
        />
      </View>

      <WaterfallList 
        trips={trips} 
        onRefresh={fetchInitialTrips}
      />
      <Portal>
        <Dialog visible={visible} onDismiss={hideDialog}>
          <Dialog.Title>搜索结果</Dialog.Title>
          <Dialog.Content>
            <Paragraph>搜索结果为空，请尝试其他关键词。</Paragraph>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={hideDialog}>好的</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  searchbar: {
    padding: 8,
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
  },
});

export default Home;