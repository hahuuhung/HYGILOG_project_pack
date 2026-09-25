'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Modal } from '@/components/ui/modal';
import { 
  Package, 
  Search, 
  Plus, 
  Filter, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Trash2, 
  Calendar, 
  Truck, 
  ShieldCheck, 
  Eye, 
  ArrowRight,
  Warehouse,
  Thermometer,
  Layers,
  FileSpreadsheet
} from 'lucide-react';
import { formatDate } from '@/lib/utils';

interface BatchItem {
  id: string;
  batchNumber: string;
  productName: string;
  category: string;
  supplier: string;
  receivedAt: string;
  expiryDate: string;
  quantity: number;
  initialQuantity: number;
  unit: string;
  storageLocation: string;
  receivingTemp: number;
  status: 'active' | 'warning' | 'consumed' | 'discarded';
  notes?: string;
  haccpCheck: boolean;
}

const initialBatches: BatchItem[] = [
  {
    id: 'BATCH-001',
    batchNumber: 'LOT-20260924-THITBO',
    productName: 'Thịt Bò Thăn Úc Prime (Đông lạnh)',
    category: 'Thịt tươi sống',
    supplier: 'Công ty Cổ phần Thực phẩm Sạch Vissan',
    receivedAt: '2026-09-24T07:30:00Z',
    expiryDate: '2026-10-24T00:00:00Z',
    quantity: 45,
    initialQuantity: 50,
    unit: 'Kg',
    storageLocation: 'Kho Đông Sâu #01 (-18°C)',
    receivingTemp: -19.2,
    status: 'active',
    notes: 'Bao bì nguyên vẹn, chứng nhận kiểm dịch thú y số 48291/KD',
    haccpCheck: true,
  },
  {
    id: 'BATCH-002',
    batchNumber: 'LOT-20260925-CAHOI',
    productName: 'Cá Hồi Nauy Fillet Tươi Fresh',
    category: 'Thủy hải sản',
    supplier: 'Hải Sản Biển Đông Logistics',
    receivedAt: '2026-09-25T06:15:00Z',
    expiryDate: '2026-09-27T18:00:00Z',
    quantity: 18,
    initialQuantity: 20,
    unit: 'Kg',
    storageLocation: 'Tủ Mát Chuyên Dụng Bếp Sashimi (1.5°C)',
    receivingTemp: 2.1,
    status: 'warning',
    notes: 'Cận hạn sử dụng trong 48h - Ưu tiên chế biến thực đơn trong ngày (FEFO)',
    haccpCheck: true,
  },
  {
    id: 'BATCH-003',
    batchNumber: 'LOT-20260923-SUA',
    productName: 'Sữa Tươi Tiệt Trùng Nguyên Chất 1L',
    category: 'Sữa & Bơ sữa',
    supplier: 'Vinamilk Food Service',
    receivedAt: '2026-09-23T09:00:00Z',
    expiryDate: '2026-12-15T00:00:00Z',
    quantity: 120,
    initialQuantity: 120,
    unit: 'Hộp',
    storageLocation: 'Kho Mát Pha Chế #02 (3.5°C)',
    receivingTemp: 4.0,
    status: 'active',
    notes: 'Kiểm tra niêm phong nắp hộp hoàn chỉnh',
    haccpCheck: true,
  },
  {
    id: 'BATCH-004',
    batchNumber: 'LOT-20260924-RAUDALAT',
    productName: 'Rau Xà Lách Lô Lô Hữu Cơ Chuẩn VietGAP',
    category: 'Rau củ quả',
    supplier: 'Hợp Tác Xã Rau Sạch Đà Lạt Green',
    receivedAt: '2026-09-24T05:45:00Z',
    expiryDate: '2026-09-28T00:00:00Z',
    quantity: 30,
    initialQuantity: 30,
    unit: 'Kg',
    storageLocation: 'Kho Mát Rau Củ (6.0°C)',
    receivingTemp: 5.8,
    status: 'active',
    notes: 'Rau tươi, không dập nát, test dư lượng thuốc BVTV âm tính',
    haccpCheck: true,
  },
  {
    id: 'BATCH-005',
    batchNumber: 'LOT-20260920-GA',
    productName: 'Thịt Gà Tươi Làm Sẵn CP Safe',
    category: 'Thịt tươi sống',
    supplier: 'Tập đoàn C.P. Việt Nam',
    receivedAt: '2026-09-20T07:00:00Z',
    expiryDate: '2026-09-23T18:00:00Z',
    quantity: 0,
    initialQuantity: 40,
    unit: 'Kg',
    storageLocation: 'Tủ Trữ Bếp Nóng',
    receivingTemp: 1.8,
    status: 'consumed',
    notes: 'Đã xuất kho chế biến hết theo định lượng tiệc',
    haccpCheck: true,
  },
  {
    id: 'BATCH-006',
    batchNumber: 'LOT-20260918-BOHAP',
    productName: 'Bơ Lạt Lactic 250g Nhập Khẩu',
    category: 'Sữa & Bơ sữa',
    supplier: 'Anchor Food Professionals',
    receivedAt: '2026-09-18T10:00:00Z',
    expiryDate: '2026-09-21T00:00:00Z',
    quantity: 5,
    initialQuantity: 15,
    unit: 'Kg',
    storageLocation: 'Khu Vực Cách Ly Hàng Chờ Hủy',
    receivingTemp: 9.5,
    status: 'discarded',
    notes: 'Nhiệt độ giao hàng vượt ngưỡng 8°C lúc giao, lập biên bản tiêu hủy theo HACCP',
    haccpCheck: false,
  },
];

