import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/utils/cn';
import {
  LayoutDashboard,
  FileText,
  UploadCloud,
  GitCompare,
  ShieldCheck,
  CheckSquare,
  ShoppingBag,
  History,
  Settings,
  ChevronLeft,
  ChevronRight,
  Search,
  Bell,
  LogOut,
  Menu,
  X,
  BarChart3,
  Cpu,
  User,
  BookOpen
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

interface SidebarItem {
  name: string;
  path: string;
  icon: React.ComponentType<any>;
}

const SIDEBAR_ITEMS: SidebarItem[] = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Purchase Requests', path: '/purchase-requests', icon: FileText },
  { name: 'Upload Quotations', path: '/upload-quotations', icon: UploadCloud },
  { name: 'Vendor Comparison', path: '/vendor-comparison', icon: GitCompare },
  { name: 'Policy Validation', path: '/policy-validation', icon: ShieldCheck },
  { name: 'Approvals', path: '/approvals', icon: CheckSquare },
  { name: 'Procurement Analytics', path: '/analytics', icon: BarChart3 },
  { name: 'Explainability', path: '/explainability', icon: Cpu },
  { name: 'Purchase Orders', path: '/purchase-orders', icon: ShoppingBag },
  { name: 'Audit Trail', path: '/audit-trail', icon: History },
  { name: 'Settings', path: '/settings', icon: Settings },
];

// Mock Notifications
const MOCK_NOTIFICATIONS = [
  { id: 1, title: 'New Quotation Uploaded', description: 'Vendor Quotation #QT-9043 was uploaded.', time: '2 mins ago', read: false, link: '/upload-quotations' },
  { id: 2, title: 'Policy Violation Detected', description: 'Request PR-2045 budget exceeds the limit.', time: '1 hour ago', read: false, link: '/policy-validation' },
  { id: 3, title: 'Approval Completed', description: 'PR-2039 was approved by Director.', time: '3 hours ago', read: true, link: '/approvals' },
];

const COMPANY_RULES_LIBRARY = [
  {
    id: 'POL-001',
    name: 'GST Number Check',
    severity: 'Critical',
    mandate: 'All supplier invoices must contain a validated GSTIN registered with taxation ledgers.'
  },
  {
    id: 'POL-002',
    name: 'Delivery SLA Limit',
    severity: 'Medium',
    mandate: 'Standard goods delivery timelines should not exceed 7 business days from PO dispatch.'
  },
  {
    id: 'POL-003',
    name: 'Three-Quote Minimum',
    severity: 'Low',
    mandate: 'Bids exceeding $10,000 require comparison across a minimum of three independent quotes.'
  },
  {
    id: 'POL-004',
    name: 'Price Variance Check',
    severity: 'Low',
    mandate: 'Individual item bid prices must remain within a 10% variance range of historical pricing.'
  }
];

