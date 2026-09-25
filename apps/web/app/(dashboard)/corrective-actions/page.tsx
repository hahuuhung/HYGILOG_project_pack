'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Modal } from '@/components/ui/modal';
import { 
  AlertOctagon, 
  Search, 
  Plus, 
  Filter, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  User, 
  Wrench, 
  ShieldAlert, 
  FileText, 
  Eye, 
  ArrowUpRight,
  Calendar,
  Flame,
  Check,
  Building
} from 'lucide-react';
import { formatDate } from '@/lib/utils';

interface CorrectiveActionItem {
  id: string;
  code: string;
  title: string;
  category: 'temperature' | 'hygiene' | 'cross_contamination' | 'equipment' | 'expired_goods';
  severity: 'critical' | 'high' | 'medium' | 'low';
  siteName: string;
  reportedBy: string;
  assignedTo: string;
  reportedAt: string;
  dueDate: string;
  resolvedAt?: string;
  issueDescription: string;
  immediateAction?: string;
  preventiveAction?: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  relatedCcp?: string;
}

const initialActions: CorrectiveActionItem[] = [
  {
    id: 'CAPA-001',
    code: 'CAPA-2026-081',
    title: 'Tủ mát hải sản tầng 1 vượt ngưỡng cho phép (8.2°C)',
    category: 'temperature',
    severity: 'critical',
    siteName: 'Landmark 81 - Bếp Âu',
    reportedBy: 'Trần Thị B (Trưởng ca)',
    assignedTo: 'Nguyễn Văn Kỹ Thuật',
    reportedAt: '2026-09-25T07:10:00Z',
    dueDate: '2026-09-25T11:00:00Z',
    issueDescription: 'Đầu dò cảm biến nhiệt độ ghi nhận nhiệt độ tủ mát bảo quản cá hồi tươi tăng vọt từ 2.0°C lên 8.2°C trong hơn 45 phút.',
    immediateAction: 'Chuyển toàn bộ 18kg cá hồi và sò điệp sang Tủ mát dự phòng #03 (1.5°C). Đo nhiệt độ tâm sản phẩm vẫn đảm bảo dưới 4°C.',
    preventiveAction: 'Bảo trì quạt tản nhiệt dàn lạnh và thay thế gioăng đệm cửa bị rách.',
    status: 'in_progress',
    relatedCcp: 'CCP-2 (Bảo quản lạnh)',
  },
  {
    id: 'CAPA-002',
    code: 'CAPA-2026-079',
    title: 'Nồng độ cồn sát khuẩn tay tại trạm cửa vào bếp dưới 70 độ',
    category: 'hygiene',
    severity: 'medium',
    siteName: 'Quận 1 - Đồng Khởi',
    reportedBy: 'Lê Hoàng Yến (Giám sát ATTP)',
    assignedTo: 'Lê Văn C (Tổ trưởng tạp vụ)',
    reportedAt: '2026-09-24T14:30:00Z',
    dueDate: '2026-09-24T16:00:00Z',
    resolvedAt: '2026-09-24T15:10:00Z',
    issueDescription: 'Bình xịt tự động trạm rửa tay lối vào sơ chế bị pha loãng sai tỷ lệ trong ca trưa.',
    immediateAction: 'Hủy toàn bộ dung dịch trong bình chứa, súc rửa và châm cồn y tế 70 độ nguyên chất kèm test nhanh cồn kế.',
    preventiveAction: 'Tập huấn lại quy trình pha hóa chất và dán tem nhãn định lượng tại kho hóa chất.',
    status: 'closed',
    relatedCcp: 'PRP-Vệ sinh cá nhân',
  },
  {
    id: 'CAPA-003',
    code: 'CAPA-2026-077',
    title: 'Phát hiện dùng chung thớt sơ chế gia cầm sống và thịt chín',
    category: 'cross_contamination',
    severity: 'high',
    siteName: 'Hà Nội - Tây Hồ',
    reportedBy: 'Phạm Đức Minh (Bếp phó)',
    assignedTo: 'Đỗ Tuấn Anh (Bếp sơ chế)',
    reportedAt: '2026-09-24T09:45:00Z',
    dueDate: '2026-09-24T12:00:00Z',
    resolvedAt: '2026-09-24T10:30:00Z',
    issueDescription: 'Nhân viên mới phân ca dùng thớt màu vàng (thịt gia cầm sống) để cắt thịt gà luộc chín.',
    immediateAction: 'Tiêu hủy đĩa thịt chín bị nguy cơ nhiễm chéo vi khuẩn Salmonella, rửa ngâm clo thớt và dao 200ppm.',
    preventiveAction: 'Cố định vị trí và màu sắc dụng cụ: Vàng (Gia cầm sống), Nâu (Thịt chín), Xanh lá (Rau củ).',
    status: 'resolved',
    relatedCcp: 'CCP-Ngăn ngừa nhiễm chéo',
  },
  {
    id: 'CAPA-004',
    code: 'CAPA-2026-075',
    title: 'Nhiệt độ dầu sôi bếp chiên chưa đạt chuẩn lúc cho gà vào (145°C)',
    category: 'equipment',
    severity: 'medium',
    siteName: 'Landmark 81 - Bếp Á',
    reportedBy: 'Hoàng Anh Tuấn (Bếp trưởng)',
    assignedTo: 'Vũ Minh Trí (Nhân viên chiên)',
    reportedAt: '2026-09-23T18:20:00Z',
    dueDate: '2026-09-23T19:30:00Z',
    resolvedAt: '2026-09-23T18:50:00Z',
    issueDescription: 'Nhiệt kế hồng ngoại báo dầu chỉ đạt 145°C (chuẩn tối thiểu 175°C để diệt khuẩn và không ngấm dầu).',
    immediateAction: 'Chờ thanh nhiệt đạt đúng 175°C mới tiếp tục chiên lô thực phẩm mới, kiểm tra nhiệt độ tâm miếng gà đạt 78°C.',
    preventiveAction: 'Thay cảm biến nhiệt thermostat bếp chiên bị lệch chỉ số 10°C.',
    status: 'closed',
    relatedCcp: 'CCP-3 (Xử lý nhiệt nấu chín)',
  },
  {
    id: 'CAPA-005',
    code: 'CAPA-2026-074',
    title: 'Hộp sữa tươi bị móp méo và rỉ sữa trong lô hàng mới nhập',
    category: 'expired_goods',
    severity: 'low',
    siteName: 'Quận 1 - Đồng Khởi',
    reportedBy: 'Ngô Thanh Hà (Thủ kho)',
    assignedTo: 'Đại diện NCC CP Foods',
    reportedAt: '2026-09-23T10:15:00Z',
    dueDate: '2026-09-24T10:00:00Z',
    resolvedAt: '2026-09-23T16:00:00Z',
    issueDescription: 'Phát hiện 3 thùng sữa tươi tiệt trùng bị biến dạng bao bì trong lúc dỡ hàng từ xe tải giao hàng.',
    immediateAction: 'Từ chối nhận 3 thùng hư hỏng, lập biên bản trả hàng ngay tại cửa giao nhận.',
    preventiveAction: 'Yêu cầu nhà xe cố định thùng hàng đúng quy cách chèn lót khi vận chuyển đường xa.',
    status: 'closed',
    relatedCcp: 'CCP-1 (Kiểm soát tiếp nhận hàng)',
  },
];

