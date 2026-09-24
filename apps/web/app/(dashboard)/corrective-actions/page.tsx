'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  AlertTriangle, 
  Plus, 
  CheckCircle2, 
  Clock, 
  ShieldAlert, 
  X, 
  FileText,
  UserCheck,
  Building2,
  Calendar
} from 'lucide-react';
import { formatDate } from '@/lib/utils';

interface Incident {
  id: string;
  title: string;
  category: 'Nhiệt độ CCP' | 'Vệ sinh khử trùng' | 'Nguồn gốc thực phẩm' | 'Thiết bị hỏng';
  severity: 'critical' | 'high' | 'medium' | 'low';
  location: string;
  reportedBy: string;
  reportedAt: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  description: string;
  rootCause?: string;
  resolution?: string;
  approvedBy?: string;
}

const mockIncidents: Incident[] = [
  {
    id: 'CAPA-2026-001',
    title: 'Tủ mát trưng bày salad vượt ngưỡng 7.2°C trong 45 phút',
    category: 'Nhiệt độ CCP',
    severity: 'critical',
    location: 'Khu ra món Bếp chính',
    reportedBy: 'Lê Hoàng Nam',
    reportedAt: '2026-09-24T08:30:00Z',
    status: 'in_progress',
    description: 'Nhiệt kế cảm biến ghi nhận 7.2°C (ngưỡng tối đa cho phép 4.0°C). Quạt gió bị đóng tuyết.',
    rootCause: 'Gioăng cao su mép cửa tủ bị rách nhẹ, nhân viên quên đóng chặt sau ca chuẩn bị.',
  },
  {
    id: 'CAPA-2026-002',
    title: 'Nồng độ dung dịch khử khuẩn thớt Clorin dưới 50ppm',
    category: 'Vệ sinh khử trùng',
    severity: 'high',
    location: 'Khu sơ chế gia cầm',
    reportedBy: 'Phạm Minh Đức',
    reportedAt: '2026-09-23T14:15:00Z',
    status: 'resolved',
    description: 'Giấy thử test nồng độ Clo cho kết quả 30ppm (tiêu chuẩn yêu cầu 50-100ppm).',
    rootCause: 'Pha loãng dung dịch không dùng cốc đong chuẩn tỷ lệ.',
    resolution: 'Đã hủy chậu dung dịch cũ, huấn luyện lại nhân viên và pha mới đạt 75ppm.',
  },
  {
    id: 'CAPA-2026-003',
    title: 'Phát hiện bao bì bột mì bị rách góc khi nhập kho',
    category: 'Nguồn gốc thực phẩm',
    severity: 'medium',
    location: 'Kho khô tầng trệt',
    reportedBy: 'Võ Thị Hương',
    reportedAt: '2026-09-21T09:00:00Z',
    status: 'closed',
    description: 'Bao bột mì số lô LOT-991 bị rách lớp nilon bảo vệ, nguy cơ hút ẩm và nấm mốc.',
    rootCause: 'Va quẹt cạnh pallet gỗ trong quá trình bốc dỡ của nhà xe.',
    resolution: 'Đã từ chối nhận hàng, lập biên bản trả lại nhà cung cấp và nhận bao thay thế.',
    approvedBy: 'Trần Thị Mai (Giám đốc Tuân thủ)',
  },
];

