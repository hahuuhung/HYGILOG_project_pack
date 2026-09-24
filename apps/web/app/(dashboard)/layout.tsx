import { Sidebar } from '@/components/layouts/sidebar';
import { TopBar } from '@/components/layouts/top-bar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen flex bg-slate-950 overflow-hidden">
      <div className="hidden md:flex h-full w-72 flex-col fixed inset-y-0 z-40">
        <Sidebar />
      </div>
      <main className="md:pl-72 flex-1 flex flex-col min-h-screen h-full">
        <TopBar />
        <div className="flex-1 overflow-y-auto p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
