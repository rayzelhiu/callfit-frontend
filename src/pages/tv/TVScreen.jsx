import { useEffect, useRef, useState } from "react";
import api from "../../api/axios";
import logo from "../../assets/call_fit.png";
import { MdTimer } from "react-icons/md";
import { FiRefreshCw } from "react-icons/fi";

export default function TvScreen() {

  // ================= STATE =================
  const [sessions, setSessions] = useState([]);
  const [state, setState] = useState(null);
  const [unlocked, setUnlocked] = useState(false);
  const [localRemaining, setLocalRemaining] = useState(0);

  // ================= REF =================
  const intervalRef = useRef(null);
  const prevPhase = useRef(null);
  const lastSoundKey = useRef(null);

  // ================= AUDIO UNLOCK =================
  useEffect(() => {
    const unlock = () => {
      const audio = new Audio("/sounds/switch.mp3");

      audio.play()
        .then(() => {
          audio.pause();
          audio.currentTime = 0;
        })
        .catch(() => {});

      setUnlocked(true);
    };

    window.addEventListener("click", unlock, { once: true });
    window.addEventListener("touchstart", unlock, { once: true });

    return () => {
      window.removeEventListener("click", unlock);
      window.removeEventListener("touchstart", unlock);
    };
  }, []);

  // ================= LISTEN MODE (ONLY AFTER UNLOCK) =================
  useEffect(() => {
    if (!unlocked) return;

    const fetchState = async () => {
      try {
        const res = await api.get("/tv/current");
        if (res.data?.data) {
          setState(res.data.data);
        }
      } catch (err) {}
    };

    intervalRef.current = setInterval(fetchState, 1000);

    return () => clearInterval(intervalRef.current);
  }, [unlocked]);

  // ================= AUDIO CONTROL (ANTI DOUBLE) =================
  const play = (src) => {
    const audio = new Audio(src);
    audio.volume = 0.8;
    audio.play().catch(() => {});
  };

  useEffect(() => {
    if (!state?.phase) return;
    if (!unlocked) return;

    const prev = prevPhase.current;
    const current = state.phase;

    if (!prev) {
      prevPhase.current = current;
      return;
    }

    const key = `${prev}-${current}`;
    if (lastSoundKey.current === key) return;

    if (prev === "warmup" && current === "work") play("/sounds/work.mp3");
    if (prev === "work" && current === "switch") play("/sounds/switch.mp3");
    if (prev === "rest" && current === "work") play("/sounds/switch.mp3");
    if (prev === "switch" && current === "work") play("/sounds/work.mp3");
    if (prev === "work" && current === "rest") play("/sounds/work.mp3");
    if (prev === "switch" && current === "cooldown") play("/sounds/cooldown.mp3");

    lastSoundKey.current = key;
    prevPhase.current = current;
  }, [state?.phase]);

  // ================= TIMER =================
  useEffect(() => {
    if (!state?.phase_end) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const end = state.phase_end * 1000;
      setLocalRemaining(Math.max(0, Math.ceil((end - now) / 1000)));
    }, 200);

    return () => clearInterval(interval);
  }, [state?.phase_end]);

  const timer = localRemaining;
  const { phase, context, set } = state || {};
  const stations = context?.stations || [];

  const warmups = context?.warmups || [];
const cooldowns = context?.cooldowns || [];

const list =
  phase === "warmup"
    ? warmups
    : phase === "cooldown"
    ? cooldowns
    : [];

