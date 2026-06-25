import api from "../api/axios";

export const getTVState = () => {
  return api.get("/tv/current");
};

export const startSession = async () => {
  const res = await api.post("/sessions/start");
  return res.data;
};