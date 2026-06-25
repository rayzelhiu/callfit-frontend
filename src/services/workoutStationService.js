import api from "../api/axios";

export const getStations = (templateId) =>
  api.get(`/workouts/${templateId}/stations`);

export const createStation = (data) =>
  api.post("/workouts/stations", data);

export const updateStation = (id, data) =>
  api.put(`/workouts/stations/${id}`, data);

export const deleteStation = (id) =>
  api.delete(`/workouts/stations/${id}`);

export const reorderStations = (
  stations
) =>
  api.post(
    "/workout-stations/reorder",
    {
      stations,
    }
  );