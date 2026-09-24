'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/stores/auth-store';
import { 
  LayoutDashboard, 
  CheckCircle2,
  Thermometer, 
  ClipboardCheck, 
  PackageSearch,
  AlertTriangle,
  Radio,
  FileBarChart,
  Building2,
  Users, 
  Settings,
  ShieldCheck,
  LogOut,
  ChevronRight
} from 'lucide-react';

interface RouteItem {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  color: string;
  permission?: string;
  badge?: string;
}

const routes: RouteItem[] = [
  {
    label: 'Tổng quan (Dashboard)',
    icon: LayoutDashboard,
    href: '/dashboard',
    color: 'text-sky-400',
    permission: 'dashboard.view',
  },
  {
    label: 'Nhiệm vụ ca trực',
    icon: CheckCircle2,
    href: '/tasks',
    color: 'text-emerald-400',
    permission: 'tasks.view',
  },
  {
    label: 'Ghi nhận Nhiệt độ',
    icon: Thermometer,
    href: '/temperature',
    color: 'text-orange-400',
    permission: 'temperature.view',
    badge: 'HACCP CCP1',
  },
  {
    label: 'Checklist Vệ sinh',
    icon: ClipboardCheck,
    href: '/checklists',
    color: 'text-teal-400',
    permission: 'checklists.view',
  },
  {
    label: 'Truy xuất Nguồn gốc',
    icon: PackageSearch,
    href: '/traceability',
    color: 'text-amber-400',
    permission: 'traceability.view',
  },
  {
    label: 'Sự cố & Khắc phục',
    icon: AlertTriangle,
    href: '/corrective-actions',
    color: 'text-rose-400',
    permission: 'corrective.view',
    badge: 'CAPA',
  },
  {
    label: 'Trạm kiểm tra NFC',
    icon: Radio,
    href: '/nfc',
    color: 'text-cyan-400',
    permission: 'nfc.scan',
  },
  {
    label: 'Báo cáo Tuân thủ',
    icon: FileBarChart,
    href: '/reports',
    color: 'text-indigo-400',
    permission: 'reports.view',
  },
  {
    label: 'Cơ sở & Khu vực',
    icon: Building2,
    href: '/sites',
    color: 'text-blue-400',
    permission: 'sites.view',
  },
  {
    label: 'Quản lý Nhân sự',
    icon: Users,
    href: '/users',
    color: 'text-violet-400',
    permission: 'users.view',
  },
  {
    label: 'Cài đặt Hệ thống',
    icon: Settings,
    href: '/settings',
    color: 'text-slate-400',
    permission: 'settings.view',
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, permissions, logout } = useAuthStore();

  const filteredRoutes = routes.filter((route) => {
    if (!route.permission) return true;
    if (permissions?.includes('all')) return true;
    if (!permissions || permissions.length === 0) return true;
    return permissions.includes(route.permission);
  });

  return (
    <aside className="space-y-4 py-4 flex flex-col h-full bg-slate-900/90 backdrop-blur-xl border-r border-slate-800 shadow-xl">
      <div className="px-4 py-2 flex-1 flex flex-col overflow-hidden">
        {/* Brand Header */}
        <Link href="/dashboard" className="flex items-center gap-3 px-2 mb-6 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-200">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-black tracking-tight bg-gradient-to-r from-indigo-300 via-white to-violet-300 bg-clip-text text-transparent">
                HYGILOG
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                PRO
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium truncate max-w-[140px]">
              HACCP Food Safety SaaS
            </p>
          </div>
        </Link>

        {/* Navigation List */}
        <div className="flex-1 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
          <p className="px-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
            Nghiệp vụ vận hành
          </p>
          {filteredRoutes.map((route) => {
            const isActive = pathname === route.href || pathname.startsWith(`${route.href}/`);
            const Icon = route.icon;
            return (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  "text-xs group flex items-center justify-between px-3 py-2.5 rounded-xl font-medium transition-all duration-150",
                  isActive 
                    ? "text-white bg-gradient-to-r from-indigo-600/80 to-violet-600/80 shadow-md shadow-indigo-900/30 font-semibold" 
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                )}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Icon className={cn("h-4 w-4 shrink-0 transition-colors", isActive ? "text-white" : route.color)} />
                  <span className="truncate">{route.label}</span>
                </div>
                {route.badge && (
                  <span className={cn(
                    "text-[10px] px-1.5 py-0.5 rounded font-mono uppercase tracking-tight",
                    isActive ? "bg-white/20 text-white" : "bg-slate-800 text-slate-400 border border-slate-700"
                  )}>
                    {route.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </div>
      
      {/* User profile & Tenant Card */}
      <div className="px-3 pt-2 border-t border-slate-800/80">
        <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-3 flex flex-col gap-2.5">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-white truncate">
                {user?.name || 'Nguyễn Văn An'}
              </p>
              <p className="text-[11px] text-slate-400 truncate">
                {user?.role || 'Quản trị viên'}
              </p>
            </div>
          </div>
          <button 
            onClick={() => {
              logout();
              window.location.href = '/login';
            }}
            className="flex items-center justify-center gap-2 text-xs text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 py-1.5 px-2 rounded-lg transition-colors w-full font-medium"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Đăng xuất</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
