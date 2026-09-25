'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth-store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Lock, ShieldCheck } from 'lucide-react';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email({ message: "Email không hợp lệ" }),
  password: z.string().min(6, { message: "Mật khẩu phải có ít nhất 6 ký tự" }),
});

export default function LoginPage() {
  const router = useRouter();
  const setAuth = useAuthStore(state => state.setAuth);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{email?: string, password?: string, form?: string}>({});

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    
    try {
      loginSchema.parse({ email, password });
      
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (email === 'admin@hygilog.vn' && password === 'password123') {
        setAuth({
          user: {
            id: '1',
            email: 'admin@hygilog.vn',
            name: 'Admin User',
            role: 'super_admin',
            organizationId: 'org_1'
          },
          accessToken: 'mock_token',
          refreshToken: 'mock_refresh',
          permissions: ['all']
        });
        router.push('/dashboard');
      } else {
        setErrors({ form: 'Email hoặc mật khẩu không chính xác' });
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: any = {};
        error.errors.forEach(err => {
          if (err.path[0]) fieldErrors[err.path[0]] = err.message;
        });
        setErrors(fieldErrors);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full glassmorphism border-white/10 shadow-2xl">
      <CardHeader className="space-y-3 text-center pb-8">
        <div className="mx-auto w-12 h-12 bg-indigo-500/20 rounded-full flex items-center justify-center mb-2">
          <ShieldCheck className="w-7 h-7 text-indigo-400" />
        </div>
        <CardTitle className="text-3xl font-bold tracking-tight bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
          HYGILOG
        </CardTitle>
        <CardDescription className="text-slate-400">
          Hệ thống quản lý an toàn thực phẩm HACCP
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleLogin} className="space-y-4">
          {errors.form && (
            <div className="p-3 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-md">
              {errors.form}
            </div>
          )}
          <div className="space-y-2">
            <Input
              type="email"
              placeholder="Email của bạn (admin@hygilog.vn)"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={<Mail className="w-4 h-4" />}
              error={errors.email}
              disabled={loading}
            />
          </div>
          <div className="space-y-2">
            <Input
              type="password"
              placeholder="Mật khẩu (password123)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              icon={<Lock className="w-4 h-4" />}
              error={errors.password}
              disabled={loading}
            />
          </div>
          <Button type="submit" className="w-full mt-4" loading={loading}>
            Đăng nhập
          </Button>
        </form>
        
        <div className="mt-6 text-center text-sm text-slate-500">
          <p>Dùng admin@hygilog.vn / password123 để thử nghiệm</p>
        </div>
      </CardContent>
    </Card>
  );
}
