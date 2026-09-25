'use client';

import React, { useState } from 'react';
import { 
  Bell, 
  Search, 
  Building2, 
  CheckCircle2, 
  AlertTriangle, 
  ChevronDown, 
  Radio, 
  ShieldCheck,
  X
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

export function TopBar() {
  const [selectedSite, setSelectedSite] = useState('Landmark 81 - Bếp Trung Tâm');
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [unreadAlerts, setUnreadAlerts] = useState([
    {
      id: 1,
      title: 'Tủ mát hải sản #02 vượt ngưỡng 8.2°C',
      time: '15 phút trước',
      type: 'critical',
      href: '/corrective-actions',
    },
    {
      id: 2,
      title: 'Kho đông sâu #01 đã hoàn thành xả đá định kỳ',
      time: '45 phút trước',
      type: 'info',
      href: '/temperature',
    },
  ]);

  return (
    <div className="h-16 border-b border-slate-800 bg-slate-900/60 backdrop-blur-md flex items-center px-4 sm:px-6 justify-between sticky top-0 z-30 select-none">
      {/* Left: Quick Site Selector & Live Indicator */}
      <div className="flex items-center gap-4">
        {/* Site Switcher Dropdown */}
        <div className="flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700/60 text-xs font-semibold text-white">
          <Building2 className="w-3.5 h-3.5 text-indigo-400" />
          <select
            value={selectedSite}
            onChange={(e) => setSelectedSite(e.target.value)}
            className="bg-transparent border-none text-xs text-white focus:outline-none cursor-pointer pr-1"
          >
            <option value="Landmark 81 - Bếp Trung Tâm" className="bg-slate-900 text-white">
              Landmark 81 - Bếp Trung Tâm
            </option>
            <option value="Quận 1 - Đồng Khởi Flagship" className="bg-slate-900 text-white">
              Quận 1 - Đồng Khởi Flagship
            </option>
            <option value="Hà Nội - Tây Hồ Premium" className="bg-slate-900 text-white">
              Hà Nội - Tây Hồ Premium
            </option>
          </select>
        </div>

        {/* Real-time Status Badge */}
        <div className="hidden lg:flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Hệ thống trực tuyến (HACCP Active)</span>
        </div>
      </div>
      
      {/* Right: Search + Notifications */}
      <div className="flex items-center gap-3">
        <div className="w-64 hidden md:block">
          <Input 
            placeholder="Tìm kiếm nhanh (Ctrl + K)..." 
            icon={<Search className="w-4 h-4" />}
            className="bg-slate-900/80 border-slate-700/60 text-xs h-8"
          />
        </div>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button 
            onClick={() => setIsAlertOpen(!isAlertOpen)}
            className="relative p-2 text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-slate-800 cursor-pointer"
            title="Thông báo cảnh báo"
          >
            <Bell className="w-5 h-5" />
            {unreadAlerts.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            )}
          </button>

          {/* Alert Popover */}
          {isAlertOpen && (
            <div className="absolute right-0 mt-2 w-80 rounded-xl bg-slate-900 border border-slate-700/80 shadow-2xl p-3 z-50 animate-slide-in">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-white">Cảnh Báo An Toàn Thực Phẩm</span>
                  <Badge variant="destructive" className="text-[10px] px-1.5 py-0">
                    {unreadAlerts.length}
                  </Badge>
                </div>
                <button 
                  onClick={() => setIsAlertOpen(false)}
                  className="text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2">
                {unreadAlerts.map((alert) => (
                  <Link
                    key={alert.id}
                    href={alert.href}
                    onClick={() => setIsAlertOpen(false)}
                    className="block p-2.5 rounded-lg bg-slate-800/60 hover:bg-slate-800 transition border border-slate-700/50"
                  >
                    <div className="flex items-start gap-2">
                      {alert.type === 'critical' ? (
                        <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                      ) : (
                        <CheckCircle2 className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5" />
                      )}
                      <div>
                        <p className="text-xs font-medium text-white leading-snug">{alert.title}</p>
                        <p className="text-[10px] text-slate-400 mt-1">{alert.time}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              <div className="pt-2 mt-2 border-t border-slate-800 text-center">
                <Link
                  href="/corrective-actions"
                  onClick={() => setIsAlertOpen(false)}
                  className="text-[11px] text-indigo-400 hover:underline font-semibold"
                >
                  Xem toàn bộ sổ theo dõi sự cố (CAPA) →
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
