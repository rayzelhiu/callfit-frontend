import { FaDumbbell, FaFileAlt } from "react-icons/fa";

export default function Sidebar({
  tab,
  setTab,
  handleLogout,
}) {
  return (
    <aside
      className="d-none d-lg-flex flex-column bg-white shadow-sm"
      style={{
        width: "250px",
        minHeight: "calc(100vh - 70px)",
        position: "sticky",
        top: "70px",
        flexShrink: 0,
      }}
    >
      <div className="p-4">
        <button
          onClick={() => setTab("exercise")}
          className={`btn w-100 mb-2 ${
            tab === "exercise"
              ? "btn-primary"
              : "btn-light"
          }`}
        >
          <FaDumbbell className="me-2" />
          Exercise
        </button>

        <button
          onClick={() => setTab("template")}
          className={`btn w-100 ${
            tab === "template"
              ? "btn-primary"
              : "btn-light"
          }`}
        >
          <FaFileAlt className="me-2" />
          Template
        </button>
      </div>

      <div className="mt-auto p-4">
        <hr />
        <button
          className="btn btn-outline-danger w-100"
          style={{
            borderRadius: "10px",
            height: "45px",
          }}
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </aside>
  );
}