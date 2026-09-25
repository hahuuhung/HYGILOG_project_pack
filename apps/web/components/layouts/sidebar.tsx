'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/stores/auth-store';
import { 
  LayoutDashboard, 
  Thermometer, 
  ClipboardCheck, 
  CheckSquare,
  Package,
  AlertOctagon,
  Radio,
  FileText,
  Building2,
  Users, 
  Settings,
  ShieldCheck,
  LogOut,
  ChevronRight,
  ShieldAlert
} from 'lucide-react';

interface RouteGroup {
  groupName: string;
  items: {
    label: string;
    icon: any;
    href: string;
    color: string;
    badge?: string;
  }[];
}

const routeGroups: RouteGroup[] = [
  {
    groupName: 'GIÁM SÁT VẬN HÀNH',
    items: [
      {
        label: 'Tổng quan',
        icon: LayoutDashboard,
        href: '/dashboard',
        color: 'text-sky-400',
      },
      {
        label: 'Ghi nhận Nhiệt độ',
        icon: Thermometer,
        href: '/temperature',
        color: 'text-orange-400',
      },
      {
        label: 'Checklist HACCP',
        icon: ClipboardCheck,
        href: '/checklists',
        color: 'text-emerald-400',
      },
      {
        label: 'Nhiệm vụ Ca trực',
        icon: CheckSquare,
        href: '/tasks',
        color: 'text-blue-400',
      },
    ],
  },
  {
    groupName: 'AN TOÀN & TRUY XUẤT',
    items: [
      {
        label: 'Truy xuất Lô hàng',
        icon: Package,
        href: '/traceability',
        color: 'text-amber-400',
      },
      {
        label: 'Hành động Khắc phục',
        icon: AlertOctagon,
        href: '/corrective-actions',
        color: 'text-red-400',
        badge: 'CAPA',
      },
      {
        label: 'Trạm Thẻ NFC',
        icon: Radio,
        href: '/nfc',
        color: 'text-violet-400',
      },
    ],
  },
  {
    groupName: 'QUẢN TRỊ & BÁO CÁO',
    items: [
      {
        label: 'Báo cáo Kiểm toán',
        icon: FileText,
        href: '/reports',
        color: 'text-teal-400',
      },
      {
        label: 'Cơ sở & Chi nhánh',
        icon: Building2,
        href: '/sites',
        color: 'text-indigo-400',
      },
      {
        label: 'Quản lý Nhân sự',
        icon: Users,
        href: '/users',
        color: 'text-fuchsia-400',
      },
      {
        label: 'Cấu hình Hệ thống',
        icon: Settings,
        href: '/settings',
        color: 'text-slate-400',
      },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();

  return (
    <div className="flex flex-col h-full bg-slate-900 border-r border-slate-800 select-none">
      {/* Brand Logo Header */}
      <div className="px-6 py-5 border-b border-slate-800/80 flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/30">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-indigo-400 via-violet-300 to-indigo-200 bg-clip-text text-transparent">
              HYGILOG
            </h1>
            <p className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
              HACCP Food Safety OS
            </p>
          </div>
        </Link>
      </div>

      {/* Navigation Links Scrollable */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6 scrollbar-thin scrollbar-thumb-slate-800">
        {routeGroups.map((group, groupIdx) => (
          <div key={groupIdx} className="space-y-1">
            <h2 className="px-3 text-[11px] font-bold tracking-wider text-slate-400 uppercase">
              {group.groupName}
            </h2>
            <div className="space-y-1 pt-1">
              {group.items.map((route) => {
                const isActive = pathname === route.href;
                return (
                  <Link
                    key={route.href}
                    href={route.href}
                    className={cn(
                      "text-xs group flex items-center justify-between px-3 py-2.5 rounded-xl font-medium transition-all duration-150",
                      isActive 
                        ? "text-white bg-indigo-600/20 border border-indigo-500/30 shadow-sm" 
                        : "text-slate-400 hover:text-white hover:bg-slate-800/60"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <route.icon className={cn("h-4 w-4 transition-transform group-hover:scale-110", route.color)} />
                      <span>{route.label}</span>
                    </div>

                    {route.badge && (
                      <span className="px-1.5 py-0.5 text-[10px] font-bold rounded bg-red-500/20 text-red-400 border border-red-500/30">
                        {route.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      
      {/* User Info & Logout Footer */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-900/40">
        <div className="bg-slate-800/60 rounded-xl p-3 flex flex-col gap-2.5 border border-slate-700/40">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-violet-600 flex items-center justify-center text-white font-bold text-xs shadow-md">
              {user?.name?.charAt(0) || 'A'}
            </div>
            <div className="flex-1 overflow-hidden">
              <div className="flex items-center gap-1.5">
                <p className="text-xs font-semibold text-white truncate">{user?.name || 'Nguyễn Văn A'}</p>
              </div>
              <p className="text-[11px] text-slate-400 truncate">{user?.email || 'admin@hygilog.vn'}</p>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1 border-t border-slate-700/50">
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              {user?.role === 'super_admin' ? 'Super Admin' : user?.role || 'Quản lý ATTP'}
            </span>

            <button 
              onClick={() => {
                logout();
                window.location.href = '/login';
              }}
              className="flex items-center text-xs text-slate-400 hover:text-red-400 transition-colors p-1 rounded hover:bg-red-500/10"
              title="Đăng xuất"
            >
              <LogOut className="w-3.5 h-3.5 mr-1" />
              Thoát
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
