import { useEffect, useRef, useState } from "react";
import api from "../../api/axios";
import logo from "../../assets/call_fit.png";
import { MdTimer } from "react-icons/md";
import { FiRefreshCw } from "react-icons/fi";

export default function TvScreen() {

  const [state, setState] = useState(null);
  const [unlocked, setUnlocked] = useState(false);
  const [localRemaining, setLocalRemaining] = useState(0);

  const intervalRef = useRef(null);
  const prevPhase = useRef(null);
  const lastSoundKey = useRef(null);

  // ================= AUDIO UNLOCK =================
  useEffect(() => {
    const unlock = () => {
      const audio = new Audio("/sounds/switch.mp3");

      audio.play().catch(() => {});
      setUnlocked(true);
    };

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
          console.log("STATE FROM API:", res.data.data); // DEBUG
          setState((prev) => {
          const next = res.data.data;

          // freeze kalau paused
          if (prev?.status === "paused" && next?.status === "running") {
            return prev;
          }

          return next;
        });
        }
      } catch (err) {
        console.log("FETCH ERROR:", err);
      }
    };

    intervalRef.current = setInterval(fetchState, 1000);

    return () => clearInterval(intervalRef.current);
  }, [unlocked]);

  // ================= AUDIO CONTROL =================
  const play = (src) => {
    const audio = new Audio(src);
    audio.volume = 0.8;
    audio.play().catch(() => {});
  };

  useEffect(() => {
    if (!state?.phase || !unlocked) return;

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
    if (prev === "work" && current === "rest") play("/sounds/work.mp3");
    if (prev === "switch" && current === "cooldown") play("/sounds/cooldown.mp3");

    lastSoundKey.current = key;
    prevPhase.current = current;

  }, [state?.phase]);

  // ================= SNAPSHOT TIMER (NO REALTIME MATH) =================
useEffect(() => {
  if (!state) return;
  setLocalRemaining(state.remaining_time || 0);
}, [state?.remaining_time, state?.status]);


const lastStatus = useRef(null);

useEffect(() => {
  if (!state) return;

  if (state.status !== lastStatus.current) {
    lastStatus.current = state.status;
  }

  setState((prev) => {
    if (prev?.status === "paused" && state.status === "running") {
      return prev; // BLOCK overwrite pause
    }
    return state;
  });
}, [state]);


  const timer = state?.status === "paused"
  ? state.remaining_time
  : localRemaining;

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
          color: timer <= 10 ? "#ff4d4d" : "#2ecc71",
        }}>
          {timer}
        </div>

        <div style={{ background: "#0f2557", padding: "20px 50px", borderRadius: 16, color: "white" }}>
          SETS {set || "-"}
        </div>

      </div>

      {/* BODY */}
      <div style={{ flex: 1, padding: 20 }}>

        {phase === "work" ? (
          <div style={{
            height: "80vh",
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gridTemplateRows: "repeat(3, 1fr)",
            gap: 45,
            paddingTop: 50
          }}>
            {stations.slice(0, 6).map((st) => {

              const isActive =
                state?.active_station_number === st.station_number &&
                state?.phase === "work";

              const media = isActive
                ? st.exercise?.video_url
                : st.exercise?.thumbnail_url;

              return (
                <div key={st.id} style={{ position: "relative", background: "#000" }}>

                  {isActive ? (
                    <video src={media} autoPlay muted playsInline style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : (
                    <img src={media} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  )}

                  <div style={{
                    position: "absolute",
                    bottom: 10,
                    left: 12,
                    color: "white",
                    fontSize: 48,
                    fontWeight: 900
                  }}>
                    {st.station_number}
                  </div>

                </div>
              );
            })}
          </div>
        ) : (
          item && (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
              <video src={item.exercise?.video_url} autoPlay muted playsInline style={{ width: "80%" }} />
            </div>
          )
        )}

      </div>

      {/* OVERLAY */}
      {(phase === "rest" || phase === "switch") && (
        <div style={{
          position: "absolute",
          inset: 0,
          background: phase === "rest" ? "#e74c3c" : "#f1c40f",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column"
        }}>
          <div style={{ fontSize: 100, color: "white" }}>
            {phase.toUpperCase()}
          </div>

          <div style={{ fontSize: 150, color: "white" }}>
            {timer}
          </div>
        </div>
      )}
  
  {state?.status === "paused" && (
  <div style={{
    position: "absolute",
    inset: 0,
    background: "rgba(0,0,0,0.85)",
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