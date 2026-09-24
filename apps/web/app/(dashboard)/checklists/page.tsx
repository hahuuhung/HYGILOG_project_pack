'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  ClipboardCheck, 
  Plus, 
  CheckCircle2, 
  Clock, 
  Building2, 
  UserCheck, 
  X,
  Sparkles,
  Camera,
  FileCheck
} from 'lucide-react';

interface ChecklistItem {
  id: string;
  label: string;
  checked: boolean;
  notes?: string;
}

interface ChecklistRun {
  id: string;
  title: string;
  shift: string;
  timeWindow: string;
  site: string;
  assignedTo: string;
  approvedBy?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'approved';
  items: ChecklistItem[];
}

const initialChecklists: ChecklistRun[] = [
  {
    id: 'CHK-01',
    title: 'Vệ sinh & An toàn Bếp ca sáng (Opening Routine)',
    shift: 'Ca Sáng',
    timeWindow: '06:00 - 07:30',
    site: 'Nhà hàng Phố Cổ (Bếp Nóng)',
    assignedTo: 'Nguyễn Văn An',
    approvedBy: 'Lê Hoàng Nam (Bếp trưởng)',
    status: 'approved',
    items: [
      { id: '1', label: 'Rửa tay sát khuẩn đúng 6 bước Bộ Y Tế, thay đồng phục và tạp dề sạch', checked: true },
      { id: '2', label: 'Kiểm tra cảm quan nhiệt kế kho đông và tủ mát trước khi chế biến', checked: true },
      { id: '3', label: 'Vệ sinh khử trùng mặt bàn sơ chế inox bằng cồn 70 độ hoặc dung dịch Clorin', checked: true },
      { id: '4', label: 'Bố trí dao thớt tách biệt màu sắc (Đỏ: Thịt sống, Xanh lá: Rau củ, Vàng: Thịt chín)', checked: true },
      { id: '5', label: 'Kiểm tra lưới lọc dầu và hệ thống hút khói PCCC', checked: true },
    ],
  },
  {
    id: 'CHK-02',
    title: 'Kiểm thực 3 bước - Giám sát giao nhận thực phẩm trưa',
    shift: 'Ca Trưa',
    timeWindow: '10:30 - 11:30',
    site: 'Nhà hàng Phố Cổ (Cửa nhập)',
    assignedTo: 'Võ Thị Hương',
    status: 'in_progress',
    items: [
      { id: '1', label: 'Kiểm tra bao bì, nhãn mác, hạn sử dụng trên từng thùng thực phẩm nhập vào', checked: true },
      { id: '2', label: 'Đo nhiệt độ xe lạnh giao hàng (Thịt đông lạnh ≤ -18°C, Rau củ 5°C - 10°C)', checked: true },
      { id: '3', label: 'Kiểm tra hóa đơn chứng từ kiểm dịch thú y hợp lệ', checked: false },
      { id: '4', label: 'Phân loại xếp hàng lên pallet, không để nguyên liệu tiếp xúc trực tiếp nền nhà', checked: false },
    ],
  },
  {
    id: 'CHK-03',
    title: 'Tổng vệ sinh & Khử khuẩn ca tối (Closing Routine)',
    shift: 'Ca Tối',
    timeWindow: '21:30 - 22:30',
    site: 'Khách sạn Sài Gòn Riverside',
    assignedTo: 'Phạm Minh Đức',
    status: 'pending',
    items: [
      { id: '1', label: 'Bọc màng bọc thực phẩm, dán nhãn ngày mở và hạn dùng cho toàn bộ nguyên liệu tồn', checked: false },
      { id: '2', label: 'Cọ rửa rãnh thoát sàn, khử mùi và đổ rác thải sinh hoạt trước khi ra về', checked: false },
      { id: '3', label: 'Khóa van bình gas công nghiệp và ngắt nguồn điện các thiết bị gia nhiệt', checked: false },
      { id: '4', label: 'Kiểm tra cửa kho lạnh đóng kín, cài chốt an toàn ban đêm', checked: false },
    ],
  },
];

