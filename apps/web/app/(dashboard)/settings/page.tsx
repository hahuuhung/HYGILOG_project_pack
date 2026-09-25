'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Settings, 
  Building, 
  Thermometer, 
  Bell, 
  ShieldCheck, 
  Save, 
  CheckCircle2, 
  RefreshCw, 
  Sliders, 
  Smartphone,
  Lock,
  Mail,
  AlertTriangle
} from 'lucide-react';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<'org' | 'ccp' | 'alerts' | 'sync'>('ccp');
  const [isSaving, setIsSaving] = useState(false);
  const [savedToast, setSavedToast] = useState(false);

  // Form states
  const [orgData, setOrgData] = useState({
    name: 'TẬP ĐOÀN ẨM THỰC HYGILOG HOSPITALITY VIỆT NAM',
    taxCode: '0318294719',
    legalRep: 'Nguyễn Văn A',
    address: 'Tầng 77, Tòa nhà Vinpearl Landmark 81, Quận Bình Thạnh, TP.HCM',
    phone: '1900 6868',
    email: 'contact@hygilog.vn',
    haccpCertNumber: 'HACCP-CODEX-2025-VN88',
  });

  const [ccpThresholds, setCcpThresholds] = useState({
    freezerMin: '-22',
    freezerMax: '-18',
    chillerMin: '0',
    chillerMax: '4',
    produceMin: '4',
    produceMax: '8',
    hotHoldingMin: '60',
    hotHoldingMax: '85',
    coreCookingMin: '75',
    maxDeviationMinutes: '15',
  });

  const [alertSettings, setAlertSettings] = useState({
    emailAlerts: true,
    smsUrgent: true,
    pushMobile: true,
    soundAlarmKitchen: true,
    alertEmails: 'manager.lm81@hygilog.vn, chef.qa@hygilog.vn',
  });

  const [syncSettings, setSyncSettings] = useState({
    syncIntervalSeconds: '60',
    sampleRetentionHours: '24',
    offlineStorageDays: '30',
    requireNfcConfirmation: true,
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setSavedToast(true);
      setTimeout(() => setSavedToast(false), 3500);
    }, 600);
  };

  return (
    <div className="space-y-6 animate-slide-in">
      {/* Toast Feedback */}
      {savedToast && (
        <div className="fixed top-20 right-6 z-50 bg-emerald-600 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 border border-emerald-400/40 animate-slide-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-200" />
          <span className="text-sm font-medium">Đã cập nhật và lưu cấu hình hệ thống HACCP thành công!</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-slate-800 text-slate-300 border border-slate-700">
            <Settings className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">Cấu Hình Hệ Thống & Chuẩn HACCP</h1>
            <p className="text-slate-400 text-sm mt-0.5">Thiết lập ngưỡng nhiệt độ giới hạn tới hạn CCP, chính sách thông báo sự cố và thông tin tổ chức</p>
          </div>
        </div>

        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="bg-indigo-600 hover:bg-indigo-500 text-white gap-2 shadow-lg shadow-indigo-600/25"
        >
          {isSaving ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          Lưu Tất Cả Thiết Lập
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex rounded-xl bg-slate-900/80 p-1.5 border border-slate-800 gap-1 overflow-x-auto">
        <button
          onClick={() => setActiveTab('ccp')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition whitespace-nowrap ${
            activeTab === 'ccp' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Thermometer className="w-4 h-4" />
          Ngưỡng Giới Hạn Tới Hạn (CCP Limits)
        </button>

        <button
          onClick={() => setActiveTab('alerts')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition whitespace-nowrap ${
            activeTab === 'alerts' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Bell className="w-4 h-4" />
          Cảnh Báo & Thông Báo Khẩn
        </button>

        <button
          onClick={() => setActiveTab('sync')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition whitespace-nowrap ${
            activeTab === 'sync' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Smartphone className="w-4 h-4" />
          Quy Chuẩn Đồng Bộ & Lưu Mẫu
        </button>

        <button
          onClick={() => setActiveTab('org')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition whitespace-nowrap ${
            activeTab === 'org' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Building className="w-4 h-4" />
          Hồ Sơ Doanh Nghiệp & Pháp Lý
        </button>
      </div>

      {/* Tab 1: CCP Limits */}
      {activeTab === 'ccp' && (
        <Card className="glassmorphism">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">Ngưỡng Kiểm Soát Nhiệt Độ Tiêu Chuẩn Quốc Tế HACCP</CardTitle>
                <CardDescription>
                  Khi nhiệt độ thiết bị nằm ngoài phạm vi này, hệ thống sẽ tự động kích hoạt trạng thái Cảnh Báo và tạo phiếu sự cố CAPA
                </CardDescription>
              </div>
              <Badge variant="outline" className="text-emerald-400 border-emerald-500/30">
                Codex Alimentarius
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Kho đông */}
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-white text-sm">Kho Đông Sâu (Deep Freezer)</span>
                  <Badge variant="secondary">Thịt & Thủy sản</Badge>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs text-slate-400">Nhiệt độ tối thiểu (°C)</label>
                    <Input
                      type="number"
                      value={ccpThresholds.freezerMin}
                      onChange={(e) => setCcpThresholds({ ...ccpThresholds, freezerMin: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-slate-400">Nhiệt độ tối đa (°C)</label>
                    <Input
                      type="number"
                      value={ccpThresholds.freezerMax}
                      onChange={(e) => setCcpThresholds({ ...ccpThresholds, freezerMax: e.target.value })}
                    />
                  </div>
                </div>
                <p className="text-[11px] text-slate-500">Tiêu chuẩn khuyến nghị: Giữ ổn định ở mức ≤ -18.0°C</p>
              </div>

              {/* Tủ mát thực phẩm */}
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-white text-sm">Tủ Mát Thực Phẩm & Sữa (Chiller)</span>
                  <Badge variant="secondary">Sơ chế & Trưng bày</Badge>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs text-slate-400">Nhiệt độ tối thiểu (°C)</label>
                    <Input
                      type="number"
                      value={ccpThresholds.chillerMin}
                      onChange={(e) => setCcpThresholds({ ...ccpThresholds, chillerMin: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-slate-400">Nhiệt độ tối đa (°C)</label>
                    <Input
                      type="number"
                      value={ccpThresholds.chillerMax}
                      onChange={(e) => setCcpThresholds({ ...ccpThresholds, chillerMax: e.target.value })}
                    />
                  </div>
                </div>
                <p className="text-[11px] text-slate-500">Tiêu chuẩn khuyến nghị: 0.0°C đến 4.0°C để ức chế vi khuẩn</p>
              </div>

              {/* Tủ mát rau củ */}
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-white text-sm">Kho Rau Củ Quả & Trái Cây</span>
                  <Badge variant="secondary">Thực vật</Badge>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs text-slate-400">Nhiệt độ tối thiểu (°C)</label>
                    <Input
                      type="number"
                      value={ccpThresholds.produceMin}
                      onChange={(e) => setCcpThresholds({ ...ccpThresholds, produceMin: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-slate-400">Nhiệt độ tối đa (°C)</label>
                    <Input
                      type="number"
                      value={ccpThresholds.produceMax}
                      onChange={(e) => setCcpThresholds({ ...ccpThresholds, produceMax: e.target.value })}
                    />
                  </div>
                </div>
                <p className="text-[11px] text-slate-500">Tiêu chuẩn khuyến nghị: 4.0°C đến 8.0°C tránh dập nát do đông đá</p>
              </div>

              {/* Giữ nóng thực phẩm */}
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-white text-sm">Quầy Giữ Nóng & Buffet (Hot Holding)</span>
                  <Badge variant="secondary">Thức ăn chín</Badge>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs text-slate-400">Nhiệt độ tối thiểu (°C)</label>
                    <Input
                      type="number"
                      value={ccpThresholds.hotHoldingMin}
                      onChange={(e) => setCcpThresholds({ ...ccpThresholds, hotHoldingMin: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-slate-400">Nhiệt độ tối đa (°C)</label>
                    <Input
                      type="number"
                      value={ccpThresholds.hotHoldingMax}
                      onChange={(e) => setCcpThresholds({ ...ccpThresholds, hotHoldingMax: e.target.value })}
                    />
                  </div>
                </div>
                <p className="text-[11px] text-slate-500">Bắt buộc giữ trên 60°C để ngăn ngừa vi sinh vật phát triển</p>
              </div>
            </div>

            {/* Core Cooking Temp */}
            <div className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-indigo-300 text-sm">Nhiệt Độ Tâm Khi Nấu Chín (Core Cooking CCP-3)</span>
                <span className="font-bold text-white text-sm">≥ {ccpThresholds.coreCookingMin}°C</span>
              </div>
              <p className="text-xs text-slate-400">
                Thịt gia cầm và thịt xay cần đạt tối thiểu 75°C trong ít nhất 15 giây tại tâm điểm dày nhất trước khi mang ra phục vụ thực khách.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tab 2: Alerts */}
      {activeTab === 'alerts' && (
        <Card className="glassmorphism">
          <CardHeader>
            <CardTitle className="text-lg">Kênh Thông Báo & Báo Động Khẩn Cấp</CardTitle>
            <CardDescription>Cấu hình cơ chế cảnh báo khi có sai lệch nhiệt độ hoặc vi phạm checklist nghiêm trọng</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-4">
              <label className="flex items-center justify-between p-4 rounded-xl bg-slate-900/60 border border-slate-800 cursor-pointer hover:border-slate-700 transition">
                <div>
                  <span className="text-sm font-semibold text-white block">Thông báo đẩy ứng dụng di động (Push Notification)</span>
                  <span className="text-xs text-slate-400">Gửi tức thì đến điện thoại của Bếp trưởng, Quản lý ca và Giám sát ATTP</span>
                </div>
                <input
                  type="checkbox"
                  checked={alertSettings.pushMobile}
                  onChange={(e) => setAlertSettings({ ...alertSettings, pushMobile: e.target.checked })}
                  className="w-5 h-5 rounded text-indigo-600 focus:ring-indigo-500"
                />
              </label>

              <label className="flex items-center justify-between p-4 rounded-xl bg-slate-900/60 border border-slate-800 cursor-pointer hover:border-slate-700 transition">
                <div>
                  <span className="text-sm font-semibold text-white block">Email báo cáo sự cố tự động</span>
                  <span className="text-xs text-slate-400">Gửi biên bản sự cố CAPA kèm sơ đồ nhiệt độ lệch chuẩn</span>
                </div>
                <input
                  type="checkbox"
                  checked={alertSettings.emailAlerts}
                  onChange={(e) => setAlertSettings({ ...alertSettings, emailAlerts: e.target.checked })}
                  className="w-5 h-5 rounded text-indigo-600 focus:ring-indigo-500"
                />
              </label>

              <label className="flex items-center justify-between p-4 rounded-xl bg-slate-900/60 border border-slate-800 cursor-pointer hover:border-slate-700 transition">
                <div>
                  <span className="text-sm font-semibold text-white block">Tin nhắn SMS khẩn cấp (Sự cố Mức Độ Cao)</span>
                  <span className="text-xs text-slate-400">Kích hoạt khi kho đông bị mất điện hoặc hỏng máy nén quá 30 phút</span>
                </div>
                <input
                  type="checkbox"
                  checked={alertSettings.smsUrgent}
                  onChange={(e) => setAlertSettings({ ...alertSettings, smsUrgent: e.target.checked })}
                  className="w-5 h-5 rounded text-indigo-600 focus:ring-indigo-500"
                />
              </label>
            </div>

            <div className="space-y-2 pt-2">
              <label className="text-xs font-medium text-slate-300">Danh sách Email nhận cảnh báo khẩn (ngăn cách bởi dấu phẩy)</label>
              <Input
                value={alertSettings.alertEmails}
                onChange={(e) => setAlertSettings({ ...alertSettings, alertEmails: e.target.value })}
                className="bg-slate-900 border-slate-700"
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tab 3: Sync & Storage */}
      {activeTab === 'sync' && (
        <Card className="glassmorphism">
          <CardHeader>
            <CardTitle className="text-lg">Quy Chuẩn Đồng Bộ & Lưu Trữ Mẫu</CardTitle>
            <CardDescription>Đồng bộ dữ liệu đa nền tảng Web ↔ Mobile Offline-first và quy định lưu mẫu 24h</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
                <span className="text-sm font-semibold text-white">Thời gian lưu mẫu thức ăn (Giờ)</span>
                <p className="text-xs text-slate-400">Quy định pháp luật bắt buộc lưu mẫu thức ăn trong tủ lạnh riêng biệt</p>
                <Input
                  type="number"
                  value={syncSettings.sampleRetentionHours}
                  onChange={(e) => setSyncSettings({ ...syncSettings, sampleRetentionHours: e.target.value })}
                />
              </div>

              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
                <span className="text-sm font-semibold text-white">Tần suất đồng bộ nền (Giây)</span>
                <p className="text-xs text-slate-400">Chu kỳ đẩy dữ liệu offline từ app di động lên đám mây máy chủ</p>
                <Input
                  type="number"
                  value={syncSettings.syncIntervalSeconds}
                  onChange={(e) => setSyncSettings({ ...syncSettings, syncIntervalSeconds: e.target.value })}
                />
              </div>
            </div>

            <label className="flex items-center justify-between p-4 rounded-xl bg-slate-900/60 border border-slate-800 cursor-pointer">
              <div>
                <span className="text-sm font-semibold text-white block">Bắt buộc xác thực vị trí bằng thẻ chip NFC</span>
                <span className="text-xs text-slate-400">Chống gian lận ghi chép từ xa, nhân viên phải chạm thẻ vật lý mới được hoàn tất phiếu</span>
              </div>
              <input
                type="checkbox"
                checked={syncSettings.requireNfcConfirmation}
                onChange={(e) => setSyncSettings({ ...syncSettings, requireNfcConfirmation: e.target.checked })}
                className="w-5 h-5 rounded text-indigo-600 focus:ring-indigo-500"
              />
            </label>
          </CardContent>
        </Card>
      )}

      {/* Tab 4: Org Info */}
      {activeTab === 'org' && (
        <Card className="glassmorphism">
          <CardHeader>
            <CardTitle className="text-lg">Thông Tin Doanh Nghiệp & Hồ Sơ Pháp Lý</CardTitle>
            <CardDescription>Thông tin xuất hiện trên các biên bản kiểm toán và giấy chứng nhận an toàn thực phẩm</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">Tên doanh nghiệp / Đơn vị chủ quản</label>
              <Input
                value={orgData.name}
                onChange={(e) => setOrgData({ ...orgData, name: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">Mã số thuế doanh nghiệp</label>
                <Input
                  value={orgData.taxCode}
                  onChange={(e) => setOrgData({ ...orgData, taxCode: e.target.value })}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">Người đại diện pháp luật</label>
                <Input
                  value={orgData.legalRep}
                  onChange={(e) => setOrgData({ ...orgData, legalRep: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">Địa chỉ trụ sở chính</label>
              <Input
                value={orgData.address}
                onChange={(e) => setOrgData({ ...orgData, address: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">Hotline hỗ trợ an toàn</label>
                <Input
                  value={orgData.phone}
                  onChange={(e) => setOrgData({ ...orgData, phone: e.target.value })}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">Số Chứng Nhận Hệ Thống HACCP</label>
                <Input
                  value={orgData.haccpCertNumber}
                  onChange={(e) => setOrgData({ ...orgData, haccpCertNumber: e.target.value })}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
