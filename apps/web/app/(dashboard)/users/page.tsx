'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Plus, 
  Search, 
  ShieldCheck, 
  UserCheck, 
  Lock, 
  Unlock, 
  Building2, 
  Mail, 
  X,
  Shield,
  Key
} from 'lucide-react';
import { RoleType } from '@hygilog/shared-types';

interface UserItem {
  id: string;
  name: string;
  email: string;
  role: RoleType;
  roleTitle: string;
  siteName: string;
  status: 'active' | 'disabled';
  lastLogin: string;
}

const mockStaff: UserItem[] = [
  { 
    id: 'USR-01', 
    name: 'Nguyễn Văn An', 
    email: 'an.nguyen@hygilog.vn', 
    role: RoleType.SUPER_ADMIN, 
    roleTitle: 'Quản trị viên Nền tảng (Super Admin)', 
    siteName: 'Toàn hệ thống', 
    status: 'active',
    lastLogin: 'Hôm nay 10:15'
  },
  { 
    id: 'USR-02', 
    name: 'Trần Thị Mai', 
    email: 'mai.tran@hygilog.vn', 
    role: RoleType.ORG_ADMIN, 
    roleTitle: 'Giám đốc Tuân thủ (Org Admin)', 
    siteName: 'Toàn bộ cơ sở công ty', 
    status: 'active',
    lastLogin: 'Hôm nay 09:30'
  },
  { 
    id: 'USR-03', 
    name: 'Lê Hoàng Nam', 
    email: 'nam.le@hygilog.vn', 
    role: RoleType.SITE_MANAGER, 
    roleTitle: 'Bếp trưởng Điều hành (Site Manager)', 
    siteName: 'Nhà hàng Phố Cổ (HN-CENTRAL-01)', 
    status: 'active',
    lastLogin: 'Hôm nay 07:15'
  },
  { 
    id: 'USR-04', 
    name: 'Phạm Minh Đức', 
    email: 'duc.pham@hygilog.vn', 
    role: RoleType.SUPERVISOR, 
    roleTitle: 'Trưởng ca Vệ sinh (Supervisor)', 
    siteName: 'Khách sạn Sài Gòn Riverside', 
    status: 'active',
    lastLogin: 'Hôm qua 18:20'
  },
  { 
    id: 'USR-05', 
    name: 'Võ Thị Hương', 
    email: 'huong.vo@hygilog.vn', 
    role: RoleType.EMPLOYEE, 
    roleTitle: 'Nhân viên Chế biến & Sơ chế (Employee)', 
    siteName: 'Nhà hàng Phố Cổ (HN-CENTRAL-01)', 
    status: 'active',
    lastLogin: 'Hôm nay 06:45'
  },
  { 
    id: 'USR-06', 
    name: 'Đặng Quốc Bảo', 
    email: 'bao.dang@kiemtoan-attp.gov.vn', 
    role: RoleType.AUDITOR, 
    roleTitle: 'Thanh tra viên Độc lập (Auditor)', 
    siteName: 'Xem xét báo cáo (Read-only)', 
    status: 'active',
    lastLogin: '3 ngày trước'
  },
];

