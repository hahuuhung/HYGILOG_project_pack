'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { Input } from '@/components/ui/input';
import { 
  ClipboardCheck, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  User, 
  ArrowRight, 
  Sparkles, 
  Check, 
  X, 
  Calendar,
  Layers,
  ShieldCheck,
  Building
} from 'lucide-react';
import { formatDate } from '@/lib/utils';

interface ChecklistTemplate {
  id: string;
  name: string;
  category: 'daily' | 'receiving' | 'sanitization' | 'closing';
  timeSlot: string;
  progress: number;
  status: 'completed' | 'in_progress' | 'pending';
  assignedTo: string;
  completedAt?: string;
  itemsCount: number;
  passedCount: number;
  questions: {
    id: string;
    text: string;
    criticalCcp: boolean;
    status: 'pass' | 'fail' | 'na';
    notes?: string;
  }[];
}

const initialChecklists: ChecklistTemplate[] = [
  {
    id: 'CHK-01',
    name: 'Kiểm Tra Vệ Sinh Bếp Đầu Ca Sáng (Opening Checklist)',
    category: 'daily',
    timeSlot: '06:00 - 07:00',
    progress: 100,
    status: 'completed',
    assignedTo: 'Trần Thị B (Trưởng ca)',
    completedAt: '2026-09-25T06:50:00Z',
    itemsCount: 5,
    passedCount: 5,
    questions: [
      { id: 'q1', text: 'Nhân viên mặc trang phục bếp sạch sẽ, đội mũ trùm tóc và tháo trang sức?', criticalCcp: false, status: 'pass' },
      { id: 'q2', text: 'Bồn rửa tay có đầy đủ xà phòng diệt khuẩn, cồn 70 độ và giấy lau tay 1 lần?', criticalCcp: true, status: 'pass' },
      { id: 'q3', text: 'Nhiệt độ kho đông thịt tươi (-18°C) và tủ mát (0-4°C) đạt tiêu chuẩn?', criticalCcp: true, status: 'pass' },
      { id: 'q4', text: 'Dao và thớt phân chia đúng màu sắc (Xanh: rau, Vàng: gà sống, Nâu: thịt chín)?', criticalCcp: true, status: 'pass' },
      { id: 'q5', text: 'Bề mặt bàn inox sơ chế được lau khử trùng bằng dung dịch clo 200ppm?', criticalCcp: false, status: 'pass' },
    ],
  },
  {
    id: 'CHK-02',
    name: 'Kiểm Tra Tiếp Nhận Nguyên Liệu Thực Phẩm (CCP-1 Receiving)',
    category: 'receiving',
    timeSlot: '08:00 - 10:00',
    progress: 60,
    status: 'in_progress',
    assignedTo: 'Ngô Thanh Hà (Thủ kho)',
    itemsCount: 5,
    passedCount: 3,
    questions: [
      { id: 'q1', text: 'Xe tải giao hàng có thùng xe sạch sẽ, thùng lạnh đang hoạt động đúng nhiệt độ?', criticalCcp: true, status: 'pass' },
      { id: 'q2', text: 'Thịt tươi có dấu kiểm dịch thú y hợp lệ và giấy chứng nhận ATTP?', criticalCcp: true, status: 'pass' },
      { id: 'q3', text: 'Hải sản tươi sống có độ đàn hồi tốt, mang đỏ tươi, không có mùi lạ?', criticalCcp: false, status: 'pass' },
      { id: 'q4', text: 'Bao bì sản phẩm nguyên vẹn, hạn sử dụng còn tối thiểu 80% thời hạn?', criticalCcp: false, status: 'na' },
      { id: 'q5', text: 'Đo và ghi nhận nhiệt độ bề mặt thực phẩm lúc giao hàng đạt chuẩn?', criticalCcp: true, status: 'na' },
    ],
  },
  {
    id: 'CHK-03',
    name: 'Quy Trình Khử Trùng & Rửa Rau Củ Quả Ca Trưa',
    category: 'sanitization',
    timeSlot: '10:30 - 11:30',
    progress: 0,
    status: 'pending',
    assignedTo: 'Phạm Thuỳ Dung (Phụ bếp)',
    itemsCount: 4,
    passedCount: 0,
    questions: [
      { id: 'q1', text: 'Rau củ quả được nhặt sạch lá úa, cắt bỏ rễ và rửa sạch đất cát thô dưới vòi nước chảy?', criticalCcp: false, status: 'na' },
      { id: 'q2', text: 'Pha nước ngâm clo đạt nồng độ 50 - 100 ppm (test bằng giấy thử quỳ)?', criticalCcp: true, status: 'na' },
      { id: 'q3', text: 'Thời gian ngâm đúng quy chuẩn từ 5 đến 10 phút, không quá hạn?', criticalCcp: true, status: 'na' },
      { id: 'q4', text: 'Rửa lại bằng nước sạch ăn uống và để ráo trong rổ inox cách sàn 30cm?', criticalCcp: false, status: 'na' },
    ],
  },
  {
    id: 'CHK-04',
    name: 'Kiểm Tra Vệ Sinh Đóng Cửa Bếp Cuối Ngày (Closing Checklist)',
    category: 'closing',
    timeSlot: '22:00 - 23:00',
    progress: 0,
    status: 'pending',
    assignedTo: 'Hoàng Anh Tuấn (Bếp trưởng)',
    itemsCount: 5,
    passedCount: 0,
    questions: [
      { id: 'q1', text: 'Toàn bộ thực phẩm dư thừa được bọc màng thực phẩm, dán nhãn ngày giờ lưu tủ?', criticalCcp: true, status: 'na' },
      { id: 'q2', text: 'Mẫu thức ăn lưu 24h của tất cả các món trong ngày được khóa niêm phong trong tủ mẫu?', criticalCcp: true, status: 'na' },
      { id: 'q3', text: 'Hệ thống bếp gas, van gas trung tâm và các bếp điện từ đã tắt hoàn toàn?', criticalCcp: false, status: 'na' },
      { id: 'q4', text: 'Thùng rác hữu cơ đã được dọn sạch ra nhà rác trung tâm, rửa khử trùng thùng rác?', criticalCcp: false, status: 'na' },
      { id: 'q5', text: 'Cửa kho lạnh và các tủ mát đã được đóng khít chốt an toàn?', criticalCcp: true, status: 'na' },
    ],
  },
];

