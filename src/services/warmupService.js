import api from "../api/axios";

export const getWarmups = (templateId) =>
  api.get(`/warmups`, {
    params: {
      template_id: templateId,
    },
  });

export const createWarmup = (data) =>
  api.post("/warmups", data);

export const updateWarmup = (id, data) =>
  api.put(`/warmups/${id}`, data);

export const deleteWarmup = (id) =>
  api.delete(`/warmups/${id}`);

export const reorderWarmups = (items) =>
  api.post("/warmups/reorder", { items });