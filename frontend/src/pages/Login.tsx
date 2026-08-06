import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Shield, Eye, EyeOff, AlertCircle } from 'lucide-react';

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
  const [isDemoCredentialsVisible, setIsDemoCredentialsVisible] = useState(true);

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
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50 dark:bg-slate-950 transition-colors duration-200">
      {/* Left side: Premium Branding Column */}
      <div className="flex-1 hidden md:flex flex-col justify-between bg-primary-900 text-white p-12 relative overflow-hidden select-none border-r border-primary-950">
        {/* Subtle grid background pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:24px_24px]" />
        
        {/* Abstract vector wave background */}
        <div className="absolute -bottom-48 -left-48 w-[600px] h-[600px] rounded-full bg-primary-800/20 blur-3xl" />
        <div className="absolute -top-48 -right-48 w-[600px] h-[600px] rounded-full bg-primary-500/10 blur-3xl" />

        <div className="relative z-10 flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-white flex items-center justify-center text-primary-900 font-black text-2xl shadow-lg">
            V
          </div>
          <span className="font-bold text-2xl tracking-tight">Procura</span>
        </div>

        <div className="relative z-10 max-w-lg my-auto space-y-6">
          <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight text-white m-0 text-left">
            Enterprise Procurement Decision Intelligence
          </h1>
          <p className="text-sm lg:text-base text-primary-100/80 leading-relaxed font-normal text-left">
            Automating procurement workflows with multi-agent intelligence, policy compliance, and auditability. Achieve extreme operational efficiency with human-in-the-loop validation.
          </p>

          <div className="flex items-center gap-4 bg-primary-950/40 p-4 rounded-xl border border-primary-800/40 backdrop-blur-sm">
            <Shield className="text-primary-400 h-10 w-10 flex-shrink-0" />
            <div className="text-left">
              <h4 className="text-xs font-semibold text-white uppercase tracking-wider">
                Enterprise Ready
              </h4>
              <p className="text-xs text-primary-200/70 mt-0.5 leading-normal">
                Verifiable decision trails, real-time policy alerts, and cross-department manager flows.
              </p>
            </div>
          </div>
        </div>

        <div className="relative z-10 flex items-center justify-between text-xs text-primary-200/50">
          <span>&copy; {new Date().getFullYear()} Procura Inc. All rights reserved.</span>
          <div className="flex gap-4">
            <a href="#" className="hover:underline">Privacy Policy</a>
            <a href="#" className="hover:underline">Terms of Service</a>
          </div>
        </div>
      </div>

      {/* Right side: Login Form Column */}
      <div className="w-full md:w-[500px] flex flex-col justify-center px-6 py-12 md:px-16 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 transition-colors duration-200 shadow-2xl">
        <div className="w-full max-w-sm mx-auto space-y-8">
          <div className="space-y-2 text-left">
            {/* Mobile Logo */}
            <div className="flex items-center gap-2 md:hidden mb-6">
              <div className="h-8 w-8 rounded-lg bg-primary-600 flex items-center justify-center text-white font-extrabold text-lg">
                V
              </div>
              <span className="font-bold text-lg text-slate-800 dark:text-slate-100">Procura</span>
            </div>
            
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              Sign In
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Enter your corporate credentials to access the Procura portal.
            </p>
          </div>

          {submitError && (
            <div className="flex items-start gap-2.5 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs dark:bg-red-950/20 dark:border-red-900/30 dark:text-red-400">
              <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
              <span>{submitError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <Input
              label="Corporate Email"
              type="email"
              placeholder="e.g. sarah.jenkins@company.com"
              error={errors.email?.message}
              disabled={isSubmitting}
              {...register('email')}
            />

            <div className="space-y-1.5 text-left">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Portal Access Role
              </label>
              <select
                className="w-full text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-lg px-3 py-2.5 outline-none focus:border-primary-500 transition-colors cursor-pointer"
                disabled={isSubmitting}
                {...register('role')}
              >
                <option value="Procurement Officer">Procurement Officer (Employee Portal)</option>
                <option value="Approving Manager">Approving Manager</option>
                <option value="System Administrator">System Administrator</option>
              </select>
              {errors.role?.message && (
                <p className="text-[10px] text-red-500 font-semibold mt-0.5">
                  {errors.role.message}
                </p>
              )}
            </div>

            <div className="relative">
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                error={errors.password?.message}
                disabled={isSubmitting}
                {...register('password')}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-[34px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 cursor-pointer"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 select-none cursor-pointer">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-slate-300 dark:border-slate-700 text-primary-600 focus:ring-primary-500/20 cursor-pointer"
                  {...register('rememberMe')}
                />
                <span className="text-xs text-slate-600 dark:text-slate-400">
                  Remember this device
                </span>
              </label>

              <button
                type="button"
                onClick={() => alert('Please contact your enterprise IT administrator or procurement manager to reset your password.')}
                className="text-xs text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-semibold cursor-pointer"
              >
                Forgot Password?
              </button>
            </div>

            <Button
              type="submit"
              className="w-full text-xs font-semibold py-2.5"
              isLoading={isSubmitting}
            >
              Sign In to Procura
            </Button>
          </form>

          {isDemoCredentialsVisible && (
            <div className="p-3.5 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 text-left">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-600">
                  Demo Environment Setup
                </span>
                <button
                  onClick={() => setIsDemoCredentialsVisible(false)}
                  className="text-[10px] text-slate-400 hover:text-slate-600 dark:text-slate-600 dark:hover:text-slate-400"
                >
                  Hide
                </button>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal">
                Click below to auto-fill mock credentials for the three specialized user portals:
              </p>
              <div className="flex flex-col gap-2 mt-2.5">
                <button
                  type="button"
                  onClick={() => fillDemoCredentials('Procurement Officer')}
                  className="text-[11px] bg-slate-200/60 hover:bg-slate-200 dark:bg-slate-800/80 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold px-2.5 py-1.5 rounded transition-colors cursor-pointer text-left"
                >
                  Fill Procurement Officer (officer@procura.io)
                </button>
                <button
                  type="button"
                  onClick={() => fillDemoCredentials('Approving Manager')}
                  className="text-[11px] bg-slate-200/60 hover:bg-slate-200 dark:bg-slate-800/80 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold px-2.5 py-1.5 rounded transition-colors cursor-pointer text-left"
                >
                  Fill Approving Manager (manager@procura.io)
                </button>
                <button
                  type="button"
                  onClick={() => fillDemoCredentials('System Administrator')}
                  className="text-[11px] bg-slate-200/60 hover:bg-slate-200 dark:bg-slate-800/80 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold px-2.5 py-1.5 rounded transition-colors cursor-pointer text-left"
                >
                  Fill System Administrator (admin@procura.io)
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
