import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
//import "../index.css";

const Login = () => {
  const [inputValue, setInputValue] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { email, password } = inputValue;

  const handleOnChange = (e) => {
    const { name, value } = e.target;

    setInputValue((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await axios.post(
        `${process.env.REACT_APP_API_URL}/login`,
        {
          email: email.trim(),
          password,
        },
        { withCredentials: true }
      );

      if (data.success) {
        toast.success("Login successful!");

        window.location.assign(
          process.env.REACT_APP_DASHBOARD_URL
        );
      } else {
        toast.error(data.message || "Login failed");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
        "Unable to login. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="kite-auth-page">
      <div className="kite-auth-card">
        <div className="kite-auth-logo">
          <div
            className="kite-auth-logo-mark"
            aria-hidden="true"
          />
        </div>

        <h2 className="kite-auth-title">
          Login to Trading Demo
        </h2>

        <form
          className="kite-auth-form"
          onSubmit={handleSubmit}
        >
          <div>
            <label
              htmlFor="login-email"
              className="visually-hidden"
            >
              Email address
            </label>

            <input
              id="login-email"
              type="email"
              name="email"
              className="kite-auth-input"
              placeholder="Email address"
              value={email}
              onChange={handleOnChange}
              autoComplete="email"
              required
            />
          </div>

          <div className="kite-password-wrapper">
            <label
              htmlFor="login-password"
              className="visually-hidden"
            >
              Password
            </label>

            <input
              id="login-password"
              type={showPassword ? "text" : "password"}
              name="password"
              className="kite-auth-input"
              placeholder="Password"
              value={password}
              onChange={handleOnChange}
              autoComplete="current-password"
              required
            />

            <button
              type="button"
              className="kite-password-toggle"
              onClick={() =>
                setShowPassword((prev) => !prev)
              }
              aria-label={
                showPassword
                  ? "Hide password"
                  : "Show password"
              }
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          <button
            type="submit"
            className="kite-auth-button"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="kite-auth-help">
          Use your registered email and password
        </div>
      </div>

      <div className="kite-auth-footer">
        <p>
          Don't have an account?{" "}
          <Link to="/signup">Sign up for free!</Link>
        </p>

        <p className="kite-auth-disclaimer">
          Zerodha Clone Project · Educational Demo
          <br />
          Not affiliated with Zerodha
        </p>
      </div>

      <ToastContainer position="bottom-right" />
    </div>
  );
};

export default Login;