'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Plus, 
  Thermometer, 
  Search, 
  Filter, 
  Download, 
  AlertTriangle, 
  CheckCircle2, 
  Building2, 
  Calendar,
  X,
  Radio
} from 'lucide-react';
import { formatDate, formatTemperature } from '@/lib/utils';

interface TempRecord {
  id: string;
  equipment: string;
  equipmentType: 'freezer' | 'chiller' | 'hot_holding' | 'cooking';
  temp: number;
  time: string;
  status: 'OK' | 'Cảnh báo' | 'Nguy hiểm';
  user: string;
  site: string;
  nfcVerified: boolean;
  notes?: string;
}

const initialRecords: TempRecord[] = [
  { 
    id: 'TR-1082', 
    equipment: 'Kho Đông Sâu #1', 
    equipmentType: 'freezer',
    temp: -19.2, 
    time: new Date(Date.now() - 1000 * 60 * 15).toISOString(), 
    status: 'OK', 
    user: 'Võ Thị Hương (Nhân viên)',
    site: 'Nhà hàng Phố Cổ',
    nfcVerified: true,
    notes: 'Quạt dàn lạnh chạy ổn định'
  },
  { 
    id: 'TR-1081', 
    equipment: 'Tủ Mát Salad & Sơ Chế', 
    equipmentType: 'chiller',
    temp: 5.8, 
    time: new Date(Date.now() - 1000 * 60 * 45).toISOString(), 
    status: 'Cảnh báo', 
    user: 'Nguyễn Văn An (Bếp phó)',
    site: 'Nhà hàng Phố Cổ',
    nfcVerified: true,
    notes: 'Vừa mở cửa bổ sung nguyên liệu đợt trưa'
  },
  { 
    id: 'TR-1080', 
    equipment: 'Bể Giữ Nóng Món Ăn (Buffet)', 
    equipmentType: 'hot_holding',
    temp: 68.5, 
    time: new Date(Date.now() - 1000 * 60 * 90).toISOString(), 
    status: 'OK', 
    user: 'Phạm Minh Đức',
    site: 'Khách sạn Sài Gòn Riverside',
    nfcVerified: false,
    notes: 'Đạt giới hạn tới hạn CCP2 (>= 63°C)'
  },
  { 
    id: 'TR-1079', 
    equipment: 'Chảo Chiên Ngập Dầu', 
    equipmentType: 'cooking',
    temp: 172.0, 
    time: new Date(Date.now() - 1000 * 60 * 150).toISOString(), 
    status: 'OK', 
    user: 'Lê Hoàng Nam (Bếp trưởng)',
    site: 'Nhà hàng Phố Cổ',
    nfcVerified: true,
  },
  { 
    id: 'TR-1078', 
    equipment: 'Tủ Trữ Thịt Tươi Sống #2', 
    equipmentType: 'chiller',
    temp: 7.4, 
    time: new Date(Date.now() - 1000 * 60 * 240).toISOString(), 
    status: 'Nguy hiểm', 
    user: 'Đặng Quốc Bảo (Thanh tra)',
    site: 'Bếp Trung Tâm Quận 1',
    nfcVerified: true,
    notes: 'Vượt giới hạn 2°C! Đã lập phiếu CAPA-2026-001'
  },
];

