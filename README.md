# 🛡️ HYGILOG — Nền Tảng Quản Lý An Toàn Vệ Sinh Thực Phẩm & Tuân Thủ HACCP

[![Node.js Version](https://img.shields.io/badge/node.js-v20%20%7C%20v24-brightgreen.svg)](https://nodejs.org)
[![Next.js Version](https://img.shields.io/badge/next.js-v14.2-blue.svg)](https://nextjs.org)
[![NestJS Version](https://img.shields.io/badge/nestjs-v10-red.svg)](https://nestjs.com)
[![TypeScript](https://img.shields.io/badge/typescript-v5-blue.svg)](https://www.typescriptlang.org)
[![MongoDB](https://img.shields.io/badge/mongodb-v7-green.svg)](https://www.mongodb.com)
[![HACCP Standard](https://img.shields.io/badge/standard-TCVN%205603%20%7C%20ISO%2022000-orange.svg)]()

> **HYGILOG** là giải pháp phần mềm B2B SaaS chuyên biệt dành cho ngành Nhà hàng, Khách sạn, Khu nghỉ dưỡng và Bếp ăn công nghiệp (Hospitality & Food Services). Nền tảng số hóa 100% quy trình kiểm soát an toàn thực phẩm theo tiêu chuẩn **HACCP (Hazard Analysis and Critical Control Points)**, tích hợp trạm quét **thẻ NFC thực địa chống gian lận kiểm tra**, quản lý nhiệt độ chuỗi lạnh thời gian thực và tự động tạo hồ sơ thanh kiểm tra y tế.

---

## 🌟 Tính Năng Bản Thương Mại (Commercial Features)

| Phân hệ nghiệp vụ | Chi tiết triển khai | Tiêu chuẩn áp dụng |
|---|---|---|
| **Tổng quan (Executive Dashboard)** | Bảng giám sát chỉ số tuân thủ tổng thể, cảnh báo nhiệt độ CCP theo thời gian thực (Live Telemetry), dòng nhật ký vận hành trực tiếp | TCVN 5603:2008 |
| **Ghi nhận Nhiệt độ (CCP1)** | Quản lý kho đông (≤ -18°C), tủ mát bảo quản (0°C - 4°C), giữ nóng thức ăn (≥ 63°C), cảnh báo vượt ngưỡng và yêu cầu quét thẻ NFC đối chiếu | HACCP Nguyên tắc 2 & 3 |
| **Checklist Vệ sinh Ca** | Quy trình kiểm tra mở ca (Opening), kiểm thực 3 bước nhập hàng, quy trình đóng ca (Closing). Ký duyệt số nghiệm thu trực tiếp | Thông tư 30/2012/TT-BYT |
| **Truy xuất Nguồn gốc (Traceability)** | Quản lý lô hàng thực phẩm (LOT), kiểm soát hạn sử dụng, cảnh báo sắp hết hạn trong 72 giờ, nguyên tắc xuất nhập FIFO, phong tỏa lô hàng | ISO 22005:2007 |
| **Sự cố & Khắc phục (CAPA)** | Quy trình ghi nhận sự cố, phân loại mức độ nghiêm trọng, điều tra nguyên nhân gốc rễ (Root Cause) và ký duyệt biện pháp phòng ngừa | HACCP Nguyên tắc 5 |
| **Trạm Kiểm Tra NFC Thực Địa** | Gắn thẻ NFC vật lý tại từng kho/tủ/bàn sơ chế để nhân viên bắt buộc quét thẻ trước khi ghi số liệu, chống gian lận dữ liệu từ xa | Anti-fraud Presence Proof |
| **Báo cáo & Hồ sơ Thanh tra** | Tính toán điểm tuân thủ an toàn thực phẩm, xuất file báo cáo thanh kiểm tra định kỳ (PDF/Excel), nhật ký kiểm toán bất biến (Audit Trail) | Thanh tra Sở Y Tế / ATTP |
| **Cơ sở & Khu vực (Multi-Site)** | Quản lý chuỗi nhiều nhà hàng, bếp trung tâm, phân chia khu vực kiểm tra và thiết bị theo chi nhánh | Enterprise Multi-Tenant |
| **Phân quyền RBAC 6 Vai trò** | Super Admin, Org Admin, Site Manager, Supervisor, Employee, Auditor | Role-Based Access Control |

---

## 👥 Ma Trận 6 Vai Trò Người Dùng (RBAC Matrix)

```
┌────────────────────────────────────────────────────────────────────────┐
│                        PHÂN QUYỀN HỆ THỐNG HYGILOG                     │
├─────────────────┬──────────────┬───────────────────────────────────────┤
│ Vai trò         │ Phạm vi      │ Quyền hạn tiêu biểu                   │
├─────────────────┼──────────────┼───────────────────────────────────────┤
│ 👑 Super Admin  │ Toàn nền tảng│ Quản trị hệ thống, cấp tenant, debug  │
│ 🏢 Org Admin    │ Doanh nghiệp │ Quản lý tổ chức, xem toàn bộ chi nhánh│
│ 👨‍🍳 Site Manager│ Cơ sở cụ thể │ Bếp trưởng, phê duyệt checklist, CAPA │
│ 📋 Supervisor   │ Cơ sở cụ thể │ Giám sát ca trực, gán việc, duyệt việc│
│ 🧑‍🍳 Employee     │ Cơ sở cụ thể │ Nhân viên bếp, quét NFC, đo nhiệt độ  │
│ 🔍 Auditor      │ Doanh nghiệp │ Thanh tra viên y tế, xem & xuất hồ sơ │
└─────────────────┴──────────────┴───────────────────────────────────────┘
```

---

## 🏛️ Kiến Trúc Kỹ Thuật (Architecture Topology)

```
               ┌──────────────────────────────────────────────┐
               │          Cloudflare CDN / DNS / WAF          │
               │   (SSL Strict Mode, DDoS Guard, API Bypass)  │
               └──────────────┬────────────────┬──────────────┘
                              │                │
            ┌─────────────────▼──┐          ┌──▼──────────────────┐
            │     AWS Amplify    │          │  API Gateway / VPS  │
            │  Next.js 14 Web UI │          │  NestJS Backend API │
            │  (Glassmorphism)   │          │  (Port 3001)        │
            └────────────────────┘          └──────────┬──────────┘
                                                       │
                           ┌───────────────────────────┼───────────────────────────┐
                           ▼                           ▼                           ▼
                 ┌───────────────────┐       ┌───────────────────┐       ┌───────────────────┐
                 │    MongoDB 7.0    │       │     Redis 7.0     │       │ Physical NFC Tags │
                 │  Multi-Tenant DB  │       │  Token Blacklist  │       │ NTAG213 / NTAG215 │
                 │ (organizationId)  │       │  & Session Cache  │       │  Presence Proof   │
                 └───────────────────┘       └───────────────────┘       └───────────────────┘
```

---

## ⚡ Bắt Đầu Nhanh (Quickstart)

```bash
# 1. Cài đặt toàn bộ dependencies monorepo
npm install

# 2. Build tất cả packages và ứng dụng
npm run build

# 3. Khởi tạo dữ liệu mẫu thực tế
npm run seed

# 4. Chạy chế độ phát triển
npm run dev:api   # API: http://localhost:3001/docs
npm run dev:web   # Web: http://localhost:3000

# Hoặc khởi chạy trọn gói bằng Docker
docker-compose up -d
```

---

## 📄 Tài Liệu Tham Khảo

- [Hướng dẫn phát triển chi tiết](file:///c:/Users/Tiep/Desktop/claudecode/HYGILOG_project_pack/docs/LOCAL_DEVELOPMENT.md)
- [Bảng tiến độ các Milestone](file:///c:/Users/Tiep/Desktop/claudecode/HYGILOG_project_pack/docs/MILESTONE_BOARD.md)
- [Đặc tả phân quyền RBAC](file:///c:/Users/Tiep/Desktop/claudecode/HYGILOG_project_pack/docs/RBAC.md)
- [Kiến trúc cơ sở dữ liệu](file:///c:/Users/Tiep/Desktop/claudecode/HYGILOG_project_pack/docs/DATABASE.md)
- [Tài liệu API](file:///c:/Users/Tiep/Desktop/claudecode/HYGILOG_project_pack/docs/API.md)
