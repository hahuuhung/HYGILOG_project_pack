import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ShieldAlert } from 'lucide-react';

export default function ForbiddenPage() {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
      <div className="text-center max-w-md w-full space-y-6 animate-slide-in">
        <div className="mx-auto w-24 h-24 bg-red-500/10 rounded-full flex items-center justify-center mb-6">
          <ShieldAlert className="w-12 h-12 text-red-500" />
        </div>
        <h1 className="text-4xl font-bold text-white">403 - Cấm Truy Cập</h1>
        <p className="text-slate-400 text-lg">
          Xin lỗi, bạn không có quyền truy cập vào trang này. Vui lòng liên hệ quản trị viên nếu bạn nghĩ đây là một sự nhầm lẫn.
        </p>
        <div className="pt-4">
          <Link href="/dashboard">
            <Button size="lg" className="w-full sm:w-auto">
              Quay lại Trang chủ
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
