Kết luận nhanh
Ở trạng thái working tree hiện tại, HYGILOG là một prototype/alpha có định hướng sản phẩm tốt nhưng chưa đạt mức có thể triển khai production an toàn.
Điểm mạnh nhất là định vị “hotel operations + food safety + NFC” khá khác biệt. Tuy nhiên, khoảng cách lớn nhất với FoodDocs, SafetyCulture, Jolt và Safefood 360° hiện không nằm ở giao diện, mà ở độ hoàn thiện, mobile/offline, báo cáo, tích hợp thiết bị và đặc biệt là bảo mật backend.
Lưu ý: đánh giá này dựa trên repository hiện tại ngày 25/09/2026. Working tree có 39 file đang sửa, khoảng 4.940 dòng bị xóa chưa commit, nên có thể đây là trạng thái refactor dang dở chứ không phản ánh chính xác production đang chạy.
Kết quả kiểm tra kỹ thuật
1. Build và test chưa đạt
- npm.cmd run build thất bại:
  - API: 128 lỗi TypeScript.
  - Web: thiếu class-variance-authority và @radix-ui/react-slot.
- API unit test: No tests found.
- Hai file e2e tồn tại nhưng không được chạy bởi cấu hình test mặc định.
- [main.ts](C:/Users/Tiep/Desktop/claudecode/HYGILOG_project_pack/apps/api/src/main.ts) đang rỗng.
- 8 trang Web đang là file rỗng, gồm sites, tasks, reports, settings, NFC, traceability và corrective actions.
- Các trang còn nội dung chủ yếu dùng mock data; login trả mock_token và mock_refresh tại [login/page.tsx (line 46)](/C:/Users/Tiep/Desktop/claudecode/HYGILOG_project_pack/apps/web/app/(auth\)/login/page.tsx:46).
Kết luận: chưa có đường chạy Web → API → Database hoàn chỉnh để nghiệm thu sản phẩm.
2. Lỗ hổng nghiêm trọng ở authentication/RBAC
10 controller đang khai báo guard giả dạng class rỗng và decorator Permissions không ghi metadata. Ví dụ:
- [users.controller.ts (line 6)](/C:/Users/Tiep/Desktop/claudecode/HYGILOG_project_pack/apps/api/src/users/users.controller.ts:6)
- [temperature.controller.ts (line 4)](/C:/Users/Tiep/Desktop/claudecode/HYGILOG_project_pack/apps/api/src/temperature/temperature.controller.ts:4)
- [nfc.controller.ts (line 4)](/C:/Users/Tiep/Desktop/claudecode/HYGILOG_project_pack/apps/api/src/nfc/nfc.controller.ts:4)
Điều này có nghĩa là các endpoint có thể không được xác thực hay kiểm tra permission thực sự. Chỉ roles.controller.ts đang dùng guard thật.
Ngoài ra:
- JWT có fallback secret hardcode tại [jwt.strategy.ts (line 18)](/C:/Users/Tiep/Desktop/claudecode/HYGILOG_project_pack/apps/api/src/auth/strategies/jwt.strategy.ts:18).
- Redis blacklist hiện là mock luôn trả null, nên logout không thực sự thu hồi access token: [auth.module.ts (line 12)](/C:/Users/Tiep/Desktop/claudecode/HYGILOG_project_pack/apps/api/src/auth/auth.module.ts:12).
- Token được lưu bằng Zustand persistence/local storage, không phải cookie HttpOnly: [auth-store.ts (line 32)](/C:/Users/Tiep/Desktop/claudecode/HYGILOG_project_pack/apps/web/stores/auth-store.ts:32).
- Middleware chỉ kiểm tra cookie có tên auth-storage, trong khi Zustand mặc định ghi local storage: [middleware.ts (line 5)](/C:/Users/Tiep/Desktop/claudecode/HYGILOG_project_pack/apps/web/middleware.ts:5). Vì vậy bảo vệ route có khả năng hoạt động không đúng.
- CreateUserDto nhận organizationId từ request body dù tenant phải lấy từ authenticated context: [create-user.dto.ts (line 17)](/C:/Users/Tiep/Desktop/claudecode/HYGILOG_project_pack/apps/api/src/users/dto/create-user.dto.ts:17).
Đây là blocker tuyệt đối trước khi triển khai hoặc pilot với khách hàng.
3. Tenant isolation mới đạt một phần
Điểm tốt: nhiều service đã lọc MongoDB theo organizationId, ví dụ [users.service.ts (line 23)](/C:/Users/Tiep/Desktop/claudecode/HYGILOG_project_pack/apps/api/src/users/users.service.ts:23).
Nhưng còn các vấn đề:
- Guard tại controller đang bị thay bằng mock.
- Chưa có kiểm soát scope theo siteIds, mặc dù role SITE_MANAGER, SUPERVISOR, EMPLOYEE được mô tả là site-scoped.
- getPermissionsForRole() tìm role chỉ bằng roleId, không kèm tenant: [roles.service.ts (line 48)](/C:/Users/Tiep/Desktop/claudecode/HYGILOG_project_pack/apps/api/src/roles/roles.service.ts:48).
- NFC kiểm tra trùng tagId toàn hệ thống, trong khi các thao tác khác tenant-scoped: [nfc.service.ts (line 15)](/C:/Users/Tiep/Desktop/claudecode/HYGILOG_project_pack/apps/api/src/nfc/nfc.service.ts:15).
- Chưa có test cross-tenant thực sự với hai tenant và dữ liệu thật.
4. Tài liệu chủ yếu vẫn là template
Các tài liệu quan trọng chưa phản ánh hệ thống thật:
- Architecture còn ghi “Replace this conceptual view…” tại [ARCHITECTURE.md (line 20)](/C:/Users/Tiep/Desktop/claudecode/HYGILOG_project_pack/docs/ARCHITECTURE.md:20).
- Database tenant identifier vẫn là TBD: [DATABASE.md (line 7)](/C:/Users/Tiep/Desktop/claudecode/HYGILOG_project_pack/docs/DATABASE.md:7).
- Ma trận sáu role vẫn là Role 1…Role 6: [RBAC.md (line 9)](/C:/Users/Tiep/Desktop/claudecode/HYGILOG_project_pack/docs/RBAC.md:9).
- Toàn bộ milestone vẫn chưa được đánh dấu hoàn thành: [MILESTONE_BOARD.md (line 4)](/C:/Users/Tiep/Desktop/claudecode/HYGILOG_project_pack/docs/MILESTONE_BOARD.md:4).
- DNS/Cloudflare có placeholder <amplify-app-id> và <api-server-domain>, nên chưa phải cấu hình đã xác minh.
Public website HYGILOG hiện truy cập được qua HTTPS và định vị sản phẩm rộng hơn code hiện tại: food safety, maintenance, receiving, HR compliance, cleaning, documentation và process control. Tuy nhiên điều này chưa chứng minh hạ tầng Amplify/Cloudflare production đã được kiểm tra đầy đủ. Website HYGILOG
So sánh với sản phẩm tương tự
Tiêu chí	HYGILOG hiện tại	FoodDocs	SafetyCulture	Jolt	Safefood 360°
Định vị	Vận hành khách sạn + HACCP + NFC	HACCP/food safety chuyên sâu	Nền tảng vận hành, inspection đa ngành	Vận hành nhà hàng/frontline	Enterprise food safety
Checklist/inspection	Có schema/API khung, UI một phần	Hoàn chỉnh	Rất mạnh	Rất mạnh	Hoàn chỉnh
HACCP plan, hazard analysis, CCP	Chỉ có permission, chưa có module	Tự động tạo plan, CCP, SOP, PRP, flowchart	Template và đào tạo HACCP	Thiên về thực thi checklist	HACCP/PCP và risk model chuyên sâu
Temperature	API khung và mock UI	Log, cảnh báo, tích hợp thiết bị	Sensor/IoT, Bluetooth	Sensor 24/7 và Bluetooth probe	IoT và cảnh báo real-time
Corrective actions	Có backend khung	Tự kích hoạt và verification	Actions/issues workflow	Có audit trail	CAPA/deviation chuyên sâu
Traceability/recall	Batch cơ bản	Batch và recall-readiness	Traceability chung qua inspections/actions	Hạn chế hơn FoodDocs	Rất mạnh
Mobile/offline	Không có source Flutter trong repo	Mobile app	Web/mobile, hỗ trợ làm việc offline	Mobile-first	Web/cloud đa thiết bị
Multi-site analytics	Mới có organization/site model	Dashboard nhiều location, AI reports	Analytics/dashboard tùy biến	Multi-location visibility	BI, Tableau, business unit/site
Training/SOP	Chưa có	Hướng dẫn trong task	LMS/training mạnh	Library cho nhân viên	PRP và document control
Supplier/document management	Chưa thấy trong code	Có document và một phần supplier workflow	Có asset/document workflows	Không phải thế mạnh chính	Rất mạnh
Production readiness	Chưa build/test được	Thương mại hoàn chỉnh	Enterprise-grade	Thương mại hoàn chỉnh	Enterprise-grade


