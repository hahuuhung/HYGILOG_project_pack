# Hướng Dẫn Phát Triển & Khởi Chạy Local (HYGILOG Local Development Guide)

Tài liệu hướng dẫn thiết lập môi trường phát triển cục bộ và vận hành nền tảng HYGILOG SaaS (Backend NestJS + Frontend Next.js + Shared Types + MongoDB + Redis).

---

## 1. Yêu Cầu Môi Trường (Prerequisites)

- **Node.js**: v20.x hoặc v24.x (Khuyến cáo LTS v20.18+ hoặc v24.19+)
- **NPM**: v10.x hoặc v11.x (Hỗ trợ npm workspaces)
- **MongoDB**: v7.0+ (Local hoặc Docker hoặc MongoDB Atlas)
- **Redis**: v7.0+ (Local hoặc Docker cho Blacklist token & Cache)
- **Docker & Docker Compose**: (Tùy chọn, khuyến nghị cho việc chạy trọn gói)

---

## 2. Cấu Hình Biến Môi Trường (Environment Variables)

File mẫu: [`.env.example`](file:///c:/Users/Tiep/Desktop/claudecode/HYGILOG_project_pack/.env.example). 
Dự án đã có sẵn file [`.env`](file:///c:/Users/Tiep/Desktop/claudecode/HYGILOG_project_pack/.env) tại thư mục gốc với các thông số mặc định:

```env
# Backend API Server
PORT=3001
NODE_ENV=development
CORS_ORIGINS=http://localhost:3000,http://localhost:3001

# Frontend Web
NEXT_PUBLIC_API_URL=http://localhost:3001/api

# Database
MONGODB_URI=mongodb://localhost:27017/hygilog
REDIS_URL=redis://localhost:6379

# JWT & Authentication
JWT_SECRET=super_secret_jwt_key_hygilog_haccp_2026
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# AWS Infrastructure
AWS_REGION=ap-southeast-1
AMPLIFY_APP_ID=amplify_demo_app_01

# Cloudflare DNS & Edge
CLOUDFLARE_API_TOKEN=demo_cf_token
CLOUDFLARE_ZONE_ID=demo_zone_id
```

---

## 3. Cài Đặt Dependencies

Chạy tại thư mục gốc của monorepo:

```bash
npm install
```

NPM sẽ tự động liên kết các workspace:
- `@hygilog/shared-types` (`packages/shared-types`)
- `hygilog-api` (`apps/api`)
- `web` (`apps/web`)

---

## 4. Biên Dịch (Build) Toàn Bộ Dự Án

```bash
# Build tất cả workspaces
npm run build

# Hoặc build từng phần:
npm run build:types  # Build shared types package
npm run build:api    # Build NestJS API (dist/main.js)
npm run build:web    # Build Next.js 14 App (Static & SSR)
```

---

## 5. Khởi Tạo Dữ Liệu Mẫu (Database Seeding)

Đảm bảo MongoDB đang chạy trên cổng 27017, sau đó thực hiện lệnh:

```bash
npm run seed
```

Dữ liệu sẽ được tự động khởi tạo bao gồm:
1. **1 Tổ chức Doanh nghiệp**: Tập đoàn Ẩm thực HYGILOG Việt Nam (Mã số thuế, Giấy phép ATTP).
2. **3 Cơ sở thực địa**: Nhà hàng Phố Cổ (HN), Khách sạn Sài Gòn Riverside (HCM), Bếp Trung Tâm Quận 1.
3. **6 Vai trò RBAC chuẩn**: `super_admin`, `org_admin`, `site_manager`, `supervisor`, `employee`, `auditor`.
4. **6 Tài khoản người dùng mẫu** (Mật khẩu mặc định: `Hygilog@2026`).
5. **3 Trạm NFC kiểm tra thực địa** gắn tại kho đông, tủ mát salad, quầy buffet.
6. **Bản ghi nhiệt độ, lô hàng truy xuất (Traceability), danh mục kiểm tra (Checklists), sự cố CAPA**.

---

## 6. Chạy Ứng Dụng (Development Mode)

### Cách 1: Chạy song song từng ứng dụng

Mở 2 cửa sổ terminal:

**Terminal 1 — Backend NestJS API (Port 3001):**
```bash
npm run dev:api
```
- Swagger API Docs: `http://localhost:3001/docs`
- Health Check: `http://localhost:3001/health`

**Terminal 2 — Frontend Web Next.js (Port 3000):**
```bash
npm run dev:web
```
- Web Application: `http://localhost:3000`
- Đăng nhập thử nghiệm: Dùng các nút **1-Click Demo Profiles** trên giao diện Login.

### Cách 2: Chạy trọn gói qua Docker Compose

```bash
docker-compose up -d
```
Docker sẽ khởi tạo đồng thời:
- `mongodb` (Port 27017)
- `redis` (Port 6379)
- `api` (Port 3001)
- `web` (Port 3000)

---

## 7. Chạy Kiểm Thử (Testing)

```bash
# Unit & E2E Tests
npm run test

# Kiểm tra kiểu dữ liệu TypeScript không sinh mã
npx tsc --noEmit -p apps/api/tsconfig.json
npx tsc --noEmit -p apps/web/tsconfig.json
```
