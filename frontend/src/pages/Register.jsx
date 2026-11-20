
import Brand from "../components/Brand";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useAuth } from "../context/AuthContext";
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
    <div className="auth-page auth-register-page">
      <div className="auth-background" />

      <div className="auth-brand">
        <Brand />
      </div>

      <main className="auth-main">
        <section className="auth-intro">
          <span className="auth-eyebrow">
            A clearer way to work
          </span>

          <h1>
            Start building
            <br />
            with <span>clarity.</span>
          </h1>

          <p>
            Create your workspace, organize projects, and track
            everything that needs to get done.
          </p>
        </section>

        <section className="auth-card">
          <div className="auth-card-heading">
            <span className="auth-card-kicker">
              GET STARTED
            </span>

            <h2>Create account</h2>

            <p className="auth-subtitle">
              Get started with your personal workspace.
            </p>
          </div>

          {error && (
            <div className="auth-alert">
              {error}
            </div>
          )}

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="auth-field">
              <label htmlFor="register-name">
                Full name
              </label>

              <input
                id="register-name"
                type="text"
                placeholder="Your name"
                autoComplete="name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="auth-field">
              <label htmlFor="register-username">
                Username
              </label>

              <input
                id="register-username"
                type="text"
                placeholder="e.g. Alex7"
                autoComplete="username"
                minLength={3}
                maxLength={20}
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div className="auth-field">
              <label htmlFor="register-email">
                Email address
              </label>

              <input
                id="register-email"
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="auth-field">
              <label htmlFor="register-password">
                Password
              </label>

              <input
                id="register-password"
                type="password"
                placeholder="Create a password"
                autoComplete="new-password"
                minLength={6}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <span className="auth-field-hint">
                Use at least 6 characters.
              </span>
            </div>

            <button
              type="submit"
              className="auth-submit"
              disabled={loading}
            >
              <span>
                {loading ? "Creating account..." : "Create account"}
              </span>

              {!loading && <ArrowRight size={17} />}
            </button>
          </form>

          <div className="auth-switch">
            Already registered?
            <Link to="/login">Sign in</Link>
          </div>
        </section>
      </main>
    </div>
  );
}
