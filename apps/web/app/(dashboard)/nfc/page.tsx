'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Radio, 
  Plus, 
  Smartphone, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Building2, 
  ShieldCheck,
  X
} from 'lucide-react';
import { formatDate } from '@/lib/utils';

interface NfcTagItem {
  id: string;
  tagUid: string;
  stationName: string;
  location: string;
  equipment: string;
  status: 'active' | 'inactive';
  lastScanAt: string;
  lastScanBy: string;
  totalScans: number;
}

const mockTags: NfcTagItem[] = [
  {
    id: '1',
    tagUid: '04:7B:A2:8F:33:10:80',
    stationName: 'Trạm kiểm tra Kho đông #1',
    location: 'Khu Bếp Chính - Tầng B1',
    equipment: 'Kho đông sâu -20°C',
    status: 'active',
    lastScanAt: '2026-09-24T08:15:00Z',
    lastScanBy: 'Nguyễn Văn An (Bếp phó)',
    totalScans: 342,
  },
  {
    id: '2',
    tagUid: '04:1E:5C:92:44:21:81',
    stationName: 'Trạm kiểm tra Tủ mát Salad',
    location: 'Khu ra món (Pass) - Tầng 1',
    equipment: 'Tủ mát trưng bày rau củ',
    status: 'active',
    lastScanAt: '2026-09-24T09:40:00Z',
    lastScanBy: 'Trần Thị Mai (Giám sát)',
    totalScans: 215,
  },
  {
    id: '3',
    tagUid: '04:99:3D:11:8A:55:82',
    stationName: 'Trạm khử trùng dao thớt',
    location: 'Khu sơ chế thịt cá sống',
    equipment: 'Bồn ngâm hóa chất Clorin',
    status: 'active',
    lastScanAt: '2026-09-24T07:30:00Z',
    lastScanBy: 'Phạm Minh Đức',
    totalScans: 489,
  },
  {
    id: '4',
    tagUid: '04:88:2C:77:9B:66:83',
    stationName: 'Trạm tiếp nhận hàng cửa sau',
    location: 'Cửa nhập nguyên liệu',
    equipment: 'Bàn cân & đo nhiệt độ nhận hàng',
    status: 'inactive',
    lastScanAt: '2026-09-20T11:00:00Z',
    lastScanBy: 'Lê Hoàng Nam',
    totalScans: 98,
  },
];