export default function TemperaturePage() {
  const [records, setRecords] = useState<TempRecord[]>(initialRecords);
  const [filterStatus, setFilterStatus] = useState<'all' | 'OK' | 'Cảnh báo' | 'Nguy hiểm'>('all');
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New record form
  const [newEntry, setNewEntry] = useState({
    equipment: 'Kho Đông Sâu #1',
    temp: -18.0,
    site: 'Nhà hàng Phố Cổ',
    notes: '',
    nfcVerified: true,
  });

  const determineStatus = (equipment: string, temp: number): 'OK' | 'Cảnh báo' | 'Nguy hiểm' => {
    if (equipment.includes('Kho Đông') || equipment.includes('Tủ Đông')) {
      if (temp <= -18) return 'OK';
      if (temp <= -15) return 'Cảnh báo';
      return 'Nguy hiểm';
    }
    if (equipment.includes('Mát') || equipment.includes('Trữ')) {
      if (temp >= 0 && temp <= 4) return 'OK';
      if (temp <= 6) return 'Cảnh báo';
      return 'Nguy hiểm';
    }
    if (equipment.includes('Nóng') || equipment.includes('Buffet')) {
      if (temp >= 63) return 'OK';
      if (temp >= 58) return 'Cảnh báo';
      return 'Nguy hiểm';
    }
    return 'OK';
  };

  const handleAddRecord = (e: React.FormEvent) => {
    e.preventDefault();
    const tempNum = Number(newEntry.temp);
    const calculatedStatus = determineStatus(newEntry.equipment, tempNum);

    const created: TempRecord = {
      id: `TR-${Math.floor(1000 + Math.random() * 9000)}`,
      equipment: newEntry.equipment,
      equipmentType: newEntry.equipment.includes('Đông') ? 'freezer' : newEntry.equipment.includes('Nóng') ? 'hot_holding' : 'chiller',
      temp: tempNum,
      time: new Date().toISOString(),
      status: calculatedStatus,
      user: 'Nguyễn Văn An (Bạn)',
      site: newEntry.site,
      nfcVerified: newEntry.nfcVerified,
      notes: newEntry.notes,
    };

    setRecords([created, ...records]);
    setIsModalOpen(false);
    setNewEntry({
      equipment: 'Kho Đông Sâu #1',
      temp: -18.0,
      site: 'Nhà hàng Phố Cổ',
      notes: '',
      nfcVerified: true,
    });
  };

  const filteredRecords = records.filter(r => {
    const matchesFilter = filterStatus === 'all' || r.status === filterStatus;
    const matchesSearch = r.equipment.toLowerCase().includes(search.toLowerCase()) || 
                          r.user.toLowerCase().includes(search.toLowerCase()) ||
                          r.site.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-3xl font-bold tracking-tight text-white">Ghi Nhận Nhiệt Độ CCP</h2>
            <Badge variant="outline" className="text-orange-400 border-orange-500/30 bg-orange-500/10">
              Điểm Kiểm Soát Tới Hạn (CCP1)
            </Badge>
          </div>
          <p className="text-slate-400 text-sm mt-1">
            Giám sát nhiệt độ chuỗi lạnh và nhiệt độ nấu nướng theo thời gian thực chuẩn HACCP
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button onClick={() => setIsModalOpen(true)} className="gap-2 shadow-lg shadow-orange-950 bg-orange-600 hover:bg-orange-500 text-white">
            <Plus className="w-4 h-4" />
            Đo nhiệt độ mới
          </Button>
        </div>
      </div>

      {/* KPI Overview */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="glassmorphism">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400">Tổng lượt đo hợp lệ</p>
              <h3 className="text-2xl font-bold text-white mt-1">
                {records.filter(r => r.status === 'OK').length} / {records.length}
              </h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="glassmorphism">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400">Cảnh báo chênh lệch</p>
              <h3 className="text-2xl font-bold text-amber-400 mt-1">
                {records.filter(r => r.status === 'Cảnh báo').length} cảnh báo
              </h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="glassmorphism border-rose-500/30">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-rose-400">Vi phạm tới hạn (CAPA)</p>
              <h3 className="text-2xl font-bold text-rose-400 mt-1">
                {records.filter(r => r.status === 'Nguy hiểm').length} vi phạm
              </h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Input 
            placeholder="Tìm theo thiết bị, nhân viên, cơ sở..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            icon={<Search className="w-4 h-4 text-slate-400" />}
            className="bg-slate-900 border-slate-800"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <Button 
            size="sm" 
            variant={filterStatus === 'all' ? 'primary' : 'outline'}
            onClick={() => setFilterStatus('all')}
          >
            Tất cả
          </Button>
          <Button 
            size="sm" 
            variant={filterStatus === 'OK' ? 'primary' : 'outline'}
            onClick={() => setFilterStatus('OK')}
          >
            Đạt chuẩn
          </Button>
          <Button 
            size="sm" 
            variant={filterStatus === 'Cảnh báo' ? 'primary' : 'outline'}
            onClick={() => setFilterStatus('Cảnh báo')}
          >
            Cảnh báo
          </Button>
          <Button 
            size="sm" 
            variant={filterStatus === 'Nguy hiểm' ? 'primary' : 'outline'}
            onClick={() => setFilterStatus('Nguy hiểm')}
          >
            Nguy hiểm
          </Button>
        </div>
      </div>

      {/* Table Card */}
      <Card className="glassmorphism">
        <CardContent className="p-0">
          <div className="rounded-xl overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-900/80 text-slate-300 border-b border-slate-800">
                <tr>
                  <th className="px-6 py-4 font-semibold">Mã / Thiết Bị</th>
                  <th className="px-6 py-4 font-semibold">Nhiệt Độ Đo</th>
                  <th className="px-6 py-4 font-semibold">Xác Thực NFC</th>
                  <th className="px-6 py-4 font-semibold">Thời Gian Đo</th>
                  <th className="px-6 py-4 font-semibold">Nhân Sự / Cơ Sở</th>
                  <th className="px-6 py-4 font-semibold">Trạng Thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {filteredRecords.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-white">{row.equipment}</div>
                      <div className="text-xs font-mono text-slate-500 mt-0.5">{row.id}</div>
                      {row.notes && (
                        <p className="text-[11px] text-slate-400 mt-1 italic">"{row.notes}"</p>
                      )}
                    </td>
                    <td className="px-6 py-4 font-bold text-base font-mono">
                      <span className={
                        row.status === 'OK' ? 'text-emerald-400' :
                        row.status === 'Cảnh báo' ? 'text-amber-400' : 'text-rose-400'
                      }>
                        {formatTemperature(row.temp)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs">
                      {row.nfcVerified ? (
                        <span className="flex items-center gap-1.5 text-cyan-400 font-medium">
                          <Radio className="w-3.5 h-3.5" />
                          Đã quét NFC
                        </span>
                      ) : (
                        <span className="text-slate-500">Nhập thủ công</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-400">
                      {formatDate(row.time)}
                    </td>
                    <td className="px-6 py-4 text-xs">
                      <div className="text-white font-medium">{row.user}</div>
                      <div className="text-slate-400 mt-0.5">{row.site}</div>
                    </td>
                    <td className="px-6 py-4">
                      {row.status === 'OK' && <Badge variant="success">Đạt chuẩn</Badge>}
                      {row.status === 'Cảnh báo' && <Badge variant="warning">Cảnh báo</Badge>}
                      {row.status === 'Nguy hiểm' && <Badge variant="danger">Vi phạm CCP</Badge>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Add Temperature Record Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-5">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Thermometer className="w-5 h-5 text-orange-400" />
                Ghi Nhận Nhiệt Độ Thiết Bị Mới
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddRecord} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Thiết bị giám sát *</label>
                <select
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                  value={newEntry.equipment}
                  onChange={(e) => setNewEntry({ ...newEntry, equipment: e.target.value })}
                >
                  <option value="Kho Đông Sâu #1">Kho Đông Sâu #1 (Chuẩn: ≤ -18°C)</option>
                  <option value="Tủ Mát Salad & Sơ Chế">Tủ Mát Salad & Sơ Chế (Chuẩn: 0°C đến 4°C)</option>
                  <option value="Tủ Trữ Thịt Tươi Sống #2">Tủ Trữ Thịt Tươi Sống #2 (Chuẩn: 0°C đến 2°C)</option>
                  <option value="Bể Giữ Nóng Món Ăn (Buffet)">Bể Giữ Nóng Món Ăn (Buffet) (Chuẩn: ≥ 63°C)</option>
                  <option value="Chảo Chiên Ngập Dầu">Chảo Chiên Ngập Dầu (Chuẩn: 160°C - 180°C)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Nhiệt độ đọc được (°C) *</label>
                <Input 
                  type="number"
                  step="0.1"
                  value={newEntry.temp}
                  onChange={(e) => setNewEntry({ ...newEntry, temp: parseFloat(e.target.value) || 0 })}
                  className="text-lg font-bold font-mono"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Cơ sở hoạt động</label>
                <select
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                  value={newEntry.site}
                  onChange={(e) => setNewEntry({ ...newEntry, site: e.target.value })}
                >
                  <option value="Nhà hàng Phố Cổ">Nhà hàng Phố Cổ (Trụ sở)</option>
                  <option value="Khách sạn Sài Gòn Riverside">Khách sạn Sài Gòn Riverside</option>
                  <option value="Bếp Trung Tâm Quận 1">Bếp Trung Tâm Quận 1</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Ghi chú quan sát cảm quan</label>
                <Input 
                  placeholder="VD: Không đọng đá, gioăng khít..."
                  value={newEntry.notes}
                  onChange={(e) => setNewEntry({ ...newEntry, notes: e.target.value })}
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input 
                  type="checkbox"
                  id="nfcCheck"
                  checked={newEntry.nfcVerified}
                  onChange={(e) => setNewEntry({ ...newEntry, nfcVerified: e.target.checked })}
                  className="w-4 h-4 accent-indigo-600 rounded cursor-pointer"
                />
                <label htmlFor="nfcCheck" className="text-xs text-slate-300 cursor-pointer">
                  Xác nhận đã quét thẻ NFC gắn tại thiết bị
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                  Hủy
                </Button>
                <Button type="submit" variant="primary" className="bg-orange-600 hover:bg-orange-500">
                  Lưu số đo nhiệt độ
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
