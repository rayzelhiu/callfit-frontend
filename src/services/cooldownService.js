import api from "../api/axios";

export const getCooldowns = (templateId) =>
  api.get(`/cooldowns`, {
    params: {
      template_id: templateId,
    },
  });

export const createCooldown = (data) =>
  api.post("/cooldowns", data);

export const updateCooldown = (id, data) =>
  api.put(`/cooldowns/${id}`, data);

export const deleteCooldown = (id) =>
  api.delete(`/cooldowns/${id}`);

export const reorderCooldowns = (items) =>
  api.post("/cooldowns/reorder", { items });