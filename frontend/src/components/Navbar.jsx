import React, { useState, useContext, useRef, useEffect } from "react";
import { useNavigate, NavLink, useLocation, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { Menu, X, ChevronDown, LogOut, Shield, LayoutDashboard, Globe } from "lucide-react";

const Navbar = () => {
  const API = import.meta.env.VITE_API_URL || "";

  const { user, logout } = useContext(AuthContext);
  const [showMenu, setShowMenu] = useState(false);
  const [dropdown, setDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Ensure dropdown is closed when user changes (e.g., after login/signup/navigation)
  useEffect(() => {
    setDropdown(false);
  }, [user]);

  // close mobile menu on route change
  useEffect(() => {
    setShowMenu(false);
  }, [navigate, user]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navLinkClass = ({ isActive }) =>
    `px-4 py-2 text-sm font-medium rounded-lg transition-all duration-150 cursor-pointer ${
      isActive
        ? "text-white bg-white/[0.06]"
        : "text-white/50 hover:text-white/80 hover:bg-white/[0.03]"
    }`;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/[0.06] backdrop-blur-2xl bg-[#050816]/80">
      <nav className="flex items-center justify-between max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2.5 cursor-pointer no-underline"
        >
          <div className="w-8 h-8 rounded-lg bg-[#7C3AED] flex items-center justify-center">
            <span className="text-white text-sm font-bold" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>U</span>
          </div>
          <span
            className="text-white font-bold text-base tracking-tight"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            UrbanAstro
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-1">
          <NavLink to="/astrologers" className={navLinkClass}>
            Astrologers
          </NavLink>
          <NavLink to="/my-bookings" className={navLinkClass}>
            My Bookings
          </NavLink>
          <NavLink to="/askai" className={navLinkClass}>
            Ask AI
          </NavLink>
        </div>

        {/* Desktop Right Actions */}
        <div className="hidden lg:flex items-center gap-3">
          {user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdown((prev) => !prev)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-white/[0.08] hover:border-white/[0.15] hover:bg-white/[0.04] transition-all cursor-pointer"
              >
                <img
                  src={
                    user.profilePic
                      ? user.profilePic.startsWith("http")
                        ? user.profilePic
                        : `${API}${user.profilePic}`
                      : "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                  }
                  alt="profile"
                  className="w-7 h-7 rounded-full object-cover"
                />
                <span className="text-white/70 text-sm font-medium max-w-[100px] truncate">
                  {user.name || "User"}
                </span>
                <ChevronDown className={`w-3.5 h-3.5 text-white/30 transition-transform duration-200 ${dropdown ? "rotate-180" : ""}`} />
              </button>

              {dropdown && (
                <div className="absolute right-0 mt-2 w-48 ua-card py-2 shadow-lg shadow-black/30 z-50">
                  <div className="px-4 py-2.5 border-b border-white/[0.06]">
                    <p className="text-sm font-semibold text-white truncate">
                      {user.name || "User"}
                    </p>
                    <p className="text-xs text-white/30 truncate">{user.phone || ""}</p>
                  </div>
                  {user.isAdmin && (
                    <button
                      onClick={() => {
                        navigate("/admin/dashboard");
                        setDropdown(false);
                      }}
                      className="w-full text-left px-4 py-2.5 text-sm text-white/60 hover:text-white hover:bg-white/[0.04] flex items-center gap-2.5 transition-colors"
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      Admin Panel
                    </button>
                  )}
                  {location.pathname.startsWith("/admin") && (
                    <button
                      onClick={() => {
                        navigate("/");
                        setDropdown(false);
                      }}
                      className="w-full text-left px-4 py-2.5 text-sm text-white/60 hover:text-white hover:bg-white/[0.04] flex items-center gap-2.5 transition-colors"
                    >
                      <Globe className="w-4 h-4" />
                      Main Website
                    </button>
                  )}
                  <button
                    onClick={() => {
                      logout();
                      navigate("/");
                    }}
                    className="w-full text-left px-4 py-2.5 text-sm text-white/60 hover:text-red-400 hover:bg-white/[0.04] flex items-center gap-2.5 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="ua-btn-primary"
            >
              Login / Sign Up
            </button>
          )}
        </div>

        {/* Mobile hamburger (hidden on auth pages) */}
        {!(
          location.pathname === "/login" ||
          location.pathname === "/signup"
        ) && (
          <div className="lg:hidden flex items-center">
            <button
              onClick={() => setShowMenu((s) => !s)}
              aria-label="Toggle menu"
              className="p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/[0.04] transition-colors cursor-pointer"
            >
              {showMenu ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        )}
      </nav>

      {/* Mobile menu overlay */}
      {showMenu && (
        <div
          className="lg:hidden border-t border-white/[0.06] bg-[#050816]/95 backdrop-blur-2xl"
          style={{ position: "fixed", top: "64px", left: 0, right: 0, bottom: 0, zIndex: 9999 }}
        >
          <div className="p-6 flex flex-col gap-2 h-full">
            <nav className="flex flex-col gap-1">
              <NavLink
                to="/astrologers"
                onClick={() => setShowMenu(false)}
                className={({ isActive }) =>
                  `px-4 py-3 text-sm font-medium rounded-xl transition-colors ${
                    isActive
                      ? "text-white bg-white/[0.06]"
                      : "text-white/60 hover:text-white hover:bg-white/[0.04]"
                  }`
                }
              >
                Astrologers
              </NavLink>
              <NavLink
                to="/my-bookings"
                onClick={() => setShowMenu(false)}
                className={({ isActive }) =>
                  `px-4 py-3 text-sm font-medium rounded-xl transition-colors ${
                    isActive
                      ? "text-white bg-white/[0.06]"
                      : "text-white/60 hover:text-white hover:bg-white/[0.04]"
                  }`
                }
              >
                My Bookings
              </NavLink>
              <NavLink
                to="/askai"
                onClick={() => setShowMenu(false)}
                className={({ isActive }) =>
                  `px-4 py-3 text-sm font-medium rounded-xl transition-colors ${
                    isActive
                      ? "text-white bg-white/[0.06]"
                      : "text-white/60 hover:text-white hover:bg-white/[0.04]"
                  }`
                }
              >
                Ask AI
              </NavLink>
              {user && user.isAdmin && (
                <button
                  onClick={() => {
                    navigate("/admin/dashboard");
                    setShowMenu(false);
                  }}
                  className="px-4 py-3 text-sm font-medium text-white/60 hover:text-white hover:bg-white/[0.04] rounded-xl transition-colors text-left flex items-center gap-2.5"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Admin Panel
                </button>
              )}
            </nav>

            <div className="mt-auto border-t border-white/[0.06] pt-4">
              {user ? (
                <div className="flex items-center gap-4">
                  <img
                    src={
                      user.profilePic
                        ? user.profilePic.startsWith("http")
                          ? user.profilePic
                          : `${API}${user.profilePic}`
                        : "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                    }
                    alt="profile"
                    className="w-12 h-12 rounded-full object-cover border border-white/[0.08]"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-white truncate">
                      {user.name || user.phone || "User"}
                    </div>
                    <div className="flex gap-4 items-center mt-2">
                      {user.isAdmin && (
                        <button
                          onClick={() => {
                            navigate("/admin/dashboard");
                            setShowMenu(false);
                          }}
                          className="text-sm text-white/50 hover:text-white transition-colors"
                        >
                          Admin
                        </button>
                      )}
                      <button
                        onClick={() => {
                          logout();
                          setShowMenu(false);
                          navigate("/");
                        }}
                        className="text-sm text-white/50 hover:text-red-400 transition-colors flex items-center gap-1.5"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        Logout
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => {
                    navigate("/login");
                    setShowMenu(false);
                  }}
                  className="w-full ua-btn-primary justify-center"
                >
                  Login / Sign Up
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
