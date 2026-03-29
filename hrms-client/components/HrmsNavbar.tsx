import React from 'react';
import { NavLink } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Role } from '../types';
import { Bell, CalendarDays, ChevronDown, LayoutDashboard, LineChart, LogOut, Menu, Shield, UserCircle, Users, X, Zap } from 'lucide-react';
import { notificationAPI } from '../services/api';

interface NavItem {
  to: string;
  label: string;
  icon: React.ReactNode;
}

const getLinksForRole = (role: Role): NavItem[] => {
  if (role === Role.ADMIN) {
    return [
      { to: '/', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
      { to: '/admin-users', label: 'Users', icon: <Users size={18} /> },
      { to: '/admin-audit', label: 'Audit', icon: <Shield size={18} /> },
      { to: '/admin-leaves', label: 'Leaves', icon: <CalendarDays size={18} /> },
      { to: '/admin-analytics', label: 'Analytics', icon: <LineChart size={18} /> },
    ];
  }

  if (role === Role.HR) {
    return [
      { to: '/', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
      { to: '/hr-today', label: 'Today', icon: <CalendarDays size={18} /> },
      { to: '/hr-approvals', label: 'Approvals', icon: <Shield size={18} /> },
      { to: '/admin-analytics', label: 'Analytics', icon: <LineChart size={18} /> },
      { to: '/holidays', label: 'Holidays', icon: <CalendarDays size={18} /> },
    ];
  }

  return [
    { to: '/', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
    { to: '/profile', label: 'Profile', icon: <UserCircle size={18} /> },
    { to: '/holidays', label: 'Holidays', icon: <CalendarDays size={18} /> },
  ];
};

export const HrmsNavbar: React.FC = () => {
  const { auth, logout, notifications, refreshData } = useApp();
  const user = auth.user;
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  const [notificationsOpen, setNotificationsOpen] = React.useState(false);
  const [notificationsBusy, setNotificationsBusy] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement | null>(null);
  const notificationsRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    const onPointerDown = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setNotificationsOpen(false);
      }
    };

    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, []);

  if (!user) {
    return null;
  }

  const links = getLinksForRole(user.role);
  const unreadCount = notifications.filter((notification) => !notification.read).length;
  const sortedNotifications = [...notifications].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  const activeLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium transition-all duration-200 ${
      isActive
        ? 'bg-gradient-to-br from-primary/15 to-secondary/15 text-primary-light ring-1 ring-primary/20'
        : 'text-text-secondary hover:bg-white/5 hover:text-text-primary'
    }`;

  const handleNotificationToggle = () => {
    setDropdownOpen(false);
    setNotificationsOpen((open) => !open);
  };

  const handleMarkAllRead = async () => {
    if (!unreadCount) return;
    setNotificationsBusy(true);
    try {
      await notificationAPI.markAllAsRead();
      await refreshData(true);
    } finally {
      setNotificationsBusy(false);
    }
  };

  const handleMarkRead = async (id: string, isRead: boolean) => {
    if (isRead) return;
    setNotificationsBusy(true);
    try {
      await notificationAPI.markAsRead(id);
      await refreshData(true);
    } finally {
      setNotificationsBusy(false);
    }
  };

  return (
    <>
      <nav className="sticky top-0 left-0 right-0 z-50 h-[72px] border-b border-white/10 bg-bg-dark px-4 sm:px-6">
        <div className="mx-auto flex h-full w-full max-w-[1440px] items-center justify-between gap-4">
          <div className="flex items-center gap-4 lg:gap-8">
            <button
              type="button"
              className="rounded-xl border border-white/10 p-2 text-text-secondary transition-colors hover:bg-white/5 hover:text-text-primary lg:hidden"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={20} />
            </button>

            <NavLink to="/" className="flex items-center gap-2.5">
              <div className="flex h-[34px] w-[34px] items-center justify-center rounded-lg bg-gradient-to-br from-primary to-secondary text-white shadow-[0_0_20px_rgba(99,102,241,0.4)]">
                <Zap size={18} fill="currentColor" />
              </div>
              <span className="font-display text-xl font-extrabold text-white">
                Career<span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Lens</span>
              </span>
            </NavLink>

            <div className="hidden items-center gap-3 lg:flex">
              {links.map((link) => (
                <NavLink key={link.to} to={link.to} className={activeLinkClass}>
                  {link.icon}
                  <span>{link.label}</span>
                </NavLink>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative hidden sm:block" ref={notificationsRef}>
              <button
                type="button"
                className="relative rounded-2xl border border-white/10 p-2.5 text-text-secondary transition-colors hover:bg-white/5 hover:text-text-primary"
                aria-label="Notifications"
                onClick={handleNotificationToggle}
              >
                <Bell size={18} />
                {unreadCount > 0 && (
                  <span className="absolute right-1.5 top-1.5 flex h-[14px] min-w-[14px] items-center justify-center rounded-full bg-danger px-1 text-[9px] font-bold text-white">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>

              {notificationsOpen && (
                <div className="absolute right-0 top-[calc(100%+10px)] z-[60] w-[360px] max-w-[80vw] overflow-hidden rounded-[20px] border border-white/10 bg-bg-card shadow-2xl">
                  <div className="flex items-center justify-between border-b border-white/10 bg-bg-card-2 px-4 py-3">
                    <div>
                      <div className="text-sm font-semibold text-text-primary">Notifications</div>
                      <div className="text-[11px] font-medium text-text-muted">
                        {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up'}
                      </div>
                    </div>
                    <button
                      type="button"
                      className="rounded-xl border border-white/10 bg-bg-card px-3 py-1.5 text-xs font-semibold text-text-secondary transition-colors hover:bg-bg-elevated hover:text-text-primary disabled:opacity-50"
                      onClick={handleMarkAllRead}
                      disabled={!unreadCount || notificationsBusy}
                    >
                      Mark all read
                    </button>
                  </div>

                  <div className="max-h-[380px] overflow-y-auto p-2">
                    {sortedNotifications.length === 0 ? (
                      <div className="px-4 py-10 text-center text-sm text-text-muted">
                        No notifications yet.
                      </div>
                    ) : (
                      sortedNotifications.map((notification) => (
                        <button
                          key={notification.id}
                          type="button"
                          className={`flex w-full items-start gap-3 rounded-2xl px-3 py-3 text-left transition-all ${
                            notification.read
                              ? 'bg-bg-card text-text-secondary hover:bg-bg-card-2'
                              : 'bg-bg-card-2 text-text-primary ring-1 ring-primary/15 hover:bg-[#24304c]'
                          }`}
                          onClick={() => handleMarkRead(notification.id, notification.read)}
                        >
                          <span className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${notification.read ? 'bg-white/15' : 'bg-secondary'}`} />
                          <span className="min-w-0 flex-1">
                            <span className="block text-sm leading-5">{notification.message}</span>
                            <span className="mt-1 block text-[11px] text-text-muted">
                              {new Date(notification.createdAt).toLocaleString()}
                            </span>
                          </span>
                        </button>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                className="flex items-center gap-2 rounded-full border border-white/10 bg-transparent p-1 pr-3.5 transition-all duration-200 hover:border-primary hover:bg-primary/10"
                onClick={() => setDropdownOpen((open) => !open)}
              >
                <div className="flex h-[30px] w-[30px] items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary text-[13px] font-bold text-white shadow-sm">
                  {user.name?.charAt(0).toUpperCase()}
                </div>
                <ChevronDown size={14} className={`hidden text-text-muted transition-transform duration-200 sm:block ${dropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 top-[calc(100%+10px)] z-[60] w-[220px] overflow-hidden rounded-[20px] border border-white/10 bg-bg-card shadow-2xl">
                  <div className="border-b border-white/10 bg-bg-card-2 p-4">
                    <div className="truncate text-sm font-semibold text-text-primary">{user.name}</div>
                    <div className="mt-0.5 text-[11px] font-bold uppercase tracking-wider text-text-muted">{user.role}</div>
                  </div>
                  <div className="p-2 space-y-1">
                    <NavLink to="/" className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm text-text-secondary transition-all hover:bg-white/5 hover:text-text-primary" onClick={() => setDropdownOpen(false)}>
                      <LayoutDashboard size={15} />
                      Dashboard
                    </NavLink>
                    <NavLink to="/profile" className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm text-text-secondary transition-all hover:bg-white/5 hover:text-text-primary" onClick={() => setDropdownOpen(false)}>
                      <UserCircle size={15} />
                      My Profile
                    </NavLink>
                  </div>
                  <div className="border-t border-white/10 p-2">
                    <button
                      type="button"
                      className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-left text-sm font-medium text-danger transition-all hover:bg-danger/10"
                      onClick={logout}
                    >
                      <LogOut size={15} />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <div
        className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-all duration-300 lg:hidden ${mobileMenuOpen ? 'visible opacity-100' : 'invisible opacity-0'}`}
        onClick={() => setMobileMenuOpen(false)}
      >
        <div
          className={`fixed left-0 top-0 z-50 flex h-full w-[300px] max-w-[85vw] flex-col border-r border-white/10 bg-bg-dark transition-transform duration-300 ease-out ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}
          onClick={(event) => event.stopPropagation()}
        >
          <div className="flex items-center justify-between border-b border-white/10 p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-secondary text-white shadow-lg shadow-primary/20">
                <Zap size={18} />
              </div>
              <span className="font-display text-lg font-bold text-text-primary">CareerLens</span>
            </div>
            <button
              type="button"
              className="rounded-lg p-2 text-text-secondary transition-all duration-200 hover:bg-white/5 hover:text-text-primary"
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Close menu"
            >
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-2">
              {links.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    `flex items-center gap-3.5 rounded-xl px-4 py-3 text-[15px] font-medium transition-all duration-200 ${
                      isActive
                        ? 'bg-primary/10 text-primary-light ring-1 ring-primary/20'
                        : 'text-text-secondary hover:bg-white/5 hover:text-text-primary'
                    }`
                  }
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.icon}
                  <span>{link.label}</span>
                </NavLink>
              ))}
            </div>
          </div>

          <div className="border-t border-white/10 p-6">
            <button
              type="button"
              className="flex w-full items-center justify-center gap-3 rounded-xl bg-danger/10 px-4 py-3.5 font-semibold text-danger transition-all duration-200"
              onClick={logout}
            >
              <LogOut size={16} />
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
