
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Layers3 } from "lucide-react";

import { useAuth } from "../context/AuthContext";
import Brand from "../components/Brand";
import Button from "../components/Button";
import Input from "../components/Input";
import "./Auth.css";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(email, password);
      navigate("/");
    } catch (err) {
      setError(
        err.response?.data?.message || "Login failed. Check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <section className="auth-visual">
        <Brand light />

        <div className="auth-visual-content">
          <Layers3 size={38} color="#67e8f9" />
          <h1>
            Work smarter.
            <br />
            Build <span>better.</span>
          </h1>
          <p>
            Bring your projects, issues, and team progress into one
            focused workspace.
          </p>
        </div>

        <div className="auth-visual-footer">
          IssueFlow · Project management, made clearer.
        </div>
      </section>

      <section className="auth-form-side">
        <div className="auth-card">
          <div className="auth-mobile-brand">
            <Brand to="/login" />
          </div>

          <h2>Welcome back</h2>
          <p className="auth-subtitle">
            Sign in to continue to your workspace.
          </p>

          {error && <div className="auth-alert">{error}</div>}

          <form className="auth-form" onSubmit={handleSubmit}>
            <Input
              id="login-email"
              label="Email address"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Input
              id="login-password"
              label="Password"
              type="password"
              placeholder="Enter your password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Button type="submit" className="btn-full" loading={loading}>
              Sign in <ArrowRight size={17} />
            </Button>
          </form>

          <div className="auth-switch">
            Don't have an account? <Link to="/register">Create one</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