export default function UsersPage() {
  const [users, setUsers] = useState<UserItem[]>(mockStaff);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRoleForPermissions, setSelectedRoleForPermissions] = useState<string | null>(null);

  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: RoleType.EMPLOYEE,
    siteName: 'Nhà hàng Phố Cổ',
  });

  const handleToggleStatus = (id: string) => {
    setUsers(prev => prev.map(u => {
      if (u.id === id) {
        return {
          ...u,
          status: u.status === 'active' ? 'disabled' : 'active'
        };
      }
      return u;
    }));
  };

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUser.name || !newUser.email) return;

    const roleTitles: Record<RoleType, string> = {
      [RoleType.SUPER_ADMIN]: 'Quản trị viên Nền tảng',
      [RoleType.ORG_ADMIN]: 'Giám đốc Tuân thủ',
      [RoleType.SITE_MANAGER]: 'Bếp trưởng Điều hành',
      [RoleType.SUPERVISOR]: 'Trưởng ca Vệ sinh',
      [RoleType.EMPLOYEE]: 'Nhân viên Chế biến',
      [RoleType.AUDITOR]: 'Thanh tra viên Độc lập',
    };

    const created: UserItem = {
      id: `USR-${String(users.length + 1).padStart(2, '0')}`,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      roleTitle: roleTitles[newUser.role],
      siteName: newUser.siteName,
      status: 'active',
      lastLogin: 'Chưa đăng nhập',
    };

    setUsers([...users, created]);
    setIsModalOpen(false);
    setNewUser({ name: '', email: '', role: RoleType.EMPLOYEE, siteName: 'Nhà hàng Phố Cổ' });
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    u.siteName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-3xl font-bold tracking-tight text-white">Quản Lý Nhân Sự & Phân Quyền</h2>
            <Badge variant="outline" className="text-violet-400 border-violet-500/30 bg-violet-500/10">
              Mô hình RBAC 6 Vai Trò
            </Badge>
          </div>
          <p className="text-slate-400 text-sm mt-1">
            Thiết lập danh tính, phân quyền hạn theo cơ sở và quản lý truy cập bảo mật đa khách hàng
          </p>
        </div>

        <Button onClick={() => setIsModalOpen(true)} className="gap-2 shadow-lg shadow-violet-950 bg-violet-600 hover:bg-violet-500 text-white">
          <Plus className="w-4 h-4" />
          Thêm nhân sự mới
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Input 
            placeholder="Tìm theo họ tên, email, cơ sở..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            icon={<Search className="w-4 h-4 text-slate-400" />}
            className="bg-slate-900 border-slate-800"
          />
        </div>
      </div>

      {/* Users Table */}
      <Card className="glassmorphism">
        <CardContent className="p-0">
          <div className="rounded-xl overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-900/80 text-slate-300 border-b border-slate-800">
                <tr>
                  <th className="px-6 py-4 font-semibold">Nhân Sự</th>
                  <th className="px-6 py-4 font-semibold">Email Đăng Nhập</th>
                  <th className="px-6 py-4 font-semibold">Vai Trò RBAC</th>
                  <th className="px-6 py-4 font-semibold">Phạm Vi Cơ Sở</th>
                  <th className="px-6 py-4 font-semibold">Đăng Nhập Cuối</th>
                  <th className="px-6 py-4 font-semibold">Trạng Thái</th>
                  <th className="px-6 py-4 font-semibold text-right">Khóa / Mở</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-white flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-violet-500/20 text-violet-400 flex items-center justify-center font-bold text-xs shrink-0">
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <div>{user.name}</div>
                          <span className="text-[11px] font-mono text-slate-500">{user.id}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs font-mono text-slate-300">
                      {user.email}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-block px-2.5 py-1 rounded-lg text-xs font-semibold border ${
                        user.role === RoleType.SUPER_ADMIN ? 'bg-rose-500/10 text-rose-300 border-rose-500/30' :
                        user.role === RoleType.ORG_ADMIN ? 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30' :
                        user.role === RoleType.SITE_MANAGER ? 'bg-blue-500/10 text-blue-300 border-blue-500/30' :
                        user.role === RoleType.SUPERVISOR ? 'bg-amber-500/10 text-amber-300 border-amber-500/30' :
                        user.role === RoleType.AUDITOR ? 'bg-purple-500/10 text-purple-300 border-purple-500/30' :
                        'bg-slate-800 text-slate-300 border-slate-700'
                      }`}>
                        {user.roleTitle}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-300">
                      <div className="flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-slate-500" />
                        <span>{user.siteName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-400 font-mono">
                      {user.lastLogin}
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={user.status === 'active' ? 'success' : 'danger'}>
                        {user.status === 'active' ? 'Đang hoạt động' : 'Đã khóa'}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleToggleStatus(user.id)}
                        className={`text-xs px-2.5 py-1.5 rounded-lg border font-medium transition-colors ${
                          user.status === 'active'
                            ? 'text-rose-400 border-rose-500/30 hover:bg-rose-500/10'
                            : 'text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/10'
                        }`}
                      >
                        {user.status === 'active' ? 'Khóa truy cập' : 'Kích hoạt lại'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Add User Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-5">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-violet-400" />
                Thêm Nhân Sự Mới & Cấp Quyền
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Họ và tên *</label>
                <Input 
                  placeholder="VD: Trần Văn Bình"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Email công vụ *</label>
                <Input 
                  type="email"
                  placeholder="binh.tran@hygilog.vn"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Vai trò RBAC *</label>
                <select
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                  value={newUser.role}
                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value as RoleType })}
                >
                  <option value={RoleType.EMPLOYEE}>Nhân viên Bếp / Vệ sinh (Employee)</option>
                  <option value={RoleType.SUPERVISOR}>Trưởng ca / Bếp phó (Supervisor)</option>
                  <option value={RoleType.SITE_MANAGER}>Quản lý Cơ sở / Bếp trưởng (Site Manager)</option>
                  <option value={RoleType.ORG_ADMIN}>Giám đốc Tuân thủ (Org Admin)</option>
                  <option value={RoleType.AUDITOR}>Thanh tra viên Độc lập (Auditor - Chỉ xem)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Cơ sở làm việc</label>
                <select
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                  value={newUser.siteName}
                  onChange={(e) => setNewUser({ ...newUser, siteName: e.target.value })}
                >
                  <option value="Nhà hàng Phố Cổ">Nhà hàng Phố Cổ (Trụ sở chính)</option>
                  <option value="Khách sạn Sài Gòn Riverside">Khách sạn Sài Gòn Riverside</option>
                  <option value="Bếp Trung Tâm Quận 1">Bếp Trung Tâm Quận 1</option>
                  <option value="Toàn bộ cơ sở công ty">Toàn bộ cơ sở công ty (Quản trị)</option>
                </select>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400">
                Mật khẩu mặc định khởi tạo sẽ là <code className="text-indigo-400 font-mono">Hygilog@2026</code>. Nhân sự được yêu cầu đổi mật khẩu ở lần đăng nhập đầu tiên.
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                  Hủy
                </Button>
                <Button type="submit" variant="primary" className="bg-violet-600 hover:bg-violet-500">
                  Tạo nhân sự
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
