'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Thermometer, 
  ClipboardCheck, 
  Sparkles,
  Building2,
  Calendar,
  Filter
} from 'lucide-react';

interface Task {
  id: string;
  title: string;
  category: 'temperature' | 'checklist' | 'sanitation' | 'receiving';
  deadline: string;
  location: string;
  assignedTo: string;
  status: 'pending' | 'in_progress' | 'completed' | 'overdue';
  priority: 'high' | 'medium' | 'low';
}

const initialTasks: Task[] = [
  {
    id: 'TASK-101',
    title: 'Đo nhiệt độ Kho đông - Ca sáng',
    category: 'temperature',
    deadline: '07:30 Hôm nay',
    location: 'Kho Đông Sâu #1 (Bếp chính)',
    assignedTo: 'Võ Thị Hương',
    status: 'completed',
    priority: 'high',
  },
  {
    id: 'TASK-102',
    title: 'Kiểm tra vệ sinh bề mặt thớt & dao chế biến thịt tươi',
    category: 'sanitation',
    deadline: '08:00 Hôm nay',
    location: 'Khu sơ chế thịt sống',
    assignedTo: 'Nguyễn Văn An',
    status: 'completed',
    priority: 'high',
  },
  {
    id: 'TASK-103',
    title: 'Ghi nhận nhiệt độ Tủ mát trưng bày salad & tráng miệng',
    category: 'temperature',
    deadline: '11:00 Hôm nay',
    location: 'Khu ra đồ (Pass)',
    assignedTo: 'Trần Thị Mai',
    status: 'in_progress',
    priority: 'high',
  },
  {
    id: 'TASK-104',
    title: 'Checklist kiểm thực 3 bước - Tiếp nhận rau củ quả Đà Lạt',
    category: 'receiving',
    deadline: '11:30 Hôm nay',
    location: 'Khu nhận hàng cửa sau',
    assignedTo: 'Lê Hoàng Nam',
    status: 'pending',
    priority: 'medium',
  },
  {
    id: 'TASK-105',
    title: 'Đo nhiệt độ cốt lõi dầu chiên & món hâm nóng buffet',
    category: 'temperature',
    deadline: '11:45 Hôm nay',
    location: 'Bếp Nóng Chảo & Chiên',
    assignedTo: 'Phạm Minh Đức',
    status: 'pending',
    priority: 'high',
  },
  {
    id: 'TASK-106',
    title: 'Khử trùng tay & thay găng tay toàn bộ ca chế biến',
    category: 'sanitation',
    deadline: '13:00 Hôm nay',
    location: 'Toàn bộ khu bếp',
    assignedTo: 'Võ Thị Hương',
    status: 'pending',
    priority: 'low',
  },
];

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');

  const handleToggleTask = (id: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id === id) {
        return {
          ...t,
          status: t.status === 'completed' ? 'pending' : 'completed'
        };
      }
      return t;
    }));
  };

  const filteredTasks = tasks.filter(t => {
    if (filter === 'pending') return t.status !== 'completed';
    if (filter === 'completed') return t.status === 'completed';
    return true;
  });

  const completedCount = tasks.filter(t => t.status === 'completed').length;
  const progressPercent = Math.round((completedCount / tasks.length) * 100);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-3xl font-bold tracking-tight text-white">Nhiệm Vụ Ca Trực</h2>
            <Badge variant="outline" className="text-emerald-400 border-emerald-500/30 bg-emerald-500/10">
              Ca Sáng (06:00 - 14:00)
            </Badge>
          </div>
          <p className="text-slate-400 text-sm mt-1">
            Quy trình tuân thủ HACCP và kiểm tra vệ sinh an toàn thực phẩm theo ca làm việc
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button 
            variant={filter === 'all' ? 'primary' : 'outline'} 
            size="sm"
            onClick={() => setFilter('all')}
          >
            Tất cả ({tasks.length})
          </Button>
          <Button 
            variant={filter === 'pending' ? 'primary' : 'outline'} 
            size="sm"
            onClick={() => setFilter('pending')}
          >
            Chưa xong ({tasks.length - completedCount})
          </Button>
          <Button 
            variant={filter === 'completed' ? 'primary' : 'outline'} 
            size="sm"
            onClick={() => setFilter('completed')}
          >
            Đã xong ({completedCount})
          </Button>
        </div>
      </div>

      {/* Progress Bar Card */}
      <Card className="glassmorphism border-indigo-500/20 bg-gradient-to-r from-indigo-950/40 to-slate-900/60">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">Tiến độ tuân thủ ca trực hiện tại</h4>
                <p className="text-xs text-slate-400">Đã hoàn thành {completedCount}/{tasks.length} hạng mục bắt buộc</p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-2xl font-black text-indigo-400">{progressPercent}%</span>
            </div>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-indigo-500 to-emerald-400 h-2.5 rounded-full transition-all duration-500" 
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
        </CardContent>
      </Card>

      {/* Task List */}
      <div className="space-y-3">
        {filteredTasks.map((task) => {
          const isDone = task.status === 'completed';
          return (
            <div 
              key={task.id}
              onClick={() => handleToggleTask(task.id)}
              className={`p-4 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                isDone 
                  ? 'bg-slate-900/30 border-slate-800/60 opacity-75' 
                  : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 hover:shadow-lg'
              }`}
            >
              <div className="flex items-start sm:items-center gap-3.5 min-w-0">
                <button 
                  className={`w-6 h-6 rounded-lg flex items-center justify-center border transition-colors shrink-0 mt-0.5 sm:mt-0 ${
                    isDone 
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' 
                      : 'border-slate-600 hover:border-indigo-400 text-transparent'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                </button>

                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-mono text-slate-500">{task.id}</span>
                    <h4 className={`text-sm font-semibold truncate ${isDone ? 'line-through text-slate-400' : 'text-white'}`}>
                      {task.title}
                    </h4>
                  </div>
                  <div className="flex items-center gap-4 mt-1 text-xs text-slate-400 flex-wrap">
                    <span className="flex items-center gap-1">
                      <Building2 className="w-3.5 h-3.5 text-slate-500" />
                      {task.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-500" />
                      Hạn: {task.deadline}
                    </span>
                    <span className="text-slate-500">Phụ trách: {task.assignedTo}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center">
                {task.priority === 'high' && (
                  <Badge variant="danger" className="text-[10px]">Ưu tiên cao</Badge>
                )}
                {task.category === 'temperature' && (
                  <Badge variant="warning" className="text-[10px] flex items-center gap-1">
                    <Thermometer className="w-3 h-3" /> Nhiệt độ
                  </Badge>
                )}
                {task.category === 'sanitation' && (
                  <Badge variant="success" className="text-[10px] flex items-center gap-1">
                    <ClipboardCheck className="w-3 h-3" /> Vệ sinh
                  </Badge>
                )}
                <Badge variant={isDone ? 'success' : 'default'} className="text-[10px]">
                  {isDone ? 'Đã hoàn thành' : 'Đang chờ'}
                </Badge>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