const item = list?.[0] || null;

  // ================= UNLOCK SCREEN =================
  if (!unlocked) {
    return (
      <div
        onClick={() => setUnlocked(true)}
        style={{
          height: "100vh",
          background: "#0f172a",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          color: "white",
          fontSize: 28,
          textAlign: "center",
          cursor: "pointer"
        }}
      >
        🔊 TAP TO ACTIVATE TV
        <div style={{ fontSize: 14, opacity: 0.6, marginTop: 10 }}>
          waiting trainer start session
        </div>
      </div>
    );
  }

  /* ================= LOADING ================= */
  if (!state) {
    return (
      <div className="vh-100 d-flex justify-content-center align-items-center"
        style={{ background: "#0f172a", color: "white" }}>
        LOADING...
      </div>
    );
  }

  /* ================= FINISHED ================= */
  if (phase === "finished") {
    return (
      <div className="vh-100 d-flex flex-column justify-content-center align-items-center"
        style={{ background: "#f5f7fb" }}>

        <img src={logo} width={160} style={{ marginBottom: 20 }} />

        <h1 style={{
          color: "#123473",
          fontWeight: "bold",
          letterSpacing: 1,
          textAlign: "center"
        }}>
          WORKOUT COMPLETED
        </h1>
      </div>
    );
  }

  /* ================= MAIN UI ================= */
  return (
    <div className="vh-100 d-flex flex-column" style={{ background: "#f5f7fb" }}>

     {/* ================= HEADER CARD STYLE ================= */}
<div
  style={{
    height: "12%",
    background: "#123473",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 40px",
    position: "relative", // 🔥 penting untuk center absolute
  }}
>

  {/* ================= LOGO (LEFT) ================= */}
  <div
    style={{
      background: "white",
      borderRadius: 16,
      padding: 10,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    <img src={logo} width={130} />
  </div>

  {/* ================= TIMER (CENTER FIXED) ================= */}
  <div
    style={{
      position: "absolute",
      left: "50%",
      transform: "translateX(-50%)",

      background: "#0f2557",
      padding: "10px 60px", // 🔥 bikin lebih “lega”
      borderRadius: 18,

      fontSize: 110,
      fontWeight: "900",
      color: timer <= 10 ? "#ff4d4d" : "#2ecc71",

      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      minWidth: 260,
    }}
  >
    {timer}
  </div>

  {/* ================= SETS (RIGHT) ================= */}
  <div
    style={{
      background: "#0f2557",
      borderRadius: 16,
      padding: "20px 50px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      color: "white",
      minWidth: 140,
    }}
  >
    <div
      style={{
        fontSize: 20,
        letterSpacing: 3,
        opacity: 0.8,
      }}
    >
      SETS
    </div>

    <div
      style={{
        fontSize: 60,
        fontWeight: "900",
        lineHeight: 1.5,
      }}
    >
      {set || "-"}
    </div>
  </div>

</div>

      {/* BODY */}
      <div style={{ flex: 1, padding: 20 }}>

{/* ================= WORK MODE TV PERFECT FIT ================= */}
{phase === "work" ? (
  <div
    style={{
      height: "80vh",
      width: "100%",
      display: "grid",
      gridTemplateColumns: "repeat(2, 1fr)",
      gridTemplateRows: "repeat(3, 1fr)",
      gap: 45, // 🔥 sedikit lebih kecil (±1% feel lebih rapat)
      padding: 9, // 🔥 sedikit lebih rapat
      boxSizing: "border-box",
      overflow: "hidden",
      paddingTop: 50
    }}
  >
    {stations.slice(0, 6).map((st) => {
      const isActive =
        state?.active_station_number === st.station_number &&
        state?.phase === "work";

      const media = isActive
        ? st.exercise?.video_url
        : st.exercise?.thumbnail_url;

      return (
        <div
          key={st.id}
          style={{
            position: "relative",
            borderRadius: 14,
            overflow: "hidden",
            background: "#000",
          }}
        >

          {/* MEDIA */}
          {isActive ? (
            <video
              src={media}
              autoPlay
              muted
              playsInline
              style={{
                width: "100%",
                height: "100%",
                transform: "scale(1.02)",
                objectFit: "cover",
              }}
            />
          ) : (
            <img
              src={media}
              style={{
                width: "100%",
                height: "100%",
                transform: "scale(1.02)",
                objectFit: "cover",
              }}
            />
          )}

          {/* ================= STATION LABEL (BIG UPGRADE) ================= */}
          <div
            style={{
              position: "absolute",
              bottom: 10,
              left: 12,
              background: "rgba(0,0,0,0.65)",
              padding: "6px 14px",
              borderRadius: 10,
              color: "white",

              // 🔥 BESAR BANGET
              fontSize: 48,
              fontWeight: 900,
              letterSpacing: 2,
              lineHeight: 1,
              textShadow: "0 2px 6px rgba(0,0,0,0.8)"
            }}
          >
            {st.station_number}
          </div>

        </div>
      );
    })}
  </div>
) : (
          /* WARMUP / COOLDOWN */
          item && (
            <div style={{
              height: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center"
            }}>
              <video
                src={item.exercise?.video_url}
                autoPlay
                muted
                playsInline
                style={{
                  width: "80%",
                  borderRadius: 16,
                  boxShadow: "0 10px 30px rgba(0,0,0,0.2)"
                }}
              />
            </div>
          )
        )}
      </div>
      {/* ================= OVERLAY REST / SWITCH ================= */}
{/* ================= OVERLAY REST / SWITCH ================= */}
{(phase === "rest" || phase === "switch") && (
  <div
    style={{
      position: "absolute",
      inset: 0,
      background: phase === "rest" ? "#e74c3c" : "#f1c40f",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 999,
    }}
  >
    {/* ICON */}
    <div style={{ color: "white", marginBottom: 10 }}>
      {phase === "rest" ? (
        <MdTimer size={110} />
      ) : (
        <FiRefreshCw size={110} />
      )}
    </div>

    {/* TEXT BESAR */}
    <div
      style={{
        fontSize: 90,
        fontWeight: "900",
        color: "white",
        letterSpacing: 2,
      }}
    >
      {phase?.toUpperCase()}
    </div>

    {/* TIMER BESAR */}
    <div
      style={{
        fontSize: 150,
        fontWeight: "900",
        color: "white",
        marginTop: 10,
      }}
    >
      {timer}
    </div>
  </div>
)}
    </div>
  );
}