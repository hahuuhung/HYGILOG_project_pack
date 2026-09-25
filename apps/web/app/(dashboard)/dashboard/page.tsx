'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Thermometer, 
  ClipboardCheck, 
  AlertTriangle, 
  Building2, 
  ShieldCheck, 
  ArrowUpRight, 
  Activity, 
  CheckCircle2, 
  Clock, 
  Radio, 
  Package, 
  Users, 
  Zap, 
  Flame, 
  Snowflake,
  TrendingUp,
  AlertOctagon,
  ChevronRight
} from 'lucide-react';
import { useAuthStore } from '@/stores/auth-store';
import Link from 'next/link';

export default function DashboardPage() {
  const user = useAuthStore(state => state.user);

  return (
    <div className="space-y-6 animate-slide-in">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-indigo-950/70 via-slate-900 to-slate-900/90 border border-indigo-500/20 backdrop-blur-md shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              HACCP Food Safety Real-time Surveillance Active
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Xin chào, {user?.name || 'Quản lý Hệ thống'} 👋
          </h1>
          <p className="text-sm text-slate-300">
            Hôm nay: <strong className="text-white">Thứ Sáu, 25 Tháng 9, 2026</strong> • Chuỗi 3 chi nhánh đang vận hành ổn định đạt chuẩn <strong className="text-emerald-400">Hạng A</strong>.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Link href="/temperature">
            <Button size="sm" className="bg-indigo-600 hover:bg-indigo-500 text-white gap-1.5 shadow-md shadow-indigo-600/20">
              <Thermometer className="w-4 h-4" />
              Đo Nhiệt Độ
            </Button>
          </Link>
          <Link href="/checklists">
            <Button size="sm" variant="outline" className="border-slate-700 hover:bg-slate-800 text-white gap-1.5">
              <ClipboardCheck className="w-4 h-4" />
              Checklist Ca
            </Button>
          </Link>
          <Link href="/corrective-actions">
            <Button size="sm" variant="secondary" className="bg-red-500/10 text-red-300 hover:bg-red-500/20 border border-red-500/30 gap-1.5">
              <AlertOctagon className="w-4 h-4" />
              Báo Sự Cố
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {/* KPI 1 */}
        <Card className="glassmorphism border-emerald-500/20 hover:border-emerald-500/40 transition">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Chỉ Số Tuân Thủ Chung
            </CardTitle>
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-emerald-400">98.4%</div>
            <div className="flex items-center gap-1.5 text-xs text-emerald-300/90 mt-1.5">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+1.2% so với tuần trước • Chuẩn Grade A</span>
            </div>
          </CardContent>
        </Card>

        {/* KPI 2 */}
        <Card className="glassmorphism border-orange-500/20 hover:border-orange-500/40 transition">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Nhiệt Độ Thiết Bị Hôm Nay
            </CardTitle>
            <Thermometer className="h-4 w-4 text-orange-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-white">124 lượt</div>
            <p className="text-xs text-slate-400 mt-1.5">
              122 lượt an toàn • <span className="text-red-400 font-semibold">2 cảnh báo đã xử lý</span>
            </p>
          </CardContent>
        </Card>

        {/* KPI 3 */}
        <Card className="glassmorphism border-indigo-500/20 hover:border-indigo-500/40 transition">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Checklist Hoàn Thành
            </CardTitle>
            <ClipboardCheck className="h-4 w-4 text-indigo-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-white">45 / 50</div>
            <div className="w-full bg-slate-800 rounded-full h-1.5 mt-2">
              <div className="bg-indigo-500 h-1.5 rounded-full" style={{ width: '90%' }} />
            </div>
            <p className="text-xs text-indigo-400 mt-1.5 font-medium">90% tiến độ ca sáng & trưa</p>
          </CardContent>
        </Card>

        {/* KPI 4 */}
        <Card className="glassmorphism border-amber-500/20 hover:border-amber-500/40 transition">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Sự Cố CAPA Đang Xử Lý
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-amber-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-amber-400">1</div>
            <p className="text-xs text-amber-300/80 mt-1.5">
              Tủ mát #02 đang thay gioăng • SLA: Còn 1h45p
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Command Center: 2 Columns */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
        {/* Left Column: CCP Control Board (2 Cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Critical Control Points Board */}
          <Card className="glassmorphism">
            <CardHeader className="pb-3 border-b border-slate-800">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base font-bold text-white flex items-center gap-2">
                    <Activity className="w-5 h-5 text-indigo-400" />
                    Bảng Giám Sát Điểm Kiểm Soát Tới Hạn (CCP Status Board)
                  </CardTitle>
                  <CardDescription>
                    Tình trạng thực địa tại 4 chốt an toàn theo quy chuẩn HACCP quốc tế
                  </CardDescription>
                </div>
                <Badge variant="success">An Toàn 100%</Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-4 space-y-3">
              {[
                {
                  code: 'CCP-1',
                  name: 'Tiếp Nhận Nguyên Liệu Thực Phẩm',
                  desc: 'Kiểm tra xe lạnh thịt tươi (-19.2°C), giấy kiểm dịch thú y hợp lệ',
                  status: 'pass',
                  value: 'Đạt chuẩn tiếp nhận',
                  icon: Package,
                  color: 'text-indigo-400',
                  bgColor: 'bg-indigo-500/10 border-indigo-500/20',
                },
                {
                  code: 'CCP-2',
                  name: 'Bảo Quản Kho Lạnh Sâu & Tủ Mát',
                  desc: 'Kho đông -18.5°C, Kho mát rau 3.2°C, Tủ hải sản dự phòng 1.5°C',
                  status: 'pass',
                  value: '24/24 thiết bị ổn định',
                  icon: Snowflake,
                  color: 'text-sky-400',
                  bgColor: 'bg-sky-500/10 border-sky-500/20',
                },
                {
                  code: 'CCP-3',
                  name: 'Xử Lý Nhiệt Nấu Chín Thực Phẩm',
                  desc: 'Nhiệt độ tâm gà chiên đạt 78.5°C (Yêu cầu tối thiểu ≥ 75°C)',
                  status: 'pass',
                  value: 'Đạt chuẩn diệt khuẩn',
                  icon: Flame,
                  color: 'text-orange-400',
                  bgColor: 'bg-orange-500/10 border-orange-500/20',
                },
                {
                  code: 'CCP-4',
                  name: 'Giữ Nóng Thức Ăn Bàn Tiệc & Buffet',
                  desc: 'Nồi súp và khay giữ nhiệt nóng 68.0°C (Yêu cầu tối thiểu ≥ 60°C)',
                  status: 'pass',
                  value: 'Đạt chuẩn giữ nóng',
                  icon: Clock,
                  color: 'text-amber-400',
                  bgColor: 'bg-amber-500/10 border-amber-500/20',
                },
              ].map((ccp, idx) => (
                <div 
                  key={idx}
                  className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between gap-4 hover:border-slate-700 transition"
                >
                  <div className="flex items-center gap-3.5">
                    <div className={`p-2.5 rounded-xl ${ccp.bgColor} ${ccp.color} border flex-shrink-0`}>
                      <ccp.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold px-1.5 py-0.2 rounded bg-slate-800 text-indigo-400 border border-slate-700">
                          {ccp.code}
                        </span>
                        <h4 className="text-sm font-bold text-white">{ccp.name}</h4>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">{ccp.desc}</p>
                    </div>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <span className="text-xs font-bold text-emerald-400 block">{ccp.value}</span>
                    <Badge variant="success" className="mt-1 text-[10px]">
                      Kiểm soát tốt
                    </Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Multi-Site Network Overview */}
          <Card className="glassmorphism">
            <CardHeader className="pb-3 border-b border-slate-800">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base font-bold text-white flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-indigo-400" />
                    Tình Trạng An Toàn Chuỗi Chi Nhánh (Multi-Site Status)
                  </CardTitle>
                  <CardDescription>Giám sát tổng thể các bếp nhà hàng trong hệ thống</CardDescription>
                </div>
                <Link href="/sites" className="text-xs text-indigo-400 hover:underline flex items-center">
                  Xem tất cả <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </CardHeader>
            <CardContent className="pt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { name: 'Landmark 81', code: 'LM81-01', compliance: 99.4, staff: 38, grade: 'Grade A', status: 'Hoạt động' },
                { name: 'Quận 1 - Đồng Khởi', code: 'DK-02', compliance: 98.1, staff: 26, grade: 'Grade A', status: 'Hoạt động' },
                { name: 'Hà Nội - Tây Hồ', code: 'TH-03', compliance: 97.6, staff: 30, grade: 'Grade A', status: 'Hoạt động' },
              ].map((site, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">{site.name}</span>
                    <Badge variant="outline" className="text-emerald-400 border-emerald-500/30 text-[10px]">
                      {site.grade}
                    </Badge>
                  </div>
                  <div className="text-2xl font-extrabold text-emerald-400">{site.compliance}%</div>
                  <div className="text-[11px] text-slate-400 flex items-center justify-between pt-1 border-t border-slate-800">
                    <span>{site.staff} nhân sự ca</span>
                    <span className="text-emerald-400">● {site.status}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Real-time HACCP Operations Feed (1 Col) */}
        <div className="space-y-6">
          <Card className="glassmorphism">
            <CardHeader className="pb-3 border-b border-slate-800">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-bold text-white flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  Nhật Ký Thao Tác Trực Tuyến
                </CardTitle>
                <span className="text-[11px] text-slate-400 font-mono">Live Feed</span>
              </div>
              <CardDescription>Cập nhật theo từng giây từ máy quét NFC và cảm biến</CardDescription>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              {[
                {
                  action: 'Đã hoàn thành Checklist Vệ Sinh Khử Trùng Bếp Ca Sáng',
                  user: 'Trần Thị B (Trưởng ca)',
                  time: '5 phút trước',
                  type: 'checklist',
                  color: 'text-emerald-400',
                  dot: 'bg-emerald-400',
                },
                {
                  action: 'Quẹt thẻ NFC kiểm tra nhiệt độ Tủ Mát Sashimi #02: 1.5°C',
                  user: 'Nguyễn Văn A (Bếp chính)',
                  time: '12 phút trước',
                  type: 'temp',
                  color: 'text-indigo-400',
                  dot: 'bg-indigo-400',
                },
                {
                  action: 'Tiếp nhận lô Thịt Bò Úc Prime 45kg (Mã LOT-20260924)',
                  user: 'Ngô Thanh Hà (Thủ kho)',
                  time: '28 phút trước',
                  type: 'batch',
                  color: 'text-amber-400',
                  dot: 'bg-amber-400',
                },
                {
                  action: 'Phát lệnh sửa chữa quạt làm mát (Sự cố CAPA-2026-081)',
                  user: 'Kỹ thuật viên bảo trì',
                  time: '45 phút trước',
                  type: 'capa',
                  color: 'text-red-400',
                  dot: 'bg-red-400',
                },
                {
                  action: 'Đã niêm phong tủ lưu mẫu 24h đối với 12 món ăn tiệc trưa',
                  user: 'Lê Hoàng Yến (QA)',
                  time: '1 giờ trước',
                  type: 'sample',
                  color: 'text-violet-400',
                  dot: 'bg-violet-400',
                },
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-3 text-xs">
                  <span className={`w-2 h-2 rounded-full ${item.dot} mt-1.5 flex-shrink-0`} />
                  <div className="flex-1 space-y-0.5">
                    <p className="text-white font-medium leading-relaxed">{item.action}</p>
                    <div className="flex items-center gap-2 text-[11px] text-slate-400">
                      <span>{item.user}</span>
                      <span>•</span>
                      <span className="text-slate-500">{item.time}</span>
                    </div>
                  </div>
                </div>
              ))}

              <div className="pt-3 border-t border-slate-800 text-center">
                <Link
                  href="/reports"
                  className="text-xs font-semibold text-indigo-400 hover:underline flex items-center justify-center gap-1"
                >
                  Xuất toàn bộ nhật ký kiểm toán hôm nay <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Compliance Certification Badge */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-900/40 to-slate-900/80 border border-indigo-500/20 space-y-2">
            <div className="flex items-center gap-2 text-indigo-300 font-bold text-xs uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Chứng Nhận Tiêu Chuẩn Quốc Tế
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Hệ thống HYGILOG tuân thủ nghiêm ngặt nguyên tắc <strong>Codex Alimentarius HACCP & ISO 22000:2018</strong> về an toàn vệ sinh thực phẩm nhà hàng.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

