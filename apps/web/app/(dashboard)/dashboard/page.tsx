'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Thermometer, 
  ClipboardCheck, 
  AlertTriangle, 
  Building2, 
  PackageSearch,
  Radio,
  FileCheck2,
  TrendingUp,
  ArrowUpRight,
  ShieldCheck,
  Plus,
  Clock,
  ExternalLink
} from 'lucide-react';
import { useAuthStore } from '@/stores/auth-store';
import Link from 'next/link';

interface CriticalEquipment {
  name: string;
  type: string;
  temp: number;
  target: string;
  status: 'safe' | 'warning' | 'critical';
  location: string;
  lastCheck: string;
}

const equipmentWatchlist: CriticalEquipment[] = [
  { name: 'Kho Đông Sâu #1', type: 'Đông lạnh', temp: -19.5, target: '≤ -18°C', status: 'safe', location: 'Bếp chính - Khu B1', lastCheck: '10 phút trước' },
  { name: 'Tủ Mát Thịt Tươi #2', type: 'Mát thịt sống', temp: 1.2, target: '0°C đến +2°C', status: 'safe', location: 'Bếp sơ chế', lastCheck: '25 phút trước' },
  { name: 'Tủ Mát Trưng Bày Salad', type: 'Mát thức ăn liền', temp: 5.6, target: '0°C đến +4°C', status: 'warning', location: 'Quầy Pass Món', lastCheck: '5 phút trước' },
  { name: 'Bể Giữ Nóng Món Ăn', type: 'Hot holding', temp: 68.0, target: '≥ +63°C', status: 'safe', location: 'Quầy Buffet', lastCheck: '15 phút trước' },
];

