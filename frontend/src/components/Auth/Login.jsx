import React, { useContext, useState } from "react";
import { MdOutlineMailOutline } from "react-icons/md";
import { RiLock2Fill } from "react-icons/ri";
import { Link, Navigate } from "react-router-dom";
import { FaRegUser } from "react-icons/fa";
import api from "../../utils/api";
import toast from "react-hot-toast";
import { Context } from "../../main";
import GoogleButton from "./GoogleButton";
import ThemeToggle from "../Layout/ThemeToggle";
import "./Auth.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");

  const { isAuthorized, setIsAuthorized, setUser } = useContext(Context);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post("/user/login", { email, password, role });
      toast.success(data.message);
      setUser(data.user);
      setEmail("");
      setPassword("");
      setRole("");
      setIsAuthorized(true);
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed.");
    }
  };

  const handleGoogleSuccess = (data) => {
    setUser(data.user);
    setIsAuthorized(true);
  };

  if (isAuthorized) {
    return <Navigate to={"/"} />;
  }

  return (
    <section className="auth-page">
      <div className="auth-page-theme-toggle">
        <ThemeToggle />
      </div>
      <div className="auth-card">
        <div className="auth-form-side">
          <div className="auth-logo-row">
            <img src="/JobZeelogo.png" alt="JobZee logo" />
          </div>
          <h1 className="auth-title anim-fade-up">Welcome back</h1>
          <p className="auth-subtitle anim-fade-up anim-fade-up-delay-1">
            Login to your account to continue.
          </p>

          <form className="auth-form anim-fade-up anim-fade-up-delay-2" onSubmit={handleLogin}>
            <div className="auth-field">
              <label>Login As</label>
              <div className="auth-input-wrap">
                <FaRegUser />
                <select value={role} onChange={(e) => setRole(e.target.value)} required>
                  <option value="">Select Role</option>
                  <option value="Employer">Employer</option>
                  <option value="Job Seeker">Job Seeker</option>
                </select>
              </div>
            </div>

            <div className="auth-field">
              <label>Email Address</label>
              <div className="auth-input-wrap">
                <MdOutlineMailOutline />
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="auth-field">
              <label>Password</label>
              <div className="auth-input-wrap">
                <RiLock2Fill />
                <input
                  type="password"
                  placeholder="Your Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button type="submit" className="auth-submit-btn">
              Login
            </button>
          </form>

          <div className="auth-divider">or</div>

          <GoogleButton role={role} onAuthSuccess={handleGoogleSuccess} />

          <p className="auth-switch-line">
            New here? <Link to={"/register"}>Create an account</Link>
          </p>

          <p className="auth-credit">
            Made with <span>♥</span> by <span>Ashutosh Mohanty</span>
          </p>
        </div>
        <div className="auth-banner-side">
          <img src="/login.png" alt="Login illustration" />
        </div>
      </div>
    </section>
  );
};

export default Login;
