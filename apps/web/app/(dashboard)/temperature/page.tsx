'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Modal } from '@/components/ui/modal';
import { 
  Plus, 
  Thermometer, 
  Search, 
  Filter, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  User, 
  Building2, 
  ArrowUpRight,
  TrendingDown,
  Warehouse,
  Flame,
  Snowflake,
  ShieldCheck
} from 'lucide-react';
import { formatDate, formatTemperature } from '@/lib/utils';
import Link from 'next/link';

interface TempLog {
  id: string;
  equipment: string;
  location: string;
  category: 'freezer' | 'chiller' | 'cooking' | 'holding';
  temp: number;
  minAllowed: number;
  maxAllowed: number;
  time: string;
  status: 'compliant' | 'warning' | 'critical';
  user: string;
  notes?: string;
}

const initialTempLogs: TempLog[] = [
  { 
    id: 'TEMP-101', 
    equipment: 'Kho đông sâu thịt tươi #01', 
    location: 'Tầng hầm B1 - Kho lạnh trung tâm', 
    category: 'freezer', 
    temp: -18.5, 
    minAllowed: -22, 
    maxAllowed: -18, 
    time: new Date().toISOString(), 
    status: 'compliant', 
    user: 'Nguyễn Văn A' 
  },
  { 
    id: 'TEMP-102', 
    equipment: 'Tủ mát bảo quản hải sản sashimi', 
    location: 'Bếp lạnh sashimi - Quầy B', 
    category: 'chiller', 
    temp: 6.8, 
    minAllowed: 0, 
    maxAllowed: 4, 
    time: new Date(Date.now() - 1800000).toISOString(), 
    status: 'critical', 
    user: 'Trần Thị B',
    notes: 'Nhiệt độ vượt ngưỡng 4°C. Đã lập lệnh chuyển kho dự phòng.'
  },
  { 
    id: 'TEMP-103', 
    equipment: 'Tủ mát trưng bày rau salad', 
    location: 'Bếp lạnh sơ chế', 
    category: 'chiller', 
    temp: 3.2, 
    minAllowed: 0, 
    maxAllowed: 4, 
    time: new Date(Date.now() - 3600000).toISOString(), 
    status: 'compliant', 
    user: 'Phạm Thuỳ Dung' 
  },
  { 
    id: 'TEMP-104', 
    equipment: 'Bếp chiên nhúng gà giòn #02', 
    location: 'Bếp nóng Á', 
    category: 'cooking', 
    temp: 178.5, 
    minAllowed: 175, 
    maxAllowed: 190, 
    time: new Date(Date.now() - 5400000).toISOString(), 
    status: 'compliant', 
    user: 'Lê Văn C' 
  },
  { 
    id: 'TEMP-105', 
    equipment: 'Tủ giữ nóng canh súp buffet', 
    location: 'Quầy phục vụ khách tầng 1', 
    category: 'holding', 
    temp: 68.0, 
    minAllowed: 60, 
    maxAllowed: 85, 
    time: new Date(Date.now() - 7200000).toISOString(), 
    status: 'compliant', 
    user: 'Hoàng Anh Tuấn' 
  },
  { 
    id: 'TEMP-106', 
    equipment: 'Kho đông lạnh kem & bơ sữa', 
    location: 'Kho tầng hầm B1', 
    category: 'freezer', 
    temp: -16.2, 
    minAllowed: -22, 
    maxAllowed: -18, 
    time: new Date(Date.now() - 9000000).toISOString(), 
    status: 'warning', 
    user: 'Ngô Thanh Hà',
    notes: 'Đang trong chu kỳ xả đá tự động định kỳ'
  },
];

