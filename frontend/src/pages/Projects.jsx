
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  FolderKanban,
  Plus,
  Search,
  ArrowUpRight,
  Pencil,
  Trash2,
  X,
  Layers3,
} from "lucide-react";

import api from "../services/api";
import Button from "../components/Button";
import Input from "../components/Input";
import "./Projects.css";

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formName, setFormName] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [saving, setSaving] = useState(false);

  const loadProjects = async () => {
    try {
      const response = await api.get("/projects");
      setProjects(response.data.projects || []);
      setError("");
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to load projects."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const filteredProjects = useMemo(() => {
    const term = search.toLowerCase().trim();

    if (!term) return projects;

    return projects.filter((project) =>
      `${project.name} ${project.description || ""}`
        .toLowerCase()
        .includes(term)
    );
  }, [projects, search]);

  const resetForm = () => {
    setShowForm(false);
    setEditingId(null);
    setFormName("");
    setFormDescription("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formName.trim()) return;

    setSaving(true);
    setError("");

    try {
      if (editingId) {
        await api.put(`/projects/${editingId}`, {
          name: formName.trim(),
          description: formDescription.trim(),
        });
      } else {
        await api.post("/projects", {
          name: formName.trim(),
          description: formDescription.trim(),
        });
      }

      resetForm();
      await loadProjects();
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to save project."
      );
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (project) => {
    setEditingId(project._id);
    setFormName(project.name || "");
    setFormDescription(project.description || "");
    setShowForm(true);
  };

  const handleDelete = async (project) => {
    const confirmed = window.confirm(
      `Delete "${project.name}"? This action cannot be undone.`
    );

    if (!confirmed) return;

    try {
      await api.delete(`/projects/${project._id}`);
      setProjects((prev) =>
        prev.filter((item) => item._id !== project._id)
      );
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to delete project."
      );
    }
  };

  if (loading) {
    return <div className="projects-loading">Loading projects...</div>;
  }

  return (
    <div className="projects-page">
      <section className="projects-hero">
        <div>
          <span className="projects-eyebrow">YOUR WORKSPACE</span>
          <h2>Projects</h2>
          <p>Plan, organize, and keep track of everything you're building.</p>
        </div>

        <Button onClick={() => {
          resetForm();
          setShowForm(true);
        }}>
          <Plus size={17} /> New Project
        </Button>
      </section>

      {error && <div className="projects-error">{error}</div>}

      {showForm && (
        <section className="project-form-panel">
          <div className="project-form-heading">
            <div>
              <h3>{editingId ? "Edit project" : "Create project"}</h3>
              <p>Give your workspace a name and description.</p>
            </div>

            <button
              className="project-close"
              onClick={resetForm}
              aria-label="Close project form"
            >
              <X size={19} />
            </button>
          </div>

          <form className="project-form" onSubmit={handleSubmit}>
            <Input
              id="project-name"
              label="Project name"
              placeholder="e.g. Website redesign"
              required
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
            />

            <div className="form-field">
              <label htmlFor="project-description">Description</label>
              <textarea
                id="project-description"
                className="form-input project-textarea"
                placeholder="What is this project about?"
                rows={3}
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
              />
            </div>

            <div className="project-form-actions">
              <Button type="button" variant="secondary" onClick={resetForm}>
                Cancel
              </Button>
              <Button type="submit" loading={saving}>
                {editingId ? "Save changes" : "Create project"}
              </Button>
            </div>
          </form>
        </section>
      )}

      <section className="projects-toolbar">
        <div>
          <h3>All projects <span>{projects.length}</span></h3>
          <p>Manage your project spaces</p>
        </div>

        <div className="projects-search">
          <Search size={17} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search projects..."
            aria-label="Search projects"
          />
        </div>
      </section>

      {filteredProjects.length === 0 ? (
        <div className="projects-empty">
          <div className="projects-empty-icon"><FolderKanban size={30} /></div>
          <h3>{search ? "No matching projects" : "No projects yet"}</h3>
          <p>
            {search
              ? "Try another search term."
              : "Create your first project to get started."}
          </p>
          {!search && (
            <Button onClick={() => setShowForm(true)}>
              <Plus size={16} /> Create project
            </Button>
          )}
        </div>
      ) : (
        <div className="projects-grid">
          {filteredProjects.map((project, index) => (
            <article className="project-card" key={project._id}>
              <div className="project-card-top">
                <div className={`project-card-icon project-icon-${index % 3}`}>
                  <Layers3 size={22} />
                </div>

                <div className="project-card-actions">
                  <button
                    onClick={() => startEdit(project)}
                    title="Edit project"
                    aria-label={`Edit ${project.name}`}
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(project)}
                    title="Delete project"
                    aria-label={`Delete ${project.name}`}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <Link to={`/projects/${project._id}`} className="project-card-title">
                <h3>{project.name}</h3>
                <ArrowUpRight size={17} />
              </Link>

              <p className="project-card-description">
                {project.description || "No description provided."}
              </p>

              <div className="project-card-footer">
                <span><FolderKanban size={14} /> Project workspace</span>
                <Link to={`/projects/${project._id}`}>Open project</Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