export default function CorrectiveActionsPage() {
  const [incidents, setIncidents] = useState<Incident[]>(mockIncidents);
  const [filter, setFilter] = useState<'all' | 'open' | 'resolved' | 'closed'>('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);

  const [newIncident, setNewIncident] = useState({
    title: '',
    category: 'Nhiệt độ CCP' as Incident['category'],
    severity: 'high' as Incident['severity'],
    location: '',
    description: '',
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newIncident.title) return;

    const created: Incident = {
      id: `CAPA-2026-${String(incidents.length + 1).padStart(3, '0')}`,
      title: newIncident.title,
      category: newIncident.category,
      severity: newIncident.severity,
      location: newIncident.location || 'Bếp trung tâm',
      reportedBy: 'Nguyễn Văn An (Bếp phó)',
      reportedAt: new Date().toISOString(),
      status: 'open',
      description: newIncident.description,
    };

    setIncidents([created, ...incidents]);
    setIsCreateModalOpen(false);
    setNewIncident({
      title: '',
      category: 'Nhiệt độ CCP',
      severity: 'high',
      location: '',
      description: '',
    });
  };

  const handleResolve = (id: string, resolution: string, rootCause: string) => {
    setIncidents(prev => prev.map(inc => {
      if (inc.id === id) {
        return {
          ...inc,
          status: 'resolved',
          resolution,
          rootCause,
        };
      }
      return inc;
    }));
    setSelectedIncident(null);
  };

  const handleApprove = (id: string) => {
    setIncidents(prev => prev.map(inc => {
      if (inc.id === id) {
        return {
          ...inc,
          status: 'closed',
          approvedBy: 'Trần Thị Mai (Giám đốc Tuân thủ)',
        };
      }
      return inc;
    }));
    setSelectedIncident(null);
  };

  const filtered = incidents.filter(i => {
    if (filter === 'open') return i.status === 'open' || i.status === 'in_progress';
    if (filter === 'resolved') return i.status === 'resolved';
    if (filter === 'closed') return i.status === 'closed';
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-3xl font-bold tracking-tight text-white">Sự Cố & Khắc Phục (CAPA)</h2>
            <Badge variant="outline" className="text-rose-400 border-rose-500/30 bg-rose-500/10">
              Quy trình HACCP Nguyên tắc 5
            </Badge>
          </div>
          <p className="text-slate-400 text-sm mt-1">
            Ghi nhận vi phạm tới hạn CCP, điều tra nguyên nhân gốc rễ và xác nhận biện pháp khắc phục phòng ngừa
          </p>
        </div>

        <Button onClick={() => setIsCreateModalOpen(true)} className="gap-2 bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-900/30">
          <Plus className="w-4 h-4" />
          Báo cáo sự cố mới
        </Button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2">
        <Button variant={filter === 'all' ? 'primary' : 'outline'} size="sm" onClick={() => setFilter('all')}>
          Tất cả ({incidents.length})
        </Button>
        <Button variant={filter === 'open' ? 'primary' : 'outline'} size="sm" onClick={() => setFilter('open')}>
          Cần xử lý ({incidents.filter(i => i.status === 'open' || i.status === 'in_progress').length})
        </Button>
        <Button variant={filter === 'resolved' ? 'primary' : 'outline'} size="sm" onClick={() => setFilter('resolved')}>
          Chờ duyệt ({incidents.filter(i => i.status === 'resolved').length})
        </Button>
        <Button variant={filter === 'closed' ? 'primary' : 'outline'} size="sm" onClick={() => setFilter('closed')}>
          Đã đóng ({incidents.filter(i => i.status === 'closed').length})
        </Button>
      </div>

      {/* Incident Cards / Table */}
      <div className="space-y-3">
        {filtered.map((item) => (
          <Card key={item.id} className="glassmorphism hover:border-slate-700 transition-all">
            <CardContent className="p-5">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className="font-mono text-xs text-indigo-400 font-bold">{item.id}</span>
                    <h3 className="text-sm font-semibold text-white">{item.title}</h3>
                    {item.severity === 'critical' && <Badge variant="danger">Khẩn cấp</Badge>}
                    {item.severity === 'high' && <Badge variant="warning">Nghiêm trọng</Badge>}
                    {item.severity === 'medium' && <Badge variant="default">Trung bình</Badge>}
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">{item.description}</p>

                  <div className="flex items-center gap-4 text-xs text-slate-400 pt-1 flex-wrap">
                    <span className="flex items-center gap-1">
                      <Building2 className="w-3.5 h-3.5 text-slate-500" />
                      {item.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-500" />
                      {formatDate(item.reportedAt)}
                    </span>
                    <span>Báo cáo: {item.reportedBy}</span>
                    {item.approvedBy && (
                      <span className="text-emerald-400 font-medium">✓ Duyệt: {item.approvedBy}</span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0 self-end md:self-center">
                  {item.status === 'open' && <Badge variant="danger">Chưa xử lý</Badge>}
                  {item.status === 'in_progress' && <Badge variant="warning">Đang khắc phục</Badge>}
                  {item.status === 'resolved' && <Badge variant="success">Đã khắc phục</Badge>}
                  {item.status === 'closed' && <Badge variant="outline" className="text-slate-400 border-slate-700">Đã nghiệm thu</Badge>}

                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setSelectedIncident(item)}
                  >
                    Xem chi tiết / Duyệt
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Create Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-5">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-rose-500" />
                Báo Cáo Sự Cố / Không Phù Hợp HACCP
              </h3>
              <button onClick={() => setIsCreateModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Tiêu đề sự cố *</label>
                <Input 
                  placeholder="VD: Nhiệt độ món hâm nóng buffet tụt dưới 60°C"
                  value={newIncident.title}
                  onChange={(e) => setNewIncident({ ...newIncident, title: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Phân loại</label>
                  <select
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                    value={newIncident.category}
                    onChange={(e) => setNewIncident({ ...newIncident, category: e.target.value as any })}
                  >
                    <option value="Nhiệt độ CCP">Nhiệt độ CCP</option>
                    <option value="Vệ sinh khử trùng">Vệ sinh khử trùng</option>
                    <option value="Nguồn gốc thực phẩm">Nguồn gốc thực phẩm</option>
                    <option value="Thiết bị hỏng">Thiết bị hỏng</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Mức độ nghiêm trọng</label>
                  <select
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                    value={newIncident.severity}
                    onChange={(e) => setNewIncident({ ...newIncident, severity: e.target.value as any })}
                  >
                    <option value="critical">Khẩn cấp (Nguy cơ ngộ độc)</option>
                    <option value="high">Cao (Vi phạm giới hạn CCP)</option>
                    <option value="medium">Trung bình</option>
                    <option value="low">Thấp (Cần lưu ý)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Vị trí xảy ra</label>
                <Input 
                  placeholder="VD: Quầy Buffet sảnh tầng 1 hoặc Kho lạnh #2"
                  value={newIncident.location}
                  onChange={(e) => setNewIncident({ ...newIncident, location: e.target.value })}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Mô tả chi tiết sự cố</label>
                <textarea
                  rows={3}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  placeholder="Nêu rõ thông số đo được, thực phẩm bị ảnh hưởng..."
                  value={newIncident.description}
                  onChange={(e) => setNewIncident({ ...newIncident, description: e.target.value })}
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <Button type="button" variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                  Hủy
                </Button>
                <Button type="submit" variant="primary" className="bg-rose-600 hover:bg-rose-500">
                  Gửi báo cáo
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Incident Detail / Resolve Modal */}
      {selectedIncident && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <div>
                <span className="font-mono text-xs text-indigo-400 font-bold">{selectedIncident.id}</span>
                <h3 className="text-base font-bold text-white mt-0.5">{selectedIncident.title}</h3>
              </div>
              <button onClick={() => setSelectedIncident(null)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-300">
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <p className="text-slate-400 font-medium">Hiện tượng vi phạm:</p>
                <p className="mt-1 text-white">{selectedIncident.description}</p>
              </div>

              {selectedIncident.rootCause && (
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                  <p className="text-amber-400 font-medium">Nguyên nhân gốc rễ (Root Cause):</p>
                  <p className="mt-1 text-slate-200">{selectedIncident.rootCause}</p>
                </div>
              )}

              {selectedIncident.resolution && (
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                  <p className="text-emerald-400 font-medium">Biện pháp khắc phục đã thực hiện:</p>
                  <p className="mt-1 text-slate-200">{selectedIncident.resolution}</p>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 pt-5 border-t border-slate-800 mt-5">
              {selectedIncident.status === 'open' && (
                <Button 
                  variant="primary"
                  onClick={() => handleResolve(selectedIncident.id, 'Đã hiệu chỉnh cảm biến và hạ nhiệt độ khẩn cấp', 'Cảm biến bám bụi')}
                >
                  Xác nhận đã khắc phục
                </Button>
              )}

              {selectedIncident.status === 'resolved' && (
                <Button 
                  variant="primary"
                  className="bg-emerald-600 hover:bg-emerald-500"
                  onClick={() => handleApprove(selectedIncident.id)}
                >
                  Ký duyệt nghiệm thu (HACCP Sign-off)
                </Button>
              )}

              <Button variant="outline" onClick={() => setSelectedIncident(null)}>
                Đóng
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
