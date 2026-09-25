'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Modal } from '@/components/ui/modal';
import { 
  CheckSquare, 
  Search, 
  Plus, 
  Clock, 
  User, 
  Calendar, 
  AlertCircle, 
  CheckCircle2, 
  Filter, 
  Sun, 
  Moon, 
  Sunset,
  Flame,
  ShieldCheck,
  Check
} from 'lucide-react';
import { formatDate } from '@/lib/utils';

interface TaskItem {
  id: string;
  title: string;
  category: 'temperature' | 'sanitization' | 'sample_storage' | 'receiving' | 'equipment';
  shift: 'morning' | 'afternoon' | 'evening';
  assignedTo: string;
  dueTime: string;
  status: 'todo' | 'in_progress' | 'completed' | 'overdue';
  priority: 'high' | 'medium' | 'low';
  completedAt?: string;
  completedBy?: string;
  notes?: string;
  ccpPoint?: string;
}

const initialTasks: TaskItem[] = [
  {
    id: 'TSK-01',
    title: 'Kiểm tra & ghi nhận nhiệt độ 4 kho lạnh và 6 tủ mát đầu ca',
    category: 'temperature',
    shift: 'morning',
    assignedTo: 'Nguyễn Văn A (Bếp chính)',
    dueTime: '07:00',
    status: 'completed',
    priority: 'high',
    completedAt: '2026-09-25T06:55:00Z',
    completedBy: 'Nguyễn Văn A',
    notes: 'Tất cả các kho đều trong ngưỡng an toàn: Kho đông -18.5°C, Kho mát 2.1°C.',
    ccpPoint: 'CCP-2 (Bảo quản lạnh)',
  },
  {
    id: 'TSK-02',
    title: 'Pha hóa chất & kiểm tra nồng độ dung dịch khử trùng clo ngâm rau (50-100 ppm)',
    category: 'sanitization',
    shift: 'morning',
    assignedTo: 'Phạm Thuỳ Dung (Phụ bếp)',
    dueTime: '08:00',
    status: 'completed',
    priority: 'high',
    completedAt: '2026-09-25T07:45:00Z',
    completedBy: 'Phạm Thuỳ Dung',
    notes: 'Test bằng giấy thử nồng độ đạt chuẩn 75 ppm.',
    ccpPoint: 'PRP-Khử trùng rau củ',
  },
  {
    id: 'TSK-03',
    title: 'Tiếp nhận và kiểm định nhiệt độ xe lạnh giao thịt bò Úc nhập khẩu',
    category: 'receiving',
    shift: 'morning',
    assignedTo: 'Ngô Thanh Hà (Thủ kho)',
    dueTime: '09:00',
    status: 'completed',
    priority: 'high',
    completedAt: '2026-09-25T08:15:00Z',
    completedBy: 'Ngô Thanh Hà',
    notes: 'Thịt tươi có kiểm dịch, nhiệt độ giao -19.2°C.',
    ccpPoint: 'CCP-1 (Kiểm soát nhận hàng)',
  },
  {
    id: 'TSK-04',
    title: 'Đo nhiệt độ tâm thực phẩm các món hầm & sốt nóng trên quầy giữ nhiệt (> 60°C)',
    category: 'temperature',
    shift: 'afternoon',
    assignedTo: 'Trần Thị B (Trưởng ca)',
    dueTime: '11:45',
    status: 'in_progress',
    priority: 'high',
    notes: 'Đang chuẩn bị bước vào giờ cao điểm phục vụ trưa.',
    ccpPoint: 'CCP-4 (Giữ nóng thực phẩm)',
  },
  {
    id: 'TSK-05',
    title: 'Kiểm tra chỉ số chất lượng dầu chiên TPM bếp chiên nhúng (< 24%)',
    category: 'equipment',
    shift: 'afternoon',
    assignedTo: 'Lê Văn C (Nhân viên)',
    dueTime: '14:00',
    status: 'todo',
    priority: 'medium',
    ccpPoint: 'PRP-Kiểm soát dầu chiên',
  },
  {
    id: 'TSK-06',
    title: 'Lấy mẫu lưu 24h toàn bộ 12 món tiệc trưa vào hộp inox tiệt trùng',
    category: 'sample_storage',
    shift: 'afternoon',
    assignedTo: 'Lê Hoàng Yến (Giám sát ATTP)',
    dueTime: '14:30',
    status: 'todo',
    priority: 'high',
    notes: 'Mỗi mẫu tối thiểu 100g, dán nhãn ghi rõ giờ lấy và tên nhân viên chế biến.',
    ccpPoint: 'CCP-Lưu mẫu thực phẩm 24h',
  },
  {
    id: 'TSK-07',
    title: 'Tổng vệ sinh & tẩy nhờn hệ thống chụp hút khói cùng phễu gom dầu mỡ',
    category: 'sanitization',
    shift: 'evening',
    assignedTo: 'Tổ tạp vụ bếp đêm',
    dueTime: '22:30',
    status: 'todo',
    priority: 'medium',
    ccpPoint: 'PRP-Vệ sinh môi trường',
  },
  {
    id: 'TSK-08',
    title: 'Niêm phong rác thải hữu cơ và khử trùng cống thoát sàn cuối ngày',
    category: 'sanitization',
    shift: 'evening',
    assignedTo: 'Tổ tạp vụ bếp đêm',
    dueTime: '23:00',
    status: 'todo',
    priority: 'medium',
    ccpPoint: 'PRP-Quản lý chất thải',
  },
];