export default function NfcManagementPage() {
  const [tags, setTags] = useState<NfcTagItem[]>(mockTags);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [scanFeedback, setScanFeedback] = useState<string | null>(null);

  const [newTag, setNewTag] = useState({
    tagUid: '',
    stationName: '',
    location: '',
    equipment: '',
  });

  const handleSimulateScan = (tag: NfcTagItem) => {
    setScanFeedback(`Đang xác thực thẻ NFC [${tag.tagUid}] tại ${tag.stationName}...`);
    setTimeout(() => {
      setTags(prev => prev.map(t => {
        if (t.id === tag.id) {
          return {
            ...t,
            lastScanAt: new Date().toISOString(),
            lastScanBy: 'Bạn (Người dùng hiện tại)',
            totalScans: t.totalScans + 1,
          };
        }
        return t;
      }));
      setScanFeedback(`Quét NFC thành công! Đã ghi nhận sự hiện diện thực địa tại: ${tag.stationName}`);
      setTimeout(() => setScanFeedback(null), 3500);
    }, 800);
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTag.stationName || !newTag.tagUid) return;

    const created: NfcTagItem = {
      id: String(Date.now()),
      tagUid: newTag.tagUid,
      stationName: newTag.stationName,
      location: newTag.location || 'Khu Bếp Chính',
      equipment: newTag.equipment || 'Thiết bị chuẩn',
      status: 'active',
      lastScanAt: new Date().toISOString(),
      lastScanBy: 'Hệ thống khởi tạo',
      totalScans: 0,
    };

    setTags([...tags, created]);
    setIsModalOpen(false);
    setNewTag({ tagUid: '', stationName: '', location: '', equipment: '' });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-3xl font-bold tracking-tight text-white">Trạm Kiểm Tra NFC Thực Địa</h2>
            <Badge variant="outline" className="text-cyan-400 border-cyan-500/30 bg-cyan-500/10">
              Chống gian lận kiểm tra (Presence Proof)
            </Badge>
          </div>
          <p className="text-slate-400 text-sm mt-1">
            Gắn thẻ NFC vật lý tại các thiết bị & vị trí trọng yếu để nhân viên bắt buộc quét thẻ trước khi ghi nhiệt độ
          </p>
        </div>

        <Button onClick={() => setIsModalOpen(true)} className="gap-2 shadow-lg shadow-cyan-950">
          <Plus className="w-4 h-4" />
          Đăng ký thẻ NFC mới
        </Button>
      </div>

      {/* Real-time Scan Notification */}
      {scanFeedback && (
        <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center gap-3 text-cyan-300 text-xs animate-in fade-in duration-200">
          <Smartphone className="w-5 h-5 animate-bounce shrink-0" />
          <span className="font-medium">{scanFeedback}</span>
        </div>
      )}

      {/* Summary KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="glassmorphism">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400">Tổng trạm NFC</p>
              <h3 className="text-2xl font-bold text-white mt-1">{tags.length} trạm</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
              <Radio className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="glassmorphism">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400">Lượt quét hôm nay</p>
              <h3 className="text-2xl font-bold text-emerald-400 mt-1">87 lượt</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="glassmorphism">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400">Bảo mật chống quét trùng</p>
              <h3 className="text-2xl font-bold text-indigo-400 mt-1">Debounce 5p</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tag Stations Table */}
      <Card className="glassmorphism">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-900/80 text-slate-300 border-b border-slate-800">
                <tr>
                  <th className="px-6 py-4 font-semibold">Tên Trạm / Thiết Bị</th>
                  <th className="px-6 py-4 font-semibold">Mã UID Thẻ NFC</th>
                  <th className="px-6 py-4 font-semibold">Vị Trí Lắp Đặt</th>
                  <th className="px-6 py-4 font-semibold">Lần Quét Gần Nhất</th>
                  <th className="px-6 py-4 font-semibold">Tổng Lượt</th>
                  <th className="px-6 py-4 font-semibold">Trạng Thái</th>
                  <th className="px-6 py-4 font-semibold text-right">Mô Phỏng Quét</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {tags.map((tag) => (
                  <tr key={tag.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-white">{tag.stationName}</div>
                      <div className="text-xs text-slate-400">{tag.equipment}</div>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-cyan-400 font-bold">
                      {tag.tagUid}
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-300">
                      <div className="flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-slate-500" />
                        <span>{tag.location}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs">
                      <div className="text-slate-300">{formatDate(tag.lastScanAt)}</div>
                      <div className="text-[11px] text-slate-500">{tag.lastScanBy}</div>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-slate-300">
                      {tag.totalScans}
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={tag.status === 'active' ? 'success' : 'default'}>
                        {tag.status === 'active' ? 'Sẵn sàng' : 'Tạm khóa'}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="gap-1.5 text-cyan-400 border-cyan-500/30 hover:bg-cyan-500/10"
                        onClick={() => handleSimulateScan(tag)}
                      >
                        <Smartphone className="w-3.5 h-3.5" />
                        Quét thử
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Register Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-5">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Radio className="w-5 h-5 text-cyan-400" />
                Đăng Ký Thẻ NFC Mới
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Mã UID Thẻ NFC (Hex) *</label>
                <Input 
                  placeholder="VD: 04:A1:B2:C3:D4:E5:F6"
                  value={newTag.tagUid}
                  onChange={(e) => setNewTag({ ...newTag, tagUid: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Tên trạm / Điểm kiểm tra *</label>
                <Input 
                  placeholder="VD: Trạm đo Tủ đông thịt Bếp 2"
                  value={newTag.stationName}
                  onChange={(e) => setNewTag({ ...newTag, stationName: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Thiết bị gắn thẻ</label>
                <Input 
                  placeholder="VD: Tủ đông Panasonic NR-200"
                  value={newTag.equipment}
                  onChange={(e) => setNewTag({ ...newTag, equipment: e.target.value })}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Khu vực lắp đặt</label>
                <Input 
                  placeholder="VD: Khu Bếp Bánh hoặc Quầy Bar"
                  value={newTag.location}
                  onChange={(e) => setNewTag({ ...newTag, location: e.target.value })}
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                  Hủy
                </Button>
                <Button type="submit" variant="primary">
                  Lưu trạm NFC
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
