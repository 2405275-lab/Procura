import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import {
  Mail,
  User,
  Lock,
  ChevronDown,
  ChevronRight,
  ShieldCheck,
  BarChart3,
  Cpu,
  Eye,
  EyeOff,
  AlertCircle,
  ArrowRight
} from 'lucide-react';

const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.string().min(1, 'Role is required'),
  rememberMe: z.boolean(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      role: 'Procurement Officer',
      rememberMe: false,
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setSubmitError(null);
    try {
      await login(data.email, data.rememberMe, data.role);
      navigate('/dashboard');
    } catch (err) {
      setSubmitError('Authentication failed. Please check your credentials and try again.');
    }
  };

  const fillDemoCredentials = (role: 'Procurement Officer' | 'Approving Manager' | 'System Administrator') => {
    setValue('password', 'password123');
    if (role === 'Procurement Officer') {
      setValue('email', 'officer@procura.io');
      setValue('role', 'Procurement Officer');
    } else if (role === 'Approving Manager') {
      setValue('email', 'manager@procura.io');
      setValue('role', 'Approving Manager');
    } else {
      setValue('email', 'admin@procura.io');
      setValue('role', 'System Administrator');
    }
  };

  return (
    <div className="h-screen max-h-screen flex flex-col md:flex-row bg-[#02040d] text-slate-100 font-sans select-none overflow-hidden relative">
      
      {/* LEFT SIDE: Premium Branding Column */}
      <div className="flex-1 hidden md:flex flex-col justify-between p-10 lg:p-12 relative overflow-hidden bg-[#04081c] border-r border-slate-900/60 h-full">
        
        {/* Glowing Background Wave SVG Overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-950/20 via-[#04081c]/0 to-transparent pointer-events-none z-0" />
        <svg 
          className="absolute left-0 bottom-0 w-[500px] h-[500px] pointer-events-none z-0 opacity-40" 
          viewBox="0 0 600 600" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path 
            d="M-100 600 C 150 550, 100 200, 380 250 C 480 270, 500 150, 600 100" 
            stroke="url(#brandGradient)" 
            strokeWidth="4" 
            strokeLinecap="round"
            filter="url(#glowBrand)"
          />
          <defs>
            <linearGradient id="brandGradient" x1="0" y1="1" x2="1" y2="0">
              <stop offset="0%" stopColor="#1d4ed8" stopOpacity="0" />
              <stop offset="50%" stopColor="#3b82f6" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#0d9488" stopOpacity="0" />
            </linearGradient>
            <filter id="glowBrand" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="12" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
        </svg>

        {/* Top Branding Header */}
        <div className="flex items-center gap-3 relative z-10 select-none">
          <div className="h-8 w-8 overflow-hidden relative flex items-center justify-center rounded-lg">
            <img 
              src="/logo.png" 
              alt="Procura" 
              className="absolute max-w-none w-[68px] h-auto -top-[4px]" 
            />
          </div>
          <div className="flex flex-col text-left">
            <span className="text-sm font-black tracking-widest text-white leading-none">PROCURA</span>
            <span className="text-[7.5px] text-blue-400 font-bold tracking-widest uppercase mt-1 leading-none">
              PROCUREMENT | CONSULTING | SOLUTIONS
            </span>
          </div>
        </div>

        {/* Main Copy Area */}
        <div className="relative z-10 max-w-lg my-auto space-y-4 lg:space-y-6 text-left">
          <h1 className="text-3xl lg:text-[40px] font-black tracking-tight leading-[1.1] text-white">
            Enterprise <br />
            Procurement. <br />
            <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400 bg-clip-text text-transparent">
              Smarter Decisions.
            </span>
          </h1>

          <p className="text-[12px] lg:text-[13px] text-slate-400 leading-relaxed font-normal max-w-md">
            Procura leverages multi-agent AI to automate quotation auditing, ensure policy compliance, and deliver actionable insights—empowering your organization to reduce risk, save more, and operate with confidence.
          </p>

          {/* Horizontal Mini-Feature Grid */}
          <div className="grid grid-cols-2 gap-3.5 pt-4">
            {/* Feature 1 */}
            <div className="flex items-start gap-3 bg-[#030614]/50 border border-slate-900 p-3 rounded-xl backdrop-blur-sm">
              <div className="h-7 w-7 rounded-lg bg-blue-950/80 border border-blue-900/40 flex items-center justify-center text-blue-400 flex-shrink-0">
                <ShieldCheck size={14} />
              </div>
              <div className="space-y-0.5 text-left">
                <h4 className="text-[9px] font-bold text-white uppercase tracking-wider leading-none">Policy Compliance</h4>
                <span className="text-[8.5px] text-slate-500 leading-tight block mt-1">Built-in rules and governance controls</span>
              </div>
            </div>
            {/* Feature 2 */}
            <div className="flex items-start gap-3 bg-[#030614]/50 border border-slate-900 p-3 rounded-xl backdrop-blur-sm">
              <div className="h-7 w-7 rounded-lg bg-emerald-950/80 border border-emerald-900/40 flex items-center justify-center text-emerald-400 flex-shrink-0">
                <BarChart3 size={14} />
              </div>
              <div className="space-y-0.5 text-left">
                <h4 className="text-[9px] font-bold text-white uppercase tracking-wider leading-none">AI-Powered Insights</h4>
                <span className="text-[8.5px] text-slate-500 leading-tight block mt-1">Intelligent analysis for better decisions</span>
              </div>
            </div>
            {/* Feature 3 */}
            <div className="flex items-start gap-3 bg-[#030614]/50 border border-slate-900 p-3 rounded-xl backdrop-blur-sm">
              <div className="h-7 w-7 rounded-lg bg-purple-950/80 border border-purple-900/40 flex items-center justify-center text-purple-400 flex-shrink-0">
                <Cpu size={14} />
              </div>
              <div className="space-y-0.5 text-left">
                <h4 className="text-[9px] font-bold text-white uppercase tracking-wider leading-none">End-to-End Visibility</h4>
                <span className="text-[8.5px] text-slate-500 leading-tight block mt-1">Real-time tracking across the cycle</span>
              </div>
            </div>
            {/* Feature 4 */}
            <div className="flex items-start gap-3 bg-[#030614]/50 border border-slate-900 p-3 rounded-xl backdrop-blur-sm">
              <div className="h-7 w-7 rounded-lg bg-blue-950/80 border border-blue-900/40 flex items-center justify-center text-blue-400 flex-shrink-0">
                <span className="text-xs">🔒</span>
              </div>
              <div className="space-y-0.5 text-left">
                <h4 className="text-[9px] font-bold text-white uppercase tracking-wider leading-none">Secure & Auditable</h4>
                <span className="text-[8.5px] text-slate-500 leading-tight block mt-1">Enterprise security and audit trails</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Area */}
        <div className="relative z-10 flex items-center justify-between text-[9.5px] text-slate-550">
          <span>© 2025 Procura Inc. All rights reserved.</span>
          <div className="flex gap-4">
            <a href="#" className="hover:text-slate-400">Privacy Policy</a>
            <a href="#" className="hover:text-slate-400">Terms of Service</a>
          </div>
        </div>

      </div>

      {/* RIGHT SIDE: Interactive Login Panel */}
      <div className="w-full md:w-[500px] flex flex-col justify-center px-6 py-6 md:px-10 bg-[#04060f] relative z-10 h-full overflow-hidden">
        <div className="w-full max-w-[390px] mx-auto space-y-4 border border-slate-900/80 bg-[#060814]/40 p-6 rounded-2xl shadow-2xl backdrop-blur-sm">
          
          {/* Lock Header */}
          <div className="flex flex-col items-center text-center space-y-2">
            <div className="h-9 w-9 rounded-full border border-blue-900/40 bg-blue-950/20 flex items-center justify-center text-blue-400 shadow-inner">
              <span className="text-sm">🔒</span>
            </div>
            <div className="space-y-0.5">
              <h2 className="text-lg font-bold text-white tracking-wide leading-none">Welcome Back</h2>
              <span className="text-[11px] text-slate-400 block mt-1">Sign in to access the Procura portal.</span>
            </div>
          </div>

          {submitError && (
            <div className="flex items-start gap-2 p-2.5 rounded-lg bg-red-955/25 border border-red-900/30 text-red-400 text-[11px]">
              <AlertCircle size={14} className="flex-shrink-0 mt-0.5" />
              <span className="text-left">{submitError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5">
            
            {/* Corporate Email Field */}
            <div className="space-y-1 text-left w-full">
              <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                Corporate Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <Mail size={14} />
                </div>
                <input
                  type="email"
                  placeholder="e.g. sarah.jenkins@company.com"
                  disabled={isSubmitting}
                  {...register('email')}
                  className={`w-full text-xs pl-9 pr-3.5 py-3 bg-[#03050c]/85 border ${errors.email ? 'border-red-500' : 'border-slate-800/85'} text-white placeholder-slate-600 rounded-xl outline-none focus:border-blue-500 transition-colors duration-200`}
                />
              </div>
              {errors.email?.message && (
                <p className="text-[9px] text-red-500 font-semibold mt-0.5">{errors.email.message}</p>
              )}
            </div>

            {/* Portal Access Role Select */}
            <div className="space-y-1 text-left w-full">
              <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                Portal Access Role
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <User size={14} />
                </div>
                <select
                  disabled={isSubmitting}
                  {...register('role')}
                  className={`w-full text-xs pl-9 pr-9 py-3 bg-[#03050c]/85 border ${errors.role ? 'border-red-500' : 'border-slate-800/85'} text-white rounded-xl outline-none focus:border-blue-500 transition-colors duration-200 appearance-none cursor-pointer`}
                >
                  <option value="Procurement Officer">Select your access role</option>
                  <option value="Procurement Officer">Procurement Officer (Employee Portal)</option>
                  <option value="Approving Manager">Approving Manager (Manager Portal)</option>
                  <option value="System Administrator">System Administrator (Admin Portal)</option>
                </select>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-500">
                  <ChevronDown size={12} />
                </div>
              </div>
              {errors.role?.message && (
                <p className="text-[9px] text-red-500 font-semibold mt-0.5">{errors.role.message}</p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-1 text-left w-full">
              <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <Lock size={14} />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  disabled={isSubmitting}
                  {...register('password')}
                  className={`w-full text-xs pl-9 pr-9 py-3 bg-[#03050c]/85 border ${errors.password ? 'border-red-500' : 'border-slate-800/85'} text-white placeholder-slate-600 rounded-xl outline-none focus:border-blue-500 transition-colors duration-200`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 cursor-pointer focus:outline-none"
                >
                  {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
              {errors.password?.message && (
                <p className="text-[9px] text-red-500 font-semibold mt-0.5">{errors.password.message}</p>
              )}
            </div>

            {/* Remember & Forgot Row */}
            <div className="flex items-center justify-between pt-0.5 select-none">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-slate-800 bg-[#03050c] text-blue-600 focus:ring-blue-500/20 cursor-pointer"
                  {...register('rememberMe')}
                />
                <span className="text-[11px] text-slate-450">Remember this device</span>
              </label>

              <button
                type="button"
                onClick={() => alert('Please contact your enterprise IT administrator to reset your password.')}
                className="text-[11px] text-blue-400 hover:text-blue-300 font-semibold cursor-pointer focus:outline-none"
              >
                Forgot Password?
              </button>
            </div>

            {/* Submit Button */}
            <div className="pt-1">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-6 rounded-xl shadow-lg shadow-blue-500/15 hover:shadow-blue-500/25 transition-all duration-200 flex items-center justify-center gap-1.5 border border-blue-500/20 cursor-pointer text-[11px] uppercase tracking-wider"
              >
                {isSubmitting ? 'Signing In...' : 'Sign In to Procura'}
                <ArrowRight size={12} />
              </button>
            </div>

          </form>

          {/* OR Divider */}
          <div className="flex items-center justify-center gap-2 pt-1 text-[9px] font-bold text-slate-650 uppercase tracking-widest">
            <div className="h-px bg-slate-900/60 flex-1" />
            <span>or</span>
            <div className="h-px bg-slate-900/60 flex-1" />
          </div>

          {/* Try Demo Portals */}
          <div className="space-y-2.5 text-left">
            <div className="space-y-0.5">
              <h4 className="text-[9.5px] font-black text-blue-450 uppercase tracking-widest">
                Try the Demo Portals
              </h4>
              <p className="text-[9.5px] text-slate-500">
                Explore Procura with pre-configured demo accounts.
              </p>
            </div>

            {/* Demo buttons list */}
            <div className="flex flex-col gap-2">
              
              {/* Tile 1 */}
              <button
                type="button"
                onClick={() => fillDemoCredentials('Procurement Officer')}
                className="w-full bg-[#050713]/60 border border-slate-900 hover:border-slate-800 hover:bg-[#070b1e]/60 transition-all rounded-xl p-2.5 flex items-center justify-between text-left cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="h-7 w-7 rounded-lg bg-emerald-950/80 border border-emerald-900/40 flex items-center justify-center text-emerald-400 flex-shrink-0">
                    <User size={13} />
                  </div>
                  <div className="space-y-0.5">
                    <h4 className="text-[11px] font-bold text-white leading-none">Procurement Officer (Employee Portal)</h4>
                    <span className="text-[9.5px] text-slate-500 group-hover:text-slate-400 leading-none block">officer@procura.io</span>
                  </div>
                </div>
                <ChevronRight size={13} className="text-slate-700 group-hover:text-slate-400 transition-colors" />
              </button>

              {/* Tile 2 */}
              <button
                type="button"
                onClick={() => fillDemoCredentials('Approving Manager')}
                className="w-full bg-[#050713]/60 border border-slate-900 hover:border-slate-800 hover:bg-[#070b1e]/60 transition-all rounded-xl p-2.5 flex items-center justify-between text-left cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="h-7 w-7 rounded-lg bg-blue-950/80 border border-blue-900/40 flex items-center justify-center text-blue-400 flex-shrink-0">
                    <User size={13} />
                  </div>
                  <div className="space-y-0.5">
                    <h4 className="text-[11px] font-bold text-white leading-none">Approving Manager (Manager Portal)</h4>
                    <span className="text-[9.5px] text-slate-500 group-hover:text-slate-400 leading-none block">manager@procura.io</span>
                  </div>
                </div>
                <ChevronRight size={13} className="text-slate-700 group-hover:text-slate-400 transition-colors" />
              </button>

              {/* Tile 3 */}
              <button
                type="button"
                onClick={() => fillDemoCredentials('System Administrator')}
                className="w-full bg-[#050713]/60 border border-slate-900 hover:border-slate-800 hover:bg-[#070b1e]/60 transition-all rounded-xl p-2.5 flex items-center justify-between text-left cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="h-7 w-7 rounded-lg bg-purple-950/80 border border-purple-900/40 flex items-center justify-center text-purple-400 flex-shrink-0">
                    <Cpu size={13} />
                  </div>
                  <div className="space-y-0.5">
                    <h4 className="text-[11px] font-bold text-white leading-none">System Administrator (Admin Portal)</h4>
                    <span className="text-[9.5px] text-slate-500 group-hover:text-slate-400 leading-none block">admin@procura.io</span>
                  </div>
                </div>
                <ChevronRight size={13} className="text-slate-700 group-hover:text-slate-400 transition-colors" />
              </button>

            </div>

            {/* Bottom check shield status */}
            <div className="flex items-center justify-center gap-1.5 text-emerald-450 text-[9.5px] font-semibold select-none pt-1">
              <ShieldCheck size={11} className="text-emerald-450" />
              Secure • Compliant • Auditable
            </div>

          </div>

        </div>
      </div>

    </div>
  );
};
