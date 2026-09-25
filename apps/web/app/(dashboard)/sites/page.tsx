'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Modal } from '@/components/ui/modal';
import { 
  Building2, 
  Search, 
  Plus, 
  MapPin, 
  User, 
  Users, 
  Thermometer, 
  ShieldCheck, 
  Phone, 
  Mail, 
  Clock, 
  Award, 
  MoreHorizontal, 
  Edit, 
  ExternalLink,
  CheckCircle2
} from 'lucide-react';
import { formatDate } from '@/lib/utils';

interface SiteItem {
  id: string;
  name: string;
  code: string;
  address: string;
  city: string;
  managerName: string;
  managerPhone: string;
  managerEmail: string;
  staffCount: number;
  equipmentCount: number;
  complianceRate: number;
  haccpGrade: 'Grade A' | 'Grade B' | 'Grade C';
  licenseNumber: string;
  status: 'active' | 'maintenance' | 'inactive';
}

const initialSites: SiteItem[] = [
  {
    id: 'SITE-01',
    name: 'Landmark 81 - Bếp Trung Tâm & Nhà Hàng Prime',
    code: 'HCM-LM81-01',
    address: 'Tầng 77, Tòa nhà Vinpearl Landmark 81, 720A Điện Biên Phủ, Phường 22, Bình Thạnh',
    city: 'Hồ Chí Minh',
    managerName: 'Nguyễn Văn A',
    managerPhone: '0903 123 456',
    managerEmail: 'manager.lm81@hygilog.vn',
    staffCount: 38,
    equipmentCount: 24,
    complianceRate: 99.4,
    haccpGrade: 'Grade A',
    licenseNumber: 'ATTP-HCM-2025-08129',
    status: 'active',
  },
  {
    id: 'SITE-02',
    name: 'Quận 1 - Đồng Khởi Flagship Dining',
    code: 'HCM-DK-02',
    address: 'Số 15-17 Đồng Khởi, Phường Bến Nghé, Quận 1',
    city: 'Hồ Chí Minh',
    managerName: 'Trần Thị B',
    managerPhone: '0918 789 012',
    managerEmail: 'manager.dongkhoi@hygilog.vn',
    staffCount: 26,
    equipmentCount: 16,
    complianceRate: 98.1,
    haccpGrade: 'Grade A',
    licenseNumber: 'ATTP-HCM-2024-04192',
    status: 'active',
  },
  {
    id: 'SITE-03',
    name: 'Hà Nội - Tây Hồ Lakeside Premium',
    code: 'HN-TH-03',
    address: 'Số 58 Quảng Bá, Phường Quảng An, Quận Tây Hồ',
    city: 'Hà Nội',
    managerName: 'Phạm Đức Minh',
    managerPhone: '0982 345 678',
    managerEmail: 'manager.tayho@hygilog.vn',
    staffCount: 30,
    equipmentCount: 18,
    complianceRate: 97.6,
    haccpGrade: 'Grade A',
    licenseNumber: 'ATTP-HN-2025-01934',
    status: 'active',
  },
  {
    id: 'SITE-04',
    name: 'Đà Nẵng - Bếp Ven Biển Mỹ Khê (Sắp khai trương)',
    code: 'DN-MK-04',
    address: 'Số 292 Võ Nguyên Giáp, Phường Mỹ An, Ngũ Hành Sơn',
    city: 'Đà Nẵng',
    managerName: 'Lê Hoàng Nam',
    managerPhone: '0905 999 888',
    managerEmail: 'manager.danang@hygilog.vn',
    staffCount: 14,
    equipmentCount: 12,
    complianceRate: 100,
    haccpGrade: 'Grade A',
    licenseNumber: 'ATTP-DN-2026-CHỜ CẤP',
    status: 'maintenance',
  },
];

