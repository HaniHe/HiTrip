// src/api/trip.ts
import request from "@/utils/request"; 

// 定义接口返回类型
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
  id: string;
  title: string;
  content: string;
  username: string;
  auditStatus: string;
  createdAt: string;
}

// 查询旅行日记列表函数
export const getTripsByStatus = (
  params: FetchTripsParams
): Promise<TripListResponse> => {
  return request({
    url: `/api/trip/audit/status/${params.status}`,
    method: "get",
    params: {
      pageNum: params.pageNum,
      pageSize: params.pageSize,
    },
  });
};

// 审核通过函数
export const passTrip = (id: string): Promise<unknown> => {
  return request({
    url: `/api/trip/audit/pass/${id}`,
    method: "put",
  });
};

// 拒绝游记函数
export const rejectTrip = (id: string): Promise<unknown> => {
  return request({
    url: `/api/trip/audit/reject/${id}`,
    method: "put",
  });
};