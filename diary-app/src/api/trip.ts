import request from "../utils/request";
interface TripListResponse {
  data: Trip[];
  total: number;
}

interface FetchTripsParams {
  status: string;
  pageNum: number;
  pageSize: number;
}

// 定义旅行日记类型
export interface Trip {
  _id: string;
  title: string;
  content: string;
  images: string[];
  username: string;
  avatar: string;
  auditStatus: string;
  createTime: string;
  userId: string;
  likeCount: number;
  likedUsers: string[];
  location: string;       // 新增字段，字符串类型
  travelMonth: string | null; // 新增字段，字符串类型，可为空
  cost: number;           // 新增字段，数字类型
  days: number;           // 新增字段，数字类型
  // 其他字段...
}

// 获取所有已通过审核的旅行日记
export const getAllPassTrips = (
  params: FetchTripsParams
): Promise<TripListResponse> => {
  return request({
    url: `/api/trip/list`,
    method: "get",
    params,
  });
};

// 封装查询用户个人发布的游记
export const getUserTrips = (
  params: FetchTripsParams
): Promise<TripListResponse> => {
  return request({
    url: `/api/trip/status/${params.status}`,
    method: "get",
    params: {
      pageNum: params.pageNum || 1,
      pageSize: params.pageSize || 10,
    },
  });
};

// 关键词搜索旅行日记
export const searchTrips = (params: {
  keyword: string;
}): Promise<TripListResponse> => {
  return request({
    url: `/api/trip/search`,
    method: "get",
    params,
  });
};

// 创建旅行日记
export const createTrip = (params: {
  title: string;
  content: string;
  images: string[];
  location: string;
  travelMonth: string | null;
  cost: number;
  days: number;
  auditStatus: string;
}): Promise<Trip> => {
  return request({
    url: "/api/trip/",
    method: "post",
    data: params,
  });
};

// 更新旅行日记
export const updateTrip = (params: {
  _id: string;
  title: string;
  content: string;
  images: string[];
  location: string;
  travelMonth: string | null;
  cost: number;
  days: number;
  auditStatus: string;
}): Promise<Trip> => {
  return request({
    url: `/api/trip/${params._id}`,
    method: "put",
    data: params,
  });
};

// 删除旅行日记
export const deleteTrip = (id: string): Promise<void> => {
  return request({
    url: `/api/trip/${id}`,
    method: "delete",
  });
};

// 点赞游记
export const likeTrip = (tripId: string): Promise<Trip> => {
  return request({
    url: `/api/trip/${tripId}/like`,
    method: "post",
  });
};

// 取消点赞
export const unlikeTrip = (tripId: string): Promise<Trip> => {
  return request({
    url: `/api/trip/${tripId}/unlike`,
    method: "post",
  });
};
