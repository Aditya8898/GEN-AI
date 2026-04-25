import React, { useState } from 'react'
import "../auth.form.scss"
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

const Login = () => {
  const { loading, handleLogin } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await handleLogin({ email, password });
      navigate("/");
    } catch {
      setError("Login failed. Please check your credentials and try again.");
    }
  };

  if (loading) {
    return (
      <main>
        <h1>Loading...</h1>
      </main>
    );
  }

  return (
    <main>
      <div className="form-container">
        <h1 className="form-title">Login</h1>
        {error && <div className="form-error">{error}</div>}
        <form onSubmit={handleSubmit} autoComplete="on">
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              type="email"
              id="email"
              name="email"
              placeholder="Enter email address"
              autoComplete="email"
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              type="password"
              id="password"
              name="password"
              placeholder="Enter password"
              autoComplete="current-password"
              required
            />
          </div>
          <button
            className="button primary-button"
            type="submit"
            disabled={loading || !email || !password}
          >
            Login
          </button>
        </form>
        <p className="form-footer">
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </main>
  );
};

export default Login;