Nguồn đối chiếu:
- FoodDocs cung cấp HACCP builder, CCP, SOP, PRP, monitoring, traceability, corrective actions và dashboard nhiều địa điểm. FoodDocs features
- SafetyCulture có inspection, action/task, training, issues, sensor/IoT, analytics và integrations. SafetyCulture Platform
- Jolt tập trung vào checklist, temperature logs, Bluetooth probes, sensor 24/7, labeling và bằng chứng photo/signature. Jolt Food Safety
- Safefood 360° có hơn 35 module, HACCP/PCP, CAPA, supplier management, document control và IoT. Safefood 360°
Lợi thế có thể khai thác của HYGILOG
Nếu triển khai đúng, HYGILOG không nên cạnh tranh bằng cách sao chép toàn bộ FoodDocs hoặc SafetyCulture. Lợi thế hợp lý hơn là:
- Hotel-first thay vì restaurant-only hoặc inspection chung.
- Kết nối food safety với maintenance, housekeeping, receiving và HR compliance.
- NFC đặt tại thiết bị/khu vực để nhân viên mở đúng workflow ngay tại hiện trường.
- Triển khai tùy chỉnh theo từng khách sạn/resort.
- Hỗ trợ môi trường đa ngôn ngữ và nhân sự thay đổi ca liên tục.
NFC là điểm khác biệt đáng chú ý, nhưng hiện mới là API cơ bản; chưa thấy mobile UX, provisioning, chống replay, offline queue hoặc quản trị vòng đời tag.
Đánh giá mức trưởng thành
Hạng mục	Điểm hiện tại
Tầm nhìn và định vị sản phẩm	4/5
Kiến trúc nền tảng	2.5/5
Chức năng thực thi được	1.5/5
Security/RBAC/tenant isolation	1/5
Mobile và synchronization	0.5/5
Testing và release readiness	0.5/5
Documentation/handover	1.5/5
Tổng thể	khoảng 1.6/5


