import { useEffect, useRef, useState } from "react";
import api from "../../api/axios";
import logo from "../../assets/call_fit.png";
import { MdTimer } from "react-icons/md";
import { FaExchangeAlt } from "react-icons/fa";

export default function TvScreen() {

  // ================= STATE =================
  const [state, setState] = useState(null);
  const [unlocked, setUnlocked] = useState(false);
  const audioPool = useRef({});


  const [warmupIndex, setWarmupIndex] = useState(0);
  const [cooldownIndex, setCooldownIndex] = useState(0);

  const [displayTime, setDisplayTime] = useState(0);

  // ================= REFS =================
  const intervalRef = useRef(null);
  const prevPhase = useRef(null);
  const lastSoundKey = useRef(null);
  const soundLockRef = useRef(false);

  const serverAnchor = useRef(null);
  const lastSyncTime = useRef(null);

  const phase = state?.phase;
const set = state?.set;
const context = state?.context;


  // ================= UNLOCK =================
  useEffect(() => {
    const unlock = () => setUnlocked(true);

    window.addEventListener("click", unlock, { once: true });
    window.addEventListener("touchstart", unlock, { once: true });

    return () => {
      window.removeEventListener("click", unlock);
      window.removeEventListener("touchstart", unlock);
    };
  }, []);

  // ================= FETCH STATE =================
  useEffect(() => {
    if (!unlocked) return;

    const fetchState = async () => {
      try {
        const res = await api.get("/tv/current");

        if (res.data?.data) {
          const next = res.data.data;

          setState((prev) => {
            if (prev?.status === "paused" && next?.status === "running") {
              return prev;
            }
            return next;
          });
        }
      } catch (err) {
        console.log(err);
      }
    };

    intervalRef.current = setInterval(fetchState, 1000);
    return () => clearInterval(intervalRef.current);
  }, [unlocked]);

  // ================= RESET INDEX =================
  useEffect(() => {
    if (state?.phase === "warmup") setWarmupIndex(0);
    if (state?.phase === "cooldown") setCooldownIndex(0);
  }, [state?.phase]);

  // ================= WARMUP SEQUENCE =================
  useEffect(() => {
    if (state?.phase !== "warmup") return;
    if (state?.remaining_time !== 1) return;

    const max = state?.context?.warmups?.length || 0;

    setWarmupIndex((prev) => {
      if (prev + 1 >= max) return prev;
      return prev + 1;
    });
  }, [state?.remaining_time, state?.phase]);

  // ================= COOLDOWN SEQUENCE =================
  useEffect(() => {
    if (state?.phase !== "cooldown") return;
    if (state?.remaining_time !== 1) return;

    const max = state?.context?.cooldowns?.length || 0;

    setCooldownIndex((prev) => {
      if (prev + 1 >= max) return prev;
      return prev + 1;
    });
  }, [state?.remaining_time, state?.phase]);

  // ================= SMOOTH TIMER ENGINE =================
  useEffect(() => {
    if (!state) return;

    serverAnchor.current = Date.now();
    lastSyncTime.current = state.remaining_time;

    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - serverAnchor.current) / 1000);
      const base = lastSyncTime.current || state.remaining_time;

      const next = Math.max(base - elapsed, 0);
      setDisplayTime(next);
    }, 100);

    return () => clearInterval(interval);
  }, [state?.phase, state?.remaining_time]);


  // ================= AUDIO =================
  const play = (src) => {
  const audio = audioPool.current[src];
  if (!audio) return;

  audio.pause();
  audio.currentTime = 0;

  const playPromise = audio.play();

  if (playPromise !== undefined) {
    playPromise.catch(() => {
      console.log("audio blocked");
    });
  }
};

