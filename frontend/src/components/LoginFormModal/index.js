import React, { useState } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import "./LoginForm.css";
import { useHistory } from "react-router-dom";
import { Link } from "react-router-dom";

function LoginFormModal() {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();
  const history = useHistory();

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    return dispatch(sessionActions.login({ credential, password }))
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) {
          setErrors(data.errors);
        }
      });
  };

  const handleDemoUser = (e) => {
    e.preventDefault();
    setErrors({});
    return dispatch(
      sessionActions.login({
        credential: "demo@user.io",
        password: "password",
      })
    )
      .then(() => {
        closeModal();
        history.push("/");
      })
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) {
          setErrors(data.errors);
        }
      });
  };
  const handleLoginDisable = credential.length < 4 || password.length < 6;

  return (
    // <div className="'login-container">
    <div className="login-form">
      <h1>Log In</h1>
      <form onSubmit={handleSubmit}>
        <label id="errors">
          {errors.credential && <p>{errors.credential}</p>}
        </label>
        <label>
          <label id='errors'>
            {credential.length < 4 && (
              <p>Username must be longer that 4 characters</p>
            )}
          </label>
          <input
            type="text"
            value={credential}
            onChange={(e) => setCredential(e.target.value)}
            placeholder="Username or Email"
            required
          />
        </label>
        <label id='errors'>
            {password.length < 6 && (
              <p>Password must be longer that 6 characters</p>
            )}
          </label>
        <label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
          />
        </label>
        <button type="submit" disabled={handleLoginDisable}>
          Log In
        </button>
      </form>
      <Link onClick={handleDemoUser}>Log in as Demo User</Link>
    </div>
    // </div>
  );
}

export default LoginFormModal;