Thứ tự xử lý đề xuất
1. Đóng băng feature development và phục hồi build xanh.
2. Khôi phục main.ts, dependency và các trang bị rỗng; xác định phần xóa chưa commit là chủ ý hay tai nạn.
3. Thay toàn bộ mock guard/decorator bằng guard thật; bỏ mọi JWT fallback trong production.
4. Hoàn thiện authentication, Redis/token revocation và route protection.
5. Viết integration test cho 401, 403, hai tenant và site scope.
6. Kết nối Web với API thật, loại bỏ mock token/data.
7. Xác định source code mobile; nếu không tồn tại, không nên tuyên bố Web–Mobile Sync đã được triển khai.
8. Sau khi nền tảng ổn định, ưu tiên product gap: HACCP plan/CCP, offline mobile, task scheduling/escalation, evidence/photo/signature, exports và sensor integration.
9. Cập nhật tài liệu bằng kết quả thật, rồi mới audit DNS/SSL và chuẩn bị pilot.
Ở trạng thái hiện tại, mình chưa khuyến nghị demo kỹ thuật cho khách hàng, triển khai staging công khai hoặc dùng dữ liệu thật. Hướng đi sản phẩm có tiềm năng, nhưng cần một vòng stabilization và security hardening trước khi so đua tính năng với các đối thủ.