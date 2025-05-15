import { Modal, Button, List, Avatar, notification, Tag } from "antd";
import RejectTripModal from "./RejectTripModal";
import "swiper/css";
import "./index.scss";
import formatDate from "@/utils/formatDate";
import { passTrip } from "@/api/manage";
import { useState } from "react";
import { Navigation, Pagination, Scrollbar, A11y } from "swiper/modules";

import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";

const TripDetailModal = ({ isVisible, onClose, trip }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  // 审核状态映射
  const auditStatusMap = {
    pass: {
      color: "success",
      text: "已通过"
    },
    wait: {
      color: "processing",
      text: "等待审核"
    },
    reject: {
      color: "error",
      text: "已拒绝"
    }
  };

  const onRejectTrip = () => {
    setIsModalVisible(true);
  };
  const onPassTrip = () => {
    Modal.confirm({
      title: "确认通过这个行程吗？",
      onOk() {
        passTrip(trip._id)
          .then(() => {
            notification.success({
              message: "Success",
              description: "审核通过",
            });
            // 修改trip
            trip.auditStatus = "pass";
            onClose(true);
          })
          .catch((error) => {
            console.error("Error passing trip:", error);
          });
      },
    });
  };

  return (
    <>
      <Modal
        title={
          <span>
            {trip.title}{" "}
            <Tag color={auditStatusMap[trip.auditStatus]?.color}>
              {auditStatusMap[trip.auditStatus]?.text}
            </Tag>
          </span>
        }
        open={isVisible}
        onCancel={onClose}
        footer={
          trip.auditStatus === "pass" ? (
            // 已通过状态
            <div>
              <span style={{ color: "#52c41a", marginRight: "10px" }}>
                该游记已审核通过
              </span>
              <Button key="close" onClick={onClose}>
                关闭
              </Button>
            </div>
          ) : trip.auditStatus === "reject" ? (
            // 已拒绝状态
            <div>
              <span style={{ color: "#f5222d", marginRight: "10px" }}>
                该游记已被拒绝: {trip.rejectReason || "无拒绝原因"}
              </span>
              <Button key="pass" type="primary" onClick={onPassTrip} style={{ marginRight: "8px" }}>
                重新通过
              </Button>
              <Button key="close" onClick={onClose}>
                关闭
              </Button>
            </div>
          ) : (
            // 等待审核状态
            [
              <Button key="submit" type="primary" onClick={onPassTrip} style={{ marginRight: "8px" }}>
                通过
              </Button>,
              <Button key="reject" danger onClick={onRejectTrip}>
                拒绝
              </Button>,
            ]
          )
        }
      >
        <List>
          <List.Item>
            <List.Item.Meta
              avatar={<Avatar src={trip.avatar} size="large" />}
              title={trip.username}
              description={`发布时间：${formatDate(trip.createTime)}`}
            />
          </List.Item>
          <List.Item>
            <Swiper
              // install Swiper modules
              modules={[Navigation, Pagination, Scrollbar, A11y]}
              spaceBetween={50}
              slidesPerView={1}
              navigation
              pagination={{ clickable: true }}
            >
              {trip.images.map((image, index) => (
                <SwiperSlide key={index} className="swiper-slide">
                  <img
                    src={image}
                    alt={`image-${index}`}
                    className="swiper-image"
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </List.Item>
          <List.Item>
            <div>{trip.content}</div>
          </List.Item>
        </List>
      </Modal>
      <RejectTripModal
        tripId={trip._id}
        visible={isModalVisible}
        onClose={(refresh) => {
          setIsModalVisible(false);
          if (refresh) {
            trip.auditStatus = "reject";
            onClose(true);
          }
        }}
      />
    </>
  );
};

export default TripDetailModal;