export default function DashboardPage() {
  const user = useAuthStore(state => state.user);

  return (
    <div className="space-y-6">
      {/* Executive Welcome Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-indigo-950/80 via-slate-900 to-slate-900 border border-indigo-500/20 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
              HACCP Live Operations
            </span>
            <span className="text-xs text-slate-400">
              Chi nhánh: <strong className="text-white">Nhà hàng Phố Cổ (Trụ sở chính)</strong>
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Xin chào, {user?.name || 'Nguyễn Văn An'} 👋
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
            Hệ thống an toàn vệ sinh thực phẩm đang hoạt động bình thường. 
            Tất cả 14 thiết bị trọng yếu đều ghi nhận dữ liệu định kỳ và được xác thực qua trạm NFC thực địa.
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <Link href="/temperature">
            <Button size="sm" className="gap-1.5 bg-orange-600 hover:bg-orange-500 text-white shadow-lg shadow-orange-950">
              <Thermometer className="w-4 h-4" />
              Đo nhiệt độ CCP
            </Button>
          </Link>
          <Link href="/tasks">
            <Button size="sm" variant="outline" className="gap-1.5 border-slate-700 hover:bg-slate-800 text-white">
              <ClipboardCheck className="w-4 h-4 text-emerald-400" />
              Nhiệm vụ ca ({'>'}90%)
            </Button>
          </Link>
          <Link href="/reports">
            <Button size="sm" variant="outline" className="gap-1.5 border-slate-700 hover:bg-slate-800 text-slate-300">
              <FileCheck2 className="w-4 h-4 text-indigo-400" />
              Hồ sơ thanh tra
            </Button>
          </Link>
        </div>
      </div>

      {/* 4 Core KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* KPI 1: Nhiệt độ CCP */}
        <Card className="glassmorphism hover:border-slate-700 transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Nhiệt Độ CCP Hôm Nay
            </CardTitle>
            <div className="w-8 h-8 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center">
              <Thermometer className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline justify-between">
              <div className="text-3xl font-black text-white">142</div>
              <span className="text-xs font-semibold text-emerald-400 flex items-center gap-0.5">
                <TrendingUp className="w-3.5 h-3.5" /> 99.3%
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">141 đạt chuẩn • 1 cảnh báo</p>
          </CardContent>
        </Card>

        {/* KPI 2: Checklist */}
        <Card className="glassmorphism hover:border-slate-700 transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Checklist Vệ Sinh Ca
            </CardTitle>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <ClipboardCheck className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline justify-between">
              <div className="text-3xl font-black text-white">8/8</div>
              <span className="text-xs font-semibold text-emerald-400">100%</span>
            </div>
            <p className="text-xs text-emerald-400/90 mt-1">✓ Đã ký duyệt ca sáng</p>
          </CardContent>
        </Card>

        {/* KPI 3: Lô hàng truy xuất */}
        <Card className="glassmorphism hover:border-slate-700 transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Lô Hàng Đang Lưu Trữ
            </CardTitle>
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <PackageSearch className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline justify-between">
              <div className="text-3xl font-black text-white">32 lô</div>
              <Badge variant="warning" className="text-[10px]">2 cận date</Badge>
            </div>
            <p className="text-xs text-slate-400 mt-1">Tuân thủ nguyên tắc FIFO</p>
          </CardContent>
        </Card>

        {/* KPI 4: Trạm NFC */}
        <Card className="glassmorphism hover:border-slate-700 transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Trạm Kiểm Tra NFC
            </CardTitle>
            <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
              <Radio className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline justify-between">
              <div className="text-3xl font-black text-white">30 trạm</div>
              <span className="text-xs text-cyan-400 font-mono">100% Online</span>
            </div>
            <p className="text-xs text-slate-400 mt-1">Chống gian lận kiểm tra</p>
          </CardContent>
        </Card>
      </div>

      {/* Real-time Telemetry Watchlist & Activity Feed */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Telemetry Watchlist */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Thermometer className="w-5 h-5 text-orange-400" />
              <h3 className="text-base font-bold text-white">Bảng Giám Sát Thiết Bị Tới Hạn (Live Telemetry)</h3>
            </div>
            <Link href="/temperature" className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-medium">
              Xem tất cả thiết bị <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 gap-3.5">
            {equipmentWatchlist.map((eq, idx) => (
              <div 
                key={idx}
                className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="text-sm font-semibold text-white">{eq.name}</h4>
                    <p className="text-xs text-slate-400 mt-0.5">{eq.location}</p>
                  </div>
                  <Badge variant={eq.status === 'safe' ? 'success' : 'warning'}>
                    {eq.status === 'safe' ? 'Ổn định' : 'Cần chú ý'}
                  </Badge>
                </div>

                <div className="flex items-baseline justify-between pt-2 border-t border-slate-800/80">
                  <div>
                    <span className="text-2xl font-black font-mono text-white">
                      {eq.temp > 0 ? `+${eq.temp}` : eq.temp}°C
                    </span>
                    <span className="text-[11px] text-slate-400 ml-2">Ngưỡng: {eq.target}</span>
                  </div>
                  <span className="text-[10px] text-slate-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {eq.lastCheck}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Operational Activity Log */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white">Nhật Ký Thời Gian Thực</h3>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          </div>

          <Card className="glassmorphism">
            <CardContent className="p-4 space-y-3.5">
              {[
                { text: 'Nguyễn Văn An đã đo nhiệt độ Kho Đông Sâu #1 (-19.5°C)', time: '10 phút trước', user: 'NVA' },
                { text: 'Bếp trưởng Lê Hoàng Nam đã ký duyệt Checklist vệ sinh ca sáng', time: '25 phút trước', user: 'LHN' },
                { text: 'Nhận lô hàng LOT-2026-0924-A1 Thịt bò Úc Ribeye 50kg', time: '1 giờ trước', user: 'HT' },
                { text: 'Phạm Minh Đức quét thẻ NFC Trạm Bếp Nóng', time: '1.5 giờ trước', user: 'PMD' },
                { text: 'Hệ thống tự động đồng bộ 45 bản ghi lên Cloudflare / AWS Amplify', time: '2 giờ trước', user: 'SYS' },
              ].map((act, i) => (
                <div key={i} className="flex items-start gap-3 text-xs">
                  <div className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-400 font-bold flex items-center justify-center shrink-0 text-[11px] mt-0.5">
                    {act.user}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-slate-200 leading-snug">{act.text}</p>
                    <span className="text-[10px] text-slate-500 mt-0.5 block">{act.time}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
