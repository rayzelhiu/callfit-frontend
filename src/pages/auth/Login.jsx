import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../../services/authService";
import toast from "react-hot-toast";

import logo from "../../assets/call_fit.png";
import gym from "../../assets/callfit.jpg";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const data = await login(email, password);

      const token = data?.token || data?.access_token;

      if (!token) {
        toast.error("Login gagal!");
        return;
      }

      localStorage.setItem("token", token);

      toast.success("Login Success!");

      navigate("/dashboard");
    } catch (error) {
      console.log(error?.response?.data);
      toast.error("Email atau password salah");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid vh-100">
      <div className="row h-100">

        {/* LEFT SIDE - FORM */}
        <div className="col-12 col-md-6 d-flex align-items-center justify-content-center bg-white">

          <div style={{ width: "100%", maxWidth: "380px" }}>

            {/* LOGO */}
            <div className="text-center mb-4">
              <img src={logo} alt="logo" style={{ width: "90px" }} />
            </div>

            {/* TITLE */}
            <h2 className="text-center fw-bold mb-4">
              Login
            </h2>

            {/* FORM */}
            <form onSubmit={handleLogin}>

              {/* EMAIL */}
              <div className="mb-3">
                <label className="form-label fw-semibold">Email</label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              {/* PASSWORD */}
              <div className="mb-3">
                <label className="form-label fw-semibold">Password</label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              {/* BUTTON */}
              <button
                type="submit"
                disabled={loading || !email || !password}
                className="btn-primary w-100 text-white fw-semibold py-2 rounded"
              
              >
                {loading ? "Loading..." : "Login"}
              </button>

            </form>

          </div>
        </div>

        {/* RIGHT SIDE - IMAGE */}
        <div className="col-md-6 d-none d-md-block p-0 position-relative">

          <img
            src={gym}
            alt="gym"
            className="w-100 h-100"
            style={{ objectFit: "cover" }}
          />

          <div
            className="position-absolute top-0 start-0 w-100 h-100"
            style={{
              background:
                "linear-gradient(to right, white, rgba(255,255,255,0.4), transparent)",
            }}
          />
        </div>

      </div>
    </div>
  );
};

export default Login;