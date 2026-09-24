'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  PackageSearch, 
  Plus, 
  Search, 
  AlertTriangle, 
  Calendar, 
  Truck, 
  Thermometer, 
  X,
  FileCheck2,
  ShieldAlert
} from 'lucide-react';
import { formatDate } from '@/lib/utils';

interface Batch {
  id: string;
  batchCode: string;
  productName: string;
  category: string;
  supplier: string;
  receivedDate: string;
  expiryDate: string;
  quantity: string;
  deliveryTemp: number;
  status: 'active' | 'expiring_soon' | 'depleted' | 'quarantined';
  storageLocation: string;
}

const mockBatches: Batch[] = [
  {
    id: '1',
    batchCode: 'LOT-2026-0924-A1',
    productName: 'Thịt bò Úc Ribeye đông lạnh',
    category: 'Thịt bò',
    supplier: 'Công ty TNHH Thực Phẩm Sạch Toàn Cầu',
    receivedDate: '2026-09-24T08:15:00Z',
    expiryDate: '2026-10-24T00:00:00Z',
    quantity: '50 kg',
    deliveryTemp: -18.2,
    status: 'active',
    storageLocation: 'Kho đông sâu #1 - Kệ B2',
  },
  {
    id: '2',
    batchCode: 'LOT-2026-0922-C3',
    productName: 'Cá hồi tươi Na Uy Fillet',
    category: 'Thủy hải sản',
    supplier: 'Hải Sản Biển Đông Logistics',
    receivedDate: '2026-09-22T06:30:00Z',
    expiryDate: '2026-09-26T00:00:00Z',
    quantity: '25 kg',
    deliveryTemp: 1.5,
    status: 'expiring_soon',
    storageLocation: 'Tủ bảo quản hải sản #2',
  },
  {
    id: '3',
    batchCode: 'LOT-2026-0920-V2',
    productName: 'Sữa chua men sống Anchor',
    category: 'Sữa & Chế phẩm sữa',
    supplier: 'Đại lý Fonterra Miền Nam',
    receivedDate: '2026-09-20T09:00:00Z',
    expiryDate: '2026-09-25T00:00:00Z',
    quantity: '120 hộp',
    deliveryTemp: 3.8,
    status: 'expiring_soon',
    storageLocation: 'Tủ mát sữa & tráng miệng',
  },
  {
    id: '4',
    batchCode: 'LOT-2026-0918-D1',
    productName: 'Trứng gà tiệt trùng Ba Huân',
    category: 'Trứng & Gia cầm',
    supplier: 'Công ty Cổ phần Ba Huân',
    receivedDate: '2026-09-18T10:00:00Z',
    expiryDate: '2026-10-02T00:00:00Z',
    quantity: '300 quả',
    deliveryTemp: 18.0,
    status: 'active',
    storageLocation: 'Kho khô mát nhiệt độ phòng',
  },
  {
    id: '5',
    batchCode: 'LOT-2026-0915-Q9',
    productName: 'Tôm sú tươi 20 con/kg (Nghi nhiễm vi sinh)',
    category: 'Thủy hải sản',
    supplier: 'Nhà cung cấp Minh Phú Bến Tre',
    receivedDate: '2026-09-15T07:00:00Z',
    expiryDate: '2026-09-28T00:00:00Z',
    quantity: '40 kg',
    deliveryTemp: 4.2,
    status: 'quarantined',
    storageLocation: 'Khu cách ly chờ hủy / kiểm định',
  },
];

