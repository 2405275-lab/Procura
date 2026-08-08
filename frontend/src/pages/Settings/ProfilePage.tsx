import React, { useState, useEffect, useRef } from 'react';
import { useToast } from '@/components/common/Toast';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import {
  User,
  Settings,
  UploadCloud,
  Trash2,
  ShieldAlert
} from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { showToast } = useToast();
  const { user, updateUserProfile } = useAuth();

  // Roles available in Procura
  const rolesList = [
    'Procurement Officer',
    'Approving Manager',
    'System Administrator'
  ] as const;

  type RoleType = typeof rolesList[number];

  // The role profile currently being configured in the settings page
  const [selectedRole, setSelectedRole] = useState<RoleType>(
    (user?.role as RoleType) || 'Procurement Officer'
  );

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [avatar, setAvatar] = useState<string | undefined>(undefined);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load profiles dictionary from localStorage and populate state fields
  useEffect(() => {
    const savedProfilesStr = localStorage.getItem('procura_role_profiles');
    const savedProfiles = savedProfilesStr ? JSON.parse(savedProfilesStr) : {};
    const roleProfile = savedProfiles[selectedRole] || {};

    // Defaults based on role type if never configured
    let defaultEmail = '';
    let defaultName = '';
    if (selectedRole === 'Procurement Officer') {
      defaultEmail = 'officer@procura.io';
      defaultName = 'Sarah Jenkins';
    } else if (selectedRole === 'Approving Manager') {
      defaultEmail = 'manager@procura.io';
      defaultName = 'Director Jenkins';
    } else {
      defaultEmail = 'admin@procura.io';
      defaultName = 'Admin Jenkins';
    }

    setName(roleProfile.name || (selectedRole === user?.role ? user.name : defaultName));
    setEmail(roleProfile.email || (selectedRole === user?.role ? user.email : defaultEmail));
    setAvatar(roleProfile.avatar || (selectedRole === user?.role ? user.avatar : undefined));
  }, [selectedRole, user]);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        showToast('Image file size must be less than 2MB.', 'error');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result as string); // Stores the Base64 representation
        showToast('Photo uploaded successfully.', 'success');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    setAvatar(undefined);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    showToast('Photo removed successfully.', 'success');
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      showToast('Name is required.', 'error');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      showToast('A valid email is required.', 'error');
      return;
    }

    // Save selected role's profile to localStorage profiles map
    const savedProfilesStr = localStorage.getItem('procura_role_profiles');
    const savedProfiles = savedProfilesStr ? JSON.parse(savedProfilesStr) : {};
    savedProfiles[selectedRole] = { name, email, avatar };
    localStorage.setItem('procura_role_profiles', JSON.stringify(savedProfiles));

    // If the configured role is the active logged-in role, update auth context in real-time
    if (selectedRole === user?.role) {
      updateUserProfile(name, email, avatar);
    }

    showToast(`Profile details for ${selectedRole} updated successfully!`, 'success');
  };

  return (
    <div className="space-y-6 text-left max-w-4xl">
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Account Settings</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Configure profile details, upload avatar photos, and manage account credentials for each user portal role.
        </p>
      </div>

      {/* Role Profile Selection Tab */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div>
          <span className="font-bold text-slate-800 dark:text-slate-200">Selected Profile Settings</span>
          <p className="text-[10px] text-slate-400 mt-0.5">Select a specialized enterprise role to configure its credentials.</p>
        </div>
        <select
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value as RoleType)}
          className="px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-800 dark:text-slate-200 font-semibold focus:outline-none cursor-pointer text-xs"
        >
          {rolesList.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        
        {/* PROFILE PHOTO CARD */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm space-y-6 text-xs flex flex-col justify-between">
          <div className="flex flex-col items-center text-center space-y-4">
            
            {/* Avatar container */}
            <div className="h-20 w-20 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-full flex items-center justify-center text-slate-450 overflow-hidden relative shadow-inner">
              {avatar ? (
                <img
                  src={avatar}
                  alt={`${selectedRole} Avatar`}
                  className="h-full w-full object-cover"
                />
              ) : (
                <User size={36} className="text-primary-500" />
              )}
            </div>

            <div>
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                {name || 'Sarah Jenkins'}
              </h3>
              <span className="text-[10px] text-slate-400 font-bold uppercase block mt-1">
                {selectedRole}
              </span>
            </div>
          </div>

          <div className="space-y-2 pt-4 border-t border-slate-100 dark:border-slate-850">
            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest block mb-2">
              Profile Photo Actions
            </span>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handlePhotoUpload}
              accept="image/*"
              className="hidden"
            />
            
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-slate-50 hover:bg-slate-100 dark:bg-slate-950 dark:hover:bg-slate-900 text-slate-700 dark:text-slate-300 font-semibold border border-slate-200 dark:border-slate-800 rounded-lg cursor-pointer transition-colors"
            >
              <UploadCloud size={14} />
              Upload New Photo
            </button>

            {avatar && (
              <button
                type="button"
                onClick={handleRemovePhoto}
                className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-red-50 hover:bg-red-100 dark:bg-red-950/20 dark:hover:bg-red-950/30 text-red-600 dark:text-red-400 font-semibold border border-red-200/40 dark:border-red-900/20 rounded-lg cursor-pointer transition-colors"
              >
                <Trash2 size={14} />
                Remove Photo
              </button>
            )}
          </div>
        </div>

        {/* PROFILE DETAILS FORM */}
        <form onSubmit={handleSaveProfile} className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm space-y-5 text-xs flex flex-col justify-between">
          <div className="space-y-5">
            <div className="flex items-center gap-1.5 border-b border-slate-100 dark:border-slate-850 pb-3.5">
              <Settings size={15} className="text-primary-500" />
              <h3 className="text-sm font-bold text-slate-850 dark:text-slate-200">
                Personal Credentials
              </h3>
            </div>

            {selectedRole === user?.role && (
              <div className="flex items-center gap-2 p-3 bg-blue-50/40 dark:bg-blue-950/10 border border-blue-200/50 dark:border-blue-900/20 rounded-xl text-blue-700 dark:text-blue-400">
                <ShieldAlert size={14} className="flex-shrink-0" />
                <span className="font-medium text-[10px] leading-tight">
                  You are currently logged into this role. Changes will take effect in real-time.
                </span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Full Display Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Sarah Jenkins"
                className="text-xs"
              />

              <Input
                label="Corporate Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. sarah.jenkins@company.com"
                className="text-xs"
              />
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-slate-800 mt-6">
            <Button type="submit" className="text-xs font-semibold py-2 px-5">
              Save Profile Changes
            </Button>
          </div>
        </form>

      </div>
    </div>
  );
};