export default function ChecklistsPage() {
  const [checklists, setChecklists] = useState<ChecklistRun[]>(initialChecklists);
  const [activeChecklist, setActiveChecklist] = useState<ChecklistRun | null>(null);

  const handleToggleItem = (itemId: string) => {
    if (!activeChecklist) return;

    const updatedItems = activeChecklist.items.map(it => {
      if (it.id === itemId) return { ...it, checked: !it.checked };
      return it;
    });

    const completed = updatedItems.filter(i => i.checked).length;
    const total = updatedItems.length;
    let newStatus: ChecklistRun['status'] = 'in_progress';
    if (completed === total) newStatus = 'completed';
    if (completed === 0) newStatus = 'pending';

    const updatedRun = {
      ...activeChecklist,
      items: updatedItems,
      status: newStatus,
    };

    setActiveChecklist(updatedRun);
    setChecklists(prev => prev.map(c => c.id === updatedRun.id ? updatedRun : c));
  };

  const handleApprove = () => {
    if (!activeChecklist) return;
    const approved = {
      ...activeChecklist,
      status: 'approved' as const,
      approvedBy: 'Lê Hoàng Nam (Bếp trưởng đã ký số)',
    };
    setActiveChecklist(approved);
    setChecklists(prev => prev.map(c => c.id === approved.id ? approved : c));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-3xl font-bold tracking-tight text-white">Checklist Vệ Sinh HACCP</h2>
            <Badge variant="outline" className="text-teal-400 border-teal-500/30 bg-teal-500/10">
              Quy Trình Kiểm Tra Bắt Buộc
            </Badge>
          </div>
          <p className="text-slate-400 text-sm mt-1">
            Quy trình chuẩn hóa vệ sinh an toàn thực phẩm theo ca làm việc với chữ ký số nghiệm thu
          </p>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid gap-6 md:grid-cols-3">
        {checklists.map((chk) => {
          const checkedCount = chk.items.filter(i => i.checked).length;
          const totalCount = chk.items.length;
          const pct = Math.round((checkedCount / totalCount) * 100);

          return (
            <Card 
              key={chk.id} 
              onClick={() => setActiveChecklist(chk)}
              className="glassmorphism hover:-translate-y-1 hover:border-slate-700 transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300 font-mono">
                      {chk.shift}
                    </span>
                    <Badge variant={
                      chk.status === 'approved' ? 'success' :
                      chk.status === 'completed' ? 'primary' :
                      chk.status === 'in_progress' ? 'warning' : 'default'
                    }>
                      {chk.status === 'approved' ? 'Đã ký duyệt' :
                       chk.status === 'completed' ? 'Chờ duyệt' :
                       chk.status === 'in_progress' ? 'Đang thực hiện' : 'Chưa bắt đầu'}
                    </Badge>
                  </div>
                  <CardTitle className="text-base font-bold text-white mt-2 leading-snug">
                    {chk.title}
                  </CardTitle>
                  <p className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    Khung giờ: {chk.timeWindow}
                  </p>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">Tiến độ hoàn thành:</span>
                      <span className="font-bold text-white">{checkedCount}/{totalCount} ({pct}%)</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${
                          pct === 100 ? 'bg-emerald-400' : 'bg-indigo-500'
                        }`}
                        style={{ width: `${pct}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="text-xs text-slate-400 space-y-1 pt-1 border-t border-slate-800/80">
                    <div className="flex items-center gap-1.5 truncate">
                      <Building2 className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      <span className="truncate">{chk.site}</span>
                    </div>
                    <div>Thực hiện: <strong className="text-slate-200">{chk.assignedTo}</strong></div>
                    {chk.approvedBy && (
                      <div className="text-emerald-400 font-medium truncate">✓ {chk.approvedBy}</div>
                    )}
                  </div>
                </CardContent>
              </div>

              <div className="p-4 border-t border-slate-800 bg-slate-900/40 flex items-center justify-between text-xs">
                <span className="text-indigo-400 font-medium">Bấm để kiểm tra chi tiết →</span>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Interactive Execution Modal */}
      {activeChecklist && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-xl w-full p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="flex items-start justify-between pb-4 border-b border-slate-800 mb-4">
              <div>
                <span className="text-xs font-mono text-indigo-400 font-bold">{activeChecklist.id} • {activeChecklist.shift}</span>
                <h3 className="text-lg font-bold text-white mt-0.5">{activeChecklist.title}</h3>
                <p className="text-xs text-slate-400 mt-1">{activeChecklist.site}</p>
              </div>
              <button onClick={() => setActiveChecklist(null)} className="text-slate-400 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Checklist items list */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-1 py-1">
              {activeChecklist.items.map((item, idx) => (
                <div 
                  key={item.id}
                  onClick={() => handleToggleItem(item.id)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                    item.checked 
                      ? 'bg-emerald-950/20 border-emerald-500/40 text-white' 
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-300'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-md flex items-center justify-center border shrink-0 mt-0.5 transition-colors ${
                    item.checked 
                      ? 'bg-emerald-500 border-emerald-400 text-slate-950' 
                      : 'border-slate-600'
                  }`}>
                    {item.checked && <CheckCircle2 className="w-4 h-4 stroke-[3]" />}
                  </div>

                  <div className="flex-1 text-xs">
                    <span className="font-semibold text-slate-400 block mb-0.5">Tiêu chí #{idx + 1}:</span>
                    <p className={`leading-relaxed ${item.checked ? 'text-white' : 'text-slate-300'}`}>
                      {item.label}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Modal Footer / Approval */}
            <div className="pt-4 border-t border-slate-800 mt-4 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-xs text-slate-400 self-start sm:self-center">
                {activeChecklist.approvedBy ? (
                  <span className="text-emerald-400 font-semibold flex items-center gap-1">
                    <FileCheck className="w-4 h-4" />
                    {activeChecklist.approvedBy}
                  </span>
                ) : (
                  <span>Chờ chữ ký phê duyệt của Bếp trưởng</span>
                )}
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center">
                {!activeChecklist.approvedBy && activeChecklist.items.every(i => i.checked) && (
                  <Button 
                    variant="primary"
                    className="bg-emerald-600 hover:bg-emerald-500 text-white"
                    onClick={handleApprove}
                  >
                    Ký duyệt danh mục (HACCP Sign-off)
                  </Button>
                )}
                <Button variant="outline" onClick={() => setActiveChecklist(null)}>
                  Đóng
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
