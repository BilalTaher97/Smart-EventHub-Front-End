import React, { useState,useEffect } from "react";
import "../styles/signup-login.css";
import { useNavigate } from "react-router-dom";

export default function AuthForm() {
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupConfirm, setSignupConfirm] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) {
      alert("Please fill in both email and password");
      return;
    }
    navigate("./home");
  };

  useEffect(() => {
  document.body.classList.add('login-page');
  return () => document.body.classList.remove('login-page');
}, []);

  const handleSignup = (e) => {
    e.preventDefault();
    if (!signupName || !signupEmail || !signupPassword || !signupConfirm) {
      alert("Please fill in all fields");
      return;
    }
    if (signupPassword !== signupConfirm) {
      alert("Passwords do not match");
      return;
    }
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
              <label htmlFor="reg-log"><i className="uil uil-arrow-up"></i></label>

              <div className="card-3d-wrap mx-auto">
                <div className="card-3d-wrapper">

                  {/* Login */}
                  <div className="card-front">
                    <div className="center-wrap">
                      <div className="section text-center">
                        <h4 className="mb-4 pb-3">Log In</h4>
                        <div className="form-group">
                          <input type="email" className="form-style" placeholder="Your Email"
                                 value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} />
                          <i className="input-icon uil uil-at"></i>
                        </div>
                        <div className="form-group mt-2">
                          <input type="password" className="form-style" placeholder="Your Password"
                                 value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} />
                          <i className="input-icon uil uil-lock-alt"></i>
                        </div>
                        <button className="btn mt-4" onClick={handleLogin}>Submit</button>
                      </div>
                    </div>
                  </div>

                  {/* Signup */}
                  <div className="card-back">
                    <div className="center-wrap">
                      <div className="section text-center">
                        <h4 className="mb-4 pb-3">Sign Up</h4>
                        <div className="form-group">
                          <input type="text" className="form-style" placeholder="Full Name"
                                 value={signupName} onChange={(e) => setSignupName(e.target.value)} />
                          <i className="input-icon uil uil-user"></i>
                        </div>
                        <div className="form-group mt-2">
                          <input type="email" className="form-style" placeholder="Email"
                                 value={signupEmail} onChange={(e) => setSignupEmail(e.target.value)} />
                          <i className="input-icon uil uil-at"></i>
                        </div>
                        <div className="form-group mt-2">
                          <input type="password" className="form-style" placeholder="Password"
                                 value={signupPassword} onChange={(e) => setSignupPassword(e.target.value)} />
                          <i className="input-icon uil uil-lock-alt"></i>
                        </div>
                        <div className="form-group mt-2">
                          <input type="password" className="form-style" placeholder="Confirm Password"
                                 value={signupConfirm} onChange={(e) => setSignupConfirm(e.target.value)} />
                          <i className="input-icon uil uil-lock-alt"></i>
                        </div>
                        <button className="btn mt-4" onClick={handleSignup}>Submit</button>
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
