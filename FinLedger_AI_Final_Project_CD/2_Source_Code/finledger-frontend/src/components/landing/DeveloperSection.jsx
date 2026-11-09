import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Github } from 'lucide-react';

const TeamSection = () => {
  return (
    <section id="team" className="py-24 bg-[#0f172a]">
      <div className="container mx-auto px-6 md:px-12">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4">Meet the Developer</h2>
          <p className="text-xl text-gray-400 font-medium">Final Year Project — Computer Science</p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          whileHover={{ y: -5 }}
          className="max-w-[400px] mx-auto bg-[#1e293b] rounded-3xl p-8 border border-accent shadow-[0_0_40px_rgba(99,102,241,0.15)] relative mt-12"
        >
          {/* Avatar */}
          <div className="absolute -top-12 left-1/2 -translate-x-1/2">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500 to-cyan-400 p-1 shadow-[0_0_20px_rgba(99,102,241,0.5)]">
              <div className="w-full h-full rounded-full bg-[#1e293b] flex items-center justify-center">
                <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-br from-indigo-400 to-cyan-400">HM</span>
              </div>
            </div>
          </div>

          <div className="text-center pt-14 pb-6 border-b border-dark-border">
            <h3 className="text-2xl font-black text-white mb-2">Hamza Madni</h3>
            <span className="inline-block px-4 py-1.5 bg-accent/20 text-accent text-xs font-bold uppercase tracking-wider rounded-full border border-accent/30">
              Full Stack Developer
            </span>
          </div>

          <div className="py-6 space-y-4">
            <a href="mailto:madnih474@gmail.com" className="flex items-center gap-4 text-gray-300 hover:text-white transition-colors group">
              <div className="w-10 h-10 rounded-lg bg-[#0f172a] flex items-center justify-center group-hover:bg-accent/20 group-hover:text-accent transition-colors border border-dark-border">
                <Mail size={18} />
              </div>
              <span className="font-medium text-sm">madnih474@gmail.com</span>
            </a>
            <a href="mailto:madnih474@hotmail.com" className="flex items-center gap-4 text-gray-300 hover:text-white transition-colors group">
              <div className="w-10 h-10 rounded-lg bg-[#0f172a] flex items-center justify-center group-hover:bg-accent/20 group-hover:text-accent transition-colors border border-dark-border">
                <Mail size={18} />
              </div>
              <span className="font-medium text-sm">madnih474@hotmail.com</span>
            </a>
            <a href="tel:03252500064" className="flex items-center gap-4 text-gray-300 hover:text-white transition-colors group">
              <div className="w-10 h-10 rounded-lg bg-[#0f172a] flex items-center justify-center group-hover:bg-emerald-500/20 group-hover:text-emerald-400 transition-colors border border-dark-border">
                <Phone size={18} />
              </div>
              <span className="font-medium text-sm">03252500064</span>
            </a>
            <div className="flex items-center gap-4 text-gray-300">
              <div className="w-10 h-10 shrink-0 rounded-lg bg-[#0f172a] flex items-center justify-center border border-dark-border">
                <MapPin size={18} />
              </div>
              <span className="font-medium text-sm leading-snug">Hashmi House Block C, Al-Fareed Garden, Pakpattan 57400</span>
            </div>
            <a href="https://github.com/hamza-474/hamzamadni_" target="_blank" rel="noreferrer" className="flex items-center gap-4 text-gray-300 hover:text-white transition-colors group">
              <div className="w-10 h-10 rounded-lg bg-[#0f172a] flex items-center justify-center group-hover:bg-white/10 transition-colors border border-dark-border">
                <Github size={18} />
              </div>
              <span className="font-medium text-sm">hamza-474</span>
            </a>
          </div>

          <a href="mailto:madnih474@gmail.com" className="w-full btn-accent flex items-center justify-center py-3 font-bold shadow-lg">
            Get In Touch
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default TeamSection;