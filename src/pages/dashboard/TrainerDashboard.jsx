import { useEffect, useState } from "react";
import api from "../../api/axios";

export default function TrainerDashboard() {
  const [sessions, setSessions] = useState([]);
  const [stations, setStations] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
  const [demoVideo, setDemoVideo] = useState(null);
  const [status, setStatus] = useState("idle");

  // ================= LOAD SESSIONS =================
  const loadSessions = async () => {
    try {
      const res = await api.get("/sessions/waiting");
      setSessions(res.data.data || []);
    } catch (err) {
      console.log("LOAD SESSION ERROR:", err);
    }
  };

  // ================= LOAD STATIONS =================
  const loadStations = async (sessionId) => {
    try {
      const res = await api.get(`/tv/current?session_id=${sessionId}`);
      setStations(res.data.data?.context?.stations || []);
    } catch (err) {
      console.log("LOAD STATIONS ERROR:", err);
    }
  };

  // ================= FIRST LOAD =================
  useEffect(() => {
    loadSessions();
  }, []);

  // ================= SESSION SELECT =================
  const handleSelectSession = (sessionId) => {
    const session = sessions.find((s) => s.id == sessionId);
    setSelectedSession(session);

    if (sessionId) {
      loadStations(sessionId);
    }
  };

  // ================= CONTROL =================
  const startSession = async () => {
    if (!selectedSession) return;

    await api.post("/sessions/start", {
      session_id: selectedSession.id,
    });

    setStatus("running");
  };

  const pauseSession = async () => {
    await api.post("/sessions/pause", {
      session_id: selectedSession.id,
    });

    setStatus("paused");
  };

  const resumeSession = async () => {
    await api.post("/sessions/resume", {
      session_id: selectedSession.id,
    });

    setStatus("running");
  };

  const resetSession = async () => {
    await api.post("/sessions/reset", {
      session_id: selectedSession.id,
    });

    setStatus("idle");
  };

  // ================= UI =================
  return (
    <div style={{ padding: 20, fontFamily: "Arial" }}>

      <h2>Trainer Dashboard</h2>

      {/* ================= DROPDOWN (sessions/waiting) ================= */}
      <select
        style={{ padding: 10, marginBottom: 20, width: 320 }}
        onChange={(e) => handleSelectSession(e.target.value)}
      >
        <option value="">Select Session</option>

        {sessions.map((s) => (
          <option key={s.id} value={s.id}>
            {s.template?.name}
          </option>
        ))}
      </select>

      {/* ================= CONTROL BUTTONS ================= */}
      <div style={{ marginBottom: 20 }}>
        <button onClick={startSession} style={btn}>START</button>
        <button onClick={pauseSession} style={btn}>PAUSE</button>
        <button onClick={resumeSession} style={btn}>RESUME</button>
        <button onClick={resetSession} style={btn}>RESET</button>
      </div>

      {/* ================= STATUS ================= */}
      <div style={{ marginBottom: 20 }}>
        STATUS: <b>{status.toUpperCase()}</b>
      </div>

      {/* ================= STATIONS ================= */}
      <h3>Stations Demo</h3>

      <div style={{ display: "grid", gap: 10 }}>
        {stations.map((st) => (
          <div
            key={st.id}
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: 10,
              border: "1px solid #ddd",
              borderRadius: 8,
            }}
          >
            <div>
              Station {st.station_number}
            </div>

            <button
              onClick={() => setDemoVideo(st.exercise?.video_url)}
              style={btn}
            >
              ▶ DEMO
            </button>
          </div>
        ))}
      </div>

      {/* ================= VIDEO MODAL ================= */}
      {demoVideo && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.8)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div style={{ width: "70%" }}>
            <video
              src={demoVideo}
              controls
              autoPlay
              style={{ width: "100%", borderRadius: 10 }}
            />
            <button onClick={() => setDemoVideo(null)} style={btn}>
              CLOSE
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ================= STYLE =================
const btn = {
  padding: "8px 12px",
  marginRight: 10,
  background: "#123473",
  color: "white",
  border: "none",
  borderRadius: 6,
  cursor: "pointer",
};