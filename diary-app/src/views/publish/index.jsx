import React, { useState, useEffect } from "react";
import UniPopup from "./components/UniPopup";
import TropForm from "../../views/trip/tripFrom";
import { useFocusEffect, useNavigation } from "@react-navigation/native";

const CardPublish = ({ route }) => {
  const [showPopup, setShowPopup] = useState(true);
  const navigation = useNavigation();
  const isEdit = route.params?._id;

    // 根据是否有_id参数判断是编辑模式还是发布模式
    useEffect(() => {
      navigation.setOptions({
        title: isEdit ? "修改游记" : "发布游记"
      });
    }, [navigation, isEdit]);

  useFocusEffect(
    React.useCallback(() => {
      setShowPopup(true);
    }, [])
  );

  const hidePopup = () => {
    setShowPopup(false);
  };

  return (
    <>
      <TropForm route={route} />
      <UniPopup show={showPopup} onHidePopup={hidePopup} />
    </>
  );
};

export default CardPublish;
