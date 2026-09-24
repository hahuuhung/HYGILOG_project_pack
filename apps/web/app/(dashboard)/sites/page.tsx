'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Building2, 
  Plus, 
  MapPin, 
  UserCheck, 
  Thermometer, 
  Radio, 
  Settings, 
  X,
  Clock,
  ChefHat
} from 'lucide-react';

interface SiteItem {
  id: string;
  name: string;
  code: string;
  address: string;
  manager: string;
  phone: string;
  status: 'active' | 'maintenance';
  equipmentCount: number;
  nfcStationCount: number;
  zones: string[];
}

const mockSites: SiteItem[] = [
  {
    id: 'site_1',
    name: 'Nhà hàng Phố Cổ (Trụ sở chính)',
    code: 'HN-CENTRAL-01',
    address: 'Số 18 Hàng Bè, Hoàn Kiếm, Hà Nội',
    manager: 'Lê Hoàng Nam (Bếp trưởng)',
    phone: '0903 123 456',
    status: 'active',
    equipmentCount: 14,
    nfcStationCount: 6,
    zones: ['Bếp Nóng', 'Kho Đông Sâu', 'Tủ Mát Sơ Chế', 'Quầy Pass Món', 'Kho Khô'],
  },
  {
    id: 'site_2',
    name: 'Khách sạn Sài Gòn Riverside (Chi nhánh 2)',
    code: 'HCM-RIVER-02',
    address: 'Số 88 Bến Vân Đồn, Quận 4, TP. Hồ Chí Minh',
    manager: 'Trần Thị Mai (Giám sát Vận hành)',
    phone: '0918 654 321',
    status: 'active',
    equipmentCount: 22,
    nfcStationCount: 10,
    zones: ['Bếp Buffet Tầng 1', 'Bếp Á Tầng 2', 'Kho Đông Trung Tâm', 'Khu Tiếp Nhận Hàng Cửa Sau'],
  },
  {
    id: 'site_3',
    name: 'Bếp Trung Tâm Quận 1 (Central Kitchen)',
    code: 'HCM-CK-03',
    address: 'Số 204 Nguyễn Thị Minh Khai, Quận 1, TP. Hồ Chí Minh',
    manager: 'Phạm Minh Đức (Trưởng ca)',
    phone: '0977 889 900',
    status: 'active',
    equipmentCount: 30,
    nfcStationCount: 14,
    zones: ['Khu Cắt Thái Thịt Tự Động', 'Phòng Làm Lạnh Nhanh (Blast Chiller)', 'Kho Đóng Gói Chân Không', 'Kho Chờ Xuất'],
  },
];

