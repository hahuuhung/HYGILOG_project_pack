'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  FileBarChart, 
  Download, 
  ShieldCheck, 
  Calendar, 
  Building2, 
  CheckCircle2, 
  AlertTriangle,
  History,
  FileSpreadsheet,
  FileText,
  Filter
} from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default function ReportsPage() {
  const [timeRange, setTimeRange] = useState('7d');
  const [isExporting, setIsExporting] = useState(false);
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  const handleExport = (type: 'pdf' | 'csv') => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      setExportNotice(`Đã xuất báo cáo ${type.toUpperCase()} thành công! File đã sẵn sàng tải xuống.`);
      setTimeout(() => setExportNotice(null), 4000);
    }, 1200);
  };

  const auditEvents = [
    {
      id: 'EV-8821',
      action: 'GHI_NHẬN_NHIỆT_ĐỘ',
      user: 'Võ Thị Hương (Nhân viên)',
      detail: 'Đo nhiệt độ Kho đông #1 đạt -19.0°C (Hợp chuẩn)',
      time: '2026-09-24T10:05:00Z',
      verified: true,
    },
    {
      id: 'EV-8820',
      action: 'DUYỆT_CHECKLIST',
      user: 'Lê Hoàng Nam (Bếp trưởng)',
      detail: 'Ký duyệt Danh mục vệ sinh ca sáng Bếp Nóng',
      time: '2026-09-24T09:30:00Z',
      verified: true,
    },
    {
      id: 'EV-8819',
      action: 'XỬ_LÝ_SỰ_CỐ',
      user: 'Phạm Minh Đức (Giám sát)',
      detail: 'Đã bổ sung hóa chất khử khuẩn đạt nồng độ 75ppm',
      time: '2026-09-24T08:45:00Z',
      verified: true,
    },
    {
      id: 'EV-8818',
      action: 'TIẾP_NHẬN_LÔ_HÀNG',
      user: 'Nguyễn Văn An (Bếp phó)',
      detail: 'Nhập lô hàng LOT-2026-0924-A1 Thịt bò Úc 50kg (-18.2°C)',
      time: '2026-09-24T08:15:00Z',
      verified: true,
    },
    {
      id: 'EV-8817',
      action: 'QUÉT_THẺ_NFC',
      user: 'Nguyễn Văn An (Bếp phó)',
      detail: 'Xác nhận quét thẻ 04:7B:A2:8F:33:10:80 tại Kho đông sâu #1',
      time: '2026-09-24T08:14:50Z',
      verified: true,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-3xl font-bold tracking-tight text-white">Báo Cáo & Hồ Sơ HACCP</h2>
            <Badge variant="outline" className="text-indigo-400 border-indigo-500/30 bg-indigo-500/10">
              TCVN 5603:2008 / ISO 22000
            </Badge>
          </div>
          <p className="text-slate-400 text-sm mt-1">
            Tổng hợp dữ liệu tuân thủ an toàn thực phẩm phục vụ thanh kiểm tra y tế và báo cáo quản trị
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button 
            variant="outline" 
            onClick={() => handleExport('csv')}
            disabled={isExporting}
            className="gap-2 text-xs border-slate-700 hover:bg-slate-800"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            Xuất Excel (CSV)
          </Button>
          <Button 
            variant="primary" 
            onClick={() => handleExport('pdf')}
            disabled={isExporting}
            className="gap-2 text-xs shadow-lg shadow-indigo-950"
          >
            <FileText className="w-4 h-4" />
            {isExporting ? 'Đang tạo PDF...' : 'Xuất Hồ sơ Thanh tra (PDF)'}
          </Button>
        </div>
      </div>

      {/* Export notification banner */}
      {exportNotice && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-3 text-emerald-300 text-xs">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>{exportNotice}</span>
        </div>
      )}

      {/* Score and Metric Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="glassmorphism border-emerald-500/30 bg-gradient-to-br from-emerald-950/30 to-slate-900/60">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
              Chỉ số tuân thủ tổng thể
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-black text-white">98.4%</div>
            <p className="text-xs text-emerald-300/80 mt-1 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Đạt chuẩn hạng A xuất sắc
            </p>
          </CardContent>
        </Card>

        <Card className="glassmorphism">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Tuân thủ nhiệt độ CCP
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">99.2%</div>
            <p className="text-xs text-slate-400 mt-1">1,248 lượt đo hợp lệ</p>
          </CardContent>
        </Card>

        <Card className="glassmorphism">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Hoàn thành Checklist
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-indigo-400">96.8%</div>
            <p className="text-xs text-slate-400 mt-1">100% có chữ ký số quản lý</p>
          </CardContent>
        </Card>

        <Card className="glassmorphism">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Khắc phục sự cố (CAPA)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-400">100%</div>
            <p className="text-xs text-slate-400 mt-1">Thời gian TB: 32 phút</p>
          </CardContent>
        </Card>
      </div>

      {/* Audit Log / History Table */}
      <Card className="glassmorphism">
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <div className="flex items-center gap-2.5">
            <History className="w-5 h-5 text-indigo-400" />
            <div>
              <CardTitle className="text-base font-bold text-white">
                Nhật Ký Kiểm Toán Bất Biến (Audit Trail)
              </CardTitle>
              <p className="text-xs text-slate-400 mt-0.5">
                Bảo đảm tính toàn vẹn và không thể chối bỏ (Non-repudiation) của toàn bộ dữ liệu an toàn thực phẩm
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              size="sm" 
              variant={timeRange === '7d' ? 'primary' : 'outline'}
              onClick={() => setTimeRange('7d')}
            >
              7 ngày qua
            </Button>
            <Button 
              size="sm" 
              variant={timeRange === '30d' ? 'primary' : 'outline'}
              onClick={() => setTimeRange('30d')}
            >
              Tháng này
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-900/80 text-slate-300 border-b border-slate-800">
                <tr>
                  <th className="px-6 py-4 font-semibold">Mã Sự Kiện</th>
                  <th className="px-6 py-4 font-semibold">Hành Động</th>
                  <th className="px-6 py-4 font-semibold">Chi Tiết Nghiệp Vụ</th>
                  <th className="px-6 py-4 font-semibold">Nhân Sự Thực Hiện</th>
                  <th className="px-6 py-4 font-semibold">Thời Gian Ghi Nhận</th>
                  <th className="px-6 py-4 font-semibold">Tính Toàn Vẹn</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {auditEvents.map((evt) => (
                  <tr key={evt.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs text-slate-400 font-bold">
                      {evt.id}
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-800 text-slate-300 border border-slate-700">
                        {evt.action}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs font-medium text-white max-w-md">
                      {evt.detail}
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-300">
                      {evt.user}
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-400">
                      {formatDate(evt.time)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Hợp lệ (Signed)</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
