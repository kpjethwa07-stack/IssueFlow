
import { useState } from "react";
import {
  NavLink,
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";

import {
  LayoutDashboard,
  FolderKanban,
  Search,
  LogOut,
  Menu,
  X,
  ChevronRight,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";
import Brand from "../components/Brand";
import "./AppLayout.css";

const navigation = [
  { label: "Overview", path: "/", icon: LayoutDashboard },
  { label: "Projects", path: "/projects", icon: FolderKanban },
  { label: "Search", path: "/search", icon: Search },
];

function getTitle(path) {
  if (path === "/") return "Overview";
  if (path === "/projects") return "Projects";
  if (path.startsWith("/projects/")) return "Project Details";
  if (path === "/search") return "Search";
  return "Workspace";
}

export default function AppLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const title = getTitle(location.pathname);
  const name = user?.name || user?.fullName || "Account";
  const initials = name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="app-shell">
      {mobileOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside className={`sidebar ${mobileOpen ? "sidebar-open" : ""}`}>
        <div className="sidebar-brand">
          <Brand />
        </div>

        <p className="sidebar-label">WORKSPACE</p>

        <nav className="sidebar-nav">
          {navigation.map(({ label, path, icon: Icon }) => (
            <NavLink
              key={path}
              to={path}
              end={path === "/"}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `nav-link ${isActive ? "nav-link-active" : ""}`
              }
            >
              <Icon size={19} />
              <span>{label}</span>
              <ChevronRight className="nav-chevron" size={15} />
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="profile">
            <div className="avatar">{initials}</div>
            <div className="profile-info">
              <strong title={name}>{name}</strong>
              <span title={user?.email}>{user?.email || "Account"}</span>
            </div>
          </div>

          <button
            className="icon-button logout-button"
            onClick={handleLogout}
            title="Logout"
            aria-label="Logout"
          >
            <LogOut size={18} />
          </button>
        </div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <div className="topbar-left">
            <button
              className="icon-button mobile-menu-button"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle sidebar"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            <div>
              <div className="breadcrumb">
                <span>IssueFlow</span>
                <ChevronRight size={14} />
                <strong>{title}</strong>
              </div>
              <h1>{title}</h1>
            </div>
          </div>

          <div className="topbar-user">
            <div className="avatar avatar-small">{initials}</div>
            <span>{name}</span>
          </div>
        </header>

        <div className="page-content">
          <div key={location.pathname} className="page-transition">
            <Outlet />
          </div>
        </div>

        <footer className="app-footer">
          <span>© {new Date().getFullYear()} IssueFlow</span>
          <span>Project management, made clearer.</span>
        </footer>
      </main>
    </div>
  );
}
