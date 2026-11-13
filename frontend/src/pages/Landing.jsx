
import { Link } from "react-router-dom";
import "./Landing.css";

function Landing() {
  return (
    <div className="landing">

      {/* NAVBAR */}
      <nav className="landing-nav">
        <Link to="/" className="landing-logo">
          issueflow<span>.</span>
        </Link>

        <div className="landing-nav-center">
          <a href="#features">Features</a>
          <a href="#workflow">Workflow</a>
          <a href="#about">About</a>
        </div>

        <div className="landing-nav-right">
          <Link to="/login" className="nav-login">Login</Link>
          <Link to="/register" className="nav-download">
            Get Started ↗
          </Link>
          <button className="menu-button">☰</button>
        </div>
      </nav>

      {/* HERO */}
      <section className="landing-hero">
        <div className="hero-copy">
          <p className="hero-eyebrow">PROJECT MANAGEMENT · ISSUE TRACKING</p>

          <h1>
            A better way
            <br />
            <span>to track issues.</span>
          </h1>

          <p className="hero-description">
            Keep your team organized, track progress,
            and ship better software together.
          </p>

          <div className="hero-actions">
            <Link to="/register" className="primary-button">
              Get Started ↗
            </Link>

            <a href="#features" className="secondary-button">
              Explore IssueFlow ↓
            </a>
          </div>

          <div className="hero-note">
            Built for developers. Designed for teams.
          </div>
        </div>

        {/* EDITORIAL ILLUSTRATION */}
        <div className="hero-art">
          <div className="art-window">
            <div className="art-window-top">
              <span>issueflow / projects</span>
              <span>•••</span>
            </div>

            <div className="art-content">
              <div className="art-sidebar">
                <div className="art-sidebar-logo">IF.</div>
                <div className="art-sidebar-item active">Projects</div>
                <div className="art-sidebar-item">Issues</div>
                <div className="art-sidebar-item">Activity</div>
              </div>

              <div className="art-main">
                <div className="art-title">My projects</div>
                <div className="art-subtitle">Your projects, in one place.</div>

                <div className="art-project">
                  <span className="art-dot coral"></span>
                  Website redesign
                  <span className="art-count">12</span>
                </div>

                <div className="art-project">
                  <span className="art-dot black"></span>
                  IssueFlow
                  <span className="art-count">08</span>
                </div>

                <div className="art-project">
                  <span className="art-dot gray"></span>
                  Mobile app
                  <span className="art-count">04</span>
                </div>

                <div className="art-progress">
                  <div className="art-progress-label">
                    Project progress <span>72%</span>
                  </div>
                  <div className="progress-track">
                    <div className="progress-fill"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="floating-ticket">
            <span className="ticket-label">IF-024</span>
            <strong>Fix authentication bug</strong>
            <span className="ticket-status">In Progress</span>
          </div>

          <div className="art-decoration">↗</div>
        </div>
      </section>

      {/* BOTTOM FEATURE STRIP */}
      <section className="landing-strip">
        <div className="strip-item">
          <span className="strip-number">01</span>
          <h3>Organize</h3>
          <p>Keep every project structured.</p>
        </div>

        <div className="strip-item">
          <span className="strip-number">02</span>
          <h3>Track</h3>
          <p>Know what needs attention.</p>
        </div>

        <div className="strip-item">
          <span className="strip-number">03</span>
          <h3>Collaborate</h3>
          <p>Work better as a team.</p>
        </div>

        <div className="strip-item">
          <span className="strip-number">04</span>
          <h3>Deliver</h3>
          <p>Turn progress into results.</p>
        </div>
      </section>

      {/* FEATURES */}
      <section className="landing-features" id="features">
        <div className="section-heading">
          <span className="section-eyebrow">WHAT IS ISSUEFLOW?</span>
          <h2>
            Less chaos.
            <br />
            <span>More progress.</span>
          </h2>
        </div>

        <div className="feature-grid">
          <div className="feature-card">
            <span className="feature-index">01 / PROJECTS</span>
            <div className="feature-symbol">□</div>
            <h3>Everything in its place.</h3>
            <p>
              Create projects, organize your team, and
              keep all your work organized.
            </p>
          </div>

          <div className="feature-card coral-card">
            <span className="feature-index">02 / ISSUES</span>
            <div className="feature-symbol">↗</div>
            <h3>Every issue. Accounted for.</h3>
            <p>
              Assign tasks, set priorities, and track
              issues from creation to completion.
            </p>
          </div>

          <div className="feature-card">
            <span className="feature-index">03 / ACTIVITY</span>
            <div className="feature-symbol">↻</div>
            <h3>Always in the loop.</h3>
            <p>
              Follow updates, status changes, and
              team activity without missing a thing.
            </p>
          </div>
        </div>
      </section>

      {/* WORKFLOW */}
      <section className="landing-workflow" id="workflow">
        <span className="section-eyebrow">A SIMPLE WORKFLOW</span>

        <h2>
          From first issue
          <br />
          <span>to final delivery.</span>
        </h2>

        <div className="workflow-steps">
          <div>
            <span>01</span>
            <h3>Create</h3>
            <p>Start with a project.</p>
          </div>
          <div>
            <span>02</span>
            <h3>Assign</h3>
            <p>Give every issue an owner.</p>
          </div>
          <div>
            <span>03</span>
            <h3>Resolve</h3>
            <p>Track work until it's done.</p>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section className="landing-about" id="about">
        <span className="section-eyebrow">MADE FOR BUILDERS</span>
        <h2>
          Good software
          <br />
          starts with <span>good teamwork.</span>
        </h2>
        <p>
          IssueFlow brings projects, issues, and people
          together in one simple flow.
        </p>
        <Link to="/register" className="primary-button">
          Start building ↗
        </Link>
      </section>

      {/* FOOTER */}
      <footer className="landing-footer">
        <Link to="/" className="landing-logo">
          issueflow<span>.</span>
        </Link>

        <p>Projects in motion. Issues under control.</p>

        <div className="footer-links">
          <a href="#features">Features</a>
          <Link to="/login">Login</Link>
          <Link to="/register">Get Started</Link>
        </div>

        <span className="footer-copy">
          © 2026 IssueFlow
        </span>
      </footer>

    </div>
  );
}

export default Landing;
