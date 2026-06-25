import {
  FaDumbbell,
  FaFileAlt,
  FaTimes,
} from "react-icons/fa";

export default function MobileSidebar({
  sidebarOpen,
  setSidebarOpen,
  tab,
  setTab,
  handleLogout,
}) {
  if (!sidebarOpen) return null;

  return (
    <>
      <div
        className="position-fixed top-0 start-0 w-100 h-100"
        style={{
          background: "rgba(0,0,0,.4)",
          zIndex: 1200,
        }}
        onClick={() => setSidebarOpen(false)}
      />

      <aside
        className="position-fixed bg-white shadow d-flex flex-column"
        style={{
          width: "260px",
          height: "100vh",
          top: 0,
          left: 0,
          zIndex: 1300,
        }}
      >
        <div className="p-4">

          <div className="d-flex justify-content-between align-items-center mb-4">
            <button
              className="btn btn-light"
              onClick={() => setSidebarOpen(false)}
            >
              <FaTimes />
            </button>
          </div>

          <button
            className={`btn w-100 mb-2 ${
              tab === "exercise"
                ? "btn-primary"
                : "btn-light"
            }`}
            onClick={() => {
              setTab("exercise");
              setSidebarOpen(false);
            }}
          >
            <FaDumbbell className="me-2" />
            Exercise
          </button>

          <button
            className={`btn w-100 ${
              tab === "template"
                ? "btn-primary"
                : "btn-light"
            }`}
            onClick={() => {
              setTab("template");
              setSidebarOpen(false);
            }}
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
    </>
  );
}