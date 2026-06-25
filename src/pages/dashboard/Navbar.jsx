import Logo from "../../assets/call_fit.png";
import { FaBars } from "react-icons/fa";

export default function Navbar({ setSidebarOpen }) {
  return (
    <nav
      className="navbar shadow-sm sticky-top px-3"
      style={{
        height: "70px",
        zIndex: 1100,
        backgroundColor: "#123473",
      }}
    >
      <div className="container-fluid justify-content-center position-relative">
        <button
          className="btn btn-light d-lg-none position-absolute start-0 ms-2"
          onClick={() => setSidebarOpen(true)}
          style={{
            width: "42px",
            height: "42px",
            borderRadius: "10px",
          }}
        >
          <FaBars />
        </button>

        <div className="d-flex align-items-center">
          <div
            className="bg-white d-flex justify-content-center align-items-center shadow-sm"
            style={{
              width: "50px",
              height: "50px",
              borderRadius: "12px",
            }}
          >
            <img
              src={Logo}
              alt="Call Fit"
              style={{
                width: "34px",
                height: "34px",
                objectFit: "contain",
              }}
            />
          </div>

          <div className="ms-3">
            <h4
              className="fw-bold text-white m-0 d-none d-sm-block"
              style={{ fontSize: "1.35rem" }}
            >
              Call Fit Gym
            </h4>

            <h5 className="fw-bold text-white m-0 d-block d-sm-none">
              Call Fit
            </h5>
          </div>
        </div>
      </div>
    </nav>
  );
}