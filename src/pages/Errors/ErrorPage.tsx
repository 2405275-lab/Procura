import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import {
  Lock,
  Compass,
  AlertOctagon,
  Wrench,
  ArrowLeft,
  Home
} from 'lucide-react';
import { cn } from '@/utils/cn';

interface ErrorPageProps {
  code?: '403' | '404' | '500' | 'maintenance' | 'unauthorized';
}

export const ErrorPage: React.FC<ErrorPageProps> = ({ code = '404' }) => {
  const navigate = useNavigate();

  const getErrorContent = () => {
    switch (code) {
      case '403':
        return {
          title: 'Access Restricted (403)',
          desc: 'You do not have the required role privileges to access this administrative workspace folder.',
          icon: Lock,
          color: 'text-red-500 bg-red-50 dark:bg-red-950/20'
        };
      case '500':
        return {
          title: 'Internal Server Error (500)',
          desc: 'Our servers encountered an unexpected exception state. Automated logs have been dispatched to developers.',
          icon: AlertOctagon,
          color: 'text-amber-500 bg-amber-50 dark:bg-amber-950/20'
        };
      case 'maintenance':
        return {
          title: 'Scheduled Node Maintenance',
          desc: 'Veridion database instances are currently upgrading. Service allocations will resume shortly.',
          icon: Wrench,
          color: 'text-blue-500 bg-blue-50 dark:bg-blue-950/20'
        };
      case 'unauthorized':
        return {
          title: 'Credentials Required',
          desc: 'Your token session has expired or is invalid. Please sign-in again to authorize sessions.',
          icon: Lock,
          color: 'text-purple-500 bg-purple-50 dark:bg-purple-950/20'
        };
      case '404':
      default:
        return {
          title: 'Page Not Found (404)',
          desc: 'The link URL does not exist or has been relocated to another workspace folder.',
          icon: Compass,
          color: 'text-slate-500 bg-slate-50 dark:bg-slate-800'
        };
    }
  };

  const content = getErrorContent();
  const IconComponent = content.icon;

  return (
    <div className="min-h-[500px] flex items-center justify-center p-6 text-center select-none font-sans">
      <div className="max-w-md space-y-6">
        
        {/* Large visual illustration card */}
        <div className="flex flex-col items-center space-y-4">
          <div className={cn('h-16 w-16 rounded-2xl flex items-center justify-center shadow-inner border border-slate-200/20', content.color)}>
            <IconComponent size={32} />
          </div>
          <h1 className="text-xl font-black text-slate-850 dark:text-slate-100">
            {content.title}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-normal">
            {content.desc}
          </p>
        </div>

        {/* Redirect controls */}
        <div className="flex items-center justify-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(-1)}
            className="text-xs font-semibold gap-1.5 py-1.5 cursor-pointer"
          >
            <ArrowLeft size={13} />
            Go Back
          </Button>
          <Button
            size="sm"
            onClick={() => navigate('/dashboard')}
            className="text-xs font-semibold gap-1.5 py-1.5 cursor-pointer"
          >
            <Home size={13} />
            Dashboard Home
          </Button>
        </div>

      </div>
    </div>
  );
};
