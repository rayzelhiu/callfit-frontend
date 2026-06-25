import api from "../api/axios";
import { toast } from "react-hot-toast";

/* ================= SEND TEMPLATE TO QUEUE ================= */
export const handleSendToTV = async (templateId) => {
  try {
    const res = await api.post("/sessions/queue", {
      template_id: templateId,
    });

    toast.success("Template masuk antrian TV 🚀");

    return res.data;
  } catch (err) {
    console.error(err);
    toast.error(
      err?.response?.data?.message || "Gagal masuk antrian TV!"
    );
    throw err;
  }
};

/* ================= GET WAITING SESSIONS ================= */
export const getWaitingSessions = async () => {
  try {
    const res = await api.get("/sessions/waiting");
    return res.data.data;
  } catch (err) {
    console.error(err);
    toast.error("Gagal mengambil session waiting");
    return [];
  }
};

/* ================= START SESSION ================= */
export const startSession = async (sessionId) => {
  try {
    const res = await api.post("/sessions/start", {
      session_id: sessionId,
    });

    toast.success("Session dimulai 🎬");

    return res.data;
  } catch (err) {
    console.error(err);
    toast.error(
      err?.response?.data?.message || "Gagal start session"
    );
    throw err;
  }
};