export const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(() => {
    const saved = localStorage.getItem('sidebar_collapsed');
    return saved === 'true';
  });

  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);

  useEffect(() => {
    localStorage.setItem('sidebar_collapsed', String(isSidebarCollapsed));
  }, [isSidebarCollapsed]);

  const toggleSidebar = () => setIsSidebarCollapsed(!isSidebarCollapsed);

  const filteredSidebarItems = SIDEBAR_ITEMS.filter((item) => {
    if (!user) return false;
    const role = user.role;
    
    if (role === 'Procurement Officer') {
      return ['Dashboard', 'Purchase Requests', 'Upload Quotations', 'Policy Validation'].includes(item.name);
    }
    if (role === 'Approving Manager') {
      return ['Dashboard', 'Vendor Comparison', 'Policy Validation', 'Approvals', 'Explainability'].includes(item.name);
    }
    if (role === 'System Administrator') {
      return ['Dashboard', 'Procurement Analytics', 'Purchase Orders', 'Audit Trail', 'Settings'].includes(item.name);
    }
    
    return true;
  });

  const activeItem = filteredSidebarItems.find((item) => item.path === location.pathname) || filteredSidebarItems[0] || SIDEBAR_ITEMS[0];

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const handleNotificationClick = (id: number, link: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    setShowNotifications(false);
    navigate(link);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950 transition-colors duration-200">
      {/* Background overlay for mobile sidebar */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-slate-900/50 dark:bg-slate-950/70 lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* LEFT SIDEBAR - Desktop */}
      <motion.aside
        animate={{ width: isSidebarCollapsed ? '76px' : '260px' }}
        transition={{ type: 'spring', damping: 20, stiffness: 200 }}
        className="hidden lg:flex flex-col border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 sticky top-0 h-screen z-30"
      >
        {/* Sidebar Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <img 
              src="/logo_icon.png" 
              alt="Procura" 
              className="h-9 w-9 object-contain rounded-lg flex-shrink-0" 
            />
            {!isSidebarCollapsed && (
              <span className="font-bold text-lg text-slate-800 dark:text-slate-100 tracking-tight whitespace-nowrap">
                Procura
              </span>
            )}
          </div>
          <button
            onClick={toggleSidebar}
            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 cursor-pointer"
          >
            {isSidebarCollapsed ? <ChevronRight size={15} /> : <ChevronLeft size={15} />}
          </button>
        </div>

        {/* Sidebar Navigation Link List */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {filteredSidebarItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <div key={item.name} className="space-y-1">
                <Link
                  to={item.path}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group relative',
                    isActive
                      ? 'bg-primary-50 border-l-4 border-primary-600 text-primary-700 dark:bg-primary-950/30 dark:text-primary-400'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-100'
                  )}
                >
                  <item.icon
                    size={18}
                    className={cn(
                      'flex-shrink-0 transition-transform group-hover:scale-105',
                      isActive ? 'text-primary-600 dark:text-primary-400' : 'text-slate-400 group-hover:text-slate-500'
                    )}
                  />
                  {!isSidebarCollapsed && (
                    <span className="whitespace-nowrap transition-opacity duration-200">
                      {item.name}
                    </span>
                  )}
                  {/* Tooltip for collapsed sidebar */}
                  {isSidebarCollapsed && (
                    <div className="absolute left-16 scale-0 group-hover:scale-100 bg-slate-900 text-white text-xs px-2.5 py-1.5 rounded shadow-lg transition-transform origin-left whitespace-nowrap z-50 pointer-events-none">
                      {item.name}
                    </div>
                  )}
                </Link>

                {/* Rules Library directly under Policy Validation button */}
                {item.path === '/policy-validation' && !isSidebarCollapsed && (
                  <div className="ml-4 mt-1.5 mb-2 pl-3 border-l border-slate-200 dark:border-slate-800 space-y-1.5 text-left">
                    <div className="flex items-center gap-1.5 text-[9px] font-bold text-slate-450 dark:text-slate-500 uppercase tracking-widest mb-1.5 select-none">
                      <BookOpen size={9} />
                      <span>Company Rules Library</span>
                    </div>
                    {COMPANY_RULES_LIBRARY.map((rule) => (
                      <Link
                        key={rule.id}
                        to={`/policy-validation?rule=${rule.id}`}
                        className="block p-2 rounded-lg border border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-950/20 hover:bg-primary-50/10 dark:hover:bg-primary-950/5 hover:border-primary-200/40 transition-all text-[10px] leading-relaxed"
                      >
                        <div className="flex items-center justify-between font-bold text-slate-700 dark:text-slate-300">
                          <span>{rule.id}</span>
                          <span className={cn(
                            "px-1 py-0.5 rounded-[3px] text-[7.5px] font-bold uppercase scale-90 origin-right",
                            rule.severity === 'Critical' 
                              ? "bg-red-500/10 text-red-500" 
                              : rule.severity === 'Medium' 
                              ? "bg-amber-500/10 text-amber-500" 
                              : "bg-slate-500/10 text-slate-500"
                          )}>
                            {rule.severity}
                          </span>
                        </div>
                        <h5 className="font-bold text-slate-800 dark:text-slate-200 truncate mt-0.5">
                          {rule.name}
                        </h5>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          {!isSidebarCollapsed ? (
            <div className="flex items-center justify-between gap-2">
              <Link to="/settings/profile" className="flex items-center gap-2 overflow-hidden hover:opacity-85 transition-opacity cursor-pointer text-left">
                <div className="h-8 w-8 rounded-full border border-slate-200 dark:border-slate-850 bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-550 dark:text-slate-450 flex-shrink-0 overflow-hidden">
                  {user?.avatar ? (
                    <img src={user.avatar} alt="Avatar" className="h-full w-full object-cover" />
                  ) : (
                    <User size={14} />
                  )}
                </div>
                <div className="overflow-hidden">
                  <h4 className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate leading-tight">
                    {user?.name}
                  </h4>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 truncate block">
                    {user?.role}
                  </span>
                </div>
              </Link>
              <button
                onClick={logout}
                title="Log out"
                className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all cursor-pointer flex-shrink-0"
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <div className="flex justify-center">
              <button
                onClick={logout}
                title="Log out"
                className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all cursor-pointer"
              >
                <LogOut size={18} />
              </button>
            </div>
          )}
        </div>
      </motion.aside>

      {/* MOBILE SIDEBAR DRAW */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.aside
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 left-0 w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 z-50 flex flex-col lg:hidden"
          >
            <div className="h-16 flex items-center justify-between px-6 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <img 
                  src="/logo_icon.png" 
                  alt="Procura" 
                  className="h-8 w-8 object-contain rounded-lg flex-shrink-0" 
                />
                <span className="font-bold text-lg text-slate-800 dark:text-slate-100 tracking-tight">
                  Procura
                </span>
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <nav className="flex-1 px-4 py-4 space-y-1.5 overflow-y-auto">
              {filteredSidebarItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <div key={item.name} className="space-y-1">
                    <Link
                      to={item.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={cn(
                        'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all',
                        isActive
                          ? 'bg-primary-50 border-l-4 border-primary-600 text-primary-700 dark:bg-primary-950/30 dark:text-primary-400'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-100'
                      )}
                    >
                      <item.icon
                        size={18}
                        className={isActive ? 'text-primary-600 dark:text-primary-400' : 'text-slate-400'}
                      />
                      <span>{item.name}</span>
                    </Link>

                    {/* Mobile rules library sub-list */}
                    {item.path === '/policy-validation' && (
                      <div className="ml-4 mt-1 pl-3 border-l border-slate-200 dark:border-slate-800 space-y-1.5 text-left">
                        {COMPANY_RULES_LIBRARY.map((rule) => (
                          <Link
                            key={rule.id}
                            to={`/policy-validation?rule=${rule.id}`}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="block p-2 rounded-lg border border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-950/20 hover:bg-primary-50/10 dark:hover:bg-primary-950/5 hover:border-primary-200/40 transition-all text-[10px] leading-relaxed"
                          >
                            <div className="flex items-center justify-between font-bold text-slate-700 dark:text-slate-300">
                              <span>{rule.id}</span>
                              <span className={cn(
                                "px-1 py-0.5 rounded-[3px] text-[7.5px] font-bold uppercase scale-90 origin-right",
                                rule.severity === 'Critical' 
                                  ? "bg-red-500/10 text-red-500" 
                                  : rule.severity === 'Medium' 
                                  ? "bg-amber-500/10 text-amber-500" 
                                  : "bg-slate-500/10 text-slate-500"
                              )}>
                                {rule.severity}
                              </span>
                            </div>
                            <h5 className="font-bold text-slate-800 dark:text-slate-200 truncate mt-0.5">
                              {rule.name}
                            </h5>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>

            <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
              <div className="flex items-center justify-between">
                <Link to="/settings/profile" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 hover:opacity-85 transition-opacity cursor-pointer text-left">
                  <div className="h-10 w-10 rounded-full border border-slate-200 dark:border-slate-850 bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-550 dark:text-slate-450 flex-shrink-0 overflow-hidden">
                    {user?.avatar ? (
                      <img src={user.avatar} alt="Avatar" className="h-full w-full object-cover" />
                    ) : (
                      <User size={18} />
                    )}
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200 leading-tight">
                      {user?.name}
                    </h4>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      {user?.role}
                    </span>
                  </div>
                </Link>
                <button
                  onClick={logout}
                  className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all cursor-pointer"
                >
                  <LogOut size={18} />
                </button>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* MAIN CONTAINER */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* TOP HEADER */}
        <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 sticky top-0 z-20 backdrop-blur-sm px-4 lg:px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 lg:hidden cursor-pointer"
            >
              <Menu size={20} />
            </button>

            {/* Breadcrumb / Current page name */}
            <div className="hidden sm:flex items-center gap-2">
              <span className="text-xs text-slate-400 dark:text-slate-500 font-semibold tracking-wider uppercase">
                Procura
              </span>
              <span className="text-slate-300 dark:text-slate-700 font-light">/</span>
              <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                {activeItem.name}
              </span>
            </div>
          </div>

          {/* Header Actions */}
          <div className="flex items-center gap-3">
            {/* Global Search Bar */}
            <div className="relative hidden md:block w-64 lg:w-80">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400 dark:text-slate-600" />
              <input
                type="text"
                placeholder="Search requests, vendors, policies..."
                className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10 transition-all"
              />
            </div>



            {/* Notifications Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  setShowProfileMenu(false);
                }}
                className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 cursor-pointer transition-all active:scale-95 relative"
              >
                <Bell size={16} />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500" />
                )}
              </button>

              <AnimatePresence>
                {showNotifications && (
                  <>
                    <div className="fixed inset-0 z-30" onClick={() => setShowNotifications(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl z-40 overflow-hidden"
                    >
                      <div className="p-3.5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900/50">
                        <span className="font-semibold text-xs text-slate-800 dark:text-slate-200">
                          Notifications ({unreadCount})
                        </span>
                        {unreadCount > 0 && (
                          <button
                            onClick={handleMarkAllAsRead}
                            className="text-[10px] text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-semibold cursor-pointer"
                          >
                            Mark all as read
                          </button>
                        )}
                      </div>
                      <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60">
                        {notifications.length === 0 ? (
                          <div className="p-4 text-center text-xs text-slate-400">
                            No notifications
                          </div>
                        ) : (
                          notifications.map((n) => (
                             <button
                               key={n.id}
                               onClick={() => handleNotificationClick(n.id, n.link)}
                               className={cn(
                                 'w-full text-left p-3 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors flex flex-col gap-0.5 border-b border-slate-100 dark:border-slate-800/40 last:border-b-0 cursor-pointer focus:outline-none',
                                 !n.read && 'bg-primary-50/20 dark:bg-primary-950/5'
                               )}
                             >
                               <div className="flex items-center justify-between w-full">
                                 <span className={cn('text-xs font-semibold text-slate-800 dark:text-slate-200', !n.read && 'text-primary-900 dark:text-primary-300')}>
                                   {n.title}
                                 </span>
                                 <span className="text-[10px] text-slate-400 dark:text-slate-500">
                                   {n.time}
                                 </span>
                               </div>
                               <p className="text-xs text-slate-500 dark:text-slate-400 leading-normal">
                                 {n.description}
                               </p>
                             </button>
                          ))
                        )}
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowProfileMenu(!showProfileMenu);
                  setShowNotifications(false);
                }}
                className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 border border-transparent hover:border-slate-200 dark:hover:border-slate-800 transition-all cursor-pointer"
              >
                <div className="h-6 w-6 rounded-full border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 overflow-hidden flex-shrink-0">
                  {user?.avatar ? (
                    <img src={user.avatar} alt="Profile" className="h-full w-full object-cover" />
                  ) : (
                    <User size={12} />
                  )}
                </div>
                <span className="hidden sm:inline text-xs font-semibold text-slate-700 dark:text-slate-300">
                  {user?.name.split(' ')[0]}
                </span>
              </button>

              <AnimatePresence>
                {showProfileMenu && (
                  <>
                    <div className="fixed inset-0 z-30" onClick={() => setShowProfileMenu(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl z-40 overflow-hidden"
                    >
                      <div className="p-3.5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
                        <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 leading-tight">
                          {user?.name}
                        </p>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                          {user?.email}
                        </p>
                      </div>
                      <div className="p-1.5 space-y-0.5">
                        <Link
                          to="/settings/profile"
                          onClick={() => setShowProfileMenu(false)}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                        >
                          <Settings size={14} className="text-slate-400" />
                          <span>Account Settings</span>
                        </Link>
                        <button
                          onClick={() => {
                            setShowProfileMenu(false);
                            logout();
                          }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 text-left cursor-pointer"
                        >
                          <LogOut size={14} />
                          <span>Log out</span>
                        </button>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* PAGE CONTENT CONTAINER */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
};
