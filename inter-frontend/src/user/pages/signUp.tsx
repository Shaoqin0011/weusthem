import React, { useState, ChangeEvent } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.css";
import "./signUp.css";
import { Navigate, useNavigate } from "react-router-dom";

function SignUp() {
  const navigate = useNavigate();

  const [userName, setUserName] = useState("");
  const [userNameExists, setUserNameExists] = useState(true);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMatch, setPasswordMatch] = useState(true);

  const handleUserNameChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const newUserName = e.target.value;
    setUserName(newUserName);

    const response = await axios.get("http://localhost:3000/Sign_up", {
      params: {
        userName: newUserName,
      },
    });

    setUserNameExists(response.data);
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    setPassword(newPassword);
    setPasswordMatch(newPassword === confirmPassword);
  };

  const handleConfirmPasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newConfirmPassword = e.target.value;
    setConfirmPassword(e.target.value);
    setPasswordMatch(e.target.value === password);
  };

  const handleSignUpClick = async () => {
    if (!passwordMatch || userNameExists) return;
    try {
      const response = await axios.post("http://localhost:3000/Sign_up", {
        userName,
        password,
      });
      console.log(response.data);
      navigate("/Sign_in");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="sign_up_container">
      <h1>Sign Up</h1>

      <div className="mb-3 sign_up_input">
        <label htmlFor="inputUserName" className="form-label">
          User Name
        </label>
        <input
          type="text"
          className="form-control"
          id="inputUserName"
          name="userName"
          value={userName}
          onChange={handleUserNameChange}
        />
      </div>
      {userName != "" &&
        (!userNameExists ? (
          <p className="text-success sign_up_message">Nice Name!</p>
        ) : (
          <p className="text-danger sign_up_message">Username already exists</p>
        ))}

      <div className="mb-3 sign_up_input">
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

      <div className="mb-3 sign_up_input">
        <label htmlFor="inputConfirmPassword" className="form-label">
          Confirm Password
        </label>
        <input
          type="password"
          className="form-control"
          id="inputConfirmPassword"
          name="confirmPassword"
          value={confirmPassword}
          onChange={handleConfirmPasswordChange}
        />
      </div>
      {confirmPassword != "" &&
        (passwordMatch ? (
          <p className="text-success sign_up_message">Good To Go</p>
        ) : (
          <p className="text-danger sign_up_message">Passwords do not Match</p>
        ))}

      <div className="sign_up_button_container">
        <button
          className="btn btn-primary sign_up_button"
          value="log"
          onClick={handleSignUpClick}
        >
          Sign Up
        </button>
      </div>
    </div>
  );
}

export default SignUp;
