import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'HYGILOG - HACCP Food Safety',
  description: 'Multi-tenant B2B hospitality SaaS for HACCP food safety compliance.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className="dark">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased min-h-screen bg-slate-900 text-white">
        {children}
      </body>
    </html>
  );
}