export default function SitesPage() {
  const [sites, setSites] = useState<SiteItem[]>(mockSites);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newSite, setNewSite] = useState({
    name: '',
    code: '',
    address: '',
    manager: '',
    phone: '',
    zones: '',
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSite.name || !newSite.code) return;

    const created: SiteItem = {
      id: `site_${Date.now()}`,
      name: newSite.name,
      code: newSite.code,
      address: newSite.address || 'Chưa cập nhật',
      manager: newSite.manager || 'Chưa phân công',
      phone: newSite.phone || '0900 000 000',
      status: 'active',
      equipmentCount: 5,
      nfcStationCount: 2,
      zones: newSite.zones ? newSite.zones.split(',').map(z => z.trim()) : ['Bếp chính', 'Kho lạnh'],
    };

    setSites([...sites, created]);
    setIsModalOpen(false);
    setNewSite({ name: '', code: '', address: '', manager: '', phone: '', zones: '' });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-3xl font-bold tracking-tight text-white">Cơ Sở & Khu Vực Vận Hành</h2>
            <Badge variant="outline" className="text-blue-400 border-blue-500/30 bg-blue-500/10">
              Kiến trúc Multi-Site
            </Badge>
          </div>
          <p className="text-slate-400 text-sm mt-1">
            Quản lý danh sách các nhà hàng, bếp trung tâm, phân quyền và thiết bị giám sát theo từng địa điểm
          </p>
        </div>

        <Button onClick={() => setIsModalOpen(true)} className="gap-2 shadow-lg shadow-indigo-950">
          <Plus className="w-4 h-4" />
          Thêm cơ sở mới
        </Button>
      </div>

      {/* Site Cards Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {sites.map((site) => (
          <Card key={site.id} className="glassmorphism hover:border-slate-700 transition-all flex flex-col justify-between">
            <div>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <Badge variant={site.status === 'active' ? 'success' : 'warning'}>
                    {site.status === 'active' ? 'Đang hoạt động' : 'Bảo trì'}
                  </Badge>
                </div>
                <CardTitle className="text-base font-bold text-white mt-3">{site.name}</CardTitle>
                <p className="text-xs font-mono text-indigo-400">{site.code}</p>
              </CardHeader>

              <CardContent className="space-y-3.5 text-xs text-slate-300">
                <div className="flex items-start gap-2 text-slate-400">
                  <MapPin className="w-4 h-4 shrink-0 mt-0.5 text-slate-500" />
                  <span>{site.address}</span>
                </div>

                <div className="flex items-center gap-2 text-slate-400">
                  <ChefHat className="w-4 h-4 shrink-0 text-slate-500" />
                  <span>Phụ trách: <strong className="text-white">{site.manager}</strong></span>
                </div>

                {/* Counters */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800">
                  <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center gap-2">
                    <Thermometer className="w-4 h-4 text-orange-400" />
                    <div>
                      <span className="text-[10px] text-slate-400 block">Thiết bị</span>
                      <strong className="text-xs text-white">{site.equipmentCount} máy</strong>
                    </div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center gap-2">
                    <Radio className="w-4 h-4 text-cyan-400" />
                    <div>
                      <span className="text-[10px] text-slate-400 block">Trạm NFC</span>
                      <strong className="text-xs text-white">{site.nfcStationCount} trạm</strong>
                    </div>
                  </div>
                </div>

                {/* Zones tags */}
                <div className="pt-2">
                  <p className="text-[11px] text-slate-400 mb-1.5 font-medium">Khu vực kiểm tra ({site.zones.length}):</p>
                  <div className="flex flex-wrap gap-1.5">
                    {site.zones.map((zone, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded-md bg-slate-800/80 text-[10px] text-slate-300 border border-slate-700/60">
                        {zone}
                      </span>
                    ))}
                  </div>
                </div>
              </CardContent>
            </div>

            <div className="p-4 border-t border-slate-800/80 bg-slate-900/30 flex items-center justify-between">
              <span className="text-[11px] text-slate-500 font-mono">ID: {site.id}</span>
              <Button size="sm" variant="outline" className="text-xs py-1 h-auto">
                Quản lý khu vực
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Add Site Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-5">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Building2 className="w-5 h-5 text-blue-400" />
                Thêm Cơ Sở / Chi Nhánh Mới
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Tên cơ sở / Nhà hàng *</label>
                  <Input 
                    placeholder="VD: Chi nhánh Đà Nẵng"
                    value={newSite.name}
                    onChange={(e) => setNewSite({ ...newSite, name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Mã cơ sở (Code) *</label>
                  <Input 
                    placeholder="VD: DN-COAST-04"
                    value={newSite.code}
                    onChange={(e) => setNewSite({ ...newSite, code: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Địa chỉ hoạt động</label>
                <Input 
                  placeholder="Số nhà, đường, quận/huyện, tỉnh/thành"
                  value={newSite.address}
                  onChange={(e) => setNewSite({ ...newSite, address: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Người phụ trách / Bếp trưởng</label>
                  <Input 
                    placeholder="Họ tên người quản lý"
                    value={newSite.manager}
                    onChange={(e) => setNewSite({ ...newSite, manager: e.target.value })}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Số điện thoại liên hệ</label>
                  <Input 
                    placeholder="09xx xxx xxx"
                    value={newSite.phone}
                    onChange={(e) => setNewSite({ ...newSite, phone: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Các khu vực kiểm tra (cách nhau dấu phẩy)</label>
                <Input 
                  placeholder="VD: Bếp Nóng, Bếp Lạnh, Kho Mát, Quầy Bar"
                  value={newSite.zones}
                  onChange={(e) => setNewSite({ ...newSite, zones: e.target.value })}
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                  Hủy
                </Button>
                <Button type="submit" variant="primary">
                  Lưu cơ sở
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
