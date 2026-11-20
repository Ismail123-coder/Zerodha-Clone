import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
//import "../index.css";

const Signup = () => {
  const navigate = useNavigate();

  const [inputValue, setInputValue] = useState({
    email: "",
    username: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { email, username, password } = inputValue;

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
        `${process.env.REACT_APP_API_URL}/signup`,
        {
          email: email.trim(),
          username: username.trim(),
          password,
        },
        { withCredentials: true }
      );

      if (data.success) {
        toast.success("Account created successfully!");

        setInputValue({
          email: "",
          username: "",
          password: "",
        });

        setTimeout(() => {
          navigate("/login");
        }, 1000);
      } else {
        toast.error(data.message || "Signup failed");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Unable to create account."
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
          Create your account
        </h2>

        <form
          className="kite-auth-form"
          onSubmit={handleSubmit}
        >
          <div>
            <label
              htmlFor="signup-email"
              className="visually-hidden"
            >
              Email address
            </label>

            <input
              id="signup-email"
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

          <div>
            <label
              htmlFor="signup-username"
              className="visually-hidden"
            >
              Username
            </label>

            <input
              id="signup-username"
              type="text"
              name="username"
              className="kite-auth-input"
              placeholder="Choose username"
              value={username}
              onChange={handleOnChange}
              autoComplete="username"
              required
            />
          </div>

          <div className="kite-password-wrapper">
            <label
              htmlFor="signup-password"
              className="visually-hidden"
            >
              Password
            </label>

            <input
              id="signup-password"
              type={showPassword ? "text" : "password"}
              name="password"
              className="kite-auth-input"
              placeholder="Create password"
              value={password}
              onChange={handleOnChange}
              autoComplete="new-password"
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
            {loading ? "Creating account..." : "Sign up"}
          </button>
        </form>
      </div>

      <div className="kite-auth-footer">
        <p>
          Already have an account?{" "}
          <Link to="/login">Login</Link>
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

export default Signup;