export default function TraceabilityPage() {
  const [batches, setBatches] = useState<BatchItem[]>(initialBatches);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'warning' | 'consumed' | 'discarded'>('all');
  const [selectedBatch, setSelectedBatch] = useState<BatchItem | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // New Batch Form State
  const [formData, setFormData] = useState({
    batchNumber: '',
    productName: '',
    category: 'Thịt tươi sống',
    supplier: '',
    expiryDate: '',
    quantity: '',
    unit: 'Kg',
    storageLocation: 'Kho Đông Sâu #01 (-18°C)',
    receivingTemp: '2.0',
    notes: '',
  });

  const handleCreateBatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.productName || !formData.batchNumber) return;

    const newBatch: BatchItem = {
      id: `BATCH-${Date.now().toString().slice(-4)}`,
      batchNumber: formData.batchNumber,
      productName: formData.productName,
      category: formData.category,
      supplier: formData.supplier || 'Nhà cung ứng nội bộ',
      receivedAt: new Date().toISOString(),
      expiryDate: formData.expiryDate ? new Date(formData.expiryDate).toISOString() : new Date(Date.now() + 7 * 86400000).toISOString(),
      quantity: Number(formData.quantity) || 10,
      initialQuantity: Number(formData.quantity) || 10,
      unit: formData.unit,
      storageLocation: formData.storageLocation,
      receivingTemp: parseFloat(formData.receivingTemp) || 3.0,
      status: 'active',
      notes: formData.notes || 'Nhập kho thông qua kiểm soát CCP-1',
      haccpCheck: true,
    };

    setBatches([newBatch, ...batches]);
    setIsCreateModalOpen(false);
    setFormData({
      batchNumber: '',
      productName: '',
      category: 'Thịt tươi sống',
      supplier: '',
      expiryDate: '',
      quantity: '',
      unit: 'Kg',
      storageLocation: 'Kho Đông Sâu #01 (-18°C)',
      receivingTemp: '2.0',
      notes: '',
    });
  };

  const filteredBatches = batches.filter(batch => {
    const matchesSearch = 
      batch.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      batch.batchNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      batch.supplier.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || batch.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const activeCount = batches.filter(b => b.status === 'active').length;
  const warningCount = batches.filter(b => b.status === 'warning').length;
  const consumedCount = batches.filter(b => b.status === 'consumed').length;
  const discardedCount = batches.filter(b => b.status === 'discarded').length;

  return (
    <div className="space-y-6 animate-slide-in">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">Truy Xuất Nguồn Gốc & Lô Hàng</h1>
              <p className="text-slate-400 text-sm mt-0.5">Quản lý nhận hàng, chuỗi lưu trữ nhiệt độ và truy vết an toàn thực phẩm HACCP</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-indigo-600 hover:bg-indigo-500 text-white gap-2 shadow-lg shadow-indigo-600/25"
          >
            <Plus className="w-4 h-4" />
            Nhập Lô Hàng Mới
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="glassmorphism border-indigo-500/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Lô đang lưu kho</CardTitle>
            <Warehouse className="w-4 h-4 text-indigo-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{activeCount}</div>
            <p className="text-xs text-slate-400 mt-1">Đảm bảo điều kiện HACCP 100%</p>
          </CardContent>
        </Card>

        <Card className="glassmorphism border-amber-500/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Cận hạn sử dụng (FEFO)</CardTitle>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-400">{warningCount}</div>
            <p className="text-xs text-amber-400/80 mt-1">Cần ưu tiên chế biến trong 48h</p>
          </CardContent>
        </Card>

        <Card className="glassmorphism border-emerald-500/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Đã tiêu thụ hết</CardTitle>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-400">{consumedCount}</div>
            <p className="text-xs text-slate-400 mt-1">Đầy đủ chứng từ xuất kho</p>
          </CardContent>
        </Card>

        <Card className="glassmorphism border-red-500/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Lô cách ly / Tiêu hủy</CardTitle>
            <Trash2 className="w-4 h-4 text-red-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-400">{discardedCount}</div>
            <p className="text-xs text-red-400/80 mt-1">Vi phạm tiêu chuẩn đầu vào</p>
          </CardContent>
        </Card>
      </div>

      {/* Filter and Search Bar */}
      <Card className="glassmorphism">
        <CardContent className="p-4 space-y-4">
          <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
            <div className="w-full md:w-96">
              <Input
                placeholder="Tìm theo tên nguyên liệu, mã lô hoặc nhà cung cấp..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                icon={<Search className="w-4 h-4" />}
                className="bg-slate-900/60 border-slate-700/60"
              />
            </div>
            
            {/* Filter buttons */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs text-slate-400 mr-1 flex items-center gap-1">
                <Filter className="w-3.5 h-3.5" /> Lọc:
              </span>
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                  statusFilter === 'all' 
                    ? 'bg-indigo-600 text-white shadow-sm' 
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                Tất cả ({batches.length})
              </button>
              <button
                onClick={() => setStatusFilter('active')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                  statusFilter === 'active' 
                    ? 'bg-indigo-600 text-white shadow-sm' 
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                Đang lưu kho ({activeCount})
              </button>
              <button
                onClick={() => setStatusFilter('warning')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                  statusFilter === 'warning' 
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' 
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                Cận hạn ({warningCount})
              </button>
              <button
                onClick={() => setStatusFilter('consumed')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                  statusFilter === 'consumed' 
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' 
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                Đã dùng hết ({consumedCount})
              </button>
              <button
                onClick={() => setStatusFilter('discarded')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                  statusFilter === 'discarded' 
                    ? 'bg-red-500/20 text-red-300 border border-red-500/40' 
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                Tiêu hủy ({discardedCount})
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
                <th className="px-6 py-4 font-semibold">Mã Lô & Nguyên Liệu</th>
                <th className="px-6 py-4 font-semibold">Nhà Cung Cấp</th>
                <th className="px-6 py-4 font-semibold">Tồn Kho / Đơn Vị</th>
                <th className="px-6 py-4 font-semibold">Vị Trí & Nhiệt Độ</th>
                <th className="px-6 py-4 font-semibold">Hạn Dùng (FEFO)</th>
                <th className="px-6 py-4 font-semibold">Trạng Thái</th>
                <th className="px-6 py-4 font-semibold text-right">Chi Tiết</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredBatches.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-slate-400">
                        <Package className="w-6 h-6" />
                      </div>
                      <p className="text-base font-medium text-slate-300">Không tìm thấy lô hàng nào</p>
                      <p className="text-xs text-slate-500 max-w-sm">Thử thay đổi từ khóa tìm kiếm hoặc bấm nút "Nhập Lô Hàng Mới" để tạo dữ liệu truy vết.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredBatches.map((batch) => {
                  const percentLeft = Math.round((batch.quantity / batch.initialQuantity) * 100);
                  return (
                    <tr key={batch.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 flex-shrink-0">
                            <Layers className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="font-semibold text-white flex items-center gap-2">
                              {batch.productName}
                              {batch.haccpCheck && (
                                <span title="Đạt tiêu chuẩn kiểm tra CCP tiếp nhận">
                                  <ShieldCheck className="w-4 h-4 text-emerald-400 inline" />
                                </span>
                              )}
                            </div>
                            <div className="text-xs text-indigo-400 font-mono mt-0.5">
                              {batch.batchNumber}
                            </div>
                            <div className="text-[11px] text-slate-500 mt-0.5">{batch.category}</div>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="text-slate-300 font-medium">{batch.supplier}</div>
                        <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                          <Clock className="w-3 h-3" /> Nhận: {formatDate(batch.receivedAt)}
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-base font-bold text-white">{batch.quantity}</span>
                          <span className="text-xs text-slate-400">/ {batch.initialQuantity} {batch.unit}</span>
                        </div>
                        <div className="w-24 bg-slate-800 rounded-full h-1.5 mt-1.5 overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${
                              batch.quantity === 0 ? 'bg-slate-600' :
                              percentLeft < 20 ? 'bg-amber-500' : 'bg-indigo-500'
                            }`}
                            style={{ width: `${percentLeft}%` }}
                          />
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="text-xs text-slate-300 flex items-center gap-1.5">
                          <Warehouse className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                          <span className="truncate max-w-[180px]">{batch.storageLocation}</span>
                        </div>
                        <div className="text-xs text-slate-400 flex items-center gap-1 mt-1 font-mono">
                          <Thermometer className="w-3.5 h-3.5 text-orange-400" />
                          <span>Giao: {batch.receivingTemp > 0 ? `+${batch.receivingTemp}` : batch.receivingTemp}°C</span>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="text-xs font-medium text-slate-200">
                          {formatDate(batch.expiryDate)}
                        </div>
                        {batch.status === 'warning' && (
                          <span className="text-[11px] text-amber-400 flex items-center gap-1 mt-0.5">
                            <AlertTriangle className="w-3 h-3" /> Cận hạn sử dụng
                          </span>
                        )}
                      </td>

                      <td className="px-6 py-4">
                        {batch.status === 'active' && (
                          <Badge variant="success">Lưu kho</Badge>
                        )}
                        {batch.status === 'warning' && (
                          <Badge variant="warning">Cận hạn</Badge>
                        )}
                        {batch.status === 'consumed' && (
                          <Badge variant="secondary">Đã dùng hết</Badge>
                        )}
                        {batch.status === 'discarded' && (
                          <Badge variant="destructive">Tiêu hủy</Badge>
                        )}
                      </td>

                      <td className="px-6 py-4 text-right">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => setSelectedBatch(batch)}
                          className="text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/10"
                        >
                          <Eye className="w-4 h-4 mr-1.5" />
                          Truy vết
                        </Button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Modal: View Traceability Tree & Batch Details */}
      {selectedBatch && (
        <Modal
          isOpen={!!selectedBatch}
          onClose={() => setSelectedBatch(null)}
          title={`Hồ Sơ Truy Xuất: ${selectedBatch.batchNumber}`}
        >
          <div className="space-y-5 max-h-[75vh] overflow-y-auto pr-1">
            <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-base font-bold text-white">{selectedBatch.productName}</h3>
                  <p className="text-xs text-indigo-400 font-mono mt-0.5">{selectedBatch.batchNumber}</p>
                </div>
                <Badge variant={
                  selectedBatch.status === 'active' ? 'success' :
                  selectedBatch.status === 'warning' ? 'warning' :
                  selectedBatch.status === 'consumed' ? 'secondary' : 'destructive'
                }>
                  {selectedBatch.status === 'active' ? 'Đang lưu kho' :
                   selectedBatch.status === 'warning' ? 'Cận hạn' :
                   selectedBatch.status === 'consumed' ? 'Đã tiêu thụ' : 'Đã tiêu hủy'}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs pt-2 border-t border-slate-700/50">
                <div>
                  <span className="text-slate-400">Nhà cung cấp:</span>
                  <p className="font-semibold text-slate-200 mt-0.5">{selectedBatch.supplier}</p>
                </div>
                <div>
                  <span className="text-slate-400">Thời gian nhận hàng:</span>
                  <p className="font-semibold text-slate-200 mt-0.5">{formatDate(selectedBatch.receivedAt)}</p>
                </div>
                <div>
                  <span className="text-slate-400">Vị trí bảo quản:</span>
                  <p className="font-semibold text-slate-200 mt-0.5">{selectedBatch.storageLocation}</p>
                </div>
                <div>
                  <span className="text-slate-400">Hạn sử dụng (EXP):</span>
                  <p className="font-semibold text-slate-200 mt-0.5">{formatDate(selectedBatch.expiryDate)}</p>
                </div>
                <div>
                  <span className="text-slate-400">Số lượng hiện tại:</span>
                  <p className="font-semibold text-slate-200 mt-0.5">{selectedBatch.quantity} / {selectedBatch.initialQuantity} {selectedBatch.unit}</p>
                </div>
                <div>
                  <span className="text-slate-400">Nhiệt độ giao nhận CCP:</span>
                  <p className="font-semibold text-slate-200 mt-0.5">{selectedBatch.receivingTemp}°C</p>
                </div>
              </div>

              {selectedBatch.notes && (
                <div className="p-2.5 rounded-lg bg-slate-900/60 text-xs text-slate-300 border border-slate-800">
                  <span className="font-semibold text-slate-400">Ghi chú kiểm soát:</span> {selectedBatch.notes}
                </div>
              )}
            </div>

            {/* Traceability Audit Trail Steps */}
            <div>
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-indigo-400" /> Chuỗi Hành Trình Kiểm Soát An Toàn (CCP Chain)
              </h4>
              <div className="space-y-3 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-slate-800">
                <div className="relative flex items-start gap-3 pl-1">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center text-xs flex-shrink-0 z-10">
                    ✓
                  </div>
                  <div className="flex-1 bg-slate-800/40 p-3 rounded-lg border border-slate-700/40">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-white">Bước 1: Tiếp nhận tại khu giao hàng (CCP-1)</span>
                      <span className="text-[11px] text-slate-400">{formatDate(selectedBatch.receivedAt)}</span>
                    </div>
                    <p className="text-xs text-slate-300 mt-1">
                      Kiểm tra cảm quan đạt chuẩn. Nhiệt độ xe lạnh: {selectedBatch.receivingTemp}°C. Có chứng nhận an toàn thực phẩm đi kèm.
                    </p>
                  </div>
                </div>

                <div className="relative flex items-start gap-3 pl-1">
                  <div className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/40 flex items-center justify-center text-xs flex-shrink-0 z-10">
                    2
                  </div>
                  <div className="flex-1 bg-slate-800/40 p-3 rounded-lg border border-slate-700/40">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-white">Bước 2: Dán nhãn barcode & Lưu kho (CCP-2)</span>
                      <span className="text-[11px] text-slate-400">Nhân viên kho ca sáng</span>
                    </div>
                    <p className="text-xs text-slate-300 mt-1">
                      Nhập vị trí: {selectedBatch.storageLocation}. Áp dụng nguyên tắc xuất nhập trước FEFO.
                    </p>
                  </div>
                </div>

                <div className="relative flex items-start gap-3 pl-1">
                  <div className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/40 flex items-center justify-center text-xs flex-shrink-0 z-10">
                    3
                  </div>
                  <div className="flex-1 bg-slate-800/40 p-3 rounded-lg border border-slate-700/40">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-white">Bước 3: Xuất sang bộ phận sơ chế / Bếp chính</span>
                      <span className="text-[11px] text-slate-400">Kiểm tra vi sinh định kỳ</span>
                    </div>
                    <p className="text-xs text-slate-300 mt-1">
                      Sẵn sàng truy xuất đến từng đĩa món ăn phục vụ thực khách trong trường hợp có yêu cầu kiểm toán an toàn vệ sinh thực phẩm.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
              <Button variant="outline" size="sm" onClick={() => setSelectedBatch(null)}>
                Đóng
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Modal: Create New Batch */}
      {isCreateModalOpen && (
        <Modal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          title="Nhập Lô Nguyên Liệu Mới (HACCP Receiving)"
        >
          <form onSubmit={handleCreateBatch} className="space-y-4 max-h-[75vh] overflow-y-auto pr-1">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">Tên nguyên liệu / Thực phẩm *</label>
              <Input
                placeholder="VD: Thịt ba chỉ heo sạch CP"
                value={formData.productName}
                onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">Mã lô (Lot Number) *</label>
                <Input
                  placeholder="VD: LOT-20260925-HEOCP"
                  value={formData.batchNumber}
                  onChange={(e) => setFormData({ ...formData, batchNumber: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">Phân loại thực phẩm</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="flex h-9 w-full rounded-md border border-slate-700 bg-slate-900/50 px-3 py-1 text-sm text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-500"
                >
                  <option value="Thịt tươi sống">Thịt tươi sống</option>
                  <option value="Thủy hải sản">Thủy hải sản</option>
                  <option value="Rau củ quả">Rau củ quả</option>
                  <option value="Sữa & Bơ sữa">Sữa & Bơ sữa</option>
                  <option value="Gia vị & Đồ khô">Gia vị & Đồ khô</option>
                  <option value="Thực phẩm đóng gói">Thực phẩm đóng gói</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">Nhà cung cấp</label>
              <Input
                placeholder="VD: Công ty Cổ phần Thực phẩm CP Việt Nam"
                value={formData.supplier}
                onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">Số lượng</label>
                <Input
                  type="number"
                  placeholder="25"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">Đơn vị tính</label>
                <select
                  value={formData.unit}
                  onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                  className="flex h-9 w-full rounded-md border border-slate-700 bg-slate-900/50 px-3 py-1 text-sm text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-500"
                >
                  <option value="Kg">Kg</option>
                  <option value="Gói">Gói</option>
                  <option value="Hộp">Hộp</option>
                  <option value="Thùng">Thùng</option>
                  <option value="Lít">Lít</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">Nhiệt độ giao (°C)</label>
                <Input
                  type="number"
                  step="0.1"
                  placeholder="-18 hoặc 2.5"
                  value={formData.receivingTemp}
                  onChange={(e) => setFormData({ ...formData, receivingTemp: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">Vị trí lưu kho</label>
                <select
                  value={formData.storageLocation}
                  onChange={(e) => setFormData({ ...formData, storageLocation: e.target.value })}
                  className="flex h-9 w-full rounded-md border border-slate-700 bg-slate-900/50 px-3 py-1 text-sm text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-500"
                >
                  <option value="Kho Đông Sâu #01 (-18°C)">Kho Đông Sâu #01 (-18°C)</option>
                  <option value="Kho Đông Sâu #02 (-18°C)">Kho Đông Sâu #02 (-18°C)</option>
                  <option value="Kho Mát Bếp Chính (2-4°C)">Kho Mát Bếp Chính (2-4°C)</option>
                  <option value="Kho Mát Rau Củ (5-7°C)">Kho Mát Rau Củ (5-7°C)</option>
                  <option value="Kho Khô Gia Vị (20-25°C)">Kho Khô Gia Vị (20-25°C)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">Hạn sử dụng</label>
                <Input
                  type="date"
                  value={formData.expiryDate}
                  onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">Ghi chú tiếp nhận kiểm soát HACCP</label>
              <Input
                placeholder="VD: Bao bì sạch, nhiệt độ giao hàng đạt chuẩn, xe vận chuyển vệ sinh tốt"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              />
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
              <Button type="button" variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                Hủy bỏ
              </Button>
              <Button type="submit" className="bg-indigo-600 hover:bg-indigo-500 text-white">
                Lưu Hồ Sơ Lô Hàng
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
