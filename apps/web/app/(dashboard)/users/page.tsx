'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Modal } from '@/components/ui/modal';
import { 
  Users, 
  Plus, 
  Search, 
  Filter, 
  ShieldCheck, 
  Building2, 
  Mail, 
  Phone, 
  Clock, 
  UserCheck, 
  Key, 
  MoreHorizontal,
  Lock,
  Edit,
  Trash2
} from 'lucide-react';
import { formatDate } from '@/lib/utils';

interface UserItem {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'super_admin' | 'quality_manager' | 'site_manager' | 'kitchen_staff' | 'auditor';
  siteName: string;
  status: 'active' | 'suspended';
  lastLogin: string;
  permissionsCount: number;
}

const roleDisplay: Record<UserItem['role'], { label: string; badge: string }> = {
  super_admin: { label: 'Super Admin', badge: 'default' },
  quality_manager: { label: 'Giám Đốc Chất Lượng (QA)', badge: 'warning' },
  site_manager: { label: 'Quản Lý Cơ Sở', badge: 'secondary' },
  kitchen_staff: { label: 'Nhân Viên Bếp / Vận Hành', badge: 'outline' },
  auditor: { label: 'Chuyên Viên Kiểm Toán', badge: 'success' },
};

const initialUsers: UserItem[] = [
  {
    id: 'USR-01',
    name: 'Nguyễn Văn A',
    email: 'admin@hygilog.vn',
    phone: '0903 123 456',
    role: 'super_admin',
    siteName: 'Toàn hệ thống chuỗi',
    status: 'active',
    lastLogin: '2026-09-25T08:15:00Z',
    permissionsCount: 26,
  },
  {
    id: 'USR-02',
    name: 'Trần Thị B',
    email: 'chef.qa@hygilog.vn',
    phone: '0918 789 012',
    role: 'quality_manager',
    siteName: 'Landmark 81 & Quận 1',
    status: 'active',
    lastLogin: '2026-09-25T07:40:00Z',
    permissionsCount: 22,
  },
  {
    id: 'USR-03',
    name: 'Phạm Đức Minh',
    email: 'manager.tayho@hygilog.vn',
    phone: '0982 345 678',
    role: 'site_manager',
    siteName: 'Hà Nội - Tây Hồ Lakeside',
    status: 'active',
    lastLogin: '2026-09-24T18:00:00Z',
    permissionsCount: 16,
  },
  {
    id: 'USR-04',
    name: 'Lê Văn C',
    email: 'bepchinh@hygilog.vn',
    phone: '0977 111 222',
    role: 'kitchen_staff',
    siteName: 'Landmark 81 - Bếp Âu',
    status: 'active',
    lastLogin: '2026-09-25T06:30:00Z',
    permissionsCount: 8,
  },
  {
    id: 'USR-05',
    name: 'Hoàng Thị Mai',
    email: 'auditor.iso@hygilog.vn',
    phone: '0933 444 555',
    role: 'auditor',
    siteName: 'Kiểm toán độc lập ISO',
    status: 'active',
    lastLogin: '2026-09-23T11:20:00Z',
    permissionsCount: 10,
  },
  {
    id: 'USR-06',
    name: 'Vũ Minh Trí',
    email: 'tri.vm@hygilog.vn',
    phone: '0912 333 444',
    role: 'kitchen_staff',
    siteName: 'Quận 1 - Đồng Khởi',
    status: 'suspended',
    lastLogin: '2026-09-10T14:00:00Z',
    permissionsCount: 0,
  },
];

