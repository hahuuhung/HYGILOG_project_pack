'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth-store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Lock, ShieldCheck, UserCheck, Sparkles, Building2 } from 'lucide-react';
import { z } from 'zod';
import { RoleType } from '@hygilog/shared-types';

const loginSchema = z.object({
  email: z.string().email({ message: "Email không hợp lệ" }),
  password: z.string().min(6, { message: "Mật khẩu phải có ít nhất 6 ký tự" }),
});

interface DemoAccount {
  label: string;
  role: RoleType;
  name: string;
  email: string;
  permissions: string[];
}

const demoAccounts: DemoAccount[] = [
  {
    label: 'Super Admin (Nền tảng)',
    role: RoleType.SUPER_ADMIN,
    name: 'Nguyễn Văn An',
    email: 'admin@hygilog.vn',
    permissions: ['all'],
  },
  {
    label: 'Org Admin (Giám đốc Tuân thủ)',
    role: RoleType.ORG_ADMIN,
    name: 'Trần Thị Mai',
    email: 'mai.tran@hygilog.vn',
    permissions: ['all'],
  },
  {
    label: 'Site Manager (Bếp trưởng)',
    role: RoleType.SITE_MANAGER,
    name: 'Lê Hoàng Nam',
    email: 'nam.le@hygilog.vn',
    permissions: ['dashboard.view', 'temperature.view', 'temperature.create', 'checklists.view', 'checklists.approve', 'sites.view', 'tasks.view'],
  },
  {
    label: 'Supervisor (Trưởng ca)',
    role: RoleType.SUPERVISOR,
    name: 'Phạm Minh Đức',
    email: 'duc.pham@hygilog.vn',
    permissions: ['dashboard.view', 'temperature.view', 'temperature.create', 'checklists.view', 'tasks.view'],
  },
  {
    label: 'Employee (Nhân viên bếp)',
    role: RoleType.EMPLOYEE,
    name: 'Võ Thị Hương',
    email: 'huong.vo@hygilog.vn',
    permissions: ['temperature.view', 'temperature.create', 'checklists.view', 'tasks.view'],
  },
  {
    label: 'Auditor (Thanh tra viên)',
    role: RoleType.AUDITOR,
    name: 'Đặng Quốc Bảo',
    email: 'bao.dang@kiemtoan-attp.gov.vn',
    permissions: ['dashboard.view', 'reports.view', 'reports.export', 'temperature.view', 'checklists.view', 'audit.view'],
  },
];

export default function LoginPage() {
  const router = useRouter();
  const setAuth = useAuthStore(state => state.setAuth);
  
  const [email, setEmail] = useState('admin@hygilog.vn');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{email?: string, password?: string, form?: string}>({});

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    
    try {
      loginSchema.parse({ email, password });
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 600));

      const matchedDemo = demoAccounts.find(a => a.email === email) || demoAccounts[0];

      setAuth({
        user: {
          id: 'usr_' + matchedDemo.role,
          email: matchedDemo.email,
          name: matchedDemo.name,
          role: matchedDemo.role,
          organizationId: 'org_hygilog_corp_01'
        },
        accessToken: 'jwt_mock_access_token_' + Date.now(),
        refreshToken: 'jwt_mock_refresh_token_' + Date.now(),
        permissions: matchedDemo.permissions
      });

      router.push('/dashboard');
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        error.errors.forEach(err => {
          if (err.path[0]) fieldErrors[String(err.path[0])] = err.message;
        });
        setErrors(fieldErrors);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSelectDemo = (account: DemoAccount) => {
    setEmail(account.email);
    setPassword('password123');
  };

  return (
    <Card className="w-full max-w-md glassmorphism border-white/10 shadow-2xl">
      <CardHeader className="space-y-3 text-center pb-6">
        <div className="mx-auto w-14 h-14 bg-gradient-to-tr from-indigo-600 to-violet-500 rounded-2xl flex items-center justify-center mb-1 shadow-lg shadow-indigo-500/30">
          <ShieldCheck className="w-8 h-8 text-white" />
        </div>
        <CardTitle className="text-3xl font-black tracking-tight bg-gradient-to-r from-indigo-300 via-white to-violet-300 bg-clip-text text-transparent">
          HYGILOG
        </CardTitle>
        <CardDescription className="text-slate-400 text-xs">
          Nền tảng SaaS Quản lý An toàn Vệ sinh Thực phẩm & Tuân thủ HACCP
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-5">
        <form onSubmit={handleLogin} className="space-y-3.5">
          {errors.form && (
            <div className="p-3 text-xs text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-xl">
              {errors.form}
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Email đăng nhập</label>
            <Input
              type="email"
              placeholder="admin@hygilog.vn"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={<Mail className="w-4 h-4 text-slate-400" />}
              error={errors.email}
              disabled={loading}
              className="bg-slate-950 border-slate-800"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Mật khẩu</label>
            <Input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              icon={<Lock className="w-4 h-4 text-slate-400" />}
              error={errors.password}
              disabled={loading}
              className="bg-slate-950 border-slate-800"
            />
          </div>

          <Button type="submit" className="w-full mt-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2.5 rounded-xl shadow-lg shadow-indigo-950" loading={loading}>
            Đăng nhập hệ thống
          </Button>
        </form>

        {/* Demo Fast-Login Selector (Commercial Feature for Presentations) */}
        <div className="pt-4 border-t border-slate-800 space-y-2">
          <p className="text-[11px] font-semibold text-slate-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            Chọn tài khoản mẫu để trải nghiệm theo vai trò (RBAC):
          </p>

          <div className="grid grid-cols-2 gap-1.5 max-h-36 overflow-y-auto pr-0.5">
            {demoAccounts.map((acc, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectDemo(acc)}
                className={`text-left p-2 rounded-xl border text-[11px] transition-all flex flex-col justify-between ${
                  email === acc.email 
                    ? 'bg-indigo-600/20 border-indigo-500/50 text-white' 
                    : 'bg-slate-950/60 border-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <span className="font-semibold text-white truncate block">{acc.label}</span>
                <span className="text-[10px] text-slate-500 truncate block mt-0.5">{acc.name}</span>
              </button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
