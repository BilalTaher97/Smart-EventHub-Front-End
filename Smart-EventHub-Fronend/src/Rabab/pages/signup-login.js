import React, { useState, useEffect } from "react";
import "../styles/signup-login.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function AuthForm() {
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupConfirm, setSignupConfirm] = useState("");
  const [signupGender, setSignupGender] = useState("");
  const [signupPhone, setSignupPhone] = useState("");
  const [signupPasskey, setSignupPasskey] = useState("");
  const [signupRole, setSignupRole] = useState("user");

  const navigate = useNavigate();

  useEffect(() => {
    document.body.classList.add("login-page");
    return () => document.body.classList.remove("login-page");
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) {
      alert("Enter email and password");
      return;
    }

    try {
      const response = await axios.post("http://localhost:3000/api/auth/login", {
        email: loginEmail,
        passwordHash: loginPassword,
      });

      const data = response.data;
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("userEmail", loginEmail);
      localStorage.setItem("userId", data.userId);
      localStorage.setItem("role", data.role);
      localStorage.setItem("justLoggedIn", "true");
      navigate(data.redirectUrl || "/home");
      // if statement for the admin (role)

    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Login failed");
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!signupName || !signupEmail || !signupPassword || !signupConfirm || !signupGender || !signupPhone) {
      alert("Fill all fields");
      return;
    }

    if (!/^07[0-9]{8}$/.test(signupPhone)) {
      alert("Enter a valid phone number (starts with 07 and has 10 digits)");
      return;
    }

    // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(signupEmail)) {
    alert("Enter a valid email address");
    return;
  }

  // Password length validation
  if (signupPassword.length < 6 || signupPassword.length > 25) {
    alert("Password must be between 6 and 25 characters");
    return;
  }

    if (signupPassword !== signupConfirm) {
      alert("Passwords do not match");
      return;
    }

    let role = "user";
    if (signupPasskey === "admin101") role = "admin";
    else if (signupPasskey !== "") {
      alert("Invalid passkey. Leave empty for user registration");
      return;
    }

    const userData = {
      fullName: signupName,
      email: signupEmail,
      passwordHash: signupPassword,
      phone: signupPhone,
      gender: signupGender,
      role: role,
    };

    try {
      const response = await axios.post("http://localhost:3000/api/auth/register", userData);
      const data = response.data;
      console.log(data);
      alert(data.message || "Registered successfully. You can login now.");

      // Clear signup form
  setSignupName("");
  setSignupEmail("");
  setSignupPassword("");
  setSignupConfirm("");
  setSignupGender("");
  setSignupPhone("");
  setSignupPasskey("");

    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="section">
      <div className="container">
        <div className="row full-height justify-content-center">
          <div className="col-12 text-center align-self-center py-5">
            <div className="section pb-5 pt-5 pt-sm-2 text-center">
              <h6 className="mb-0 pb-3">
                <span>Log In </span>
                <span>Sign Up</span>
              </h6>
              <input className="checkbox" type="checkbox" id="reg-log" />
              <label htmlFor="reg-log">
                <i className="uil uil-arrow-up"></i>
              </label>

              <div className="card-3d-wrap mx-auto">
                <div className="card-3d-wrapper">

                  <div className="card-front">
                    <div className="center-wrap">
                      <div className="section text-center">
                        <h4 className="mb-4 pb-3">Log In</h4>
                        <div className="form-group">
                          <input
                            type="email"
                            className="form-style"
                            placeholder="Your Email"
                            value={loginEmail}
                            onChange={(e) => setLoginEmail(e.target.value)}
                          />
                          <i className="input-icon uil uil-at"></i>
                        </div>
                        <div className="form-group mt-2">
                          <input
                            type="password"
                            className="form-style"
                            placeholder="Your Password"
                            value={loginPassword}
                            onChange={(e) => setLoginPassword(e.target.value)}
                          />
                          <i className="input-icon uil uil-lock-alt"></i>
                        </div>
                        <button className="btn mt-4" onClick={handleLogin}>
                          Submit
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="card-back">
                    <div className="center-wrap">
                      <div className="section text-center">
                        <h4 className="mb-4 pb-3">Sign Up</h4>

                        <div className="signup-grid">
                          <div className="form-group">
                            <input
                              type="text"
                              className="form-style"
                              placeholder="Full Name"
                              value={signupName}
                              onChange={(e) => setSignupName(e.target.value)}
                            />
                            <i className="input-icon uil uil-user"></i>
                          </div>

                          <div className="form-group">
                            <input
                              type="email"
                              className="form-style"
                              placeholder="Email"
                              value={signupEmail}
                              onChange={(e) => setSignupEmail(e.target.value)}
                            />
                            <i className="input-icon uil uil-at"></i>
                          </div>

                          <div className="form-group two-cols">
                            <i className="input-icon uil uil-lock-alt"></i>
                            <input
                              type="password"
                              className="form-style"
                              placeholder="Password"
                              value={signupPassword}
                              onChange={(e) => setSignupPassword(e.target.value)}
                            />
                            <input
                              type="password"
                              className="form-style"
                              placeholder="Confirm"
                              value={signupConfirm}
                              onChange={(e) => setSignupConfirm(e.target.value)}
                            />
                          </div>

                          <div className="form-group two-cols">
                            <select
                              className="form-style"
                              value={signupGender}
                              onChange={(e) => setSignupGender(e.target.value)}
                            >
                              <option value="">Gender</option>
                              <option value="female">F</option>
                              <option value="male">M</option>
                            </select>
                            <i className="uil uil-phone" style={{position:'absolute',left:"54%",fontSize:"24px",color:"white"}}></i>
                            <input
                              type="text"
                              className="form-style"
                              placeholder="Phone (07XXXXXXXX)"
                              value={signupPhone}
                              onChange={(e) => setSignupPhone(e.target.value)}
                            />
                          </div>

                          <div className="form-group">
                            <input
                              type="text"
                              className="form-style"
                              placeholder="Passkey (optional)"
                              value={signupPasskey}
                              onChange={(e) => setSignupPasskey(e.target.value)}
                            />
                          </div>
                        </div>

                        <button className="btn mt-4" onClick={handleSignup}>
                          Submit
                        </button>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
