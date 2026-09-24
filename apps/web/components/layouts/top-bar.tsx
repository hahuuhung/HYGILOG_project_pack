'use client';

import { useState } from 'react';
import { Bell, Search, Building2, Clock, CheckCircle2, ChevronDown, ShieldAlert, X } from 'lucide-react';
import { Input } from '@/components/ui/input';

export function TopBar() {
  const [selectedSite, setSelectedSite] = useState('all');
  const [showNotifications, setShowNotifications] = useState(false);

  const notifications = [
    {
      id: 1,
      title: 'Cảnh báo nhiệt độ tủ mát 02',
      time: '5 phút trước',
      type: 'warning',
      desc: 'Nhiệt độ hiện tại 7.5°C vượt ngưỡng an toàn (0°C - 4°C). Cần kiểm tra!',
    },
    {
      id: 2,
      title: 'Checklist ca sáng đã phê duyệt',
      time: '25 phút trước',
      type: 'success',
      desc: 'Bếp trưởng Lê Hoàng Nam đã ký duyệt danh mục vệ sinh khu Bếp Nóng.',
    },
    {
      id: 3,
      title: 'Lô hàng thịt bò Wagyu A4',
      time: '1 giờ trước',
      type: 'info',
      desc: 'Đã nhập kho 45kg từ Nhà cung cấp FreshFood VN, mã lô LOT-2026-0924.',
    },
  ];

  return (
    <header className="h-16 border-b border-slate-800 bg-slate-900/60 backdrop-blur-md flex items-center px-6 justify-between sticky top-0 z-30 shadow-sm">
      {/* Search Input */}
      <div className="w-full max-w-sm hidden md:flex items-center gap-2">
        <div className="relative w-full">
          <Input 
            placeholder="Tìm kiếm thiết bị, lô hàng, checklist (Ctrl + K)..." 
            icon={<Search className="w-4 h-4 text-slate-400" />}
            className="bg-slate-950/60 border-slate-800 text-xs py-1.5 focus:border-indigo-500/50"
          />
        </div>
      </div>
      
      {/* Right Controls */}
      <div className="flex items-center gap-3 ml-auto">
        {/* Site Switcher */}
        <div className="flex items-center gap-2 bg-slate-950/60 border border-slate-800/80 rounded-xl px-3 py-1.5 text-xs text-slate-300">
          <Building2 className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
          <select 
            value={selectedSite} 
            onChange={(e) => setSelectedSite(e.target.value)}
            className="bg-transparent border-none text-xs text-white focus:outline-none cursor-pointer"
          >
            <option value="all" className="bg-slate-900 text-white">Toàn bộ cơ sở</option>
            <option value="site_1" className="bg-slate-900 text-white">Nhà hàng Phố Cổ (Trụ sở chính)</option>
            <option value="site_2" className="bg-slate-900 text-white">Khách sạn Riverside (Chi nhánh 2)</option>
            <option value="site_3" className="bg-slate-900 text-white">Bếp trung tâm Quận 1</option>
          </select>
        </div>

        {/* HACCP Compliance Live Status */}
        <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>HACCP Active</span>
        </div>

        {/* Notifications Button */}
        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800/60 transition-colors border border-transparent hover:border-slate-700/50"
            aria-label="Thông báo"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-slate-900 animate-pulse"></span>
          </button>

          {/* Notifications Flyout */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-semibold text-white">Thông báo tuân thủ</h4>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-indigo-500/20 text-indigo-400">
                    3 mới
                  </span>
                </div>
                <button 
                  onClick={() => setShowNotifications(false)}
                  className="text-slate-400 hover:text-white p-1 rounded-lg"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                {notifications.map((n) => (
                  <div 
                    key={n.id} 
                    className="p-3 rounded-xl bg-slate-800/40 hover:bg-slate-800/80 border border-slate-800 transition-colors text-xs flex gap-3"
                  >
                    {n.type === 'warning' ? (
                      <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-white truncate">{n.title}</p>
                      <p className="text-slate-400 text-[11px] mt-0.5 line-clamp-2">{n.desc}</p>
                      <span className="text-[10px] text-slate-500 mt-1 block">{n.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
