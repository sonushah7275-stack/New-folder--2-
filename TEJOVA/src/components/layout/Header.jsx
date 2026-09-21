import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Menu, User, LogOut } from "lucide-react";
import { navLinks, secondaryNavLinks } from "../../data/navigation";
import { MobileMenu } from "./MobileMenu";
import { Button } from "../common/Button";
import { logoutUser } from "../../Redux/slices/authSlice";

export const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isHome = location.pathname === "/";

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    dispatch(logoutUser()).then(() => {
      navigate("/");
    });
  };

  const headerBgClass =
    isHome && !scrolled
      ? "bg-gradient-to-b from-[#0A2342]/80 via-[#0A2342]/40 to-transparent text-white"
      : "bg-[#F5F3EF]/95 backdrop-blur-md border-b border-[#B87333]/30 text-[#0A2342] shadow-xs";

  const logoColorClass = isHome && !scrolled ? "text-white" : "text-[#0A2342]";
  const taglineColorClass = isHome && !scrolled ? "text-white/80" : "text-[#B87333]";
  const navLinkColorClass =
    isHome && !scrolled
      ? "text-white/90 hover:text-[#D4AF37]"
      : "text-[#0A2342] hover:text-[#D4AF37]";

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${headerBgClass}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Left: Brand Logo & Tagline */}
            <Link
              to="/"
              className="flex flex-col items-center group focus:outline-none"
            >
              <span
                className={`font-serif text-2xl lg:text-3xl tracking-[0.15em] font-medium uppercase transition-colors duration-300 ${logoColorClass}`}
              >
                Tejova
              </span>
              <span
                className={`text-[9px] lg:text-[10px] tracking-[0.3em] font-medium uppercase -mt-1 transition-colors duration-300 ${taglineColorClass}`}
              >
                Expand Your Light
              </span>
            </Link>

            {/* Center: Primary Navigation (Desktop) */}
            <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`text-md tracking-wide transition-colors relative py-1 font-medium ${navLinkColorClass} ${
                      isActive ? "font-semibold text-[#D4AF37]" : ""
                    }`}
                  >
                    {link.name}
                    {isActive && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#D4AF37] rounded-full transition-all" />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Right Actions */}
            <div className="hidden lg:flex items-center space-x-4 lg:space-x-6">
              {secondaryNavLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-sm tracking-wider uppercase font-medium transition-colors ${navLinkColorClass}`}
                >
                  {link.name}
                </Link>
              ))}

              {isAuthenticated ? (
                <div className="flex items-center space-x-3">
                  <Link
                    to="/account"
                    className={`flex items-center space-x-1.5 text-xs uppercase tracking-wider font-semibold py-1 px-2.5 rounded-full border transition-all ${
                      isHome && !scrolled
                        ? "border-white/40 text-white hover:bg-white/10"
                        : "border-[#B87333]/40 text-[#0A2342] hover:bg-[#F5F3EF]"
                    }`}
                    title="View Account Profile"
                  >
                    <User className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span className="truncate max-w-[90px]">{user?.name?.split(" ")[0] || "Profile"}</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    title="Sign Out"
                    className={`p-1.5 rounded-full transition-colors cursor-pointer ${navLinkColorClass}`}
                  >
                    <LogOut className="w-4 h-4 text-red-400 hover:text-red-500" />
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  aria-label="User Account"
                  className={`p-2 rounded-full transition-colors ${navLinkColorClass}`}
                >
                  <User className="w-5 h-5" />
                </Link>
              )}

              <Button to="/products" variant="primary" size="sm">
                Begin Journey
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex items-center space-x-3 lg:hidden">
              <Link
                to={isAuthenticated ? "/account" : "/login"}
                aria-label="User Account"
                className={`p-1.5 transition-colors ${navLinkColorClass}`}
              >
                <User className="w-5 h-5" />
              </Link>
              <button
                onClick={() => setMobileMenuOpen(true)}
                aria-label="Open Navigation Menu"
                className={`p-2 focus:outline-none transition-colors ${navLinkColorClass}`}
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />
    </>
  );
};