export default function CorrectiveActionsPage() {
  const [actions, setActions] = useState<CorrectiveActionItem[]>(initialActions);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'open' | 'in_progress' | 'resolved' | 'closed'>('all');
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [selectedAction, setSelectedAction] = useState<CorrectiveActionItem | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isResolveModalOpen, setIsResolveModalOpen] = useState(false);

  // Form State for new incident
  const [formData, setFormData] = useState({
    title: '',
    category: 'temperature' as CorrectiveActionItem['category'],
    severity: 'high' as CorrectiveActionItem['severity'],
    siteName: 'Landmark 81 - Bếp Âu',
    reportedBy: 'Nguyễn Văn A (Quản lý ATTP)',
    assignedTo: '',
    dueDate: '',
    issueDescription: '',
    immediateAction: '',
    relatedCcp: 'CCP-2 (Bảo quản lạnh)',
  });

  // Form state for resolution
  const [resolveForm, setResolveForm] = useState({
    preventiveAction: '',
    status: 'resolved' as CorrectiveActionItem['status'],
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.issueDescription) return;

    const newAction: CorrectiveActionItem = {
      id: `CAPA-${Date.now().toString().slice(-4)}`,
      code: `CAPA-2026-0${Math.floor(Math.random() * 90 + 10)}`,
      title: formData.title,
      category: formData.category,
      severity: formData.severity,
      siteName: formData.siteName,
      reportedBy: formData.reportedBy,
      assignedTo: formData.assignedTo || 'Kỹ thuật viên ca trực',
      reportedAt: new Date().toISOString(),
      dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : new Date(Date.now() + 14400000).toISOString(),
      issueDescription: formData.issueDescription,
      immediateAction: formData.immediateAction || 'Đã áp dụng biện pháp cô lập nguồn nguy cơ tạm thời.',
      status: 'open',
      relatedCcp: formData.relatedCcp,
    };

    setActions([newAction, ...actions]);
    setIsCreateModalOpen(false);
    setFormData({
      title: '',
      category: 'temperature',
      severity: 'high',
      siteName: 'Landmark 81 - Bếp Âu',
      reportedBy: 'Nguyễn Văn A (Quản lý ATTP)',
      assignedTo: '',
      dueDate: '',
      issueDescription: '',
      immediateAction: '',
      relatedCcp: 'CCP-2 (Bảo quản lạnh)',
    });
  };

  const handleResolveAction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAction) return;

    setActions(actions.map(item => {
      if (item.id === selectedAction.id) {
        return {
          ...item,
          preventiveAction: resolveForm.preventiveAction || item.preventiveAction,
          status: resolveForm.status,
          resolvedAt: new Date().toISOString(),
        };
      }
      return item;
    }));

    setIsResolveModalOpen(false);
    setSelectedAction(null);
  };

  const filteredActions = actions.filter(action => {
    const matchesSearch = 
      action.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      action.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      action.reportedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
      action.siteName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || action.status === statusFilter;
    const matchesSeverity = severityFilter === 'all' || action.severity === severityFilter;

    return matchesSearch && matchesStatus && matchesSeverity;
  });

  const openCount = actions.filter(a => a.status === 'open').length;
  const inProgressCount = actions.filter(a => a.status === 'in_progress').length;
  const resolvedCount = actions.filter(a => a.status === 'resolved' || a.status === 'closed').length;
  const criticalCount = actions.filter(a => a.severity === 'critical' && (a.status === 'open' || a.status === 'in_progress')).length;

  const categoryNames: Record<string, string> = {
    temperature: 'Vi phạm Nhiệt độ CCP',
    hygiene: 'Vệ sinh & Sát trùng',
    cross_contamination: 'Nguy cơ Nhiễm chéo',
    equipment: 'Sự cố Thiết bị Bếp',
    expired_goods: 'Nguyên liệu không đạt',
  };

  return (
    <div className="space-y-6 animate-slide-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20">
            <AlertOctagon className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">Hành Động Khắc Phục (CAPA)</h1>
            <p className="text-slate-400 text-sm mt-0.5">Xử lý sự cố vi phạm an toàn thực phẩm, phân tích nguyên nhân gốc rễ và phòng ngừa tái diễn</p>
          </div>
        </div>

        <Button 
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-red-600 hover:bg-red-500 text-white gap-2 shadow-lg shadow-red-600/25"
        >
          <Plus className="w-4 h-4" />
          Báo Cáo Sự Cố Mới
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="glassmorphism border-red-500/30">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Sự cố khẩn cấp (Critical)</CardTitle>
            <ShieldAlert className="w-4 h-4 text-red-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-400">{criticalCount}</div>
            <p className="text-xs text-red-400/80 mt-1">Yêu cầu can thiệp ngay lập tức</p>
          </CardContent>
        </Card>

        <Card className="glassmorphism border-amber-500/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Đang xử lý (In Progress)</CardTitle>
            <Clock className="w-4 h-4 text-amber-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-400">{inProgressCount}</div>
            <p className="text-xs text-slate-400 mt-1">Đang triển khai biện pháp kỹ thuật</p>
          </CardContent>
        </Card>

        <Card className="glassmorphism border-indigo-500/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Chờ phân công (Open)</CardTitle>
            <AlertTriangle className="w-4 h-4 text-indigo-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{openCount}</div>
            <p className="text-xs text-slate-400 mt-1">Sự cố mới ghi nhận</p>
          </CardContent>
        </Card>

        <Card className="glassmorphism border-emerald-500/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Đã đóng & Nghiệm thu</CardTitle>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-400">{resolvedCount}</div>
            <p className="text-xs text-slate-400 mt-1">Đạt tiêu chuẩn đánh giá HACCP</p>
          </CardContent>
        </Card>
      </div>

      {/* Filter and Search Bar */}
      <Card className="glassmorphism">
        <CardContent className="p-4 space-y-4">
          <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
            <div className="w-full md:w-96">
              <Input
                placeholder="Tìm mã CAPA, tiêu đề sự cố, người báo cáo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                icon={<Search className="w-4 h-4" />}
                className="bg-slate-900/60 border-slate-700/60"
              />
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {/* Severity select */}
              <select
                value={severityFilter}
                onChange={(e) => setSeverityFilter(e.target.value)}
                className="h-8 rounded-lg text-xs bg-slate-800 text-slate-300 border border-slate-700 px-2.5 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="all">Mọi mức độ nghiêm trọng</option>
                <option value="critical">Nghiêm trọng (Critical)</option>
                <option value="high">Cao (High)</option>
                <option value="medium">Trung bình (Medium)</option>
                <option value="low">Thấp (Low)</option>
              </select>

              {/* Status buttons */}
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                  statusFilter === 'all' 
                    ? 'bg-indigo-600 text-white shadow-sm' 
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                Tất cả ({actions.length})
              </button>
              <button
                onClick={() => setStatusFilter('in_progress')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                  statusFilter === 'in_progress' 
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' 
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                Đang xử lý ({inProgressCount})
              </button>
              <button
                onClick={() => setStatusFilter('open')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                  statusFilter === 'open' 
                    ? 'bg-red-500/20 text-red-300 border border-red-500/40' 
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                Mới ({openCount})
              </button>
              <button
                onClick={() => setStatusFilter('closed')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                  statusFilter === 'closed' 
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' 
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                Đã đóng ({resolvedCount})
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
                <th className="px-6 py-4 font-semibold">Mã & Tiêu Đề Sự Cố</th>
                <th className="px-6 py-4 font-semibold">Mức Độ & Phân Loại</th>
                <th className="px-6 py-4 font-semibold">Cơ Sở & Trạm CCP</th>
                <th className="px-6 py-4 font-semibold">Người Xử Lý & Thời Gian</th>
                <th className="px-6 py-4 font-semibold">Trạng Thái</th>
                <th className="px-6 py-4 font-semibold text-right">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredActions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-slate-400">
                        <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                      </div>
                      <p className="text-base font-medium text-slate-300">Không có sự cố vi phạm nào trong bộ lọc này</p>
                      <p className="text-xs text-slate-500 max-w-sm">Hệ thống an toàn vệ sinh thực phẩm đang hoạt động ổn định và tuân thủ các quy tắc CCP.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredActions.map((action) => (
                  <tr key={action.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg mt-0.5 flex-shrink-0 ${
                          action.severity === 'critical' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                          action.severity === 'high' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                          'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                        }`}>
                          <AlertOctagon className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="font-semibold text-white leading-snug">{action.title}</div>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs font-mono text-indigo-400 font-medium">{action.code}</span>
                            <span className="text-[11px] text-slate-500">• Báo cáo: {formatDate(action.reportedAt)}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div>
                          {action.severity === 'critical' && <Badge variant="destructive">Khẩn cấp (Critical)</Badge>}
                          {action.severity === 'high' && <Badge variant="warning">Mức cao (High)</Badge>}
                          {action.severity === 'medium' && <Badge variant="outline" className="text-amber-400 border-amber-500/30">Trung bình</Badge>}
                          {action.severity === 'low' && <Badge variant="secondary">Thấp</Badge>}
                        </div>
                        <div className="text-xs text-slate-400">{categoryNames[action.category] || action.category}</div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="text-xs font-medium text-slate-200 flex items-center gap-1">
                        <Building className="w-3.5 h-3.5 text-slate-400" /> {action.siteName}
                      </div>
                      {action.relatedCcp && (
                        <div className="text-[11px] text-indigo-400 font-mono mt-0.5">{action.relatedCcp}</div>
                      )}
                    </td>

                    <td className="px-6 py-4">
                      <div className="text-xs text-slate-300 flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        <span>Phụ trách: <strong className="text-white">{action.assignedTo}</strong></span>
                      </div>
                      <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-1">
                        <Clock className="w-3 h-3 text-amber-400" /> Hạn: {formatDate(action.dueDate)}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      {action.status === 'open' && <Badge variant="destructive">Chờ xử lý</Badge>}
                      {action.status === 'in_progress' && <Badge variant="warning">Đang giải quyết</Badge>}
                      {action.status === 'resolved' && <Badge variant="outline" className="text-emerald-400 border-emerald-500/30">Chờ nghiệm thu</Badge>}
                      {action.status === 'closed' && <Badge variant="success">Đã hoàn thành</Badge>}
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => setSelectedAction(action)}
                          className="text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/10"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          Xem
                        </Button>
                        {action.status !== 'closed' && (
                          <Button 
                            variant="secondary" 
                            size="sm"
                            onClick={() => {
                              setSelectedAction(action);
                              setResolveForm({
                                preventiveAction: action.preventiveAction || '',
                                status: 'resolved',
                              });
                              setIsResolveModalOpen(true);
                            }}
                            className="bg-indigo-600/20 text-indigo-300 hover:bg-indigo-600/30 text-xs border border-indigo-500/30"
                          >
                            <Wrench className="w-3.5 h-3.5 mr-1" />
                            Xử lý
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Modal: View Action Details */}
      {selectedAction && !isResolveModalOpen && (
        <Modal
          isOpen={!!selectedAction}
          onClose={() => setSelectedAction(null)}
          title={`Chi Tiết Sự Cố: ${selectedAction.code}`}
        >
          <div className="space-y-4 max-h-[75vh] overflow-y-auto pr-1">
            <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-base font-bold text-white">{selectedAction.title}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs font-mono text-indigo-400 font-medium">{selectedAction.code}</span>
                    <span className="text-xs text-slate-400">• {selectedAction.siteName}</span>
                  </div>
                </div>
                <Badge variant={
                  selectedAction.status === 'closed' ? 'success' :
                  selectedAction.status === 'resolved' ? 'outline' :
                  selectedAction.status === 'in_progress' ? 'warning' : 'destructive'
                }>
                  {selectedAction.status === 'closed' ? 'Đã đóng' :
                   selectedAction.status === 'resolved' ? 'Chờ nghiệm thu' :
                   selectedAction.status === 'in_progress' ? 'Đang giải quyết' : 'Mới tạo'}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs pt-2 border-t border-slate-700/50">
                <div>
                  <span className="text-slate-400">Người báo cáo:</span>
                  <p className="font-semibold text-slate-200 mt-0.5">{selectedAction.reportedBy}</p>
                </div>
                <div>
                  <span className="text-slate-400">Người phụ trách:</span>
                  <p className="font-semibold text-slate-200 mt-0.5">{selectedAction.assignedTo}</p>
                </div>
                <div>
                  <span className="text-slate-400">Thời gian ghi nhận:</span>
                  <p className="font-semibold text-slate-200 mt-0.5">{formatDate(selectedAction.reportedAt)}</p>
                </div>
                <div>
                  <span className="text-slate-400">Hạn chót giải quyết:</span>
                  <p className="font-semibold text-slate-200 mt-0.5">{formatDate(selectedAction.dueDate)}</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 text-xs">
                <span className="font-bold text-red-400 uppercase tracking-wider block mb-1">Mô tả sự cố & Nguy cơ:</span>
                <p className="text-slate-300 leading-relaxed">{selectedAction.issueDescription}</p>
              </div>

              {selectedAction.immediateAction && (
                <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 text-xs">
                  <span className="font-bold text-amber-400 uppercase tracking-wider block mb-1">Biện pháp khắc phục tức thời (Immediate Action):</span>
                  <p className="text-slate-300 leading-relaxed">{selectedAction.immediateAction}</p>
                </div>
              )}

              {selectedAction.preventiveAction && (
                <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 text-xs">
                  <span className="font-bold text-emerald-400 uppercase tracking-wider block mb-1">Biện pháp phòng ngừa lâu dài (Preventive Action):</span>
                  <p className="text-slate-300 leading-relaxed">{selectedAction.preventiveAction}</p>
                </div>
              )}
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-slate-800">
              <span className="text-xs text-slate-400">
                {selectedAction.relatedCcp || 'Tuân thủ HACCP Codex Alimentarius'}
              </span>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setSelectedAction(null)}>
                  Đóng
                </Button>
                {selectedAction.status !== 'closed' && (
                  <Button 
                    size="sm" 
                    onClick={() => {
                      setResolveForm({
                        preventiveAction: selectedAction.preventiveAction || '',
                        status: 'closed',
                      });
                      setIsResolveModalOpen(true);
                    }}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white"
                  >
                    Cập nhật tiến độ
                  </Button>
                )}
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Modal: Create Incident */}
      {isCreateModalOpen && (
        <Modal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          title="Báo Cáo Sự Cố & Tạo Hành Động Khắc Phục (CAPA)"
        >
          <form onSubmit={handleCreate} className="space-y-4 max-h-[75vh] overflow-y-auto pr-1">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">Tiêu đề sự cố / Vi phạm an toàn *</label>
              <Input
                placeholder="VD: Nhiệt độ tủ đông vượt giới hạn cho phép (-12°C)"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">Phân loại vi phạm</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                  className="flex h-9 w-full rounded-md border border-slate-700 bg-slate-900/50 px-3 py-1 text-sm text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-500"
                >
                  <option value="temperature">Vi phạm Nhiệt độ CCP</option>
                  <option value="hygiene">Vệ sinh & Khử khuẩn</option>
                  <option value="cross_contamination">Ngăn ngừa Nhiễm chéo</option>
                  <option value="equipment">Hỏng hóc Thiết bị bếp</option>
                  <option value="expired_goods">Nguyên liệu hỏng / Hết hạn</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">Mức độ nghiêm trọng</label>
                <select
                  value={formData.severity}
                  onChange={(e) => setFormData({ ...formData, severity: e.target.value as any })}
                  className="flex h-9 w-full rounded-md border border-slate-700 bg-slate-900/50 px-3 py-1 text-sm text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-500"
                >
                  <option value="critical">Khẩn cấp (Critical - Dừng phục vụ)</option>
                  <option value="high">Cao (High - Xử lý trong 2h)</option>
                  <option value="medium">Trung bình (Medium - Trong ca trực)</option>
                  <option value="low">Thấp (Low - Trong 24h)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">Cơ sở / Khu vực xảy ra</label>
                <Input
                  placeholder="VD: Landmark 81 - Bếp Âu"
                  value={formData.siteName}
                  onChange={(e) => setFormData({ ...formData, siteName: e.target.value })}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">Điểm CCP liên quan</label>
                <select
                  value={formData.relatedCcp}
                  onChange={(e) => setFormData({ ...formData, relatedCcp: e.target.value })}
                  className="flex h-9 w-full rounded-md border border-slate-700 bg-slate-900/50 px-3 py-1 text-sm text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-500"
                >
                  <option value="CCP-1 (Kiểm soát tiếp nhận hàng)">CCP-1: Tiếp nhận hàng</option>
                  <option value="CCP-2 (Bảo quản lạnh/đông)">CCP-2: Bảo quản lạnh/đông</option>
                  <option value="CCP-3 (Xử lý nhiệt nấu chín)">CCP-3: Nấu chín thực phẩm</option>
                  <option value="CCP-4 (Lưu mẫu & Phục vụ)">CCP-4: Lưu mẫu & Bàn ăn</option>
                  <option value="PRP-Vệ sinh & Khử khuẩn">PRP: Vệ sinh môi trường</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">Người phụ trách xử lý</label>
                <Input
                  placeholder="VD: Nguyễn Văn Kỹ Thuật"
                  value={formData.assignedTo}
                  onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">Thời hạn xử lý (SLA)</label>
                <Input
                  type="datetime-local"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">Chi tiết vi phạm & Nguyên nhân ban đầu *</label>
              <textarea
                rows={3}
                placeholder="Mô tả cụ thể hiện tượng, số lượng thực phẩm bị ảnh hưởng..."
                value={formData.issueDescription}
                onChange={(e) => setFormData({ ...formData, issueDescription: e.target.value })}
                required
                className="flex w-full rounded-md border border-slate-700 bg-slate-900/50 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">Hành động khắc phục ngay tại chỗ</label>
              <textarea
                rows={2}
                placeholder="VD: Đã cách ly thực phẩm sang tủ khác, kiểm tra nhiệt độ tâm..."
                value={formData.immediateAction}
                onChange={(e) => setFormData({ ...formData, immediateAction: e.target.value })}
                className="flex w-full rounded-md border border-slate-700 bg-slate-900/50 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-500"
              />
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
              <Button type="button" variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                Hủy bỏ
              </Button>
              <Button type="submit" className="bg-red-600 hover:bg-red-500 text-white">
                Phát Lệnh Khắc Phục (CAPA)
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Modal: Resolve / Update Action */}
      {isResolveModalOpen && selectedAction && (
        <Modal
          isOpen={isResolveModalOpen}
          onClose={() => setIsResolveModalOpen(false)}
          title={`Nghiệm Thu Khắc Phục: ${selectedAction.code}`}
        >
          <form onSubmit={handleResolveAction} className="space-y-4">
            <div className="p-3 rounded-lg bg-slate-800/60 text-xs space-y-1">
              <p className="font-semibold text-white">{selectedAction.title}</p>
              <p className="text-slate-400">Phụ trách: {selectedAction.assignedTo}</p>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">Biện pháp phòng ngừa lâu dài (Preventive Action) *</label>
              <textarea
                rows={3}
                placeholder="Chi tiết giải pháp kỹ thuật, thay thế phụ tùng hoặc đào tạo nhân sự để không tái diễn vi phạm..."
                value={resolveForm.preventiveAction}
                onChange={(e) => setResolveForm({ ...resolveForm, preventiveAction: e.target.value })}
                required
                className="flex w-full rounded-md border border-slate-700 bg-slate-900/50 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">Cập nhật trạng thái sau nghiệm thu</label>
              <select
                value={resolveForm.status}
                onChange={(e) => setResolveForm({ ...resolveForm, status: e.target.value as any })}
                className="flex h-9 w-full rounded-md border border-slate-700 bg-slate-900/50 px-3 py-1 text-sm text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-500"
              >
                <option value="resolved">Chờ nghiệm thu bởi Trưởng ban ATTP</option>
                <option value="closed">Đã hoàn thành & Đóng hồ sơ CAPA</option>
                <option value="in_progress">Vẫn cần theo dõi thêm (Đang giải quyết)</option>
              </select>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
              <Button type="button" variant="outline" onClick={() => setIsResolveModalOpen(false)}>
                Hủy bỏ
              </Button>
              <Button type="submit" className="bg-emerald-600 hover:bg-emerald-500 text-white">
                Xác Nhận Nghiệm Thu
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

