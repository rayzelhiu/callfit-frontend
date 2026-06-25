import api from "../api/axios";

// ================= GET ALL =================
export const getExercises = () => api.get("/exercises");

// CREATE (UPLOAD SUPPORT)
export const createExercise = (data) => {
  return api.post("/exercises", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// UPDATE (UPLOAD SUPPORT)
export const updateExercise = (id, data) => {
  return api.post(`/exercises/${id}?_method=PUT`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// DELETE
export const deleteExercise = (id) => api.delete(`/exercises/${id}`);