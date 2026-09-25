'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Download, 
  Calendar, 
  CheckCircle2, 
  AlertTriangle, 
  Filter, 
  BarChart3, 
  FileSpreadsheet, 
  Printer, 
  Building2, 
  ShieldCheck, 
  TrendingUp, 
  Clock,
  Layers,
  Check,
  Loader2
} from 'lucide-react';
import { formatDate } from '@/lib/utils';

interface ReportTemplate {
  id: string;
  code: string;
  title: string;
  description: string;
  category: 'temperature' | 'checklist' | 'traceability' | 'capa' | 'audit';
  lastGenerated: string;
  generatedBy: string;
  period: string;
  fileSize: string;
  status: 'ready' | 'generating';
}

const templates: ReportTemplate[] = [
  {
    id: 'REP-01',
    code: 'HACCP-FORM-01',
    title: 'Sổ Nhật Ký Giám Sát Nhiệt Độ Thiết Bị Lạnh & Nấu Chín',
    description: 'Báo cáo chi tiết toàn bộ các lần đo nhiệt độ tâm thực phẩm, kho đông sâu, tủ mát và quầy buffet.',
    category: 'temperature',
    lastGenerated: '2026-09-25T07:00:00Z',
    generatedBy: 'Hệ thống tự động (Daily Auto)',
    period: '24 Giờ qua',
    fileSize: '2.4 MB (PDF)',
    status: 'ready',
  },
  {
    id: 'REP-02',
    code: 'HACCP-FORM-02',
    title: 'Hồ Sơ Tổng Hợp Checklist Vệ Sinh Khử Trùng Hàng Ngày',
    description: 'Lịch sử tích chọn kiểm tra vệ sinh 3 ca trực: Ca sáng, ca trưa, ca tối kèm ảnh chụp hiện trường.',
    category: 'checklist',
    lastGenerated: '2026-09-24T23:00:00Z',
    generatedBy: 'Nguyễn Văn A (Quản lý ATTP)',
    period: '7 Ngày gần nhất',
    fileSize: '5.1 MB (PDF)',
    status: 'ready',
  },
  {
    id: 'REP-03',
    code: 'HACCP-FORM-03',
    title: 'Báo Cáo Truy Xuất Lô Hàng & Tiếp Nhận Nguyên Liệu (FEFO)',
    description: 'Chuỗi cung ứng nguyên liệu từ nhà cung cấp, nhiệt độ khi giao, giấy chứng nhận kiểm dịch và hạn dùng.',
    category: 'traceability',
    lastGenerated: '2026-09-24T18:30:00Z',
    generatedBy: 'Ngô Thanh Hà (Thủ kho)',
    period: 'Tháng 09/2026',
    fileSize: '3.8 MB (Excel)',
    status: 'ready',
  },
  {
    id: 'REP-04',
    code: 'HACCP-FORM-04',
    title: 'Báo Cáo Sự Cố & Hành Động Khắc Phục CAPA Vi Phạm',
    description: 'Tổng hợp các cảnh báo nhiệt độ lệch chuẩn, phân tích nguyên nhân gốc rễ và biên bản nghiệm thu.',
    category: 'capa',
    lastGenerated: '2026-09-23T16:00:00Z',
    generatedBy: 'Trần Thị B (Trưởng ca)',
    period: 'Tháng 09/2026',
    fileSize: '1.9 MB (PDF)',
    status: 'ready',
  },
  {
    id: 'REP-05',
    code: 'HACCP-AUDIT-GOLD',
    title: 'Báo Cáo Đánh Giá Toàn Diện Đoàn Kiểm Tra Độc Lập (Audit Summary)',
    description: 'Hồ sơ pháp lý đầy đủ phục vụ đoàn thanh tra Chi cục An toàn Vệ sinh Thực phẩm và kiểm toán ISO 22000.',
    category: 'audit',
    lastGenerated: '2026-09-20T10:00:00Z',
    generatedBy: 'Ban Giám Đốc Khối Ẩm Thực',
    period: 'Quý 3/2026',
    fileSize: '12.4 MB (Zip Pack)',
    status: 'ready',
  },
];

