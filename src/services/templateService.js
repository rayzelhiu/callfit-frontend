import api from "../api/axios";

export const getTemplates = () => api.get("/workouts");

export const createTemplate = (data) =>
  api.post("/workouts", data);

export const updateTemplate = (id, data) =>
  api.put(`/workouts/${id}`, data);

export const deleteTemplate = (id) =>
  api.delete(`/workouts/${id}`);

export const getTemplateById = (id) =>
  api.get(`/workouts/${id}`);