export default function TemperaturePage() {
  const [logs, setLogs] = useState<TempLog[]>(initialTempLogs);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New form
  const [form, setForm] = useState({
    equipment: '',
    location: '',
    category: 'chiller' as TempLog['category'],
    temp: '',
    notes: '',
  });

  const handleCreateRecord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.equipment || !form.temp) return;

    const val = parseFloat(form.temp);
    let minAllowed = 0;
    let maxAllowed = 4;
    let status: TempLog['status'] = 'compliant';

    if (form.category === 'freezer') {
      minAllowed = -22;
      maxAllowed = -18;
      if (val > -18) status = val > -15 ? 'critical' : 'warning';
    } else if (form.category === 'chiller') {
      minAllowed = 0;
      maxAllowed = 4;
      if (val > 4 || val < 0) status = val > 6 ? 'critical' : 'warning';
    } else if (form.category === 'cooking') {
      minAllowed = 175;
      maxAllowed = 190;
      if (val < 175) status = 'warning';
    } else if (form.category === 'holding') {
      minAllowed = 60;
      maxAllowed = 85;
      if (val < 60) status = 'critical';
    }

    const newRecord: TempLog = {
      id: `TEMP-${Date.now().toString().slice(-4)}`,
      equipment: form.equipment,
      location: form.location || 'Khu chế biến trung tâm',
      category: form.category,
      temp: val,
      minAllowed,
      maxAllowed,
      time: new Date().toISOString(),
      status,
      user: 'Nguyễn Văn A (Đã đăng nhập)',
      notes: form.notes,
    };

    setLogs([newRecord, ...logs]);
    setIsModalOpen(false);
    setForm({
      equipment: '',
      location: '',
      category: 'chiller',
      temp: '',
      notes: '',
    });
  };

  const filteredLogs = logs.filter(item => {
    const matchesSearch = 
      item.equipment.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = categoryFilter === 'all' || item.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  const totalLogs = logs.length;
  const compliantCount = logs.filter(l => l.status === 'compliant').length;
  const warningCount = logs.filter(l => l.status === 'warning' || l.status === 'critical').length;
  const complianceRate = Math.round((compliantCount / totalLogs) * 100);

  return (
    <div className="space-y-6 animate-slide-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-orange-500/10 text-orange-400 border border-orange-500/20">
            <Thermometer className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">Ghi Nhận Nhiệt Độ Thiết Bị</h1>
            <p className="text-slate-400 text-sm mt-0.5">Giám sát các điểm kiểm soát tới hạn (CCP-2 & CCP-3), kho lạnh sâu, tủ mát và quầy giữ nóng</p>
          </div>
        </div>

        <Button 
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-500 text-white gap-2 shadow-lg shadow-indigo-600/25"
        >
          <Plus className="w-4 h-4" />
          Ghi Nhận Mới
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="glassmorphism border-indigo-500/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Lượt kiểm tra hôm nay</CardTitle>
            <Thermometer className="w-4 h-4 text-indigo-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{totalLogs}</div>
            <p className="text-xs text-slate-400 mt-1">Chu kỳ định kỳ 2 giờ/lần</p>
          </CardContent>
        </Card>

        <Card className="glassmorphism border-emerald-500/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Tỷ lệ trong ngưỡng an toàn</CardTitle>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-400">{complianceRate}%</div>
            <p className="text-xs text-slate-400 mt-1">{compliantCount} thiết bị đạt chuẩn HACCP</p>
          </CardContent>
        </Card>

        <Card className="glassmorphism border-red-500/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Cảnh báo lệch chuẩn</CardTitle>
            <AlertTriangle className="w-4 h-4 text-red-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-400">{warningCount}</div>
            <p className="text-xs text-red-400/80 mt-1">Cần khắc phục kịp thời</p>
          </CardContent>
        </Card>

        <Card className="glassmorphism border-slate-700/60">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Kênh đo tự động (IoT)</CardTitle>
            <ShieldCheck className="w-4 h-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-200">100% Online</div>
            <p className="text-xs text-emerald-400 mt-1">Cảm biến IoT đồng bộ thời gian thực</p>
          </CardContent>
        </Card>
      </div>

      {/* Filter and Search Bar */}
      <Card className="glassmorphism">
        <CardContent className="p-4 space-y-4">
          <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
            <div className="w-full md:w-96">
              <Input
                placeholder="Tìm theo thiết bị, vị trí, người đo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                icon={<Search className="w-4 h-4" />}
                className="bg-slate-900/60 border-slate-700/60"
              />
            </div>

            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs text-slate-400 mr-1 flex items-center gap-1">
                <Filter className="w-3.5 h-3.5" /> Thiết bị:
              </span>
              <button
                onClick={() => setCategoryFilter('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                  categoryFilter === 'all' 
                    ? 'bg-indigo-600 text-white shadow-sm' 
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                Tất cả ({logs.length})
              </button>
              <button
                onClick={() => setCategoryFilter('freezer')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition flex items-center gap-1 ${
                  categoryFilter === 'freezer' 
                    ? 'bg-indigo-600 text-white shadow-sm' 
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <Snowflake className="w-3 h-3 text-sky-400" /> Kho đông (≤ -18°C)
              </button>
              <button
                onClick={() => setCategoryFilter('chiller')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                  categoryFilter === 'chiller' 
                    ? 'bg-indigo-600 text-white shadow-sm' 
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                Tủ mát (0-4°C)
              </button>
              <button
                onClick={() => setCategoryFilter('cooking')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition flex items-center gap-1 ${
                  categoryFilter === 'cooking' 
                    ? 'bg-indigo-600 text-white shadow-sm' 
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <Flame className="w-3 h-3 text-orange-400" /> Nấu chín / Chiên
              </button>
              <button
                onClick={() => setCategoryFilter('holding')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                  categoryFilter === 'holding' 
                    ? 'bg-indigo-600 text-white shadow-sm' 
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                Giữ nóng (&gt;60°C)
              </button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Table */}
      <Card className="glassmorphism overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-900/80 text-slate-300 border-b border-slate-800">
              <tr>
                <th className="px-6 py-4 font-semibold">Thiết Bị & Vị Trí</th>
                <th className="px-6 py-4 font-semibold">Nhiệt Độ Thực Tế</th>
                <th className="px-6 py-4 font-semibold">Ngưỡng An Toàn (CCP)</th>
                <th className="px-6 py-4 font-semibold">Thời Gian Ghi Nhận</th>
                <th className="px-6 py-4 font-semibold">Người Đo</th>
                <th className="px-6 py-4 font-semibold">Trạng Thái</th>
                <th className="px-6 py-4 font-semibold text-right">Khắc Phục</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredLogs.map((row) => (
                <tr key={row.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        row.status === 'compliant' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                        row.status === 'warning' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                        'bg-red-500/10 text-red-400 border border-red-500/20'
                      }`}>
                        <Thermometer className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-semibold text-white">{row.equipment}</div>
                        <div className="text-xs text-slate-400 mt-0.5">{row.location}</div>
                        {row.notes && (
                          <div className="text-[11px] text-amber-400 italic mt-0.5">"{row.notes}"</div>
                        )}
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <span className={`text-base font-bold font-mono ${
                      row.status === 'compliant' ? 'text-emerald-400' :
                      row.status === 'warning' ? 'text-amber-400' : 'text-red-400'
                    }`}>
                      {formatTemperature(row.temp)}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-xs font-mono text-slate-400">
                    {row.minAllowed}°C đến {row.maxAllowed}°C
                  </td>

                  <td className="px-6 py-4 text-xs text-slate-300">
                    {formatDate(row.time)}
                  </td>

                  <td className="px-6 py-4 text-xs text-slate-300">
                    {row.user}
                  </td>

                  <td className="px-6 py-4">
                    {row.status === 'compliant' && <Badge variant="success">Đạt chuẩn</Badge>}
                    {row.status === 'warning' && <Badge variant="warning">Cảnh báo</Badge>}
                    {row.status === 'critical' && <Badge variant="destructive">Vi phạm CCP</Badge>}
                  </td>

                  <td className="px-6 py-4 text-right">
                    {row.status !== 'compliant' ? (
                      <Link href="/corrective-actions">
                        <Button size="sm" variant="secondary" className="bg-red-500/20 text-red-300 hover:bg-red-500/30 text-xs border border-red-500/30">
                          Tạo CAPA →
                        </Button>
                      </Link>
                    ) : (
                      <span className="text-xs text-emerald-400 font-semibold">Tốt</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Modal: Add Record */}
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Thêm Bản Ghi Nhiệt Độ Mới (Kiểm Tra CCP)"
        >
          <form onSubmit={handleCreateRecord} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">Tên thiết bị / Vị trí đo *</label>
              <Input
                placeholder="VD: Tủ Mát Hải Sản Sashimi #02"
                value={form.equipment}
                onChange={(e) => setForm({ ...form, equipment: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">Loại kiểm soát</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value as any })}
                  className="flex h-9 w-full rounded-md border border-slate-700 bg-slate-900/50 px-3 py-1 text-sm text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-500"
                >
                  <option value="chiller">Tủ mát (0°C đến 4°C)</option>
                  <option value="freezer">Kho đông sâu (≤ -18°C)</option>
                  <option value="cooking">Nấu chín / Bếp chiên (≥ 75°C / 175°C)</option>
                  <option value="holding">Giữ nóng buffet (≥ 60°C)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">Nhiệt độ đo được (°C) *</label>
                <Input
                  type="number"
                  step="0.1"
                  placeholder="VD: 3.2 hoặc -18.5"
                  value={form.temp}
                  onChange={(e) => setForm({ ...form, temp: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">Khu vực / Phòng</label>
              <Input
                placeholder="VD: Bếp Âu tầng 1"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">Ghi chú hiện trường</label>
              <Input
                placeholder="Tình trạng thực phẩm, đóng kín cửa tủ..."
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
              />
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                Hủy bỏ
              </Button>
              <Button type="submit" className="bg-indigo-600 hover:bg-indigo-500 text-white">
                Lưu Nhật Ký Nhiệt Độ
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
