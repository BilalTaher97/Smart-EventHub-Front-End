import React, { useState, useEffect } from "react";
import "../styles/signup-login.css";
import { useNavigate } from "react-router-dom";

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

  const handleLogin = (e) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) {
      alert("Enter email and password");
      return;
    }
    navigate("/home");
  };

  const handleSignup = (e) => {
    e.preventDefault();

    if (
      !signupName ||
      !signupEmail ||
      !signupPassword ||
      !signupConfirm ||
      !signupGender ||
      !signupPhone
    ) {
      alert("Fill all fields");
      return;
    }

    if (!/^07[0-9]{8}$/.test(signupPhone)) {
      alert("Enter a valid phone number (starts with 07 and has 10 digits)");
    return;
    }

    if (signupPassword !== signupConfirm) {
      alert("Passwords do not match");
      return;
    }

    if (signupPasskey === "admin101") {
      setSignupRole("admin");
    } else if (signupPasskey === "") {
      setSignupRole("user");
    } else {
      alert("Invalid passkey. Leave it empty for user registration");
      return;
    }

    console.log("Role:", signupRole);
    navigate("/home");
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
              <input className="checkbox" type="checkbox" id="reg-log" name="reg-log" />
              <label htmlFor="reg-log">
                <i className="uil uil-arrow-up"></i>
              </label>

              <div className="card-3d-wrap mx-auto">
                <div className="card-3d-wrapper">

                  {/* Login */}
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

                  {/* Signup */}
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
          <div style={{ position: "relative" }}>
            <input
              type="password"
              className="form-style"
              placeholder="Password"
              value={signupPassword}
              onChange={(e) => setSignupPassword(e.target.value)}
            />
            <i className="input-icon uil uil-lock-alt"></i>
          </div>
          <div style={{ position: "relative" }}>
            <input
              type="password"
              className="form-style"
              placeholder="Confirm"
              value={signupConfirm}
              onChange={(e) => setSignupConfirm(e.target.value)}
            />
            <i className="input-icon uil uil-lock-alt"></i>
          </div>
        </div>

        <div className="form-group two-cols">
          <div style={{ position: "relative" }}>
            <select
              className="form-style"
              value={signupGender}
              onChange={(e) => setSignupGender(e.target.value)}
            >
              <option value="">Gender</option>
              <option value="female">F</option>
              <option value="male">M</option>
            </select>
          </div>
          <div style={{ position: "relative" }}>
           <input
            type="text"
            className="form-style"
            placeholder="Phone (07XXXXXXXX)"
            value={signupPhone}
            onChange={(e) => setSignupPhone(e.target.value)}
            pattern="^07[0-9]{8}$"
            />
            <i className="input-icon uil uil-phone"></i>
          </div>
        </div>

        <div className="form-group">
          <input
            type="text"
            className="form-style"
            placeholder="Passkey (optional)"
            value={signupPasskey}
            onChange={(e) => setSignupPasskey(e.target.value)}
          />
          <i className="input-icon uil uil-key-skeleton"></i>
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
