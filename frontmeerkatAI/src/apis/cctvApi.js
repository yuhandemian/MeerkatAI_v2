import { api } from "./client";

export const cctvApi = {
  getCctvs: () => api.get("/cctv/list", {}, true),
  createCctv: (cctvData) => api.post(`/cctv/add`, cctvData, true),
  updateCctv: (id, cctvData) => api.put(`/cctv/update/${id}`, cctvData, true),
  deleteCctv: (ids) => api.delete(`/cctv/delete`, ids, true),
  startStreaming: (id) => api.put(`/streaming-video/connect/${id}`, {}, true),
  stopStreaming: (id) => api.put(`/streaming-video/disconnect/${id}`, {}, true),
};