export default function SitesPage() {
  const [sites, setSites] = useState<SiteItem[]>(initialSites);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSite, setSelectedSite] = useState<SiteItem | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    address: '',
    city: 'Hồ Chí Minh',
    managerName: '',
    managerPhone: '',
    managerEmail: '',
    staffCount: '20',
    equipmentCount: '15',
    licenseNumber: '',
  });

  const handleCreateSite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.code) return;

    const newSite: SiteItem = {
      id: `SITE-0${sites.length + 1}`,
      name: formData.name,
      code: formData.code.toUpperCase(),
      address: formData.address,
      city: formData.city,
      managerName: formData.managerName || 'Chưa phân công',
      managerPhone: formData.managerPhone || '0900 000 000',
      managerEmail: formData.managerEmail || `${formData.code.toLowerCase()}@hygilog.vn`,
      staffCount: Number(formData.staffCount) || 10,
      equipmentCount: Number(formData.equipmentCount) || 8,
      complianceRate: 100,
      haccpGrade: 'Grade A',
      licenseNumber: formData.licenseNumber || 'Đang thẩm định cấp mới',
      status: 'active',
    };

    setSites([...sites, newSite]);
    setIsModalOpen(false);
    setFormData({
      name: '',
      code: '',
      address: '',
      city: 'Hồ Chí Minh',
      managerName: '',
      managerPhone: '',
      managerEmail: '',
      staffCount: '20',
      equipmentCount: '15',
      licenseNumber: '',
    });
  };

  const filteredSites = sites.filter(s =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.managerName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalStaff = sites.reduce((sum, s) => sum + s.staffCount, 0);
  const totalEquipment = sites.reduce((sum, s) => sum + s.equipmentCount, 0);
  const activeCount = sites.filter(s => s.status === 'active').length;

  return (
    <div className="space-y-6 animate-slide-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">Quản Lý Cơ Sở & Chi Nhánh</h1>
            <p className="text-slate-400 text-sm mt-0.5">Quản lý mạng lưới nhà hàng, bếp ăn trung tâm và phân quyền cách ly dữ liệu Multi-Tenant</p>
          </div>
        </div>

        <Button 
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-500 text-white gap-2 shadow-lg shadow-indigo-600/25"
        >
          <Plus className="w-4 h-4" />
          Thêm Cơ Sở Mới
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="glassmorphism border-indigo-500/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Tổng số chi nhánh</CardTitle>
            <Building2 className="w-4 h-4 text-indigo-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{sites.length}</div>
            <p className="text-xs text-emerald-400 mt-1">{activeCount} chi nhánh đang hoạt động</p>
          </CardContent>
        </Card>

        <Card className="glassmorphism border-violet-500/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Tổng nhân sự ATTP</CardTitle>
            <Users className="w-4 h-4 text-violet-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-violet-400">{totalStaff}</div>
            <p className="text-xs text-slate-400 mt-1">Đã hoàn thành khóa đào tạo HACCP</p>
          </CardContent>
        </Card>

        <Card className="glassmorphism border-orange-500/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Thiết bị giám sát</CardTitle>
            <Thermometer className="w-4 h-4 text-orange-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-400">{totalEquipment}</div>
            <p className="text-xs text-slate-400 mt-1">Kho đông, tủ mát & bếp nướng</p>
          </CardContent>
        </Card>

        <Card className="glassmorphism border-emerald-500/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Tiêu chuẩn toàn chuỗi</CardTitle>
            <Award className="w-4 h-4 text-emerald-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-400">100% Grade A</div>
            <p className="text-xs text-slate-400 mt-1">Đủ điều kiện xuất kiểm toán</p>
          </CardContent>
        </Card>
      </div>

      {/* Search Bar */}
      <Card className="glassmorphism">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
            <div className="w-full sm:w-96">
              <Input
                placeholder="Tìm cơ sở theo tên, địa chỉ, người quản lý..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                icon={<Search className="w-4 h-4" />}
                className="bg-slate-900/60 border-slate-700/60"
              />
            </div>
            <div className="text-xs text-slate-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Cách ly dữ liệu độc lập theo từng chi nhánh (Multi-Tenant Isolation)
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sites Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredSites.map((site) => (
          <Card key={site.id} className="glassmorphism hover:border-slate-600 transition-all duration-200">
            <CardHeader className="pb-3 border-b border-slate-800">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-bold">
                      {site.code}
                    </span>
                    {site.status === 'active' ? (
                      <Badge variant="success">Hoạt động</Badge>
                    ) : (
                      <Badge variant="warning">Bảo trì / Setup</Badge>
                    )}
                  </div>
                  <CardTitle className="text-lg mt-2 font-bold text-white">{site.name}</CardTitle>
                </div>
                <div className="flex flex-col items-end">
                  <Badge variant="outline" className="text-emerald-400 border-emerald-500/30 flex items-center gap-1 font-bold">
                    <Award className="w-3 h-3" /> {site.haccpGrade}
                  </Badge>
                  <span className="text-[11px] text-slate-400 mt-1">Tuân thủ: <strong className="text-white">{site.complianceRate}%</strong></span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              <div className="space-y-2 text-xs text-slate-300">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{site.address}</span>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800/60">
                  <div className="flex items-center gap-2">
                    <User className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Quản lý: <strong className="text-white">{site.managerName}</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>{site.managerPhone}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-800/60">
                  <span className="text-slate-400">Giấy phép ATTP:</span>
                  <span className="font-mono text-slate-200">{site.licenseNumber}</span>
                </div>
              </div>

              {/* Stats Footer */}
              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-800 text-center">
                <div className="p-2.5 rounded-lg bg-slate-800/40 border border-slate-700/40">
                  <span className="text-xs text-slate-400">Nhân sự ca trực</span>
                  <div className="text-base font-bold text-white mt-0.5">{site.staffCount} người</div>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-800/40 border border-slate-700/40">
                  <span className="text-xs text-slate-400">Thiết bị giám sát</span>
                  <div className="text-base font-bold text-orange-400 mt-0.5">{site.equipmentCount} máy</div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Modal: Create Site */}
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Thêm Cơ Sở / Chi Nhánh Mới"
        >
          <form onSubmit={handleCreateSite} className="space-y-4 max-h-[75vh] overflow-y-auto pr-1">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">Tên cơ sở / Nhà hàng *</label>
              <Input
                placeholder="VD: Hải Phòng - Bến Bính Dining"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">Mã cơ sở (Code) *</label>
                <Input
                  placeholder="VD: HP-BB-05"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">Thành phố</label>
                <select
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="flex h-9 w-full rounded-md border border-slate-700 bg-slate-900/50 px-3 py-1 text-sm text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-500"
                >
                  <option value="Hồ Chí Minh">Hồ Chí Minh</option>
                  <option value="Hà Nội">Hà Nội</option>
                  <option value="Đà Nẵng">Đà Nẵng</option>
                  <option value="Hải Phòng">Hải Phòng</option>
                  <option value="Cần Thơ">Cần Thơ</option>
                  <option value="Khánh Hòa">Khánh Hòa</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">Địa chỉ cụ thể *</label>
              <Input
                placeholder="Số nhà, tên đường, phường/xã, quận/huyện..."
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">Tên Quản lý cơ sở</label>
                <Input
                  placeholder="VD: Lê Hoàng Nam"
                  value={formData.managerName}
                  onChange={(e) => setFormData({ ...formData, managerName: e.target.value })}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">Số điện thoại liên hệ</label>
                <Input
                  placeholder="VD: 0905 123 456"
                  value={formData.managerPhone}
                  onChange={(e) => setFormData({ ...formData, managerPhone: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">Quy mô nhân sự</label>
                <Input
                  type="number"
                  placeholder="20"
                  value={formData.staffCount}
                  onChange={(e) => setFormData({ ...formData, staffCount: e.target.value })}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">Số thiết bị lạnh/nóng</label>
                <Input
                  type="number"
                  placeholder="15"
                  value={formData.equipmentCount}
                  onChange={(e) => setFormData({ ...formData, equipmentCount: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">Số Giấy chứng nhận ATTP</label>
              <Input
                placeholder="VD: ATTP-HP-2026-00123"
                value={formData.licenseNumber}
                onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
              />
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                Hủy bỏ
              </Button>
              <Button type="submit" className="bg-indigo-600 hover:bg-indigo-500 text-white">
                Khởi Tạo Cơ Sở
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
