import React, { useContext, useState } from "react";
import { FaRegUser } from "react-icons/fa";
import { MdOutlineMailOutline } from "react-icons/md";
import { RiLock2Fill } from "react-icons/ri";
import { FaPencilAlt } from "react-icons/fa";
import { FaPhoneFlip } from "react-icons/fa6";
import { Link, Navigate } from "react-router-dom";
import api from "../../utils/api";
import toast from "react-hot-toast";
import { Context } from "../../main";
import GoogleButton from "./GoogleButton";
import ThemeToggle from "../Layout/ThemeToggle";
import "./Auth.css";

const Register = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [skills, setSkills] = useState("");

  const { isAuthorized, setIsAuthorized, setUser } = useContext(Context);

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post("/user/register", {
        name,
        phone,
        email,
        role,
        password,
        skills,
      });
      toast.success(data.message);
      setUser(data.user);
      setName("");
      setEmail("");
      setPassword("");
      setPhone("");
      setRole("");
      setSkills("");
      setIsAuthorized(true);
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed.");
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
          <h1 className="auth-title anim-fade-up">Create your account</h1>
          <p className="auth-subtitle anim-fade-up anim-fade-up-delay-1">
            Join JobZee to find jobs or hire talent.
          </p>

          <form className="auth-form anim-fade-up anim-fade-up-delay-2" onSubmit={handleRegister}>
            <div className="auth-field">
              <label>Register As</label>
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
              <label>Name</label>
              <div className="auth-input-wrap">
                <FaPencilAlt />
                <input
                  type="text"
                  placeholder="Your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
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
              <label>Phone Number</label>
              <div className="auth-input-wrap">
                <FaPhoneFlip />
                <input
                  type="number"
                  placeholder="9876543210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
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
                  placeholder="At least 8 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            {role === "Job Seeker" && (
              <div className="auth-field">
                <label>Your Skills (for AI Job Matching)</label>
                <div className="auth-input-wrap">
                  <textarea
                    rows="3"
                    placeholder="e.g. React, Node.js, MongoDB, Python, Machine Learning"
                    value={skills}
                    onChange={(e) => setSkills(e.target.value)}
                  />
                </div>
              </div>
            )}

            <button type="submit" className="auth-submit-btn">
              Register
            </button>
          </form>

          <div className="auth-divider">or</div>

          <GoogleButton
            role={role}
            disabled={!role}
            onAuthSuccess={handleGoogleSuccess}
          />

          <p className="auth-switch-line">
            Already have an account? <Link to={"/login"}>Login</Link>
          </p>
        </div>
        <div className="auth-banner-side">
          <img src="/register.png" alt="Register illustration" />
        </div>
      </div>
    </section>
  );
};

export default Register;
