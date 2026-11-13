
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FolderKanban,
  ClipboardList,
  CheckCircle2,
  ArrowUpRight,
  Layers3,
  CircleDot,
  Activity,
} from "lucide-react";

import api from "../services/api";
import Button from "../components/Button";
import "./Dashboard.css";

export default function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const response = await api.get("/projects");
        const projectList = response.data.projects || [];

        setProjects(projectList);

        const issueResponses = await Promise.all(
          projectList.map((project) =>
            api.get(`/issues/project/${project._id}`)
          )
        );

        setIssues(
          issueResponses.flatMap((item) => item.data.issues || [])
        );
      } catch (err) {
        setError(
          err.response?.data?.message || "Unable to load dashboard."
        );
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const totalIssues = issues.length;
  const completed = issues.filter(
    (issue) => issue.status === "Done"
  ).length;
  const progress = totalIssues
    ? Math.round((completed / totalIssues) * 100)
    : 0;

  const recentIssues = [...issues]
    .sort(
      (a, b) =>
        new Date(b.updatedAt || b.createdAt || 0) -
        new Date(a.updatedAt || a.createdAt || 0)
    )
    .slice(0, 5);

  if (loading) {
    return (
      <div className="dashboard">
        <div className="dashboard-hero">
          <span className="hero-label">ISSUEFLOW / OVERVIEW</span>
          <h2>Your workspace, at a glance.</h2>
          <p>Preparing your project insights...</p>
        </div>
        <div className="dashboard-loading">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <section className="dashboard-hero">
        <div className="hero-content">
          <span className="hero-label">ISSUEFLOW / OVERVIEW</span>
          <h2>
            Your workspace,
            <br />
            <span>at a glance.</span>
          </h2>
          <p>
            Keep your projects organized, track issues, and see
            progress across your workspace.
          </p>

          <Link to="/projects" className="hero-action">
            Explore projects <ArrowUpRight size={17} />
          </Link>
        </div>

        <div className="hero-art" aria-hidden="true">
          <div className="hero-art-ring ring-one" />
          <div className="hero-art-ring ring-two" />
          <div className="hero-art-center">
            <Layers3 size={48} />
          </div>
        </div>
      </section>

      {error && <div className="dashboard-error">{error}</div>}

      <section className="metric-grid">
        <article className="metric-card metric-indigo">
          <div className="metric-top">
            <span>Total Projects</span>
            <div className="metric-icon"><FolderKanban size={20} /></div>
          </div>
          <strong>{projects.length}</strong>
          <small>Projects in your workspace</small>
        </article>

        <article className="metric-card metric-cyan">
          <div className="metric-top">
            <span>Total Issues</span>
            <div className="metric-icon"><ClipboardList size={20} /></div>
          </div>
          <strong>{totalIssues}</strong>
          <small>Issues across all projects</small>
        </article>

        <article className="metric-card metric-rose">
          <div className="metric-top">
            <span>Completion</span>
            <div className="metric-icon"><CheckCircle2 size={20} /></div>
          </div>
          <strong>{progress}%</strong>
          <small>{completed} of {totalIssues} completed</small>
          <div className="metric-progress">
            <div style={{ width: `${progress}%` }} />
          </div>
        </article>
      </section>

      <section className="dashboard-section">
        <div className="section-heading">
          <div>
            <h2>Workspace activity</h2>
            <p>Your projects and recent issues</p>
          </div>
        </div>

        <div className="dashboard-panels">
          <article className="dashboard-panel">
            <div className="panel-heading">
              <div>
                <h3>Your projects</h3>
                <p>Recently available workspaces</p>
              </div>
              <Link to="/projects" className="panel-link" aria-label="View projects">
                <ArrowUpRight size={19} />
              </Link>
            </div>

            {projects.length === 0 ? (
              <div className="empty-state">
                <FolderKanban size={28} />
                <p>No projects yet.</p>
                <Link to="/projects">Create your first project</Link>
              </div>
            ) : (
              projects.slice(0, 5).map((project, index) => {
                const projectIssues = issues.filter(
                  (issue) =>
                    String(issue.projectId?._id || issue.projectId) ===
                    String(project._id)
                );

                const done = projectIssues.filter(
                  (issue) => issue.status === "Done"
                ).length;

                const percentage = projectIssues.length
                  ? Math.round((done / projectIssues.length) * 100)
                  : 0;

                return (
                  <Link
                    className="project-summary"
                    to={`/projects/${project._id}`}
                    key={project._id}
                  >
                    <div className={`summary-icon summary-icon-${index % 3}`}>
                      <Layers3 size={19} />
                    </div>

                    <div className="summary-content">
                      <strong>{project.name}</strong>
                      <small>
                        {projectIssues.length} issues · {percentage}% complete
                      </small>
                      <div className="summary-progress">
                        <div style={{ width: `${percentage}%` }} />
                      </div>
                    </div>

                    <ArrowUpRight size={16} className="summary-arrow" />
                  </Link>
                );
              })
            )}
          </article>

          <article className="dashboard-panel">
            <div className="panel-heading">
              <div>
                <h3>Recent issues</h3>
                <p>Latest issue updates</p>
              </div>
              <Activity size={20} className="panel-cyan-icon" />
            </div>

            {recentIssues.length === 0 ? (
              <div className="empty-state">
                <CircleDot size={28} />
                <p>No issues available.</p>
              </div>
            ) : (
              recentIssues.map((issue, index) => (
                <div className="recent-issue" key={issue._id}>
                  <div className={`recent-icon recent-icon-${index % 3}`}>
                    <CircleDot size={17} />
                  </div>
                  <div className="recent-content">
                    <strong>{issue.title}</strong>
                    <small>
                      {issue.status || "Open"} · {issue.priority || "Medium"} priority
                    </small>
                  </div>
                </div>
              ))
            )}
          </article>
        </div>
      </section>

      <div className="dashboard-bottom">
        <span>{projects.length} projects · {totalIssues} issues</span>
        <Link to="/projects">
          <Button variant="secondary">Manage projects <ArrowUpRight size={15} /></Button>
        </Link>
      </div>
    </div>
  );
}