export default function UsersPage() {
  const [users, setUsers] = useState<UserItem[]>(initialUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New user form state
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'kitchen_staff' as UserItem['role'],
    siteName: 'Landmark 81 - Bếp Âu',
  });

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUser.name || !newUser.email) return;

    const created: UserItem = {
      id: `USR-0${users.length + 1}`,
      name: newUser.name,
      email: newUser.email,
      phone: newUser.phone || '0900 000 000',
      role: newUser.role,
      siteName: newUser.siteName,
      status: 'active',
      lastLogin: new Date().toISOString(),
      permissionsCount: newUser.role === 'super_admin' ? 26 : newUser.role === 'quality_manager' ? 22 : 8,
    };

    setUsers([...users, created]);
    setIsModalOpen(false);
    setNewUser({
      name: '',
      email: '',
      phone: '',
      role: 'kitchen_staff',
      siteName: 'Landmark 81 - Bếp Âu',
    });
  };

  const filteredUsers = users.filter(u => {
    const matchesSearch = 
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.siteName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const activeCount = users.filter(u => u.status === 'active').length;

  return (
    <div className="space-y-6 animate-slide-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-violet-500/10 text-violet-400 border border-violet-500/20">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">Quản Lý Nhân Sự & Phân Quyền RBAC</h1>
            <p className="text-slate-400 text-sm mt-0.5">Phân quyền theo 6 vai trò chuẩn HACCP, phân bổ cơ sở làm việc và bảo mật truy cập dữ liệu</p>
          </div>
        </div>

        <Button 
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-500 text-white gap-2 shadow-lg shadow-indigo-600/25"
        >
          <Plus className="w-4 h-4" />
          Thêm Nhân Viên
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="glassmorphism border-indigo-500/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Tổng nhân viên</CardTitle>
            <Users className="w-4 h-4 text-indigo-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{users.length}</div>
            <p className="text-xs text-emerald-400 mt-1">{activeCount} tài khoản đang hoạt động</p>
          </CardContent>
        </Card>

        <Card className="glassmorphism border-amber-500/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Quản lý chất lượng (QA)</CardTitle>
            <ShieldCheck className="w-4 h-4 text-amber-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-400">
              {users.filter(u => u.role === 'quality_manager').length}
            </div>
            <p className="text-xs text-slate-400 mt-1">Phê duyệt biên bản & giám sát CAPA</p>
          </CardContent>
        </Card>

        <Card className="glassmorphism border-violet-500/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Quản lý chi nhánh</CardTitle>
            <Building2 className="w-4 h-4 text-violet-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-violet-400">
              {users.filter(u => u.role === 'site_manager').length}
            </div>
            <p className="text-xs text-slate-400 mt-1">Điều hành vận hành theo cơ sở</p>
          </CardContent>
        </Card>

        <Card className="glassmorphism border-slate-700/60">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Nhân viên bếp & thao tác</CardTitle>
            <UserCheck className="w-4 h-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-200">
              {users.filter(u => u.role === 'kitchen_staff').length}
            </div>
            <p className="text-xs text-slate-400 mt-1">Đo nhiệt độ và làm checklist qua di động</p>
          </CardContent>
        </Card>
      </div>

      {/* Filter and Search Bar */}
      <Card className="glassmorphism">
        <CardContent className="p-4 space-y-4">
          <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
            <div className="w-full md:w-96">
              <Input
                placeholder="Tìm theo họ tên, email, chi nhánh..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                icon={<Search className="w-4 h-4" />}
                className="bg-slate-900/60 border-slate-700/60"
              />
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs text-slate-400 mr-1 flex items-center gap-1">
                <Filter className="w-3.5 h-3.5" /> Vai trò:
              </span>
              <button
                onClick={() => setRoleFilter('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                  roleFilter === 'all' 
                    ? 'bg-indigo-600 text-white shadow-sm' 
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                Tất cả ({users.length})
              </button>
              <button
                onClick={() => setRoleFilter('quality_manager')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                  roleFilter === 'quality_manager' 
                    ? 'bg-indigo-600 text-white shadow-sm' 
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                QA / HACCP
              </button>
              <button
                onClick={() => setRoleFilter('site_manager')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                  roleFilter === 'site_manager' 
                    ? 'bg-indigo-600 text-white shadow-sm' 
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                Quản lý cơ sở
              </button>
              <button
                onClick={() => setRoleFilter('kitchen_staff')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                  roleFilter === 'kitchen_staff' 
                    ? 'bg-indigo-600 text-white shadow-sm' 
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                Bếp & Vận hành
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
                <th className="px-6 py-4 font-semibold">Nhân Viên & Email</th>
                <th className="px-6 py-4 font-semibold">Vai Trò (Role)</th>
                <th className="px-6 py-4 font-semibold">Chi Nhánh Trực Thuộc</th>
                <th className="px-6 py-4 font-semibold">Đăng Nhập Cuối</th>
                <th className="px-6 py-4 font-semibold">Trạng Thái</th>
                <th className="px-6 py-4 font-semibold text-right">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredUsers.map((user) => {
                const roleInfo = roleDisplay[user.role] || { label: user.role, badge: 'default' };
                return (
                  <tr key={user.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-500 to-violet-600 flex items-center justify-center text-white font-bold text-xs flex-shrink-0 shadow-md">
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-semibold text-white">{user.name}</div>
                          <div className="text-xs text-slate-400 mt-0.5">{user.email}</div>
                          <div className="text-[11px] text-slate-500">{user.phone}</div>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <Badge variant={roleInfo.badge as any}>
                        {roleInfo.label}
                      </Badge>
                      <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1 font-mono">
                        <Key className="w-3 h-3 text-slate-400" /> {user.permissionsCount} quyền gán
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="text-xs text-slate-300 flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                        <span>{user.siteName}</span>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-xs text-slate-400">
                      {formatDate(user.lastLogin)}
                    </td>

                    <td className="px-6 py-4">
                      {user.status === 'active' ? (
                        <Badge variant="success">Hoạt động</Badge>
                      ) : (
                        <Badge variant="destructive">Tạm khóa</Badge>
                      )}
                    </td>

                    <td className="px-6 py-4 text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-slate-400 hover:text-white"
                        title="Tùy chọn tài khoản"
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Modal: Add User */}
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Thêm Nhân Sự Mới & Phân Quyền RBAC"
        >
          <form onSubmit={handleCreateUser} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">Họ và tên *</label>
              <Input
                placeholder="VD: Lê Hoàng Nam"
                value={newUser.name}
                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">Email công việc *</label>
                <Input
                  type="email"
                  placeholder="nam.lh@hygilog.vn"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">Số điện thoại</label>
                <Input
                  placeholder="0905 123 456"
                  value={newUser.phone}
                  onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">Vai trò trong hệ thống (RBAC Role)</label>
              <select
                value={newUser.role}
                onChange={(e) => setNewUser({ ...newUser, role: e.target.value as any })}
                className="flex h-9 w-full rounded-md border border-slate-700 bg-slate-900/50 px-3 py-1 text-sm text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-500"
              >
                <option value="kitchen_staff">Nhân viên Bếp / Vận hành (Đo nhiệt độ, làm checklist)</option>
                <option value="site_manager">Quản lý cơ sở (Site Manager)</option>
                <option value="quality_manager">Giám đốc chất lượng (QA / Phê duyệt HACCP)</option>
                <option value="auditor">Chuyên viên kiểm toán ATTP</option>
                <option value="super_admin">Super Admin (Toàn quyền quản trị)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">Chi nhánh phân công</label>
              <select
                value={newUser.siteName}
                onChange={(e) => setNewUser({ ...newUser, siteName: e.target.value })}
                className="flex h-9 w-full rounded-md border border-slate-700 bg-slate-900/50 px-3 py-1 text-sm text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-500"
              >
                <option value="Landmark 81 - Bếp Âu">Landmark 81 - Bếp Âu</option>
                <option value="Quận 1 - Đồng Khởi Flagship">Quận 1 - Đồng Khởi Flagship</option>
                <option value="Hà Nội - Tây Hồ Lakeside">Hà Nội - Tây Hồ Lakeside</option>
                <option value="Toàn hệ thống chuỗi">Toàn hệ thống chuỗi (Dành cho QA / Admin)</option>
              </select>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                Hủy bỏ
              </Button>
              <Button type="submit" className="bg-indigo-600 hover:bg-indigo-500 text-white">
                Khởi Tạo Tài Khoản
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