export default function ChecklistsPage() {
  const [checklists, setChecklists] = useState<ChecklistTemplate[]>(initialChecklists);
  const [activeCategory, setActiveCategory] = useState<'all' | 'daily' | 'receiving' | 'sanitization' | 'closing'>('all');
  const [activeChecklist, setActiveChecklist] = useState<ChecklistTemplate | null>(null);
  const [completedSuccessToast, setCompletedSuccessToast] = useState<string | null>(null);

  const handleOpenChecklistModal = (chk: ChecklistTemplate) => {
    // Clone to edit
    setActiveChecklist(JSON.parse(JSON.stringify(chk)));
  };

  const handleQuestionStatusChange = (questionId: string, status: 'pass' | 'fail' | 'na') => {
    if (!activeChecklist) return;

    const updatedQuestions = activeChecklist.questions.map(q => {
      if (q.id === questionId) {
        return { ...q, status };
      }
      return q;
    });

    const passedCount = updatedQuestions.filter(q => q.status === 'pass').length;
    const answeredCount = updatedQuestions.filter(q => q.status === 'pass' || q.status === 'fail').length;
    const progress = Math.round((answeredCount / updatedQuestions.length) * 100);

    setActiveChecklist({
      ...activeChecklist,
      questions: updatedQuestions,
      passedCount,
      progress,
    });
  };

  const handleSubmitChecklist = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeChecklist) return;

    const allPassed = activeChecklist.questions.every(q => q.status === 'pass' || q.status === 'na');
    const isCompleted = activeChecklist.progress === 100;

    const updated = {
      ...activeChecklist,
      status: isCompleted ? ('completed' as const) : ('in_progress' as const),
      completedAt: isCompleted ? new Date().toISOString() : undefined,
    };

    setChecklists(checklists.map(c => c.id === updated.id ? updated : c));
    setActiveChecklist(null);
    setCompletedSuccessToast(`Đã lưu biên bản kiểm tra: "${updated.name}" thành công!`);
    setTimeout(() => setCompletedSuccessToast(null), 4000);
  };

  const filteredChecklists = checklists.filter(c => 
    activeCategory === 'all' || c.category === activeCategory
  );

  const completedCount = checklists.filter(c => c.status === 'completed').length;
  const inProgressCount = checklists.filter(c => c.status === 'in_progress').length;

  return (
    <div className="space-y-6 animate-slide-in">
      {/* Toast Feedback */}
      {completedSuccessToast && (
        <div className="fixed top-20 right-6 z-50 bg-emerald-600 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 border border-emerald-400/40 animate-slide-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-200" />
          <span className="text-sm font-medium">{completedSuccessToast}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <ClipboardCheck className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">Checklist Vệ Sinh & HACCP Hàng Ngày</h1>
            <p className="text-slate-400 text-sm mt-0.5">Danh mục kiểm tra an toàn thực phẩm 3 ca trực, khử khuẩn dụng cụ và quy trình tiếp nhận</p>
          </div>
        </div>

        <div className="text-xs text-slate-400 flex items-center gap-2 bg-slate-900/80 px-3 py-1.5 rounded-xl border border-slate-800">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Hôm nay: {completedCount}/{checklists.length} Checklist Hoàn Thành</span>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex rounded-xl bg-slate-900/80 p-1.5 border border-slate-800 gap-1 overflow-x-auto">
        <button
          onClick={() => setActiveCategory('all')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition whitespace-nowrap ${
            activeCategory === 'all' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          Tất cả ({checklists.length})
        </button>
        <button
          onClick={() => setActiveCategory('daily')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition whitespace-nowrap ${
            activeCategory === 'daily' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          Đầu Ca Sáng
        </button>
        <button
          onClick={() => setActiveCategory('receiving')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition whitespace-nowrap ${
            activeCategory === 'receiving' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          Tiếp Nhận Hàng (CCP-1)
        </button>
        <button
          onClick={() => setActiveCategory('sanitization')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition whitespace-nowrap ${
            activeCategory === 'sanitization' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          Khử Trùng & Rửa Rau
        </button>
        <button
          onClick={() => setActiveCategory('closing')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition whitespace-nowrap ${
            activeCategory === 'closing' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          Đóng Cửa Bếp Đêm
        </button>
      </div>

      {/* Grid Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
        {filteredChecklists.map((item) => (
          <Card 
            key={item.id} 
            className="glassmorphism hover:border-slate-600 transition-all duration-200 flex flex-col justify-between"
          >
            <CardHeader className="pb-3 border-b border-slate-800">
              <div className="flex justify-between items-start">
                <div>
                  <Badge variant={
                    item.status === 'completed' ? 'success' : 
                    item.status === 'in_progress' ? 'warning' : 'secondary'
                  }>
                    {item.status === 'completed' ? 'Đã hoàn thành' :
                     item.status === 'in_progress' ? 'Đang thực hiện' : 'Chưa bắt đầu'}
                  </Badge>
                  <CardTitle className="text-base font-bold text-white mt-2 leading-snug">
                    {item.name}
                  </CardTitle>
                </div>
                <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  <ClipboardCheck className="w-5 h-5" />
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs text-slate-400 pt-2">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-500" /> Khung giờ: <strong className="text-slate-200">{item.timeSlot}</strong>
                </span>
                <span className="flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-slate-500" /> {item.assignedTo}
                </span>
              </div>
            </CardHeader>

            <CardContent className="pt-4 space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Tiến độ kiểm tra</span>
                  <span className="font-bold text-white">{item.progress}% ({item.passedCount}/{item.itemsCount} câu đạt)</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${
                      item.progress === 100 ? 'bg-emerald-500' : 'bg-indigo-500'
                    }`}
                    style={{ width: `${item.progress}%` }}
                  />
                </div>
              </div>

              {item.completedAt && (
                <div className="text-[11px] text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Hoàn thành lúc: {formatDate(item.completedAt)}
                </div>
              )}

              <div className="pt-2 border-t border-slate-800 flex justify-between items-center">
                <span className="text-xs text-slate-500">
                  {item.itemsCount} tiêu chuẩn an toàn
                </span>
                <Button
                  size="sm"
                  onClick={() => handleOpenChecklistModal(item)}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs gap-1.5"
                >
                  {item.status === 'completed' ? 'Xem lại biên bản' : 'Mở phiếu kiểm tra'}
                  <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Modal: Interactive Checklist Form */}
      {activeChecklist && (
        <Modal
          isOpen={!!activeChecklist}
          onClose={() => setActiveChecklist(null)}
          title={`Biên Bản Checklist: ${activeChecklist.name}`}
        >
          <form onSubmit={handleSubmitChecklist} className="space-y-4 max-h-[75vh] overflow-y-auto pr-1">
            <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Phụ trách kiểm tra:</span>
                <strong className="text-white">{activeChecklist.assignedTo}</strong>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Thời gian quy định:</span>
                <span className="font-mono text-indigo-400">{activeChecklist.timeSlot}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Tiến độ hoàn tất:</span>
                <span className="font-bold text-emerald-400">{activeChecklist.progress}%</span>
              </div>
            </div>

            {/* Questions List */}
            <div className="space-y-3 pt-1">
              {activeChecklist.questions.map((q, idx) => (
                <div 
                  key={q.id}
                  className={`p-3 rounded-xl border transition-all ${
                    q.status === 'pass' ? 'bg-slate-900/60 border-emerald-500/30' :
                    q.status === 'fail' ? 'bg-red-500/10 border-red-500/40' :
                    'bg-slate-900/40 border-slate-800'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center text-[10px] font-bold">
                          {idx + 1}
                        </span>
                        {q.criticalCcp && (
                          <span className="text-[10px] font-bold font-mono px-1.5 py-0.2 rounded bg-red-500/20 text-red-400 border border-red-500/30">
                            CCP Bắt Buộc
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-white leading-relaxed font-medium pl-7">
                        {q.text}
                      </p>
                    </div>

                    {/* Radio Pass / Fail / N/A */}
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <button
                        type="button"
                        onClick={() => handleQuestionStatusChange(q.id, 'pass')}
                        className={`px-2.5 py-1 rounded-md text-xs font-bold transition flex items-center gap-1 ${
                          q.status === 'pass'
                            ? 'bg-emerald-600 text-white shadow-md'
                            : 'bg-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        <Check className="w-3.5 h-3.5" /> Đạt
                      </button>

                      <button
                        type="button"
                        onClick={() => handleQuestionStatusChange(q.id, 'fail')}
                        className={`px-2.5 py-1 rounded-md text-xs font-bold transition flex items-center gap-1 ${
                          q.status === 'fail'
                            ? 'bg-red-600 text-white shadow-md'
                            : 'bg-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        <X className="w-3.5 h-3.5" /> Không
                      </button>

                      <button
                        type="button"
                        onClick={() => handleQuestionStatusChange(q.id, 'na')}
                        className={`px-2 py-1 rounded-md text-xs font-medium transition ${
                          q.status === 'na'
                            ? 'bg-slate-700 text-white'
                            : 'bg-slate-800 text-slate-500 hover:text-slate-300'
                        }`}
                      >
                        N/A
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
              <Button type="button" variant="outline" onClick={() => setActiveChecklist(null)}>
                Đóng
              </Button>
              <Button type="submit" className="bg-indigo-600 hover:bg-indigo-500 text-white">
                Xác Nhận & Ký Biên Bản
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

