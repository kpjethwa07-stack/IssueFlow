
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Layers3 } from "lucide-react";

import { useAuth } from "../context/AuthContext";
import Brand from "../components/Brand";
import Button from "../components/Button";
import Input from "../components/Input";
import "./Auth.css";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await register(
        name,
        username.trim().toLowerCase(),
        email,
        password
      );

      navigate("/login", {
        state: { registered: true },
      });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Registration failed. Please try again."
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
            Start building
            <br />
            with <span>clarity.</span>
          </h1>

          <p>
            Create your workspace, organize projects, and track
            everything that needs to get done.
          </p>
        </div>

        <div className="auth-visual-footer">
          IssueFlow · Project management, made clearer.
        </div>
      </section>

      <section className="auth-form-side">
        <div className="auth-card">
          <div className="auth-mobile-brand">
            <Brand to="/register" />
          </div>

          <h2>Create account</h2>
          <p className="auth-subtitle">
            Get started with your personal workspace.
          </p>

          {error && <div className="auth-alert">{error}</div>}

          <form className="auth-form" onSubmit={handleSubmit}>
            <Input
              id="register-name"
              label="Full name"
              placeholder="Your name"
              autoComplete="name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <Input
              id="register-username"
              label="Username"
              placeholder="e.g. kaushal_07"
              autoComplete="username"
              required
              minLength={3}
              maxLength={20}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />

            <Input
              id="register-email"
              label="Email address"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Input
              id="register-password"
              label="Password"
              type="password"
              placeholder="Create a password"
              autoComplete="new-password"
              minLength={6}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Button type="submit" className="btn-full" loading={loading}>
              Create account <ArrowRight size={17} />
            </Button>
          </form>

          <div className="auth-switch">
            Already registered? <Link to="/login">Sign in</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
