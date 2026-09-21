import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { X, User, LogOut } from "lucide-react";
import { InstagramIcon, FacebookIcon, YoutubeIcon, LinkedinIcon } from "../common/SocialIcons";
import { navLinks, secondaryNavLinks } from "../../data/navigation";
import { Button } from "../common/Button";
import { logoutUser } from "../../Redux/slices/authSlice";

export const MobileMenu = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logoutUser());
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 bg-[#0A2342] text-white flex flex-col justify-between p-5 sm:p-8 lg:hidden overflow-y-auto"
        >
          {/* Top Bar */}
          <div className="flex items-center justify-between">
            <Link to="/" onClick={onClose} className="text-left">
              <span className="font-serif text-2xl tracking-wider uppercase block">TEJOVA</span>
              <span className="text-[9px] tracking-[0.25em] text-[#B87333] uppercase block -mt-1 font-light">
                Expand Your Light
              </span>
            </Link>
            <button
              onClick={onClose}
              aria-label="Close menu"
              className="p-2 text-white/80 hover:text-[#D4AF37] transition-colors focus:outline-none"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Main Links */}
          <div className="my-auto py-6 space-y-5">
            <nav className="space-y-3 sm:space-y-4">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <motion.div
                    key={link.path}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.4 }}
                  >
                    <Link
                      to={link.path}
                      onClick={onClose}
                      className={`block font-serif text-2xl sm:text-3xl transition-colors ${
                        isActive ? "text-[#D4AF37]" : "text-white/90 hover:text-[#D4AF37]"
                      }`}
                    >
                      {link.name}
                    </Link>
                  </motion.div>
                );
              })}
            </nav>

            <hr className="border-[#B87333]/30 my-4 sm:my-6" />

            {/* Account / Secondary Links */}
            <div className="flex flex-col space-y-3 text-sm text-white/80">
              {isAuthenticated ? (
                <div className="space-y-2">
                  <Link
                    to="/account"
                    onClick={onClose}
                    className="flex items-center space-x-2 text-[#D4AF37] font-semibold hover:underline"
                  >
                    <User className="w-4 h-4" />
                    <span>My Account ({user?.name || "Client"})</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 text-red-400 hover:text-red-300 font-medium cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              ) : (
                <div className="flex space-x-6">
                  {secondaryNavLinks.map((link) => (
                    <Link
                      key={link.path}
                      to={link.path}
                      onClick={onClose}
                      className="hover:text-[#D4AF37] transition-colors"
                    >
                      {link.name}
                    </Link>
                  ))}
                  <Link
                    to="/login"
                    onClick={onClose}
                    className="hover:text-[#D4AF37] transition-colors font-medium"
                  >
                    Sign In
                  </Link>
                </div>
              )}
            </div>

            <div className="pt-3 sm:pt-4">
              <Button to="/products" variant="primary" size="lg" className="w-full text-center" onClick={onClose}>
                Begin Journey
              </Button>
            </div>
          </div>

          {/* Footer Socials */}
          <div className="pt-5 border-t border-white/10 flex items-center justify-between text-white/60 text-xs">
            <span>&copy; {new Date().getFullYear()} TEJOVA</span>
            <div className="flex space-x-4">
              <a href="#" aria-label="Instagram" className="hover:text-[#D4AF37] transition-colors">
                <InstagramIcon className="w-4 h-4" />
              </a>
              <a href="#" aria-label="Facebook" className="hover:text-[#D4AF37] transition-colors">
                <FacebookIcon className="w-4 h-4" />
              </a>
              <a href="#" aria-label="Youtube" className="hover:text-[#D4AF37] transition-colors">
                <YoutubeIcon className="w-4 h-4" />
              </a>
              <a href="#" aria-label="LinkedIn" className="hover:text-[#D4AF37] transition-colors">
                <LinkedinIcon className="w-4 h-4" />
              </a>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
