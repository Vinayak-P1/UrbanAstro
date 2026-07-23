import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t border-white/[0.06] mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand Column */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg bg-[#7C3AED] flex items-center justify-center">
                <span
                  className="text-white text-sm font-bold"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                >
                  U
                </span>
              </div>
              <span
                className="text-white font-bold"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                UrbanAstro
              </span>
            </div>
            <p className="text-white/40 text-sm leading-relaxed max-w-xs">
              The premium platform for personalized astrology — built for people
              who take both self-understanding and modern design seriously.
            </p>
            <div className="flex items-center gap-1.5 mt-6">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span className="text-white/40 text-xs">
                All systems operational
              </span>
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-white/60 text-xs font-semibold uppercase tracking-widest mb-4">
              Product
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/astrologers"
                  className="text-white/40 hover:text-white/70 text-sm transition-colors"
                >
                  Astrologers
                </Link>
              </li>
              <li>
                <Link
                  to="/askai"
                  className="text-white/40 hover:text-white/70 text-sm transition-colors"
                >
                  Ask AI
                </Link>
              </li>
              <li>
                <Link
                  to="/my-bookings"
                  className="text-white/40 hover:text-white/70 text-sm transition-colors"
                >
                  My Bookings
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-white/60 text-xs font-semibold uppercase tracking-widest mb-4">
              Company
            </h4>
            <ul className="space-y-3">
              <li>
                <span className="text-white/40 text-sm">About</span>
              </li>
              <li>
                <span className="text-white/40 text-sm">Careers</span>
              </li>
              <li>
                <span className="text-white/40 text-sm">Contact</span>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-white/60 text-xs font-semibold uppercase tracking-widest mb-4">
              Support
            </h4>
            <ul className="space-y-3">
              <li>
                <span className="text-white/40 text-sm">Help Center</span>
              </li>
              <li>
                <span className="text-white/40 text-sm">Privacy Policy</span>
              </li>
              <li>
                <span className="text-white/40 text-sm">Terms of Service</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/[0.06] mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/30 text-xs">
            © 2026 UrbanAstro. All rights reserved.
          </p>
          <p className="text-white/30 text-xs">
            Made with{" "}
            <span className="text-[#7C3AED]">♥</span> in Bengaluru.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;