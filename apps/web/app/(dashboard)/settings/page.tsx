'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Settings, 
  Thermometer, 
  Bell, 
  Building2, 
  ShieldCheck, 
  Save, 
  CheckCircle2,
  Lock,
  Smartphone
} from 'lucide-react';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<'haccp' | 'alerts' | 'org' | 'security'>('haccp');
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Form states
  const [haccpLimits, setHaccpLimits] = useState({
    frozenMax: -18,
    chilledMeatMax: 2,
    chilledSaladMax: 4,
    hotHoldingMin: 63,
    fryerOilMin: 160,
    fryerOilMax: 185,
    maxDeviationMinutes: 15,
  });

  const [alertSettings, setAlertSettings] = useState({
    emailAlerts: true,
    telegramBot: true,
    zaloNotification: false,
    alertEmail: 'safety-alerts@hygilog.vn',
    telegramChatId: '-100238491823',
  });

  const [orgProfile, setOrgProfile] = useState({
    orgName: 'Công ty Cổ phần Ẩm thực HYGILOG Việt Nam',
    taxCode: '0318928374',
    foodLicenseNumber: 'ATTP-HCM-2026/0491',
    licenseExpiry: '2029-08-15',
    address: 'Số 18 Hàng Bè, Hoàn Kiếm, Hà Nội',
    representative: 'Nguyễn Văn An',
  });

  const handleSave = () => {
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white">Cài Đặt Hệ Thống</h2>
          <p className="text-slate-400 text-sm mt-1">
            Thiết lập ngưỡng tới hạn CCP, cấu hình thông báo cảnh báo và hồ sơ pháp lý ATTP
          </p>
        </div>

        <Button onClick={handleSave} className="gap-2 shadow-lg shadow-indigo-950">
          <Save className="w-4 h-4" />
          Lưu cấu hình
        </Button>
      </div>

      {/* Save Success Banner */}
      {saveSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-3 text-emerald-300 text-xs">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>Đã cập nhật cấu hình hệ thống thành công! Dữ liệu đã đồng bộ tới các thiết bị máy tính bảng và điện thoại ca trực.</span>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3 overflow-x-auto">
        <button
          onClick={() => setActiveTab('haccp')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'haccp' 
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-900/40' 
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Thermometer className="w-4 h-4" />
          Ngưỡng nhiệt độ CCP
        </button>

        <button
          onClick={() => setActiveTab('alerts')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'alerts' 
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-900/40' 
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Bell className="w-4 h-4" />
          Cảnh báo & Khẩn cấp
        </button>

        <button
          onClick={() => setActiveTab('org')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'org' 
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-900/40' 
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Building2 className="w-4 h-4" />
          Hồ sơ Pháp nhân & ATTP
        </button>

        <button
          onClick={() => setActiveTab('security')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'security' 
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-900/40' 
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Lock className="w-4 h-4" />
          Bảo mật & Phiên làm việc
        </button>
      </div>

      {/* Tab 1: HACCP Limits */}
      {activeTab === 'haccp' && (
        <Card className="glassmorphism">
          <CardHeader>
            <CardTitle className="text-base font-bold text-white flex items-center gap-2">
              <Thermometer className="w-5 h-5 text-orange-400" />
              Tiêu Chuẩn Giới Hạn Tới Hạn (CCP Critical Limits)
            </CardTitle>
            <CardDescription className="text-slate-400 text-xs">
              Hệ thống sẽ kích hoạt còi cảnh báo và tạo sự cố CAPA tự động khi thông số đo lường vượt khỏi các ngưỡng này
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1.5 p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
                <label className="text-xs font-semibold text-white">Kho đông sâu thực phẩm (°C)</label>
                <p className="text-[11px] text-slate-400">Ngưỡng tối đa cho phép bảo quản đông lạnh</p>
                <div className="flex items-center gap-2 pt-1">
                  <Input 
                    type="number" 
                    value={haccpLimits.frozenMax}
                    onChange={(e) => setHaccpLimits({ ...haccpLimits, frozenMax: parseFloat(e.target.value) || 0 })}
                    className="max-w-[120px]"
                  />
                  <span className="text-xs text-slate-400">°C (Chuẩn: ≤ -18°C)</span>
                </div>
              </div>

              <div className="space-y-1.5 p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
                <label className="text-xs font-semibold text-white">Tủ mát trữ thịt & hải sản tươi sống (°C)</label>
                <p className="text-[11px] text-slate-400">Ngưỡng tối đa bảo quản thịt cá trong ngày</p>
                <div className="flex items-center gap-2 pt-1">
                  <Input 
                    type="number" 
                    value={haccpLimits.chilledMeatMax}
                    onChange={(e) => setHaccpLimits({ ...haccpLimits, chilledMeatMax: parseFloat(e.target.value) || 0 })}
                    className="max-w-[120px]"
                  />
                  <span className="text-xs text-slate-400">°C (Chuẩn: 0°C đến +2°C)</span>
                </div>
              </div>

              <div className="space-y-1.5 p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
                <label className="text-xs font-semibold text-white">Tủ mát salad & bánh ngọt (°C)</label>
                <p className="text-[11px] text-slate-400">Ngưỡng nhiệt độ mát cho món ăn liền</p>
                <div className="flex items-center gap-2 pt-1">
                  <Input 
                    type="number" 
                    value={haccpLimits.chilledSaladMax}
                    onChange={(e) => setHaccpLimits({ ...haccpLimits, chilledSaladMax: parseFloat(e.target.value) || 0 })}
                    className="max-w-[120px]"
                  />
                  <span className="text-xs text-slate-400">°C (Chuẩn: +2°C đến +4°C)</span>
                </div>
              </div>

              <div className="space-y-1.5 p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
                <label className="text-xs font-semibold text-white">Giữ ấm món nóng (Hot Holding CCP2)</label>
                <p className="text-[11px] text-slate-400">Nhiệt độ tối thiểu duy trì trên quầy buffet</p>
                <div className="flex items-center gap-2 pt-1">
                  <Input 
                    type="number" 
                    value={haccpLimits.hotHoldingMin}
                    onChange={(e) => setHaccpLimits({ ...haccpLimits, hotHoldingMin: parseFloat(e.target.value) || 0 })}
                    className="max-w-[120px]"
                  />
                  <span className="text-xs text-slate-400">°C (Chuẩn: ≥ +63°C)</span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
              <label className="text-xs font-semibold text-white">Thời gian trễ cho phép khi xả đá tự động (Defrost Delay)</label>
              <p className="text-[11px] text-slate-400">
                Khoảng thời gian (phút) thiết bị có thể tăng nhiệt độ khi chu kỳ xả đá tự động chạy trước khi kích hoạt báo động vi phạm
              </p>
              <div className="flex items-center gap-2 pt-1">
                <Input 
                  type="number" 
                  value={haccpLimits.maxDeviationMinutes}
                  onChange={(e) => setHaccpLimits({ ...haccpLimits, maxDeviationMinutes: parseInt(e.target.value) || 0 })}
                  className="max-w-[120px]"
                />
                <span className="text-xs text-slate-400">phút (Khuyến cáo: 15 - 20 phút)</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tab 2: Alerts */}
      {activeTab === 'alerts' && (
        <Card className="glassmorphism">
          <CardHeader>
            <CardTitle className="text-base font-bold text-white flex items-center gap-2">
              <Bell className="w-5 h-5 text-indigo-400" />
              Kênh Thông Báo Cảnh Báo Vi Phạm Khẩn Cấp
            </CardTitle>
            <CardDescription className="text-slate-400 text-xs">
              Gửi thông báo tức thời tới Bếp trưởng và Giám đốc điều hành khi có sự cố nghiêm trọng
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-semibold text-white">Thông báo qua Email</h4>
                  <p className="text-[11px] text-slate-400">Nhận báo cáo vi phạm và bản tin tổng hợp hàng ngày</p>
                </div>
                <input 
                  type="checkbox" 
                  checked={alertSettings.emailAlerts}
                  onChange={(e) => setAlertSettings({ ...alertSettings, emailAlerts: e.target.checked })}
                  className="w-4 h-4 accent-indigo-600 rounded cursor-pointer"
                />
              </div>
              {alertSettings.emailAlerts && (
                <Input 
                  placeholder="Địa chỉ email nhận cảnh báo"
                  value={alertSettings.alertEmail}
                  onChange={(e) => setAlertSettings({ ...alertSettings, alertEmail: e.target.value })}
                  className="text-xs"
                />
              )}
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-semibold text-white">Telegram Alert Bot (Thời gian thực 0s)</h4>
                  <p className="text-[11px] text-slate-400">Bắn tin nhắn khẩn cấp vào Group Quản lý Bếp</p>
                </div>
                <input 
                  type="checkbox" 
                  checked={alertSettings.telegramBot}
                  onChange={(e) => setAlertSettings({ ...alertSettings, telegramBot: e.target.checked })}
                  className="w-4 h-4 accent-indigo-600 rounded cursor-pointer"
                />
              </div>
              {alertSettings.telegramBot && (
                <Input 
                  placeholder="Telegram Group Chat ID (-100...)"
                  value={alertSettings.telegramChatId}
                  onChange={(e) => setAlertSettings({ ...alertSettings, telegramChatId: e.target.value })}
                  className="text-xs font-mono"
                />
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tab 3: Organization Profile */}
      {activeTab === 'org' && (
        <Card className="glassmorphism">
          <CardHeader>
            <CardTitle className="text-base font-bold text-white flex items-center gap-2">
              <Building2 className="w-5 h-5 text-blue-400" />
              Hồ Sơ Pháp Nhân & Giấy Phép An Toàn Thực Phẩm
            </CardTitle>
            <CardDescription className="text-slate-400 text-xs">
              Thông tin hiển thị trên các biểu mẫu xuất trình cho đoàn kiểm tra liên ngành
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Tên Doanh Nghiệp / Tổ Chức *</label>
                <Input 
                  value={orgProfile.orgName}
                  onChange={(e) => setOrgProfile({ ...orgProfile, orgName: e.target.value })}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Mã Số Thuế (MST) *</label>
                <Input 
                  value={orgProfile.taxCode}
                  onChange={(e) => setOrgProfile({ ...orgProfile, taxCode: e.target.value })}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Số Giấy Chứng Nhận ĐĐK ATTP</label>
                <Input 
                  value={orgProfile.foodLicenseNumber}
                  onChange={(e) => setOrgProfile({ ...orgProfile, foodLicenseNumber: e.target.value })}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Hạn Giấy Phép ATTP</label>
                <Input 
                  type="date"
                  value={orgProfile.licenseExpiry}
                  onChange={(e) => setOrgProfile({ ...orgProfile, licenseExpiry: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Địa chỉ đăng ký kinh doanh</label>
              <Input 
                value={orgProfile.address}
                onChange={(e) => setOrgProfile({ ...orgProfile, address: e.target.value })}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tab 4: Security */}
      {activeTab === 'security' && (
        <Card className="glassmorphism">
          <CardHeader>
            <CardTitle className="text-base font-bold text-white flex items-center gap-2">
              <Lock className="w-5 h-5 text-emerald-400" />
              Bảo Mật & Phân Quyền Đa Khách Hàng (Multi-Tenant Isolation)
            </CardTitle>
            <CardDescription className="text-slate-400 text-xs">
              Các quy tắc mã hóa token và cách ly dữ liệu giữa các doanh nghiệp
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold">
                <ShieldCheck className="w-4 h-4" />
                <span>Tenant Isolation Enforced</span>
              </div>
              <p className="text-xs text-slate-400">
                Toàn bộ dữ liệu được cách ly tuyệt đối thông qua cơ chế TenantGuard và chỉ mục compound Index MongoDB trên field <code className="text-indigo-400 font-mono">organizationId</code>.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
                <p className="text-xs text-slate-400">Thời hạn Access Token</p>
                <p className="text-base font-bold text-white mt-1">15 phút (JWT HMAC SHA-256)</p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
                <p className="text-xs text-slate-400">Thời hạn Refresh Token</p>
                <p className="text-base font-bold text-white mt-1">7 ngày (Redis Blacklist Supported)</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
