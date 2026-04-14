import { api } from "./client";

export const mainApi = {
  getVideoList: (filter) => api.post("/video/list", filter, true),
  viewVideo: (id) => api.get(`/video/view/${id}`, {}, true),
  downloadVideo: (ids) => api.post("/video/download", ids, true, "blob"),
  deleteVideo: (ids) => api.delete("/video/delete", ids, true),
  loadCalendar: (date) => api.get(`/calendar/${date}`, {}, true),
};