export default function TasksPage() {
  const [tasks, setTasks] = useState<TaskItem[]>(initialTasks);
  const [selectedShift, setSelectedShift] = useState<'all' | 'morning' | 'afternoon' | 'evening'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'todo' | 'in_progress' | 'completed'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // New task form state
  const [newTask, setNewTask] = useState({
    title: '',
    category: 'temperature' as TaskItem['category'],
    shift: 'morning' as TaskItem['shift'],
    assignedTo: '',
    dueTime: '08:00',
    priority: 'high' as TaskItem['priority'],
    ccpPoint: 'CCP-2 (Bảo quản lạnh)',
    notes: '',
  });

  const handleToggleComplete = (taskId: string) => {
    setTasks(tasks.map(t => {
      if (t.id === taskId) {
        if (t.status === 'completed') {
          return { ...t, status: 'todo', completedAt: undefined, completedBy: undefined };
        } else {
          return {
            ...t,
            status: 'completed',
            completedAt: new Date().toISOString(),
            completedBy: 'Nguyễn Văn A (Đã xác nhận)',
          };
        }
      }
      return t;
    }));
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.title || !newTask.assignedTo) return;

    const created: TaskItem = {
      id: `TSK-0${tasks.length + 1}`,
      title: newTask.title,
      category: newTask.category,
      shift: newTask.shift,
      assignedTo: newTask.assignedTo,
      dueTime: newTask.dueTime,
      priority: newTask.priority,
      status: 'todo',
      ccpPoint: newTask.ccpPoint,
      notes: newTask.notes,
    };

    setTasks([...tasks, created]);
    setIsCreateModalOpen(false);
    setNewTask({
      title: '',
      category: 'temperature',
      shift: 'morning',
      assignedTo: '',
      dueTime: '08:00',
      priority: 'high',
      ccpPoint: 'CCP-2 (Bảo quản lạnh)',
      notes: '',
    });
  };

  const filteredTasks = tasks.filter(t => {
    const matchesSearch = 
      t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.assignedTo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesShift = selectedShift === 'all' || t.shift === selectedShift;
    const matchesStatus = statusFilter === 'all' || t.status === statusFilter;
    return matchesSearch && matchesShift && matchesStatus;
  });

  const completedCount = tasks.filter(t => t.status === 'completed').length;
  const inProgressCount = tasks.filter(t => t.status === 'in_progress').length;
  const todoCount = tasks.filter(t => t.status === 'todo').length;
  const progressPercent = Math.round((completedCount / tasks.length) * 100);

  return (
    <div className="space-y-6 animate-slide-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <CheckSquare className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">Nhiệm Vụ Kiểm Tra Theo Ca Trực</h1>
            <p className="text-slate-400 text-sm mt-0.5">Phân công công việc kiểm soát an toàn thực phẩm, checklist thao tác thực địa và lấy mẫu lưu</p>
          </div>
        </div>

        <Button 
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-500 text-white gap-2 shadow-lg shadow-indigo-600/25"
        >
          <Plus className="w-4 h-4" />
          Giao Nhiệm Vụ Mới
        </Button>
      </div>

      {/* Progress & Shift KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="glassmorphism border-indigo-500/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Tiến độ ca hôm nay</CardTitle>
            <ShieldCheck className="w-4 h-4 text-indigo-400" />
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline justify-between">
              <div className="text-2xl font-bold text-white">{completedCount} / {tasks.length}</div>
              <span className="text-sm font-bold text-indigo-400">{progressPercent}%</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2 mt-2 overflow-hidden">
              <div className="bg-indigo-500 h-full rounded-full transition-all duration-500" style={{ width: `${progressPercent}%` }} />
            </div>
          </CardContent>
        </Card>

        <Card className="glassmorphism border-emerald-500/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Đã hoàn thành</CardTitle>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-400">{completedCount}</div>
            <p className="text-xs text-slate-400 mt-1">Đầy đủ chữ ký xác nhận số</p>
          </CardContent>
        </Card>

        <Card className="glassmorphism border-amber-500/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Đang thực hiện</CardTitle>
            <Clock className="w-4 h-4 text-amber-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-400">{inProgressCount}</div>
            <p className="text-xs text-slate-400 mt-1">Trong khung giờ phục vụ trưa</p>
          </CardContent>
        </Card>

        <Card className="glassmorphism border-slate-700/60">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Nhiệm vụ còn lại</CardTitle>
            <Calendar className="w-4 h-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-200">{todoCount}</div>
            <p className="text-xs text-slate-400 mt-1">Ca chiều và ca tổng kết đêm</p>
          </CardContent>
        </Card>
      </div>

      {/* Filter Bar */}
      <Card className="glassmorphism">
        <CardContent className="p-4 space-y-4">
          <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
            <div className="w-full md:w-96">
              <Input
                placeholder="Tìm tên nhiệm vụ, nhân viên phụ trách..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                icon={<Search className="w-4 h-4" />}
                className="bg-slate-900/60 border-slate-700/60"
              />
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {/* Shift Tabs */}
              <div className="flex rounded-lg bg-slate-900/80 p-1 border border-slate-800">
                <button
                  onClick={() => setSelectedShift('all')}
                  className={`px-3 py-1 rounded-md text-xs font-medium transition ${
                    selectedShift === 'all' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Cả ngày
                </button>
                <button
                  onClick={() => setSelectedShift('morning')}
                  className={`px-3 py-1 rounded-md text-xs font-medium transition flex items-center gap-1 ${
                    selectedShift === 'morning' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Sun className="w-3 h-3 text-amber-400" /> Ca Sáng
                </button>
                <button
                  onClick={() => setSelectedShift('afternoon')}
                  className={`px-3 py-1 rounded-md text-xs font-medium transition flex items-center gap-1 ${
                    selectedShift === 'afternoon' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Sunset className="w-3 h-3 text-orange-400" /> Ca Chiều
                </button>
                <button
                  onClick={() => setSelectedShift('evening')}
                  className={`px-3 py-1 rounded-md text-xs font-medium transition flex items-center gap-1 ${
                    selectedShift === 'evening' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Moon className="w-3 h-3 text-indigo-400" /> Ca Tối
                </button>
              </div>

              {/* Status filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="h-8 rounded-lg text-xs bg-slate-800 text-slate-300 border border-slate-700 px-2.5 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="all">Mọi trạng thái</option>
                <option value="todo">Cần làm (To-Do)</option>
                <option value="in_progress">Đang làm</option>
                <option value="completed">Đã xong</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Task List */}
      <div className="space-y-3">
        {filteredTasks.length === 0 ? (
          <Card className="glassmorphism p-12 text-center text-slate-400">
            <p>Không tìm thấy nhiệm vụ nào thỏa mãn điều kiện lọc.</p>
          </Card>
        ) : (
          filteredTasks.map((task) => (
            <div
              key={task.id}
              className={`p-4 rounded-xl border transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                task.status === 'completed'
                  ? 'bg-slate-900/30 border-slate-800/60 opacity-80'
                  : 'bg-slate-900/60 border-slate-700/60 hover:border-slate-600'
              }`}
            >
              <div className="flex items-start gap-4">
                <button
                  onClick={() => handleToggleComplete(task.id)}
                  className={`w-6 h-6 rounded-md border flex items-center justify-center transition mt-0.5 flex-shrink-0 cursor-pointer ${
                    task.status === 'completed'
                      ? 'bg-emerald-600 border-emerald-500 text-white'
                      : 'border-slate-600 bg-slate-800/80 hover:border-indigo-400'
                  }`}
                >
                  {task.status === 'completed' && <Check className="w-4 h-4 stroke-[3]" />}
                </button>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-sm font-semibold ${task.status === 'completed' ? 'text-slate-400 line-through' : 'text-white'}`}>
                      {task.title}
                    </span>
                    {task.priority === 'high' && (
                      <Badge variant="destructive">Ưu tiên cao</Badge>
                    )}
                    {task.ccpPoint && (
                      <span className="text-[11px] font-mono text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                        {task.ccpPoint}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-4 text-xs text-slate-400 flex-wrap">
                    <span className="flex items-center gap-1 text-slate-300">
                      <User className="w-3.5 h-3.5 text-slate-400" /> {task.assignedTo}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" /> Hạn giờ: <strong className="text-white">{task.dueTime}</strong>
                    </span>
                    <span className="capitalize">
                      Ca: {task.shift === 'morning' ? 'Sáng' : task.shift === 'afternoon' ? 'Chiều' : 'Tối'}
                    </span>
                    {task.completedAt && (
                      <span className="text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Hoàn thành lúc {formatDate(task.completedAt)}
                      </span>
                    )}
                  </div>

                  {task.notes && (
                    <p className="text-xs text-slate-400 italic pt-1">
                      "{task.notes}"
                    </p>
                  )}
                </div>
              </div>

              {/* Status Badge & Actions */}
              <div className="flex items-center gap-2 self-end sm:self-center">
                {task.status === 'completed' ? (
                  <Badge variant="success">Hoàn thành</Badge>
                ) : task.status === 'in_progress' ? (
                  <Badge variant="warning">Đang làm</Badge>
                ) : (
                  <Badge variant="secondary">Cần làm</Badge>
                )}

                <Button
                  size="sm"
                  variant={task.status === 'completed' ? 'outline' : 'default'}
                  onClick={() => handleToggleComplete(task.id)}
                  className={`text-xs ${
                    task.status === 'completed' 
                      ? 'border-slate-700 hover:bg-slate-800' 
                      : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                  }`}
                >
                  {task.status === 'completed' ? 'Làm lại' : 'Hoàn thành'}
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal: Create Task */}
      {isCreateModalOpen && (
        <Modal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          title="Giao Nhiệm Vụ An Toàn Thực Phẩm Mới"
        >
          <form onSubmit={handleCreateTask} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">Tên nhiệm vụ / Thao tác kiểm soát *</label>
              <Input
                placeholder="VD: Kiểm tra nhiệt độ tủ đông kem và sữa chua"
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">Phân ca trực</label>
                <select
                  value={newTask.shift}
                  onChange={(e) => setNewTask({ ...newTask, shift: e.target.value as any })}
                  className="flex h-9 w-full rounded-md border border-slate-700 bg-slate-900/50 px-3 py-1 text-sm text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-500"
                >
                  <option value="morning">Ca Sáng (06:00 - 11:30)</option>
                  <option value="afternoon">Ca Chiều (11:30 - 17:00)</option>
                  <option value="evening">Ca Tối (17:00 - 23:00)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">Mức độ ưu tiên</label>
                <select
                  value={newTask.priority}
                  onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as any })}
                  className="flex h-9 w-full rounded-md border border-slate-700 bg-slate-900/50 px-3 py-1 text-sm text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-500"
                >
                  <option value="high">Ưu tiên cao (Bắt buộc kiểm tra)</option>
                  <option value="medium">Bình thường</option>
                  <option value="low">Thấp</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">Giao cho nhân viên *</label>
                <Input
                  placeholder="VD: Trần Thị B"
                  value={newTask.assignedTo}
                  onChange={(e) => setNewTask({ ...newTask, assignedTo: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">Giờ hoàn thành</label>
                <Input
                  type="time"
                  value={newTask.dueTime}
                  onChange={(e) => setNewTask({ ...newTask, dueTime: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">Điểm CCP liên quan</label>
              <Input
                placeholder="VD: CCP-2 (Bảo quản lạnh) hoặc PRP-Vệ sinh"
                value={newTask.ccpPoint}
                onChange={(e) => setNewTask({ ...newTask, ccpPoint: e.target.value })}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">Ghi chú & Hướng dẫn thực hiện</label>
              <Input
                placeholder="Ghi chú thêm nếu có..."
                value={newTask.notes}
                onChange={(e) => setNewTask({ ...newTask, notes: e.target.value })}
              />
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
              <Button type="button" variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                Hủy bỏ
              </Button>
              <Button type="submit" className="bg-indigo-600 hover:bg-indigo-500 text-white">
                Phân Công Nhiệm Vụ
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
