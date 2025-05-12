import request from "@/utils/request";

export const passTrip = (id: string) => {
  return request.post(`/trip/audit/pass/${id}`);
};

export const rejectTrip = (id: string, reason: string) => {
  return request.post(`/trip/audit/reject/${id}`, { reason });
}; 