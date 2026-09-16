import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check } from 'lucide-react';
import { InstagramIcon, FacebookIcon, YoutubeIcon, LinkedinIcon } from '../common/SocialIcons';
import { footerColumns } from '../../data/navigation';

export const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 4000);
    }
  };

  return (
    <footer className="bg-[#1F4D3B] text-white pt-16 pb-12 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Section: Newsletter Banner */}
        <div className="pb-16 border-b border-white/15 max-w-3xl mx-auto text-center">
          <span className="font-serif text-3xl sm:text-4xl text-white block mb-3">
            Expand Your Light
          </span>
          <p className="text-sm sm:text-base text-[#A7B99F] font-light mb-8 max-w-lg mx-auto">
            Stay connected for insights, inspiration and the latest organic botanical releases from TEJOVA.
          </p>

          <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              required
              className="w-full px-4 py-3 bg-white/10 border border-white/20 text-white placeholder:text-white/50 text-sm focus:outline-none focus:border-white transition-colors rounded-xs"
            />
            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-3 bg-white text-[#1F4D3B] font-medium text-sm hover:bg-[#F7F3E9] transition-colors flex items-center justify-center gap-2 rounded-xs whitespace-nowrap"
            >
              {subscribed ? (
                <>
                  <Check className="w-4 h-4 text-[#1F4D3B]" /> Subscribed
                </>
              ) : (
                <>
                  Subscribe <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Middle Section: Links & Brand Story */}
        <div className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="inline-block">
              <span className="font-serif text-3xl tracking-widest uppercase block text-white">TEJOVA</span>
              <span className="text-xs tracking-[0.25em] text-[#A7B99F] uppercase block font-light">
                Expand Your Light
              </span>
            </Link>
            <p className="text-sm text-white/70 font-light leading-relaxed max-w-sm pt-2">
              TEJOVA is a premium wellness brand dedicated to helping you live with greater awareness, natural vitality and purpose. We bring together ancient botanical wisdom and modern living to support your journey toward lasting wellbeing.
            </p>
          </div>

          {/* Navigation Columns */}
          {footerColumns.map((col) => (
            <div key={col.title} className="space-y-4">
              <h4 className="text-xs uppercase tracking-widest font-semibold text-[#A7B99F]">
                {col.title}
              </h4>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.path}
                      className="text-sm text-white/70 hover:text-white transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

        </div>

        {/* Bottom Section: Copyright & Socials */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs text-white/50 space-y-4 sm:space-y-0">
          <div>
            &copy; {new Date().getFullYear()} TEJOVA. All rights reserved.
          </div>

          <div className="flex items-center space-x-6">
            <a href="#" aria-label="Instagram" className="hover:text-white transition-colors">
              <InstagramIcon className="w-4 h-4" />
            </a>
            <a href="#" aria-label="Facebook" className="hover:text-white transition-colors">
              <FacebookIcon className="w-4 h-4" />
            </a>
            <a href="#" aria-label="Youtube" className="hover:text-white transition-colors">
              <YoutubeIcon className="w-4 h-4" />
            </a>
            <a href="#" aria-label="LinkedIn" className="hover:text-white transition-colors">
              <LinkedinIcon className="w-4 h-4" />
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
};
