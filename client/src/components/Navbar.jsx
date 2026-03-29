import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout, fetchMe } from "../app/slices/authSlice";
import { searchAll, clearSearch } from "../app/slices/searchSlice";
import {
  Home,
  Newspaper,
  BriefcaseBusiness,
  FileText,
  Sparkles,
  Users,
  Bell,
  ChevronDown,
  Zap,
  Search,
  User,
  LogOut,
  IdCard,
  X,
  MessageSquare,
  CheckCircle,
  Building2,
} from "lucide-react";
import HrmsSetupModal from "./HrmsSetupModal";

export default function Navbar() {
  const { user } = useSelector((s) => s.auth);
  const searchState = useSelector((s) => s.search);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(() => window.innerWidth >= 1024);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [hrmsModalOpen, setHrmsModalOpen] = useState(false);
  const dropRef = useRef();
  const searchRef = useRef();
  const resultsRef = useRef();

  useEffect(() => {
    const handleUnreadUpdate = (e) => {
      if (e.detail && typeof e.detail.count === "number") {
        setUnreadNotifications(e.detail.count);
      }
    };
    window.addEventListener("update-unread-notifications", handleUnreadUpdate);
    return () =>
      window.removeEventListener(
        "update-unread-notifications",
        handleUnreadUpdate,
      );
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target))
        setDropdownOpen(false);
      const inSearch = searchRef.current?.contains(e.target);
      const inResults = resultsRef.current?.contains(e.target);
      if (!inSearch && !inResults) {
        setSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      const desktop = window.innerWidth >= 1024;
      setIsDesktop(desktop);
      if (desktop) setMobileMenuOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
    setDropdownOpen(false);
    setMobileMenuOpen(false);
  };

  useEffect(() => {
    const q = searchInput.trim();
    if (!q || q.length < 2) {
      dispatch(clearSearch());
      setSearchOpen(false);
      return;
    }
    setSearchOpen(true);
    const t = setTimeout(() => dispatch(searchAll(q)), 250);
    return () => clearTimeout(t);
  }, [dispatch, searchInput]);

  useEffect(() => {
    // Only fetch if user is HR and hrmsAccount is false/unknown to ensure we have the latest setup status
    if (user && user.role === "hr" && !user.hrmsAccount) {
      dispatch(fetchMe());
    }
  }, [user?.role, user?.hrmsAccount, dispatch]);

  const isActive = (path) =>
    location.pathname === path || location.pathname.startsWith(path + "/");

  const seekerLinks = [
    { path: "/dashboard", label: "Dashboard", icon: <Home size={18} /> },
    { path: "/feed", label: "Feed", icon: <Newspaper size={18} /> },
    { path: "/jobs", label: "Jobs", icon: <BriefcaseBusiness size={18} /> },
    {
      path: "/applications",
      label: "Applied Jobs",
      icon: <FileText size={18} />,
    },
    {
      path: "/ai-feedback",
      label: "AI Feedback",
      icon: <Sparkles size={18} />,
    },
  ];

  const hrLinks = [
    {
      path: "/hr/jobs",
      label: "My Jobs",
      icon: <BriefcaseBusiness size={18} />,
    },
    { path: "/feed", label: "Feed", icon: <Newspaper size={18} /> },
    { path: "/hr/post-job", label: "Post Job", icon: <FileText size={18} /> },
    { path: "/hr/candidates", label: "Talent", icon: <Users size={18} /> },
  ];

  const guestLinks = [
    { path: "/", label: "Home", icon: <Home size={18} /> },
    {
      path: "/jobs",
      label: "Browse Jobs",
      icon: <BriefcaseBusiness size={18} />,
    },
  ];

  const links = user
    ? user.role === "hr"
      ? hrLinks
      : seekerLinks
    : guestLinks;

  return (
    <>
      <nav className="sticky top-0 left-0 right-0 h-[72px] z-10001 bg-bg-dark/95 backdrop-blur-xl border-b border-white/10 px-6 flex items-center">
        <div className="flex items-center justify-between w-full max-w-[1440px] mx-auto">
          <div className="flex items-center gap-6">
            {/* Hamburger for mobile — hidden on desktop via JS-driven inline style */}
            <button
              style={{ display: isDesktop ? "none" : "flex" }}
              className="items-center justify-center w-10 h-10 -ml-2 rounded-xl hover:bg-white/5 transition-all duration-200 cursor-pointer"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              <div className="relative w-6 h-5 flex flex-col justify-between items-center py-1">
                <span
                  className={`block w-5 h-0.5 bg-white rounded-full transition-all duration-300 ${mobileMenuOpen ? "translate-y-1.5 rotate-45" : ""}`}
                ></span>
                <span
                  className={`block w-5 h-0.5 bg-white rounded-full transition-all duration-300 ${mobileMenuOpen ? "opacity-0 scale-x-0" : ""}`}
                ></span>
                <span
                  className={`block w-5 h-0.5 bg-white rounded-full transition-all duration-300 ${mobileMenuOpen ? "-translate-y-1.5 -rotate-45" : ""}`}
                ></span>
              </div>
            </button>

            {/* Logo */}
            <Link
              to="/"
              className="flex items-center gap-2.5 shrink-0"
              onClick={() => setMobileMenuOpen(false)}
            >
              <div className="flex items-center justify-center w-9 h-9 bg-white rounded-lg text-indigo-600 shadow-[0_0_20px_rgba(99,102,241,0.4)] transition-transform hover:scale-105">
                <Zap size={20} fill="currentColor" />
              </div>
              <span className="font-display text-xl font-extrabold text-text-primary text-white">
                Career
                <span className="bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Lens
                </span>
              </span>
            </Link>

            {/* Desktop Links — shown only on desktop via JS-driven inline style */}
            {user && (
              <div
                style={{ display: isDesktop ? "flex" : "none" }}
                className="items-center gap-5 ml-10"
              >
                {links.map((l) => (
                  <Link
                    key={l.path}
                    to={l.path}
                    className={`flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-sm font-medium transition-all duration-200 select-none ${
                      isActive(l.path)
                        ? "text-primary-light bg-linear-to-br from-primary/15 to-secondary/15 ring-1 ring-primary/20"
                        : "text-text-secondary hover:text-text-primary hover:bg-white/5"
                    }`}
                  >
                    {l.icon}
                    <span>{l.label}</span>
                  </Link>
                ))}
                {user.role === "hr" && (
                  <button
                    onClick={() => {
                      if (user.hrmsAccount) {
                        window.location.href = "http://localhost:3003";
                      } else {
                        setHrmsModalOpen(true);
                      }
                    }}
                    title={
                      user.hrmsAccount
                        ? "Open HRMS Dashboard"
                        : "Set up your HRMS account"
                    }
                    className="flex items-center gap-2.5 px-4 py-2 rounded-xl text-[13px] font-bold bg-gradient-to-r from-primary to-primary-dark text-white shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all duration-300 ring-1 ring-white/10 cursor-pointer"
                  >
                    <Building2 size={16} />
                    <span>HRMS Service</span>
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-1.5 sm:gap-4 ml-auto">
            {user ? (
              <>
                <div
                  className="flex-1 max-w-[320px] hidden md:flex"
                  ref={searchRef}
                >
                  <div className="w-full flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 focus-within:bg-white/10 focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/10 transition-all duration-200">
                    <Search size={16} className="text-text-muted" />
                    <input
                      type="text"
                      placeholder="Search..."
                      className="w-full border-none outline-none bg-transparent text-text-primary text-sm placeholder:text-text-muted"
                      value={searchInput}
                      onChange={(e) => setSearchInput(e.target.value)}
                      onFocus={() =>
                        searchInput.length >= 2 && setSearchOpen(true)
                      }
                    />
                  </div>
                </div>

                <button
                  onClick={() =>
                    window.dispatchEvent(new CustomEvent("toggle-chat"))
                  }
                  className="relative p-2 sm:p-2.5 rounded-xl text-text-secondary hover:text-text-primary border border-white/10 transition-all duration-200 flex cursor-pointer"
                >
                  <MessageSquare size={18} />
                </button>

                <button
                  onClick={() =>
                    window.dispatchEvent(
                      new CustomEvent("toggle-notifications"),
                    )
                  }
                  className="relative p-2 sm:p-2.5 rounded-xl text-text-secondary hover:text-text-primary border border-white/10 transition-all duration-200 flex cursor-pointer"
                >
                  <Bell size={18} />
                  {unreadNotifications > 0 && (
                    <span className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 flex items-center justify-center w-[14px] h-[14px] bg-red-500 rounded-full ring-2 ring-bg-dark text-[9px] font-bold text-white shadow-sm shadow-red-500/50">
                      {unreadNotifications > 9 ? "9+" : unreadNotifications}
                    </span>
                  )}
                </button>
                {/* <Link to="/notifications" className="btn-icon btn-ghost nav-icon-btn" aria-label="Notifications">
                                <Bell size={18} />
                            </Link> */}

                {/* Avatar Dropdown */}
                <div className="relative" ref={dropRef}>
                  <button
                    className="flex items-center gap-2 bg-transparent border border-white/10 rounded-full p-1 pr-3.5 hover:border-primary hover:bg-primary/10 transition-all duration-200 cursor-pointer"
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                  >
                    <div className="w-[30px] h-[30px] rounded-full bg-linear-to-br from-primary to-secondary flex items-center justify-center text-[13px] font-bold text-white overflow-hidden shadow-sm">
                      {user.avatar?.url ? (
                        <img
                          src={user.avatar.url}
                          alt={user.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span>{user.name?.charAt(0).toUpperCase()}</span>
                      )}
                    </div>
                    <ChevronDown
                      size={14}
                      className={`text-text-muted transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""} hidden sm:block`}
                    />
                  </button>
                  {dropdownOpen && (
                    <div className="absolute top-[calc(100%+10px)] right-0 w-[220px] bg-bg-dark/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-scale origin-top-right z-1200">
                      <div className="p-4 border-b border-white/10 bg-white/5">
                        <div className="font-semibold text-sm text-text-primary truncate">
                          {user.name}
                        </div>
                        <div className="text-[11px] text-text-muted mt-0.5 uppercase tracking-wider font-bold">
                          {user.role === "hr" ? "HR / Recruiter" : "Job Seeker"}
                        </div>
                      </div>
                      <div className="p-2 space-y-1">
                        <Link
                          to="/me"
                          className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-text-secondary hover:text-text-primary hover:bg-white/5 transition-all duration-150"
                          onClick={() => setDropdownOpen(false)}
                        >
                          <User size={15} /> My Profile
                        </Link>
                        <Link
                          to="/profile"
                          className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-text-secondary hover:text-text-primary hover:bg-white/5 transition-all duration-150"
                          onClick={() => setDropdownOpen(false)}
                        >
                          <IdCard size={15} /> Edit Resume
                        </Link>
                      </div>
                      <div className="p-2 border-t border-white/10">
                        <button
                          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-red-400 hover:text-red-300 hover:bg-red-400/10 transition-all duration-150 text-left font-medium"
                          onClick={handleLogout}
                        >
                          <LogOut size={15} /> Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div
                style={{ display: isDesktop ? "flex" : "none" }}
                className="items-center gap-3"
              >
                <Link
                  to="/login"
                  className="px-5 py-2 rounded-xl text-sm font-semibold text-text-secondary hover:text-text-primary transition-all duration-200"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="px-5 py-2 rounded-xl text-sm font-semibold bg-linear-to-r from-primary to-secondary text-white shadow-lg shadow-primary/20 transform hover:-translate-y-0.5 transition-all duration-200"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Search dropdown */}
        {searchOpen && (
          <div
            className="fixed top-[72px] left-1/2 -translate-x-1/2 w-[95%] max-w-[600px] max-h-[70vh] overflow-y-auto bg-bg-dark/98 backdrop-blur-2xl rounded-2xl border border-white/15 shadow-[0_30px_100px_rgba(0,0,0,0.8)] p-2 z-99999 animate-scale"
            ref={resultsRef}
          >
            {searchState.loading && (
              <div className="p-8 flex flex-col items-center justify-center gap-3 text-text-muted">
                <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                <span className="text-sm font-medium">Searching talent...</span>
              </div>
            )}
            {!searchState.loading &&
              (searchState.results || []).length === 0 && (
                <div className="p-10 text-center text-text-muted font-medium italic">
                  No matches found for "{searchInput}"
                </div>
              )}
            {(searchState.results || []).map((u) => (
              <Link
                key={u._id}
                to={`/profile/${u._id}`}
                className="flex items-center gap-4 p-3.5 rounded-xl hover:bg-primary/20 transition-all duration-150 group"
                onClick={() => {
                  setSearchOpen(false);
                  setSearchInput("");
                  dispatch(clearSearch());
                }}
              >
                <div className="w-11 h-11 rounded-full bg-linear-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-lg overflow-hidden group-hover:scale-105 transition-transform duration-200 border-2 border-transparent group-hover:border-primary/50">
                  {u.avatar?.url ? (
                    <img
                      src={u.avatar.url}
                      alt={u.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span>{u.name?.charAt(0).toUpperCase()}</span>
                  )}
                </div>
                <div className="flex-1">
                  <div className="text-[15px] font-bold text-text-primary group-hover:text-primary-light transition-colors">
                    {u.name}
                  </div>
                  <div className="text-[12px] text-text-muted mt-0.5 line-clamp-1">
                    {u.headline || u.company || u.industry || "No headline set"}
                  </div>
                </div>
                <div className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-primary/10 text-primary-light text-xs font-bold opacity-0 group-hover:opacity-100 transition-all duration-200 transform translate-x-2 group-hover:translate-x-0">
                  View Profile
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* HRMS Setup Modal */}
        {hrmsModalOpen && (
          <HrmsSetupModal onClose={() => setHrmsModalOpen(false)} />
        )}
      </nav>

      {/* Mobile Sidebar — rendered OUTSIDE <nav> to escape backdrop-filter stacking context */}
      {!isDesktop && (
        <div
          style={{
            position: "fixed",
            top: "72px",
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 10002,
            opacity: mobileMenuOpen ? 1 : 0,
            pointerEvents: mobileMenuOpen ? "auto" : "none",
            transition: "opacity 0.25s ease",
          }}
          onClick={() => setMobileMenuOpen(false)}
        >
          {/* Dark opaque backdrop */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "rgba(0,0,0,0.85)",
            }}
          />
          {/* Sliding drawer panel */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "285px",
              height: "100%",
              zIndex: 1,
              transform: mobileMenuOpen ? "translateX(0)" : "translateX(-100%)",
              transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              background: "#0d0f1a",
              borderRight: "1px solid rgba(255,255,255,0.08)",
              display: "flex",
              flexDirection: "column",
              boxShadow: "4px 0 40px rgba(0,0,0,0.7)",
              overflowY: "auto",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Search */}
            <div
              style={{
                padding: "20px 16px 16px",
                borderBottom: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "10px 14px",
                  borderRadius: "14px",
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
              >
                <Search
                  size={16}
                  style={{ color: "rgba(255,255,255,0.35)", flexShrink: 0 }}
                />
                <input
                  type="text"
                  placeholder="Search everything..."
                  style={{
                    width: "100%",
                    background: "transparent",
                    border: "none",
                    outline: "none",
                    color: "#fff",
                    fontSize: "15px",
                  }}
                  value={searchInput}
                  onChange={(e) => {
                    setSearchInput(e.target.value);
                    if (e.target.value.length >= 2) setSearchOpen(true);
                  }}
                />
              </div>
            </div>

            {/* Nav Links */}
            <div
              style={{
                flex: 1,
                padding: "12px",
                display: "flex",
                flexDirection: "column",
                gap: "4px",
              }}
            >
              {links.map((l) => (
                <Link
                  key={l.path}
                  to={l.path}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "14px",
                    padding: "12px 16px",
                    borderRadius: "12px",
                    fontSize: "14px",
                    fontWeight: 600,
                    textDecoration: "none",
                    color: isActive(l.path)
                      ? "#a5b4fc"
                      : "rgba(255,255,255,0.55)",
                    background: isActive(l.path)
                      ? "rgba(99,102,241,0.12)"
                      : "transparent",
                    transition: "all 0.15s ease",
                  }}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span
                    style={{
                      color: isActive(l.path)
                        ? "#818cf8"
                        : "rgba(255,255,255,0.3)",
                    }}
                  >
                    {l.icon}
                  </span>
                  <span>{l.label}</span>
                </Link>
              ))}
            </div>

            {/* Footer */}
            <div
              style={{
                padding: "16px",
                borderTop: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              {user ? (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                  }}
                >
                  <Link
                    to="/me"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "10px",
                      padding: "13px 16px",
                      borderRadius: "14px",
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      color: "rgba(255,255,255,0.6)",
                      fontSize: "14px",
                      fontWeight: 700,
                      textDecoration: "none",
                    }}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <User size={17} /> My Profile
                  </Link>
                  <button
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "10px",
                      padding: "13px 16px",
                      borderRadius: "14px",
                      background: "rgba(248,113,113,0.08)",
                      border: "1px solid rgba(248,113,113,0.2)",
                      color: "#f87171",
                      fontWeight: 700,
                      fontSize: "14px",
                      cursor: "pointer",
                    }}
                    onClick={handleLogout}
                  >
                    <LogOut size={15} /> Sign Out
                  </button>
                </div>
              ) : (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "10px",
                  }}
                >
                  <Link
                    to="/login"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: "13px",
                      borderRadius: "14px",
                      border: "1px solid rgba(255,255,255,0.1)",
                      color: "rgba(255,255,255,0.55)",
                      fontSize: "14px",
                      fontWeight: 700,
                      textDecoration: "none",
                    }}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/signup"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: "13px",
                      borderRadius: "14px",
                      background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                      color: "#fff",
                      fontSize: "14px",
                      fontWeight: 700,
                      textDecoration: "none",
                    }}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