export default function TraceabilityPage() {
  const [batches, setBatches] = useState<Batch[]>(mockBatches);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newBatch, setNewBatch] = useState({
    productName: '',
    batchCode: '',
    supplier: '',
    category: 'Thịt tươi',
    quantity: '',
    deliveryTemp: -18,
    expiryDate: '',
    storageLocation: '',
  });

  const handleCreateBatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBatch.productName || !newBatch.batchCode) return;

    const created: Batch = {
      id: String(Date.now()),
      batchCode: newBatch.batchCode,
      productName: newBatch.productName,
      category: newBatch.category,
      supplier: newBatch.supplier || 'Nhà cung cấp nội địa',
      receivedDate: new Date().toISOString(),
      expiryDate: newBatch.expiryDate || new Date(Date.now() + 30 * 86400000).toISOString(),
      quantity: newBatch.quantity || '10 kg',
      deliveryTemp: Number(newBatch.deliveryTemp),
      status: 'active',
      storageLocation: newBatch.storageLocation || 'Kho mát Bếp chính',
    };

    setBatches([created, ...batches]);
    setIsModalOpen(false);
    setNewBatch({
      productName: '',
      batchCode: '',
      supplier: '',
      category: 'Thịt tươi',
      quantity: '',
      deliveryTemp: -18,
      expiryDate: '',
      storageLocation: '',
    });
  };

  const handleQuarantine = (id: string) => {
    setBatches(prev => prev.map(b => b.id === id ? { ...b, status: 'quarantined' } : b));
  };

  const filteredBatches = batches.filter(b => 
    b.productName.toLowerCase().includes(search.toLowerCase()) ||
    b.batchCode.toLowerCase().includes(search.toLowerCase()) ||
    b.supplier.toLowerCase().includes(search.toLowerCase())
  );

  const expiringCount = batches.filter(b => b.status === 'expiring_soon').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white">Truy Xuất Nguồn Gốc Lô Hàng</h2>
          <p className="text-slate-400 text-sm mt-1">
            Kiểm thực 3 bước, theo dõi nguồn gốc thực phẩm và thời hạn sử dụng theo tiêu chuẩn HACCP
          </p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="gap-2 shadow-lg shadow-indigo-600/30">
          <Plus className="w-4 h-4" />
          Tiếp nhận lô hàng mới
        </Button>
      </div>

      {/* Expiring Soon Alert Banner */}
      {expiringCount > 0 && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-amber-200">
                Cảnh báo hạn dùng: Có {expiringCount} lô thực phẩm sắp hết hạn trong vòng 72 giờ
              </p>
              <p className="text-xs text-amber-300/70">
                Ưu tiên chế biến theo nguyên tắc FIFO (First In First Out) hoặc kiểm tra cảm quan trước khi sơ chế.
              </p>
            </div>
          </div>
          <Badge variant="warning" className="shrink-0">Cần xử lý</Badge>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Input 
            placeholder="Tìm theo tên thực phẩm, mã lô (LOT), nhà cung cấp..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            icon={<Search className="w-4 h-4 text-slate-400" />}
            className="bg-slate-900 border-slate-800"
          />
        </div>
      </div>

      {/* Table */}
      <Card className="glassmorphism">
        <CardContent className="p-0">
          <div className="rounded-xl overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-900/80 text-slate-300 border-b border-slate-800">
                <tr>
                  <th className="px-6 py-4 font-semibold">Mã Lô / Thực Phẩm</th>
                  <th className="px-6 py-4 font-semibold">Nhà Cung Cấp</th>
                  <th className="px-6 py-4 font-semibold">Nhiệt Độ Xe Giao</th>
                  <th className="px-6 py-4 font-semibold">Ngày Nhận / Hạn Dùng</th>
                  <th className="px-6 py-4 font-semibold">Vị Trí Lưu Kho</th>
                  <th className="px-6 py-4 font-semibold">Trạng Thái</th>
                  <th className="px-6 py-4 font-semibold text-right">Thao Tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {filteredBatches.map((batch) => (
                  <tr key={batch.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-white">{batch.productName}</div>
                      <div className="text-xs font-mono text-indigo-400 mt-0.5">{batch.batchCode}</div>
                      <span className="text-[11px] text-slate-400">SL: {batch.quantity}</span>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-300">
                      <div className="flex items-center gap-1.5">
                        <Truck className="w-3.5 h-3.5 text-slate-500" />
                        <span>{batch.supplier}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 font-mono font-semibold">
                        <Thermometer className="w-3.5 h-3.5 text-orange-400" />
                        <span className={batch.deliveryTemp > 4 && batch.deliveryTemp < 60 ? 'text-amber-400' : 'text-emerald-400'}>
                          {batch.deliveryTemp > 0 ? `+${batch.deliveryTemp}` : batch.deliveryTemp}°C
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs">
                      <div className="text-slate-300">Nhận: {formatDate(batch.receivedDate)}</div>
                      <div className="text-slate-400 mt-0.5 flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-500" />
                        Hạn: {formatDate(batch.expiryDate)}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-400">
                      {batch.storageLocation}
                    </td>
                    <td className="px-6 py-4">
                      {batch.status === 'active' && <Badge variant="success">Đạt chuẩn</Badge>}
                      {batch.status === 'expiring_soon' && <Badge variant="warning">Sắp hết hạn</Badge>}
                      {batch.status === 'quarantined' && <Badge variant="danger">Đang cách ly</Badge>}
                      {batch.status === 'depleted' && <Badge variant="default">Đã dùng hết</Badge>}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {batch.status !== 'quarantined' ? (
                        <button
                          onClick={() => handleQuarantine(batch.id)}
                          className="text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 px-2.5 py-1.5 rounded-lg transition-colors font-medium"
                        >
                          Cách ly
                        </button>
                      ) : (
                        <span className="text-xs text-slate-500 italic">Đã phong tỏa</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Create Batch Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-5">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                  <PackageSearch className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Tiếp Nhận Lô Hàng Mới</h3>
                  <p className="text-xs text-slate-400">Kiểm thực bước 1: Giao nhận nguyên liệu</p>
                </div>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateBatch} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Tên thực phẩm / Nguyên liệu *</label>
                  <Input 
                    placeholder="VD: Thịt ba chỉ bò Mỹ"
                    value={newBatch.productName}
                    onChange={(e) => setNewBatch({ ...newBatch, productName: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Mã Lô (LOT Number) *</label>
                  <Input 
                    placeholder="VD: LOT-2026-0924-B1"
                    value={newBatch.batchCode}
                    onChange={(e) => setNewBatch({ ...newBatch, batchCode: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Nhà cung cấp</label>
                  <Input 
                    placeholder="Tên công ty / HTX cung cấp"
                    value={newBatch.supplier}
                    onChange={(e) => setNewBatch({ ...newBatch, supplier: e.target.value })}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Số lượng nhận</label>
                  <Input 
                    placeholder="VD: 50 kg hoặc 100 thùng"
                    value={newBatch.quantity}
                    onChange={(e) => setNewBatch({ ...newBatch, quantity: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Nhiệt độ giao nhận (°C) *</label>
                  <Input 
                    type="number"
                    step="0.1"
                    value={newBatch.deliveryTemp}
                    onChange={(e) => setNewBatch({ ...newBatch, deliveryTemp: parseFloat(e.target.value) || 0 })}
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Hạn sử dụng</label>
                  <Input 
                    type="date"
                    value={newBatch.expiryDate}
                    onChange={(e) => setNewBatch({ ...newBatch, expiryDate: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Vị trí xếp kho</label>
                <Input 
                  placeholder="VD: Kho đông #1 Kệ A hoặc Tủ mát salad"
                  value={newBatch.storageLocation}
                  onChange={(e) => setNewBatch({ ...newBatch, storageLocation: e.target.value })}
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsModalOpen(false)}
                >
                  Hủy
                </Button>
                <Button type="submit" variant="primary">
                  Xác nhận lưu lô hàng
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
