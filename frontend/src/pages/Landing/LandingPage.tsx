import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  ArrowRight,
  Cpu,
  BarChart3,
  ChevronDown
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const featuresRef = useRef<HTMLDivElement>(null);

  const handleLaunch = () => {
    navigate('/login');
  };

  const scrollToFeatures = () => {
    featuresRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#02040d] text-slate-100 font-sans selection:bg-blue-600 selection:text-white relative scroll-smooth overflow-x-hidden">
      
      {/* Background Glow Accents */}
      <div className="absolute top-0 left-0 right-0 h-[600px] bg-gradient-to-b from-blue-950/15 via-[#02040d]/0 to-transparent pointer-events-none z-0" />
      <div className="absolute top-40 left-[10%] h-[350px] w-[350px] rounded-full bg-blue-600/5 blur-[120px] pointer-events-none z-0" />
      <div className="absolute top-80 right-[15%] h-[350px] w-[350px] rounded-full bg-teal-600/5 blur-[140px] pointer-events-none z-0" />

      {/* SVG Glowing Left Wave */}
      <svg 
        className="absolute left-0 top-[15%] w-[250px] sm:w-[380px] md:w-[500px] h-[500px] pointer-events-none z-0 opacity-60" 
        viewBox="0 0 600 500" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <path 
          d="M-50 100 C 180 80, 120 420, 380 360 C 480 340, 500 240, 600 240" 
          stroke="url(#blueGradient)" 
          strokeWidth="3.5" 
          strokeLinecap="round"
          filter="url(#glowBlue)"
        />
        <path 
          d="M-50 80 C 150 60, 100 440, 360 380 C 460 360, 480 260, 600 260" 
          stroke="url(#blueGradientLight)" 
          strokeWidth="1" 
          strokeLinecap="round"
        />
        <defs>
          <linearGradient id="blueGradient" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#1e40af" stopOpacity="0" />
            <stop offset="40%" stopColor="#2563eb" stopOpacity="0.9" />
            <stop offset="70%" stopColor="#3b82f6" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#60a5fa" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="blueGradientLight" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0" />
            <stop offset="50%" stopColor="#60a5fa" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#93c5fd" stopOpacity="0" />
          </linearGradient>
          <filter id="glowBlue" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="10" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
      </svg>

      {/* SVG Glowing Right Wave */}
      <svg 
        className="absolute right-0 top-[15%] w-[250px] sm:w-[380px] md:w-[500px] h-[500px] pointer-events-none z-0 opacity-60" 
        viewBox="0 0 600 500" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <path 
          d="M650 100 C 420 80, 480 420, 220 360 C 120 340, 100 240, 0 240" 
          stroke="url(#tealGradient)" 
          strokeWidth="3.5" 
          strokeLinecap="round"
          filter="url(#glowTeal)"
        />
        <path 
          d="M650 80 C 450 60, 500 440, 240 380 C 140 360, 120 260, 0 260" 
          stroke="url(#tealGradientLight)" 
          strokeWidth="1" 
          strokeLinecap="round"
        />
        <defs>
          <linearGradient id="tealGradient" x1="1" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#065f46" stopOpacity="0" />
            <stop offset="40%" stopColor="#0d9488" stopOpacity="0.9" />
            <stop offset="70%" stopColor="#10b981" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#34d399" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="tealGradientLight" x1="1" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0" />
            <stop offset="50%" stopColor="#34d399" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#a7f3d0" stopOpacity="0" />
          </linearGradient>
          <filter id="glowTeal" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="10" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
      </svg>

      {/* SECTION 1: HERO (Fits exactly in first fold) */}
      <section className="h-screen max-h-screen flex flex-col justify-between items-center py-10 px-6 relative z-10 text-center">
        <div className="w-1" /> {/* Flex spacer */}

        <div className="flex flex-col items-center space-y-6 md:space-y-8">
          {/* Central Logo Graphic */}
          <div className="flex flex-col items-center select-none">
            <img 
              src="/logo.png" 
              alt="Procura AI Logo" 
              className="h-36 sm:h-48 md:h-56 w-auto object-contain transition-all duration-300 hover:scale-[1.02]" 
            />
          </div>

          {/* Enterprise Pill Badge */}
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-950/30 border border-dashed border-blue-900/60 rounded-full text-blue-400 text-[10px] font-bold tracking-widest uppercase backdrop-blur-sm">
            <Cpu size={10} className="text-blue-400 animate-pulse" />
            Enterprise AI Procurement Suite
          </div>

          {/* Heading & Subtitle */}
          <div className="space-y-4 max-w-3xl">
            <h1 className="text-3xl sm:text-4xl md:text-[50px] font-black tracking-tight leading-[1.15] text-white">
              Automate Quotation Auditing <br />
              <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400 bg-clip-text text-transparent">
                with Decision Intelligence
              </span>
            </h1>

            <p className="text-xs sm:text-sm md:text-[14px] text-slate-400 leading-relaxed max-w-xl mx-auto font-normal">
              AI agents extract, analyze, and validate vendor quotations.<br />
              Ensure compliance, reduce risk, and make smarter procurement decisions.
            </p>
          </div>

          {/* Action Button */}
          <div className="pt-2">
            <button
              onClick={handleLaunch}
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-3.5 px-8 rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-blue-500/35 hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-2 mx-auto border border-blue-500/25 cursor-pointer text-xs uppercase tracking-wider"
            >
              Enter Application Workspace
              <ArrowRight size={14} />
            </button>
          </div>
        </div>

        {/* Scroll Down Indicator */}
        <button 
          onClick={scrollToFeatures}
          className="cursor-pointer flex flex-col items-center gap-1.5 text-slate-500 hover:text-blue-400 transition-colors duration-200 animate-bounce mt-4 focus:outline-none"
        >
          <span className="text-[10px] uppercase tracking-widest font-semibold">Scroll Down</span>
          <ChevronDown size={14} />
        </button>
      </section>

      {/* SECTION 2: FEATURES (Second fold) */}
      <section 
        ref={featuresRef}
        className="min-h-screen flex flex-col justify-between items-center py-20 px-6 max-w-6xl mx-auto relative z-10"
      >
        <div className="w-full flex-1 flex flex-col justify-center space-y-12">
          {/* Section title */}
          <div className="text-center space-y-3">
            <h2 className="text-2xl md:text-3xl font-black text-white">Decision Intelligence Platform</h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
              Powered by secure multi-agent systems, compliance policy engines, and cryptographic audit ledgers.
            </p>
          </div>

          {/* Features Columns */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full text-left">
            
            {/* Card 1 */}
            <div className="bg-[#050814]/60 border border-slate-900/90 hover:border-slate-800/60 p-7 rounded-2xl space-y-4 hover:bg-[#060a1d]/60 transition-all duration-300 backdrop-blur-sm shadow-xl flex flex-col justify-between">
              <div className="space-y-4">
                <div className="h-10 w-10 bg-blue-950/80 border border-blue-900/40 rounded-xl flex items-center justify-center text-blue-400 shadow-inner">
                  <Cpu size={18} />
                </div>
                <div className="space-y-1.5">
                  <h3 className="font-bold text-xs text-white tracking-wide">Intelligent OCR Parser</h3>
                  <p className="text-[11px] text-slate-400 leading-relaxed font-normal">
                    Scans quotation sheets, identifies rate matrices, and parses tax structures with 96% AI confidence.
                  </p>
                </div>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-[#050814]/60 border border-slate-900/90 hover:border-slate-800/60 p-7 rounded-2xl space-y-4 hover:bg-[#060a1d]/60 transition-all duration-300 backdrop-blur-sm shadow-xl flex flex-col justify-between">
              <div className="space-y-4">
                <div className="h-10 w-10 bg-emerald-950/80 border border-emerald-900/40 rounded-xl flex items-center justify-center text-emerald-400 shadow-inner">
                  <BarChart3 size={18} />
                </div>
                <div className="space-y-1.5">
                  <h3 className="font-bold text-xs text-white tracking-wide">Comparative Analytics</h3>
                  <p className="text-[11px] text-slate-400 leading-relaxed font-normal">
                    Side-by-side matrices ranking pricing models, delivery SLAs, and warranty support with radar graph visualizations.
                  </p>
                </div>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-[#050814]/60 border border-slate-900/90 hover:border-slate-800/60 p-7 rounded-2xl space-y-4 hover:bg-[#060a1d]/60 transition-all duration-300 backdrop-blur-sm shadow-xl flex flex-col justify-between">
              <div className="space-y-4">
                <div className="h-10 w-10 bg-purple-950/80 border border-purple-900/40 rounded-xl flex items-center justify-center text-purple-400 shadow-inner">
                  <ShieldCheck size={18} />
                </div>
                <div className="space-y-1.5">
                  <h3 className="font-bold text-xs text-white tracking-wide">Compliance Validation</h3>
                  <p className="text-[11px] text-slate-400 leading-relaxed font-normal">
                    Automated rule checking with signature-based overrides, logs justifications to cryptographic ledgers.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* FOOTER */}
        <footer className="w-full flex flex-col items-center justify-center gap-2 border-t border-slate-900/40 pt-8 mt-16">
          <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-semibold select-none">
            <ShieldCheck size={14} className="text-emerald-450" />
            Secure. Compliant. Auditable.
          </div>
          <span className="text-[11px] text-slate-500 font-normal">
            &copy; 2025 Procura. All rights reserved.
          </span>
        </footer>
      </section>

    </div>
  );
};