useEffect(() => {
  const sounds = [
    "/sounds/work.mp3",
    "/sounds/switch.mp3",
    "/sounds/cooldown.mp3",
  ];

  sounds.forEach((src) => {
    const audio = new Audio(src);
    audio.preload = "auto";
    audioPool.current[src] = audio;
  });
}, []);


  useEffect(() => {
  if (!state?.phase || !unlocked) return;

  // 🔥 jangan strict === 3
  if (displayTime > 3 || displayTime < 2) return;

  const prev = prevPhase.current;
  const current = state.phase;

  if (!prev) {
    prevPhase.current = current;
    return;
  }

  const key = `${prev}-${current}`;
  if (lastSoundKey.current === key) return;

  const audio = new Audio(
    prev === "warmup" && current === "work"
      ? "/sounds/work.mp3"
      : prev === "work" && current === "switch"
      ? "/sounds/switch.mp3"
      : prev === "rest" && current === "work"
      ? "/sounds/switch.mp3"
      : prev === "work" && current === "rest"
      ? "/sounds/work.mp3"
       : prev === "switch" && current === "work"
      ? "/sounds/work.mp3"
      : prev === "switch" && current === "cooldown"
      ? "/sounds/cooldown.mp3"
      : null
  );

  if (!audio.src) return;

  audio.volume = 0.8;

  audio.play().catch((e) => {
    console.log("AUDIO BLOCKED:", e);
  });

  lastSoundKey.current = key;
  prevPhase.current = current;

}, [state?.phase, displayTime, unlocked]);


  // ================= ITEMS =================
  const warmupItem =
    state?.context?.warmups?.[warmupIndex] || null;

  const cooldownItem =
    state?.context?.cooldowns?.[cooldownIndex] || null;

  const stations = state?.context?.stations || [];

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

  // ================= LOADING =================
  if (!state) {
    return (
      <div className="vh-100 d-flex justify-content-center align-items-center"
        style={{ background: "#0f172a", color: "white" }}>
        LOADING...
      </div>
    );
  }

  // ================= FINISHED =================
  if (phase === "finished") {
    return (
      <div className="vh-100 d-flex flex-column justify-content-center align-items-center"
        style={{ background: "#f5f7fb" }}>
        <img src={logo} width={160} style={{ marginBottom: 20 }} />
        <h1 style={{ color: "#123473", fontWeight: "bold" }}>
          WORKOUT COMPLETED
        </h1>
      </div>
    );
  }

  // ================= UI =================
  return (
    <div className="vh-100 d-flex flex-column" style={{ background: "#f5f7fb" }}>

      {/* HEADER */}
      <div style={{ height: "12%", background: "#123473", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 40px", position: "relative" }}>

        <div style={{ background: "white", padding: 10, borderRadius: 16 }}>
          <img src={logo} width={130} />
        </div>

        <div style={{
          position: "absolute",
          left: "50%",
          transform: "translateX(-50%)",
          background: "#0f2557",
          padding: "10px 60px",
          borderRadius: 18,
          fontSize: 110,
          fontWeight: "900",
          color: displayTime <= 10 ? "#ff4d4d" : "#2ecc71",
        }}>
          {displayTime}
        </div>

        <div
  style={{
    background: "#0f2557",
    padding: "20px 45px",
    borderRadius: 16,
    color: "white",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minWidth: 140,
    boxShadow: "0 8px 20px rgba(0,0,0,0.25)",
  }}
>
  {/* LABEL */}
  <div
    style={{
      fontSize: 16,
      letterSpacing: 3,
      opacity: 0.7,
      marginBottom: 6,
    }}
  >
    SETS
  </div>

  {/* VALUE */}
  <div
    style={{
      fontSize: 55,
      fontWeight: 900,
      lineHeight: 1,
      textShadow: "0 2px 10px rgba(0,0,0,0.4)",
    }}
  >
    {set || "-"}
  </div>
</div>

      </div>

      {/* BODY */}
     <div style={{ flex: 1, padding: 20 }}>

  {phase === "work" && (
    <div
      style={{
        height: "80vh",
        maxHeight: "80vh",
        display: "grid",
        gridTemplateColumns: "repeat(2, 1fr)",
        gridTemplateRows: "repeat(3, 1fr)",
        gap: 40,
        overflow: "hidden",
      }}
    >
      {stations.slice(0, 6).map((st) => {
        const media = st.exercise?.video_url;

        return (
          <div
            key={st.id}
            style={{
              position: "relative",
              background: "#000",
              borderRadius: 12,
              overflow: "hidden",
            }}
          >
            <video
              src={media}
              autoPlay
              muted
              loop
              playsInline
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />

            <div
              style={{
                position: "absolute",
                bottom: 10,
                left: 10,
                background: "rgba(0,0,0,0.75)",
                padding: "6px 14px",
                borderRadius: 10,
                color: "#fff",
                fontSize: 54,
                fontWeight: 900,
              }}
            >
              {st.station_number}
            </div>
          </div>
        );
      })}
    </div>
  )}

  {phase === "warmup" && warmupItem && (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
      <video
        src={warmupItem.exercise?.video_url}
        autoPlay
        muted
        playsInline
        style={{ width: "80%" }}
      />
    </div>
  )}

  {phase === "cooldown" && cooldownItem && (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
      <video
        src={cooldownItem.exercise?.video_url}
        autoPlay
        muted
        playsInline
        style={{ width: "80%" }}
      />
    </div>
  )}

</div>

      {/* OVERLAY */}
     
    {(phase === "rest" || phase === "switch") && (
  <div
    style={{
      position: "absolute",
      inset: 0,
      background: phase === "rest" ? "#e74c3c" : "#f1c40f",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      flexDirection: "column",
      zIndex: 999,
      color: "white",
    }}
  >
    {/* ICON */}
    <div style={{ marginBottom: 20 }}>
      {phase === "rest" ? (
        <MdTimer size={110} />
      ) : (
        <FaExchangeAlt size={110} />
      )}
    </div>

    {/* TEXT */}
    <div
      style={{
        fontSize: 120,
        fontWeight: 900,
        letterSpacing: 4,
        textTransform: "uppercase",
        textShadow: "0 5px 20px rgba(0,0,0,0.4)",
      }}
    >
      {phase}
    </div>

    {/* TIMER */}
    <div
      style={{
        fontSize: 160,
        fontWeight: 900,
        marginTop: 10,
        textShadow: "0 5px 20px rgba(0,0,0,0.4)",
      }}
    >
      {displayTime}
    </div>

  
  </div>
)}

  
  {state?.status === "paused" && (
  <div style={{
    position: "absolute",
    inset: 0,
    background: "#3b82f6",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    zIndex: 9999,
    color: "white",
    fontWeight: "900"
  }}>
    <div style={{ fontSize: 120 }}>
      PAUSED
    </div>

    <div style={{ fontSize: 24, opacity: 0.6 }}>
      Press resume to continue
    </div>
  </div>
)}

    </div>
  );
}