export default function ReportsPage() {
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [selectedSite, setSelectedSite] = useState('all');
  const [selectedPeriod, setSelectedPeriod] = useState('7days');
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const handleDownload = (report: ReportTemplate, format: 'PDF' | 'Excel') => {
    setDownloadingId(report.id);
    setTimeout(() => {
      setDownloadingId(null);
      setSuccessToast(`Đã xuất và tải về thành công: ${report.code} định dạng ${format}!`);
      setTimeout(() => setSuccessToast(null), 4000);
    }, 1200);
  };

  return (
    <div className="space-y-6 animate-slide-in">
      {/* Toast Feedback */}
      {successToast && (
        <div className="fixed top-20 right-6 z-50 bg-emerald-600 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 border border-emerald-400/40 animate-slide-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-200" />
          <span className="text-sm font-medium">{successToast}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">Báo Cáo & Dữ Liệu Kiểm Toán HACCP</h1>
            <p className="text-slate-400 text-sm mt-0.5">Xuất báo cáo pháp lý, nhật ký vận hành và thống kê tuân thủ an toàn thực phẩm chuẩn ISO 22000</p>
          </div>
        </div>

        {/* Global Action */}
        <div className="flex items-center gap-2">
          <Button 
            onClick={() => {
              setDownloadingId('ALL');
              setTimeout(() => {
                setDownloadingId(null);
                setSuccessToast('Đã đóng gói và tải về toàn bộ Hồ sơ Kiểm toán HACCP Tháng 9/2026!');
                setTimeout(() => setSuccessToast(null), 4000);
              }, 1800);
            }}
            disabled={downloadingId === 'ALL'}
            className="bg-emerald-600 hover:bg-emerald-500 text-white gap-2 shadow-lg shadow-emerald-600/25"
          >
            {downloadingId === 'ALL' ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Download className="w-4 h-4" />
            )}
            Xuất Hồ Sơ Kiểm Toán Toàn Bộ
          </Button>
        </div>
      </div>

      {/* Filter and Period Selection */}
      <Card className="glassmorphism">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-xs text-slate-400 flex items-center gap-1.5 font-medium">
                <Building2 className="w-4 h-4 text-slate-400" /> Cơ sở:
              </span>
              <select
                value={selectedSite}
                onChange={(e) => setSelectedSite(e.target.value)}
                className="h-9 rounded-lg text-xs bg-slate-900 border border-slate-700 px-3 text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
              >
                <option value="all">Tất cả chi nhánh (Chuỗi 3 nhà hàng)</option>
                <option value="site_1">Landmark 81 - Bếp Trung Tâm</option>
                <option value="site_2">Quận 1 - Đồng Khởi Flagship</option>
                <option value="site_3">Hà Nội - Tây Hồ Premium</option>
              </select>

              <span className="text-xs text-slate-400 flex items-center gap-1.5 font-medium ml-2">
                <Calendar className="w-4 h-4 text-slate-400" /> Kỳ báo cáo:
              </span>
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="h-9 rounded-lg text-xs bg-slate-900 border border-slate-700 px-3 text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
              >
                <option value="today">Hôm nay (24 Giờ)</option>
                <option value="7days">7 Ngày vừa qua</option>
                <option value="month">Tháng này (Tháng 09/2026)</option>
                <option value="quarter">Quý 3/2026 (Định kỳ thanh tra)</option>
              </select>
            </div>

            <div className="text-xs text-slate-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Dữ liệu được số hóa và ký số điện tử
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Audit KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="glassmorphism border-emerald-500/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Chỉ số Tuân thủ HACCP</CardTitle>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-emerald-400">98.4%</div>
            <div className="flex items-center gap-1 text-xs text-emerald-300 mt-1">
              <TrendingUp className="w-3.5 h-3.5" /> Xếp hạng: Đạt Chuẩn Hạng A
            </div>
          </CardContent>
        </Card>

        <Card className="glassmorphism border-indigo-500/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Tổng Lượt Đo Nhiệt Độ</CardTitle>
            <BarChart3 className="w-4 h-4 text-indigo-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">1,480</div>
            <p className="text-xs text-slate-400 mt-1">99.8% trong khoảng nhiệt độ an toàn</p>
          </CardContent>
        </Card>

        <Card className="glassmorphism border-violet-500/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Checklist Đạt Chuẩn</CardTitle>
            <CheckCircle2 className="w-4 h-4 text-violet-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-violet-400">412 / 420</div>
            <p className="text-xs text-slate-400 mt-1">Tỷ lệ hoàn thành 98.1%</p>
          </CardContent>
        </Card>

        <Card className="glassmorphism border-amber-500/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Sự Cố Đã Khắc Phục (CAPA)</CardTitle>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-amber-400">100%</div>
            <p className="text-xs text-slate-400 mt-1">5/5 sự cố được giải quyết đúng hạn</p>
          </CardContent>
        </Card>
      </div>

      {/* Reports Template Table */}
      <Card className="glassmorphism overflow-hidden">
        <CardHeader className="border-b border-slate-800">
          <CardTitle className="text-lg">Danh Mục Biểu Mẫu Báo Cáo Kiểm Toán Chính Thức</CardTitle>
          <CardDescription>Bao gồm đầy đủ các mẫu sổ nhật ký phục vụ thanh kiểm tra định kỳ của cơ quan chức năng</CardDescription>
        </CardHeader>
        <div className="divide-y divide-slate-800">
          {templates.map((report) => (
            <div key={report.id} className="p-5 hover:bg-slate-800/40 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-slate-800 text-indigo-400 border border-slate-700 flex-shrink-0">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-bold">
                      {report.code}
                    </span>
                    <h3 className="text-base font-bold text-white">{report.title}</h3>
                  </div>
                  <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">{report.description}</p>
                  
                  <div className="flex items-center gap-4 text-[11px] text-slate-500 mt-2 flex-wrap">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" /> Cập nhật: {formatDate(report.lastGenerated)}
                    </span>
                    <span>• Người lập: <strong className="text-slate-300">{report.generatedBy}</strong></span>
                    <span>• Dung lượng: <span className="font-mono text-slate-400">{report.fileSize}</span></span>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-2 self-end md:self-center flex-shrink-0">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDownload(report, 'Excel')}
                  disabled={downloadingId === report.id}
                  className="text-xs gap-1.5 border-slate-700 hover:bg-slate-800 text-emerald-400"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                  Excel
                </Button>
                <Button
                  size="sm"
                  onClick={() => handleDownload(report, 'PDF')}
                  disabled={downloadingId === report.id}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs gap-1.5"
                >
                  {downloadingId === report.id ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Download className="w-3.5 h-3.5" />
                  )}
                  Tải PDF
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Compliance Breakdown Table */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glassmorphism">
          <CardHeader>
            <CardTitle className="text-base">Mức Độ Tuân Thủ Theo Điểm Kiểm Soát Tới Hạn (CCP)</CardTitle>
            <CardDescription>Đánh giá theo 7 nguyên tắc HACCP quốc tế</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { ccp: 'CCP-1: Tiếp Nhận Hàng Thực Phẩm', pass: 99.5, color: 'bg-emerald-500' },
              { ccp: 'CCP-2: Lưu Kho Đông & Mát (Nhiệt độ)', pass: 98.2, color: 'bg-indigo-500' },
              { ccp: 'CCP-3: Xử Lý Nhiệt Nấu Chín (> 75°C)', pass: 100, color: 'bg-emerald-500' },
              { ccp: 'CCP-4: Giữ Nóng & Trưng Bày Phục Vụ', pass: 97.4, color: 'bg-amber-500' },
              { ccp: 'PRP: Vệ Sinh Cá Nhân & Rửa Tay', pass: 98.9, color: 'bg-violet-500' },
            ].map((item, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="font-medium text-slate-300">{item.ccp}</span>
                  <span className="font-bold text-white">{item.pass}%</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div className={`h-full rounded-full ${item.color}`} style={{ width: `${item.pass}%` }} />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="glassmorphism">
          <CardHeader>
            <CardTitle className="text-base">Ghi Chú Đánh Giá Của Chuyên Viên ATTP</CardTitle>
            <CardDescription>Đánh giá tổng quan ca trực và đề xuất cải tiến</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-xs leading-relaxed text-slate-300">
            <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-700/50 space-y-1.5">
              <div className="flex justify-between items-center text-white font-semibold">
                <span>Nhận xét định kỳ tuần 3 - Tháng 9</span>
                <Badge variant="success">Đạt yêu cầu</Badge>
              </div>
              <p className="text-slate-400">
                Tất cả các chi nhánh đều thực hiện ghi nhận nhiệt độ đúng chu kỳ 2 giờ/lần qua ứng dụng di động. Không có trường hợp mẫu thực phẩm quá hạn bị bỏ sót.
              </p>
            </div>

            <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-700/50 space-y-1.5">
              <div className="flex justify-between items-center text-white font-semibold">
                <span>Khuyến nghị đoàn thanh tra</span>
                <span className="text-[11px] text-slate-400">24/09/2026</span>
              </div>
              <p className="text-slate-400">
                Tiếp tục duy trì nguyên tắc xuất nhập hàng FEFO tại kho đông sâu #01. Chú ý dán tem nhãn màu cho khay thực phẩm rã đông trong ngày.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

