
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Search as SearchIcon,
  CircleDot,
  ArrowUpRight,
  FolderKanban,
} from "lucide-react";

import api from "../services/api";
import "./Search.css";

export default function Search() {
  const [query, setQuery] = useState("");
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
          err.response?.data?.message || "Unable to load search data."
        );
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const results = useMemo(() => {
    const term = query.toLowerCase().trim();

    if (!term) return { projects: [], issues: [] };

    return {
      projects: projects.filter((project) =>
        `${project.name} ${project.description || ""}`
          .toLowerCase()
          .includes(term)
      ),
      issues: issues.filter((issue) =>
        `${issue.title} ${issue.description || ""}`
          .toLowerCase()
          .includes(term)
      ),
    };
  }, [query, projects, issues]);

  const hasQuery = query.trim().length > 0;

  return (
    <div className="search-page">
      <section className="search-hero">
        <span className="search-eyebrow">WORKSPACE SEARCH</span>
        <h2>Find anything.</h2>
        <p>Search across your projects and issues in one place.</p>

        <div className="search-main-input">
          <SearchIcon size={21} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search projects, issues, descriptions..."
            autoFocus
          />
          {query && (
            <button onClick={() => setQuery("")} aria-label="Clear search">
              Clear
            </button>
          )}
        </div>
      </section>

      {error && <div className="search-error">{error}</div>}

      {loading ? (
        <div className="search-loading">Loading searchable content...</div>
      ) : !hasQuery ? (
        <div className="search-placeholder">
          <div className="search-placeholder-icon"><SearchIcon size={28} /></div>
          <h3>Search your workspace</h3>
          <p>Enter a project or issue name to find matching results.</p>
        </div>
      ) : (
        <div className="search-results">
          <div className="search-results-heading">
            <h3>Results</h3>
            <span>
              {results.projects.length + results.issues.length} matches
            </span>
          </div>

          {results.projects.length > 0 && (
            <section className="search-result-section">
              <div className="search-section-heading">
                <FolderKanban size={17} />
                <h4>Projects</h4>
                <span>{results.projects.length}</span>
              </div>

              {results.projects.map((project) => (
                <Link
                  className="search-result-card"
                  to={`/projects/${project._id}`}
                  key={project._id}
                >
                  <div className="search-result-icon search-result-indigo">
                    <FolderKanban size={19} />
                  </div>
                  <div className="search-result-content">
                    <strong>{project.name}</strong>
                    <p>{project.description || "No description provided."}</p>
                  </div>
                  <ArrowUpRight size={17} />
                </Link>
              ))}
            </section>
          )}

          {results.issues.length > 0 && (
            <section className="search-result-section">
              <div className="search-section-heading">
                <CircleDot size={17} />
                <h4>Issues</h4>
                <span>{results.issues.length}</span>
              </div>

              {results.issues.map((issue) => {
                const projectId =
                  issue.projectId?._id || issue.projectId;

                const project = projects.find(
                  (item) => String(item._id) === String(projectId)
                );

                return (
                  <Link
                    className="search-result-card"
                    to={`/projects/${projectId}`}
                    key={issue._id}
                  >
                    <div className="search-result-icon search-result-cyan">
                      <CircleDot size={19} />
                    </div>
                    <div className="search-result-content">
                      <strong>{issue.title}</strong>
                      <p>
                        {project?.name || "Project"} · {issue.status || "Open"} · {issue.priority || "Medium"}
                      </p>
                    </div>
                    <ArrowUpRight size={17} />
                  </Link>
                );
              })}
            </section>
          )}

          {results.projects.length === 0 && results.issues.length === 0 && (
            <div className="search-placeholder search-no-results">
              <h3>No results found</h3>
              <p>Try another name or keyword.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
