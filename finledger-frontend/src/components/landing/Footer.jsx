import React from 'react';
import { Link2, Github, Mail, Phone, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-[#0a0f1e] pt-16 pb-8 border-t border-slate-800">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-16">

          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30">
                <Link2 className="text-indigo-500" size={20} />
              </div>
              <span className="text-xl font-bold text-white tracking-wide">FinLedger <span className="text-indigo-500">AI</span></span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed mb-4">
              A Blockchain-Enabled Organizational Finance Monitor
            </p>
            <p className="text-slate-500 text-xs font-semibold">
              Built as Final Year Project
            </p>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4">Product</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><a href="#features" className="hover:text-indigo-400 transition-colors">Features</a></li>
              <li><a href="#how-it-works" className="hover:text-indigo-400 transition-colors">How it Works</a></li>
              <li><a href="#blockchain" className="hover:text-indigo-400 transition-colors">Blockchain Security</a></li>
              <li><a href="#ai" className="hover:text-indigo-400 transition-colors">AI Insights</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4">Account</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><Link to="/login" className="hover:text-indigo-400 transition-colors">Login</Link></li>
              <li><Link to="/register" className="hover:text-indigo-400 transition-colors">Register</Link></li>
              <li><Link to="/dashboard" className="hover:text-indigo-400 transition-colors">Dashboard</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4">Developer Contact</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li className="font-semibold text-white">Hamza Madni</li>
              <li>
                <a href="mailto:madnih474@gmail.com" className="flex items-center gap-2 hover:text-indigo-400 transition-colors">
                  <Mail size={16} /> madnih474@gmail.com
                </a>
              </li>
              <li>
                <a href="tel:03252500064" className="flex items-center gap-2 hover:text-indigo-400 transition-colors">
                  <Phone size={16} /> 03252500064
                </a>
              </li>
              <li className="flex items-center gap-2">
                <MapPin size={16} /> Pakpattan, Punjab, Pakistan
              </li>
              <li>
                <a href="https://github.com/hamza-474/hamzamadni_" target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-indigo-400 transition-colors">
                  <Github size={16} /> GitHub Profile
                </a>
              </li>
            </ul>
          </div>

        </div>

        <div className="pt-8 border-t border-slate-800 text-center">
          <p className="text-slate-500 text-sm">
            &copy; 2024 FinLedger AI &mdash; Developed by Hamza Madni | Final Year Project | MERN Stack
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;