import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ArrowRight, Check, Mail, MapPin, Clock } from "lucide-react";
import { InstagramIcon, FacebookIcon, YoutubeIcon, LinkedinIcon } from "../common/SocialIcons";
import { footerColumns } from "../../data/navigation";
import { subscribeNewsletter, clearNewsletterStatus } from "../../Redux/slices/newsletterSlice";
import { fetchPublicSettings } from "../../Redux/slices/settingsSlice";

export const Footer = () => {
  const dispatch = useDispatch();
  const { loading: newsletterLoading, successMessage, error: newsletterError } = useSelector((state) => state.newsletter);
  const { publicSettings } = useSelector((state) => state.settings);

  const [email, setEmail] = useState("");

  useEffect(() => {
    dispatch(fetchPublicSettings());
  }, [dispatch]);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim() && !newsletterLoading) {
      dispatch(subscribeNewsletter(email.trim()));
      setEmail("");
    }
  };

  useEffect(() => {
    if (successMessage || newsletterError) {
      const timer = setTimeout(() => {
        dispatch(clearNewsletterStatus());
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, newsletterError, dispatch]);

  const brandName = publicSettings?.siteName || "TEJOVA VERIFIED";
  const tagline = publicSettings?.tagline || "Expand Your Light";
  
  // Official emails per client mandate
  const conciergeEmail =
    publicSettings?.conciergeEmail ||
    (publicSettings?.supportEmail && publicSettings.supportEmail !== "care@tejova.com"
      ? publicSettings.supportEmail
      : "concierge@tejova.com");
  const careEmail = publicSettings?.careEmail || "care@tejova.com";

  const address =
    publicSettings?.address ||
    "C-148, Ramana Maroti Nagar, Nagpur, Maharashtra - 440024, India";
  const hours = publicSettings?.businessHours?.mondayToFriday
    ? `Mon – Fri: ${publicSettings.businessHours.mondayToFriday}`
    : "Mon – Fri: 9:00 AM – 6:00 PM IST";

  const social = publicSettings?.socialLinks || {};

  return (
    <footer className="bg-[#0A2342] text-[#FAF9F6] pt-16 pb-12 border-t border-[#B87333]/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Section: Newsletter Banner */}
        <div className="pb-16 border-b border-[#B87333]/30 max-w-3xl mx-auto text-center">
          <span className="font-serif text-3xl sm:text-4xl text-[#FAF9F6] block mb-3">
            {tagline}
          </span>
          <p className="text-sm sm:text-base text-[#D4AF37] font-light mb-8 max-w-lg mx-auto leading-relaxed">
            Stay connected for evidence-based metabolic protocols, biological sovereignty insights, and restorative living guidance from TEJOVA.
          </p>

          <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              required
              className="w-full px-4 py-3 bg-white/10 border border-[#B87333]/40 text-[#FAF9F6] placeholder:text-[#FAF9F6]/50 text-sm focus:outline-none focus:border-[#D4AF37] transition-colors rounded-xs"
            />
            <button
              type="submit"
              disabled={newsletterLoading}
              className="w-full sm:w-auto px-6 py-3 bg-[#D4AF37] text-[#0A2342] font-medium text-sm hover:bg-[#B87333] hover:text-[#0A2342] transition-colors flex items-center justify-center gap-2 rounded-xs whitespace-nowrap cursor-pointer disabled:opacity-50"
            >
              {successMessage ? (
                <>
                  <Check className="w-4 h-4 text-[#0A2342]" /> Subscribed
                </>
              ) : (
                <>
                  {newsletterLoading ? "Subscribing..." : "Subscribe"} <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {newsletterError && (
            <p className="text-xs text-red-400 mt-2 font-medium">⚠️ {newsletterError}</p>
          )}

          {successMessage && (
            <p className="text-xs text-emerald-400 mt-2 font-medium">✨ {successMessage}</p>
          )}
        </div>

        {/* Middle Section: Brand, Navigation & Contact */}
        <div className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Brand Col */}
          <div className="lg:col-span-4 space-y-4">
            <Link to="/" className="inline-block focus:outline-none">
              <span className="font-serif text-3xl tracking-widest uppercase block text-[#FAF9F6]">
                {brandName}
              </span>
              <span className="text-xs tracking-[0.25em] text-[#B87333] uppercase block font-light -mt-1">
                {tagline}
              </span>
            </Link>
            <p className="text-sm text-[#FAF9F6]/80 font-light leading-relaxed max-w-sm pt-2">
              TEJOVA is a sovereign performance lifestyle platform dedicated to engineering your ultimate state of being. We unite ancient restorative naturopathy and modern biological science to support enduring vitality.
            </p>
          </div>

          {/* Navigation Columns */}
          <div className="lg:col-span-4 grid grid-cols-2 gap-6 sm:gap-8">
            {footerColumns.map((col) => (
              <div key={col.title} className="space-y-4">
                <h4 className="text-xs uppercase tracking-widest font-semibold text-[#B87333]">
                  {col.title}
                </h4>
                <ul className="space-y-2.5">
                  {col.links.map((link) => (
                    <li key={link.name}>
                      <Link
                        to={link.path}
                        className="text-sm text-[#FAF9F6]/80 hover:text-[#D4AF37] transition-colors inline-block"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Contact Col */}
          <div className="lg:col-span-4 space-y-4">
            <h4 className="text-xs uppercase tracking-widest font-semibold text-[#B87333]">
              Client Care & Concierge
            </h4>
            <ul className="space-y-3 text-sm text-[#FAF9F6]/80 font-light">
              <li className="flex items-start space-x-2.5">
                <Mail className="w-4 h-4 text-[#B87333] shrink-0 mt-1" />
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-[#D4AF37] block font-semibold">
                    Concierge & Advisory
                  </span>
                  <a href={`mailto:${conciergeEmail}`} className="hover:text-[#D4AF37] transition-colors">
                    {conciergeEmail}
                  </a>
                </div>
              </li>
              <li className="flex items-start space-x-2.5">
                <Mail className="w-4 h-4 text-[#B87333] shrink-0 mt-1" />
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-[#D4AF37] block font-semibold">
                    Client Care & Operations
                  </span>
                  <a href={`mailto:${careEmail}`} className="hover:text-[#D4AF37] transition-colors">
                    {careEmail}
                  </a>
                </div>
              </li>
              <li className="flex items-start space-x-2.5">
                <MapPin className="w-4 h-4 text-[#B87333] shrink-0 mt-1" />
                <span className="leading-relaxed">{address}</span>
              </li>
              <li className="flex items-start space-x-2.5">
                <Clock className="w-4 h-4 text-[#B87333] shrink-0 mt-1" />
                <span>{hours}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section: Copyright & Confirmed Social Links */}
        <div className="pt-8 border-t border-[#B87333]/30 flex flex-col sm:flex-row items-center justify-between text-sm text-[#FAF9F6]/60 space-y-4 sm:space-y-0">
          <div>
            &copy; {new Date().getFullYear()} {brandName}. All rights reserved.
          </div>

          <div className="flex items-center space-x-6">
            {social.instagram && (
              <a
                href={social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="text-[#FAF9F6]/70 hover:text-[#D4AF37] transition-colors"
              >
                <InstagramIcon className="w-4 h-4" />
              </a>
            )}
            {social.facebook && (
              <a
                href={social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="text-[#FAF9F6]/70 hover:text-[#D4AF37] transition-colors"
              >
                <FacebookIcon className="w-4 h-4" />
              </a>
            )}
            {social.youtube && (
              <a
                href={social.youtube}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="text-[#FAF9F6]/70 hover:text-[#D4AF37] transition-colors"
              >
                <YoutubeIcon className="w-4 h-4" />
              </a>
            )}
            {social.linkedin && (
              <a
                href={social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="text-[#FAF9F6]/70 hover:text-[#D4AF37] transition-colors"
              >
                <LinkedinIcon className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};
