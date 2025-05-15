import React, { useState, useCallback } from "react";
import { View, Text, StyleSheet, ScrollView, Dimensions, TouchableOpacity, Image } from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { ActivityIndicator } from "react-native-paper";
import { getUserTrips } from "@/api/trip";
import formatDate from "@/utils/formatDate";

const { width } = Dimensions.get("window");
const COLUMN_COUNT = 2;

const tabLabels = ["通过", "等待", "拒绝"];
const statuses = ["pass", "wait", "reject"];

const UserTripCard = ({ diary, onPress, showReject }) => (
  <TouchableOpacity onPress={() => onPress(diary)} activeOpacity={0.85} style={styles.cardWrap}>
    <View style={styles.card}>
      <View style={styles.cardImageWrap}>
        {diary.images && diary.images.length > 0 && diary.images[0] ? (
          <Image
            source={{ uri: diary.images[0] }}
            style={styles.cardImageReal}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.cardImage}>
            <Text style={styles.cardImageText}>{diary.title?.slice(0, 1) || "图"}</Text>
          </View>
        )}
      </View>
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle} numberOfLines={1}>{diary.title}</Text>
        <Text style={styles.cardDate}>{formatDate(diary.createTime)}</Text>
        {showReject && diary.rejectReason ? (
          <Text style={styles.rejectReason}>{diary.rejectReason}</Text>
        ) : null}
      </View>
    </View>
  </TouchableOpacity>
);

const UserTripTab = () => {
  const navigation = useNavigation();
  const [index, setIndex] = useState(0);
  const [diaries, setDiaries] = useState({ pass: [], wait: [], reject: [] });
  const [loading, setLoading] = useState(false);

  const loadDiaries = async (status) => {
    setLoading(true);
    getUserTrips({ status })
      .then((response) => {
        if (response.data) {
          setDiaries((prev) => ({ ...prev, [status]: response.data }));
        }
      })
      .catch((error) => {
        console.error("Error fetching trips:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useFocusEffect(
    useCallback(() => {
      loadDiaries(statuses[index]);
    }, [index])
  );

  const handleItemClick = (diary) => {
    // 已通过的游记（第一个tab，index为0）跳转到详情页
    if (index === 0) {
      navigation.navigate("Detail", diary);
    } else {
      // 等待审核或被拒绝的游记跳转到编辑表单
      navigation.push("TripForm", diary);
    }
  };

  // 卡片式两列布局
  const data = diaries[statuses[index]] || [];
  const columns = Array.from({ length: COLUMN_COUNT }, () => []);
  data.forEach((item, i) => {
    columns[i % COLUMN_COUNT].push(item);
  });

  return (
    <View style={styles.container}>
      {/* 顶部tab栏 */}
      <View style={styles.tabs}>
        {tabLabels.map((label, idx) => (
          <TouchableOpacity
            key={label}
            style={styles.tabItem}
            onPress={() => setIndex(idx)}
            activeOpacity={0.7}
          >
            <Text style={[styles.tabText, index === idx && styles.tabTextActive]}>{label}</Text>
            {index === idx && <View style={styles.tabUnderline} />}
          </TouchableOpacity>
        ))}
      </View>
      {/* 卡片列表 */}
      <View style={styles.listContainer}>
        {loading ? (
          <ActivityIndicator animating={true} style={{ marginTop: 30 }} />
        ) : (
          <ScrollView contentContainerStyle={styles.scrollWrap}>
            <View style={styles.columnsContainer}>
              {columns.map((column, colIdx) => (
                <View key={colIdx} style={styles.column}>
                  {column.map((item) => (
                    <UserTripCard
                      key={item._id}
                      diary={item}
                      onPress={handleItemClick}
                      showReject={index === 2}
                    />
                  ))}
                </View>
              ))}
            </View>
          </ScrollView>
        )}
      </View>
    </View>
  );
};

const CARD_MARGIN = 8;
const CARD_WIDTH = width / COLUMN_COUNT - CARD_MARGIN * 2 - 4;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 10,
  },
  tabs: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 8,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 6,
    position: "relative",
  },
  tabText: {
    fontSize: 18,
    color: "#888",
    fontWeight: "bold",
  },
  tabTextActive: {
    color: "#222",
  },
  tabUnderline: {
    position: "absolute",
    left: "25%",
    right: "25%",
    bottom: -2,
    height: 3,
    borderRadius: 2,
    backgroundColor: "#76aede",
  },
  listContainer: {
    flex: 1,
    marginTop: 8,
  },
  scrollWrap: {
    paddingBottom: 20,
  },
  columnsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  column: {
    width: CARD_WIDTH,
    marginHorizontal: CARD_MARGIN,
  },
  cardWrap: {
    marginBottom: 16,
  },
  card: {
    borderRadius: 10,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 3,
    overflow: "hidden",
  },
  cardImageWrap: {
    width: "100%",
    height: 120,
    backgroundColor: "#f5f5f5",
    alignItems: "center",
    justifyContent: "center",
  },
  cardImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#eee",
    alignItems: "center",
    justifyContent: "center",
  },
  cardImageText: {
    fontSize: 28,
    color: "#bbb",
  },
  cardContent: {
    padding: 10,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#222",
    marginBottom: 4,
  },
  cardDate: {
    fontSize: 12,
    color: "#888",
    marginBottom: 2,
  },
  rejectReason: {
    fontSize: 12,
    color: "#e74c3c",
    marginTop: 2,
  },
  cardImageReal: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
});

export default UserTripTab;
