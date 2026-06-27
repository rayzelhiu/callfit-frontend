import { useEffect, useState } from "react";
import api from "../../api/axios";
import { FaPlay, FaPause, FaRedo } from "react-icons/fa";

export default function TrainerDashboard() {
  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
  const [stations, setStations] = useState([]);
  const [demoVideo, setDemoVideo] = useState(null);
  const [status, setStatus] = useState("idle");

  // ================= LOAD SESSIONS =================
  const loadSessions = async () => {
    try {
      const res = await api.get("/sessions/waiting");
      setSessions(res.data.data || []);
    } catch (err) {
      console.log("SESSION ERROR:", err);
    }
  };

  useEffect(() => {
    loadSessions();
  }, []);

  // ================= SELECT SESSION =================
  const handleSelectSession = (sessionId) => {
    const session = sessions.find((s) => s.id == sessionId);
    setSelectedSession(session);

    if (!session) return;

    setStations(session.template?.stations || []);
    setStatus(session.status || "idle");
  };

  // ================= CONTROL =================
  const startSession = async () => {
    if (!selectedSession) return;
    await api.post("/sessions/start", { session_id: selectedSession.id });
    setStatus("running");
  };

  const pauseSession = async () => {
    if (!selectedSession) return;
    await api.post("/sessions/pause", { session_id: selectedSession.id });
    setStatus("paused");
  };

  const resumeSession = async () => {
    if (!selectedSession) return;
    await api.post("/sessions/resume", { session_id: selectedSession.id });
    setStatus("running");
  };

  const resetSession = async () => {
    if (!selectedSession) return;
    await api.post("/sessions/reset", { session_id: selectedSession.id });
    setStatus("idle");
    setStations([]);
  };

  return (
    <div style={styles.page}>

      {/* HEADER */}
      <div style={styles.header}>
        <div style={styles.brand} className="text-black">
          TRAINER DASHBOARD
        </div>

        <div style={styles.status} className="text-black">
          STATUS: {status.toUpperCase()}
        </div>
      </div>

      {/* CARD */}
      <div style={styles.card}>

        {/* SESSION SELECT */}
        <div style={styles.section}>
          <h3 style={styles.title}>Select Session</h3>

          <select
            style={styles.select}
            onChange={(e) => handleSelectSession(e.target.value)}
          >
            <option value="">Choose session...</option>
            {sessions.map((s) => (
              <option key={s.id} value={s.id}>
                {s.template?.name}
              </option>
            ))}
          </select>
        </div>

        {/* CONTROL */}
        <div style={styles.section}>
          <h3 style={styles.title}>Controls</h3>

          <div style={styles.btnGroup}>
            <button style={styles.startBtn} onClick={startSession}>
              <FaPlay /> Start
            </button>

            <button style={styles.pauseBtn} onClick={pauseSession}>
              <FaPause /> Pause
            </button>

            <button style={styles.resumeBtn} onClick={resumeSession}>
              <FaPlay /> Resume
            </button>

        
          </div>
        </div>

        {/* STATIONS */}
        <div style={styles.section}>
          <h3 style={styles.title}>Stations</h3>

          <div style={styles.grid}>
            {stations.map((st) => (
              <div key={st.id} style={styles.cardItem}>
                <div className="text-black">
                  Station {st.station_number}
                </div>

                <button
                  style={styles.demoBtn}
                  onClick={() => setDemoVideo(st.exercise?.video_url)}
                >
                  Demo
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* VIDEO MODAL */}
      {demoVideo && (
        <div style={styles.modal}>
          <div style={styles.modalBox}>
            <video src={demoVideo} controls autoPlay style={{ width: "100%" }} />
            <button style={styles.closeBtn} onClick={() => setDemoVideo(null)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ================= STYLE ================= */
const styles = {
  page: {
    minHeight: "100vh",
    background: "#e8f5fe",
    color: "white",
    padding: 30,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },

  header: {
    width: "100%",
    maxWidth: 900,
    display: "flex",
    justifyContent: "space-between",
    marginBottom: 20,
  },

  brand: {
    fontSize: 24,
    fontWeight: "bold",
  },

  status: {
    opacity: 0.7,
  },

  card: {
    width: "100%",
    maxWidth: 900,
    background: "#123473",
    borderRadius: 14,
    padding: 20,
  },

  section: {
    marginBottom: 25,
  },

  title: {
    marginBottom: 12,
    fontSize: 16,
    opacity: 0.85,
  },

  select: {
    width: "100%",
    padding: 12,
    borderRadius: 8,
    border: "none",
  },

  btnGroup: {
    display: "flex",
    gap: 12,
    flexWrap: "wrap",
  },

  startBtn: {
    background: "#22c55e",
    border: "none",
    padding: "10px 14px",
    borderRadius: 8,
    color: "white",
  },

  pauseBtn: {
    background: "#f59e0b",
    border: "none",
    padding: "10px 14px",
    borderRadius: 8,
    color: "white",
  },

  resumeBtn: {
    background: "#3b82f6",
    border: "none",
    padding: "10px 14px",
    borderRadius: 8,
    color: "white",
  },

  resetBtn: {
    background: "#ef4444",
    border: "none",
    padding: "10px 14px",
    borderRadius: 8,
    color: "white",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: 12,
  },

  // ✅ FIX MOBILE SPACING
  cardItem: {
    background: "#e8f5fe",
    padding: 14,
    borderRadius: 10,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10, // penting biar ga mepet di hp
    flexWrap: "wrap",
  },

  demoBtn: {
    background: "#334155",
    border: "none",
    padding: "8px 12px",
    borderRadius: 6,
    color: "white",
  },

  modal: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.8)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  modalBox: {
    width: "70%",
    background: "#000",
    padding: 20,
    borderRadius: 12,
  },

  closeBtn: {
    marginTop: 10,
    padding: 10,
    width: "100%",
    background: "#ef4444",
    border: "none",
    color: "white",
    borderRadius: 8,
  },
};