import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import {
  BrainCircuit,
  ShieldCheck,
  ArrowRight,
  Cpu,
  Sparkles,
  GitCompare
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const handleLaunch = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-between font-sans overflow-x-hidden selection:bg-primary-650 selection:text-white">
      
      {/* Dynamic Background Glows */}
      <div className="absolute top-0 left-0 right-0 h-[600px] bg-gradient-to-b from-primary-950/20 via-slate-900/10 to-transparent pointer-events-none z-0" />
      <div className="absolute top-40 left-[10%] h-[300px] w-[300px] rounded-full bg-primary-600/10 blur-[120px] pointer-events-none z-0" />
      <div className="absolute top-80 right-[15%] h-[350px] w-[350px] rounded-full bg-emerald-600/5 blur-[140px] pointer-events-none z-0" />

      {/* HEADER NAV */}
      <header className="w-full max-w-7xl mx-auto px-6 py-4 flex justify-between items-center z-15 border-b border-slate-800/60 backdrop-blur bg-slate-900/30">
        <div className="flex items-center gap-2 select-none">
          <div className="h-9 w-9 bg-primary-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary-600/30">
            <BrainCircuit size={18} />
          </div>
          <span className="text-md font-black tracking-wider bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
            PROCURA
          </span>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={handleLaunch}
            className="text-xs font-bold text-slate-350 hover:text-white transition-colors cursor-pointer"
          >
            Access Portal
          </button>
          <Button
            size="sm"
            onClick={handleLaunch}
            className="text-xs font-semibold px-4 py-1.5 shadow-lg shadow-primary-600/15 gap-1 cursor-pointer"
          >
            Request Demo
            <ArrowRight size={13} />
          </Button>
        </div>
      </header>

      {/* HERO SECTION */}
      <main className="flex-1 w-full max-w-5xl mx-auto px-6 pt-16 pb-24 z-10 text-center space-y-16">
        
        <div className="space-y-6 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary-950/40 border border-primary-800/40 rounded-full text-primary-400 text-[10px] font-bold tracking-widest uppercase animate-pulse">
            <Sparkles size={11} /> Enterprise AI Procurement Suite
          </div>

          <h1 className="text-4xl sm:text-5xl font-black tracking-tight leading-none text-white">
            Automate Quotation Auditing with{' '}
            <span className="bg-gradient-to-r from-primary-400 to-emerald-400 bg-clip-text text-transparent">
              Decision Intelligence
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-400 leading-relaxed max-w-2xl mx-auto font-normal">
            Procura simplifies the B2B procurement lifecycle. AI agents extract quotation fields, validate company guidelines, rank suppliers, and maintain immutable audit timelines.
          </p>

          <div className="pt-4 flex justify-center gap-4">
            <Button
              onClick={handleLaunch}
              className="text-xs font-bold py-2.5 px-6 shadow-xl shadow-primary-600/20 gap-1.5 cursor-pointer"
            >
              Enter Application Workspace
              <ArrowRight size={14} />
            </Button>
          </div>
        </div>

        {/* FEATURE LAYOUT GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 text-left">
          
          <div className="bg-slate-850/40 border border-slate-800/70 p-6 rounded-2xl space-y-4 hover:border-slate-700/60 transition-all backdrop-blur-sm select-none relative group">
            <div className="h-9 w-9 bg-primary-950 border border-primary-800/60 rounded-xl flex items-center justify-center text-primary-450 shadow-inner">
              <Cpu size={16} />
            </div>
            <div className="space-y-1.5">
              <h3 className="font-bold text-xs text-white">Intelligent OCR Parser</h3>
              <p className="text-[11px] text-slate-400 leading-relaxed font-normal">
                Scans quotation sheets, identifies rate matrices, and parses tax structures with 96% AI confidence.
              </p>
            </div>
          </div>

          <div className="bg-slate-850/40 border border-slate-800/70 p-6 rounded-2xl space-y-4 hover:border-slate-700/60 transition-all backdrop-blur-sm select-none relative group">
            <div className="h-9 w-9 bg-emerald-950 border border-emerald-900/60 rounded-xl flex items-center justify-center text-emerald-400 shadow-inner">
              <GitCompare size={16} />
            </div>
            <div className="space-y-1.5">
              <h3 className="font-bold text-xs text-white">Comparative Analytics</h3>
              <p className="text-[11px] text-slate-400 leading-relaxed font-normal">
                Side-by-side matrices ranking pricing models, delivery SLAs, and warranty support with radar graph visualizations.
              </p>
            </div>
          </div>

          <div className="bg-slate-850/40 border border-slate-800/70 p-6 rounded-2xl space-y-4 hover:border-slate-700/60 transition-all backdrop-blur-sm select-none relative group">
            <div className="h-9 w-9 bg-purple-950 border border-purple-900/60 rounded-xl flex items-center justify-center text-purple-405 shadow-inner">
              <ShieldCheck size={16} />
            </div>
            <div className="space-y-1.5">
              <h3 className="font-bold text-xs text-white">Compliance Validation</h3>
              <p className="text-[11px] text-slate-400 leading-relaxed font-normal">
                Automated rule checking with signature-based overrides, logs justifications directly to cryptographic ledgers.
              </p>
            </div>
          </div>

        </div>

      </main>

      {/* FOOTER */}
      <footer className="w-full max-w-7xl mx-auto px-6 py-6 border-t border-slate-800/50 flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] text-slate-500 z-10">
        <span>© 2026 Procura Technologies Inc. All rights reserved.</span>
        <div className="flex gap-4">
          <a href="#" className="hover:text-slate-350">Privacy Policy</a>
          <a href="#" className="hover:text-slate-350">Terms of Use</a>
          <a href="#" className="hover:text-slate-350">Integrations Support</a>
        </div>
      </footer>

    </div>
  );
};
