'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Modal } from '@/components/ui/modal';
import { 
  Smartphone, 
  Search, 
  Plus, 
  Radio, 
  MapPin, 
  CheckCircle2, 
  Clock, 
  User, 
  AlertTriangle, 
  RefreshCw, 
  Sparkles, 
  Activity,
  Layers,
  Thermometer,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { formatDate } from '@/lib/utils';

interface NfcTagItem {
  id: string;
  tagId: string; // Physical chip ID
  name: string;
  location: string;
  area: string;
  assignedType: 'equipment' | 'location' | 'checkpoint';
  lastScannedAt: string;
  lastScannedBy: string;
  totalScans: number;
  batteryLevel?: number;
  isActive: boolean;
}

interface NfcScanLog {
  id: string;
  tagId: string;
  tagName: string;
  location: string;
  scannedBy: string;
  action: 'check_in' | 'temperature_log' | 'checklist_start' | 'sanitization';
  scannedAt: string;
  status: 'valid' | 'warning';
}

const initialTags: NfcTagItem[] = [
  {
    id: 'TAG-001',
    tagId: 'NFC-KL-01',
    name: 'Thẻ Kiểm Soát Kho Lạnh Sâu #01',
    location: 'Kho lạnh thịt tươi - Tầng hầm B1',
    area: 'Kho thực phẩm',
    assignedType: 'equipment',
    lastScannedAt: '2026-09-25T07:45:00Z',
    lastScannedBy: 'Nguyễn Văn A (Bếp chính)',
    totalScans: 342,
    batteryLevel: 95,
    isActive: true,
  },
  {
    id: 'TAG-002',
    tagId: 'NFC-TM-02',
    name: 'Thẻ Tủ Mát Hải Sản Sashimi',
    location: 'Khu vực quầy lạnh Bếp Nhật',
    area: 'Bếp lạnh',
    assignedType: 'equipment',
    lastScannedAt: '2026-09-25T08:10:00Z',
    lastScannedBy: 'Trần Thị B (Trưởng ca)',
    totalScans: 512,
    batteryLevel: 88,
    isActive: true,
  },
  {
    id: 'TAG-003',
    tagId: 'NFC-BN-03',
    name: 'Thẻ Trạm Chiên & Nướng Nhiệt Độ Cao',
    location: 'Bếp nóng trung tâm - Bếp Á',
    area: 'Bếp nóng',
    assignedType: 'location',
    lastScannedAt: '2026-09-25T06:30:00Z',
    lastScannedBy: 'Lê Văn C (Nhân viên)',
    totalScans: 289,
    batteryLevel: 92,
    isActive: true,
  },
  {
    id: 'TAG-004',
    tagId: 'NFC-RT-04',
    name: 'Trạm Khử Trùng Rửa Tay Cửa Bếp',
    location: 'Lối vào nhân viên Bếp Bánh',
    area: 'Vệ sinh kiểm soát',
    assignedType: 'checkpoint',
    lastScannedAt: '2026-09-25T08:20:00Z',
    lastScannedBy: 'Phạm Thuỳ Dung (Phụ bếp)',
    totalScans: 890,
    batteryLevel: 100,
    isActive: true,
  },
  {
    id: 'TAG-005',
    tagId: 'NFC-GN-05',
    name: 'Thẻ Điểm Tiếp Nhận Hàng Cung Ứng',
    location: 'Cửa nhận hàng Loading Bay 02',
    area: 'Khu giao nhận',
    assignedType: 'checkpoint',
    lastScannedAt: '2026-09-24T18:00:00Z',
    lastScannedBy: 'Ngô Thanh Hà (Thủ kho)',
    totalScans: 198,
    batteryLevel: 75,
    isActive: false,
  },
];

const initialLogs: NfcScanLog[] = [
  {
    id: 'LOG-1',
    tagId: 'NFC-RT-04',
    tagName: 'Trạm Khử Trùng Rửa Tay Cửa Bếp',
    location: 'Lối vào nhân viên Bếp Bánh',
    scannedBy: 'Phạm Thuỳ Dung (Phụ bếp)',
    action: 'sanitization',
    scannedAt: '2026-09-25T08:20:00Z',
    status: 'valid',
  },
  {
    id: 'LOG-2',
    tagId: 'NFC-TM-02',
    tagName: 'Thẻ Tủ Mát Hải Sản Sashimi',
    location: 'Khu vực quầy lạnh Bếp Nhật',
    scannedBy: 'Trần Thị B (Trưởng ca)',
    action: 'temperature_log',
    scannedAt: '2026-09-25T08:10:00Z',
    status: 'valid',
  },
  {
    id: 'LOG-3',
    tagId: 'NFC-KL-01',
    tagName: 'Thẻ Kiểm Soát Kho Lạnh Sâu #01',
    location: 'Kho lạnh thịt tươi - Tầng hầm B1',
    scannedBy: 'Nguyễn Văn A (Bếp chính)',
    action: 'check_in',
    scannedAt: '2026-09-25T07:45:00Z',
    status: 'valid',
  },
  {
    id: 'LOG-4',
    tagId: 'NFC-BN-03',
    tagName: 'Thẻ Trạm Chiên & Nướng Nhiệt Độ Cao',
    location: 'Bếp nóng trung tâm - Bếp Á',
    scannedBy: 'Lê Văn C (Nhân viên)',
    action: 'checklist_start',
    scannedAt: '2026-09-25T06:30:00Z',
    status: 'valid',
  },
];

export default function NfcPage() {
  const [tags, setTags] = useState<NfcTagItem[]>(initialTags);
  const [logs, setLogs] = useState<NfcScanLog[]>(initialLogs);
  const [searchTerm, setSearchTerm] = useState('');
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationToast, setSimulationToast] = useState<string | null>(null);

  // New tag form
  const [newTag, setNewTag] = useState({
    tagId: '',
    name: '',
    location: '',
    area: 'Kho thực phẩm',
    assignedType: 'equipment' as NfcTagItem['assignedType'],
  });

  const handleRegisterTag = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTag.tagId || !newTag.name) return;

    const created: NfcTagItem = {
      id: `TAG-${Date.now().toString().slice(-4)}`,
      tagId: newTag.tagId.toUpperCase(),
      name: newTag.name,
      location: newTag.location || 'Khu chế biến trung tâm',
      area: newTag.area,
      assignedType: newTag.assignedType,
      lastScannedAt: new Date().toISOString(),
      lastScannedBy: 'Chưa có lượt quét',
      totalScans: 0,
      batteryLevel: 100,
      isActive: true,
    };

    setTags([created, ...tags]);
    setIsRegisterModalOpen(false);
    setNewTag({
      tagId: '',
      name: '',
      location: '',
      area: 'Kho thực phẩm',
      assignedType: 'equipment',
    });
  };

  const handleSimulateScan = (tag: NfcTagItem) => {
    setIsSimulating(true);
    setSimulationToast(`Đang quẹt thẻ NFC: ${tag.tagId} (${tag.name})...`);

    setTimeout(() => {
      const now = new Date().toISOString();
      const actions: NfcScanLog['action'][] = ['temperature_log', 'sanitization', 'check_in', 'checklist_start'];
      const chosenAction = actions[Math.floor(Math.random() * actions.length)];

      const newLogEntry: NfcScanLog = {
        id: `LOG-${Date.now()}`,
        tagId: tag.tagId,
        tagName: tag.name,
        location: tag.location,
        scannedBy: 'Nguyễn Văn A (Thiết bị di động)',
        action: chosenAction,
        scannedAt: now,
        status: 'valid',
      };

      setLogs([newLogEntry, ...logs]);
      setTags(tags.map(t => {
        if (t.id === tag.id) {
          return {
            ...t,
            lastScannedAt: now,
            lastScannedBy: 'Nguyễn Văn A (Thiết bị di động)',
            totalScans: t.totalScans + 1,
          };
        }
        return t;
      }));

      setIsSimulating(false);
      setSimulationToast(`Quét thành công thẻ ${tag.tagId}! Dữ liệu xác thực vị trí hợp lệ.`);
      setTimeout(() => setSimulationToast(null), 4000);
    }, 800);
  };

  const actionLabels: Record<NfcScanLog['action'], { label: string; badge: string }> = {
    check_in: { label: 'Check-in Ca trực', badge: 'default' },
    temperature_log: { label: 'Xác thực Đo nhiệt độ', badge: 'warning' },
    checklist_start: { label: 'Bắt đầu Checklist', badge: 'success' },
    sanitization: { label: 'Khử khuẩn tay & thớt', badge: 'secondary' },
  };

  const filteredTags = tags.filter(t => 
    t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.tagId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activeCount = tags.filter(t => t.isActive).length;
  const totalScansAll = tags.reduce((acc, curr) => acc + curr.totalScans, 0);

  return (
    <div className="space-y-6 animate-slide-in">
      {/* Toast notification */}
      {simulationToast && (
        <div className="fixed top-20 right-6 z-50 bg-indigo-600 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 border border-indigo-400/40 animate-slide-in">
          <Zap className="w-5 h-5 text-amber-300 animate-bounce" />
          <span className="text-sm font-medium">{simulationToast}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-violet-500/10 text-violet-400 border border-violet-500/20">
            <Radio className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">Quản Lý Thẻ NFC & Điểm Kiểm Tra</h1>
            <p className="text-slate-400 text-sm mt-0.5">Xác thực vị trí hiện trường thực tế, chống gian lận đo nhiệt độ và làm checklist từ xa</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button 
            onClick={() => setIsRegisterModalOpen(true)}
            className="bg-indigo-600 hover:bg-indigo-500 text-white gap-2 shadow-lg shadow-indigo-600/25"
          >
            <Plus className="w-4 h-4" />
            Đăng Ký Thẻ NFC Mới
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="glassmorphism border-violet-500/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Thẻ đang hoạt động</CardTitle>
            <Radio className="w-4 h-4 text-violet-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{activeCount} / {tags.length}</div>
            <p className="text-xs text-emerald-400 mt-1">Độ phủ 100% các điểm CCP trọng yếu</p>
          </CardContent>
        </Card>

        <Card className="glassmorphism border-indigo-500/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Tổng lượt chạm (Scans)</CardTitle>
            <Activity className="w-4 h-4 text-indigo-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-indigo-400">{totalScansAll.toLocaleString()}</div>
            <p className="text-xs text-slate-400 mt-1">Lịch sử xác thực không thể làm giả</p>
          </CardContent>
        </Card>

        <Card className="glassmorphism border-emerald-500/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Tỷ lệ tuân thủ vị trí</CardTitle>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-400">99.2%</div>
            <p className="text-xs text-slate-400 mt-1">Xác thực GPS + NFC khớp 100%</p>
          </CardContent>
        </Card>

        <Card className="glassmorphism border-amber-500/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Thẻ cần kiểm tra</CardTitle>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-400">1</div>
            <p className="text-xs text-amber-400/80 mt-1">1 thẻ bị ngắt kết nối tại Loading Bay</p>
          </CardContent>
        </Card>
      </div>

      {/* Grid: 2 Columns (Tags List & Live Scan Feed) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: NFC Tags Management (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="glassmorphism">
            <CardHeader className="pb-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <CardTitle className="text-lg">Danh Sách Trạm Thẻ NFC Đã Gán</CardTitle>
                  <CardDescription>Bấm nút "Mô phỏng Quẹt thẻ" để kiểm tra tính năng xác thực thực địa</CardDescription>
                </div>
                <div className="w-full sm:w-64">
                  <Input
                    placeholder="Tìm mã thẻ, tên thiết bị..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    icon={<Search className="w-4 h-4" />}
                    className="h-8 text-xs bg-slate-900/60"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-slate-900/80 text-slate-300 border-b border-slate-800">
                    <tr>
                      <th className="px-5 py-3 font-semibold">Mã & Tên Trạm NFC</th>
                      <th className="px-5 py-3 font-semibold">Vị Trí & Khu Vực</th>
                      <th className="px-5 py-3 font-semibold">Lần Quét Cuối</th>
                      <th className="px-5 py-3 font-semibold">Trạng Thái</th>
                      <th className="px-5 py-3 font-semibold text-right">Mô Phỏng Chạm</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80">
                    {filteredTags.map((tag) => (
                      <tr key={tag.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400 flex-shrink-0">
                              <Radio className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="font-semibold text-white text-sm">{tag.name}</div>
                              <div className="text-xs font-mono text-violet-400 mt-0.5">{tag.tagId}</div>
                            </div>
                          </div>
                        </td>

                        <td className="px-5 py-4">
                          <div className="text-xs text-slate-200 flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                            <span className="truncate max-w-[150px]">{tag.location}</span>
                          </div>
                          <div className="text-[11px] text-slate-500 mt-0.5">{tag.area}</div>
                        </td>

                        <td className="px-5 py-4">
                          <div className="text-xs text-slate-300">{formatDate(tag.lastScannedAt)}</div>
                          <div className="text-[11px] text-slate-400 truncate max-w-[140px] mt-0.5">{tag.lastScannedBy}</div>
                        </td>

                        <td className="px-5 py-4">
                          {tag.isActive ? (
                            <Badge variant="success">Hoạt động</Badge>
                          ) : (
                            <Badge variant="destructive">Tạm khóa</Badge>
                          )}
                          <div className="text-[11px] text-slate-500 mt-1 font-mono">{tag.totalScans} lượt quét</div>
                        </td>

                        <td className="px-5 py-4 text-right">
                          <Button
                            size="sm"
                            variant="secondary"
                            disabled={!tag.isActive || isSimulating}
                            onClick={() => handleSimulateScan(tag)}
                            className="bg-indigo-600/20 text-indigo-300 hover:bg-indigo-600/40 border border-indigo-500/30 text-xs gap-1.5"
                          >
                            <Zap className="w-3.5 h-3.5 text-amber-300" />
                            Quẹt NFC
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Real-time Scan Feed */}
        <div className="space-y-4">
          <Card className="glassmorphism">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  Nhật Ký Quẹt Thẻ Real-time
                </CardTitle>
                <span className="text-xs text-slate-400 font-mono">Live Sync</span>
              </div>
              <CardDescription>Các thao tác vừa được kích hoạt qua chip NFC</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {logs.map((log) => {
                const actionInfo = actionLabels[log.action] || { label: log.action, badge: 'default' };
                return (
                  <div 
                    key={log.id} 
                    className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/50 space-y-2 hover:border-slate-600 transition"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="text-xs font-bold text-white">{log.tagName}</div>
                        <div className="text-[11px] font-mono text-indigo-400 mt-0.5">{log.tagId}</div>
                      </div>
                      <Badge variant={actionInfo.badge as any}>
                        {actionInfo.label}
                      </Badge>
                    </div>

                    <div className="text-xs text-slate-300 flex items-center justify-between pt-1 border-t border-slate-700/40">
                      <span className="flex items-center gap-1 text-slate-400">
                        <User className="w-3 h-3 text-slate-400" /> {log.scannedBy}
                      </span>
                      <span className="text-[11px] text-slate-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {formatDate(log.scannedAt)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modal: Register New NFC Tag */}
      {isRegisterModalOpen && (
        <Modal
          isOpen={isRegisterModalOpen}
          onClose={() => setIsRegisterModalOpen(false)}
          title="Đăng Ký Điểm Kiểm Soát Thẻ NFC Mới"
        >
          <form onSubmit={handleRegisterTag} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">Mã Chip / UID Thẻ Vật Lý *</label>
              <Input
                placeholder="VD: NFC-KHO-06"
                value={newTag.tagId}
                onChange={(e) => setNewTag({ ...newTag, tagId: e.target.value })}
                required
              />
              <p className="text-[11px] text-slate-500">Mã in laser trên bề mặt thẻ chip NTAG213 / NTAG215</p>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">Tên trạm / Thiết bị gán thẻ *</label>
              <Input
                placeholder="VD: Kho Mát Rau Củ VietGAP"
                value={newTag.name}
                onChange={(e) => setNewTag({ ...newTag, name: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">Khu vực phân vùng</label>
                <select
                  value={newTag.area}
                  onChange={(e) => setNewTag({ ...newTag, area: e.target.value })}
                  className="flex h-9 w-full rounded-md border border-slate-700 bg-slate-900/50 px-3 py-1 text-sm text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-500"
                >
                  <option value="Kho thực phẩm">Kho thực phẩm</option>
                  <option value="Bếp lạnh">Bếp lạnh</option>
                  <option value="Bếp nóng">Bếp nóng</option>
                  <option value="Vệ sinh kiểm soát">Vệ sinh kiểm soát</option>
                  <option value="Khu giao nhận">Khu giao nhận</option>
                  <option value="Quầy phục vụ">Quầy phục vụ</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">Loại điểm gán</label>
                <select
                  value={newTag.assignedType}
                  onChange={(e) => setNewTag({ ...newTag, assignedType: e.target.value as any })}
                  className="flex h-9 w-full rounded-md border border-slate-700 bg-slate-900/50 px-3 py-1 text-sm text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-500"
                >
                  <option value="equipment">Thiết bị bảo quản (Tủ lạnh, kho)</option>
                  <option value="location">Trạm thao tác (Bàn thớt, bếp)</option>
                  <option value="checkpoint">Chốt kiểm soát (Cửa ra vào, trạm rửa tay)</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">Mô tả vị trí lắp đặt cụ thể</label>
              <Input
                placeholder="VD: Cửa kho mát số 2, cách mặt đất 1.4m ngang tầm mắt"
                value={newTag.location}
                onChange={(e) => setNewTag({ ...newTag, location: e.target.value })}
              />
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
              <Button type="button" variant="outline" onClick={() => setIsRegisterModalOpen(false)}>
                Hủy bỏ
              </Button>
              <Button type="submit" className="bg-indigo-600 hover:bg-indigo-500 text-white">
                Kích Hoạt Thẻ NFC
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

