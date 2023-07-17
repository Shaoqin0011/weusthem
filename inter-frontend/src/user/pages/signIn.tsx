import React, { useState, ChangeEvent, useEffect } from "react";
import "./signIn.css";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.css";
import { Navigate, useNavigate } from "react-router-dom";

function SignIn() {
  const navigate = useNavigate();

  useEffect(() => {
    const userName = localStorage.getItem('userName');
    if (userName) {
      navigate('/Main', { replace: true });
    }
  }, []);


  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [match, setMatch] = useState(true);

  const handleSignUpClick = () => {
    navigate("/Sign_up");
  };

  const handleSignInClick = async () => {
    try {
      const response = await axios.get("http://localhost:3000/Sign_up", {
        params: {
          userName: userName,
          password: password,
        },
      });

      if (response.data) {
        setMatch(true);
        localStorage.setItem('userName', userName);
        navigate("/Main");
      } else {
        setMatch(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleUserNameChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const newUserName = e.target.value;
    setUserName(newUserName);
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
  };

  return (
    <div className="sign_in_container">
      <div className="sign_in_input">
        <h1>Sign in</h1>
        <div className="mb-3 sign_in_input">
          <label htmlFor="inputUsername" className="form-label">
            User Name
          </label>
          <input
            type="text"
            className="form-control"
            id="inputUsername"
            name="username"
            value={userName}
            onChange={handleUserNameChange}
          />
        </div>
        <div className="mb-3 sign_in_input">
          <label htmlFor="inputPassword" className="form-label">
            Password
          </label>
          <input
            type="password"
            className="form-control"
            id="inputPassword"
            name="password"
            value={password}
            onChange={handlePasswordChange}
          />
        </div>
      </div>
      {!match && (
        <p className="text-danger sign_in_message">
          User name and password do not match.
        </p>
      )}
      <div className="sign_in_button_container">
        <button
          className="btn btn-primary sign_in_button"
          value="log"
          onClick={handleSignInClick}
        >
          Log In
        </button>
        <button
          className="btn btn-primary sign_in_button"
          value="register"
          onClick={handleSignUpClick}
        >
          Sign Up
        </button>
      </div>
    </div>
  );
}

export default SignIn;
