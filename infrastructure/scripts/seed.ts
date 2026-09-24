import { MongoClient, ObjectId } from 'mongodb';
import * as bcrypt from 'bcryptjs';

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/hygilog';

async function seed() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    console.log('Connected to MongoDB:', uri);
    const db = client.db();

    // Clear existing collections
    const collectionsToClear = [
      'organizations',
      'sites',
      'users',
      'roles',
      'permissions',
      'nfctags',
      'nfc_tags',
      'temperaturerecords',
      'temperatures',
      'checklists',
      'checklisttemplates',
      'batches',
      'correctiveactions',
      'corrective_actions',
      'auditlogs',
    ];

    for (const col of collectionsToClear) {
      try {
        await db.collection(col).deleteMany({});
      } catch (err) {
        // ignore if collection doesn't exist
      }
    }

    console.log('✓ Cleaned existing collections');

    // 1. Organization
    const orgId = new ObjectId();
    await db.collection('organizations').insertOne({
      _id: orgId,
      name: 'Tập đoàn Ẩm thực HYGILOG Việt Nam',
      slug: 'hygilog-vietnam',
      address: 'Số 18 Hàng Bè, Phường Hàng Bạc, Quận Hoàn Kiếm, Hà Nội',
      phone: '024 3828 9999',
      email: 'contact@hygilog.vn',
      plan: 'enterprise',
      status: 'active',
      settings: {
        haccpCertified: true,
        licenseNumber: 'ATTP-HN-2026/0888',
        timezone: 'Asia/Ho_Chi_Minh',
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    console.log('✓ Seeded Organization:', orgId.toString());

    // 2. Sites (Facilities)
    const siteIds = [new ObjectId(), new ObjectId(), new ObjectId()];
    await db.collection('sites').insertMany([
      {
        _id: siteIds[0],
        organizationId: orgId,
        name: 'Nhà hàng Phố Cổ (Trụ sở chính)',
        code: 'HN-CENTRAL-01',
        address: 'Số 18 Hàng Bè, Hoàn Kiếm, Hà Nội',
        type: 'restaurant',
        status: 'active',
        timezone: 'Asia/Ho_Chi_Minh',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        _id: siteIds[1],
        organizationId: orgId,
        name: 'Khách sạn Sài Gòn Riverside (Chi nhánh 2)',
        code: 'HCM-RIVER-02',
        address: 'Số 88 Bến Vân Đồn, Quận 4, TP. Hồ Chí Minh',
        type: 'hotel_kitchen',
        status: 'active',
        timezone: 'Asia/Ho_Chi_Minh',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        _id: siteIds[2],
        organizationId: orgId,
        name: 'Bếp Trung Tâm Quận 1 (Central Kitchen)',
        code: 'HCM-CK-03',
        address: 'Số 204 Nguyễn Thị Minh Khai, Quận 1, TP. Hồ Chí Minh',
        type: 'central_kitchen',
        status: 'active',
        timezone: 'Asia/Ho_Chi_Minh',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
    console.log('✓ Seeded 3 Sites');

    // 3. Permissions Catalog
    const allPermissions = [
      'dashboard.view',
      'users.view', 'users.create', 'users.update', 'users.delete',
      'sites.view', 'sites.create', 'sites.update', 'sites.delete',
      'temperature.view', 'temperature.create', 'temperature.update',
      'checklists.view', 'checklists.create', 'checklists.update', 'checklists.approve',
      'traceability.view', 'traceability.create', 'traceability.update',
      'corrective.view', 'corrective.create', 'corrective.approve',
      'reports.view', 'reports.export',
      'nfc.scan', 'nfc.manage',
      'haccp.view', 'haccp.create', 'haccp.update', 'haccp.approve',
      'settings.view', 'settings.update',
      'tasks.view', 'tasks.assign',
      'audit.view',
    ];

    await db.collection('permissions').insertMany(
      allPermissions.map((code) => ({
        code,
        description: `Quyền thực hiện ${code}`,
        module: code.split('.')[0],
        createdAt: new Date(),
      }))
    );

    // 4. Roles (6 distinct roles)
    const roles = [
      {
        name: 'super_admin',
        description: 'Quản trị viên Nền tảng với toàn quyền',
        scope: 'platform',
        permissions: allPermissions,
        isSystem: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'org_admin',
        description: 'Giám đốc Tuân thủ / Quản trị tổ chức',
        scope: 'organization',
        permissions: allPermissions.filter((p) => !p.startsWith('platform.')),
        isSystem: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'site_manager',
        description: 'Bếp trưởng Điều hành / Quản lý cơ sở',
        scope: 'site',
        permissions: [
          'dashboard.view', 'users.view', 'sites.view',
          'temperature.view', 'temperature.create', 'temperature.update',
          'checklists.view', 'checklists.create', 'checklists.update', 'checklists.approve',
          'traceability.view', 'traceability.create', 'traceability.update',
          'corrective.view', 'corrective.create', 'corrective.approve',
          'reports.view', 'reports.export', 'nfc.scan', 'nfc.manage',
          'haccp.view', 'tasks.view', 'tasks.assign',
        ],
        isSystem: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'supervisor',
        description: 'Trưởng ca Vệ sinh / Bếp phó',
        scope: 'site',
        permissions: [
          'dashboard.view', 'temperature.view', 'temperature.create',
          'checklists.view', 'checklists.create', 'checklists.update', 'checklists.approve',
          'traceability.view', 'traceability.create', 'corrective.view', 'corrective.create',
          'nfc.scan', 'tasks.view', 'tasks.assign',
        ],
        isSystem: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'employee',
        description: 'Nhân viên Chế biến & Vận hành',
        scope: 'site',
        permissions: [
          'temperature.view', 'temperature.create',
          'checklists.view', 'checklists.create',
          'traceability.view', 'traceability.create',
          'corrective.create', 'nfc.scan', 'tasks.view',
        ],
        isSystem: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'auditor',
        description: 'Thanh tra viên Độc lập (Chỉ xem)',
        scope: 'organization',
        permissions: [
          'dashboard.view', 'sites.view', 'temperature.view', 'checklists.view',
          'traceability.view', 'corrective.view', 'reports.view', 'reports.export',
          'haccp.view', 'audit.view',
        ],
        isSystem: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    await db.collection('roles').insertMany(roles);
    console.log('✓ Seeded 6 RBAC Roles');

    // 5. Users (One per role, hashed password Hygilog@2026)
    const passwordHash = await bcrypt.hash('Hygilog@2026', 10);
    const usersList = [
      { firstName: 'Văn An', lastName: 'Nguyễn', email: 'admin@hygilog.vn', roleId: 'super_admin', siteIds: siteIds },
      { firstName: 'Thị Mai', lastName: 'Trần', email: 'mai.tran@hygilog.vn', roleId: 'org_admin', siteIds: siteIds },
      { firstName: 'Hoàng Nam', lastName: 'Lê', email: 'nam.le@hygilog.vn', roleId: 'site_manager', siteIds: [siteIds[0]] },
      { firstName: 'Minh Đức', lastName: 'Phạm', email: 'duc.pham@hygilog.vn', roleId: 'supervisor', siteIds: [siteIds[1]] },
      { firstName: 'Thị Hương', lastName: 'Võ', email: 'huong.vo@hygilog.vn', roleId: 'employee', siteIds: [siteIds[0]] },
      { firstName: 'Quốc Bảo', lastName: 'Đặng', email: 'bao.dang@kiemtoan-attp.gov.vn', roleId: 'auditor', siteIds: siteIds },
    ];

    const insertedUsers = await db.collection('users').insertMany(
      usersList.map((u) => ({
        ...u,
        password: passwordHash,
        organizationId: orgId,
        status: 'active',
        lastLogin: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      }))
    );
    console.log('✓ Seeded 6 Users (Password: Hygilog@2026)');

    const adminUserId = Object.values(insertedUsers.insertedIds)[0];

    // 6. NFC Tags
    await db.collection('nfctags').insertMany([
      {
        tagId: '04:7B:A2:8F:33:10:80',
        label: 'Kho Đông Sâu #1',
        location: 'Khu Bếp Chính - Tầng B1',
        siteId: siteIds[0],
        organizationId: orgId,
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        tagId: '04:1E:5C:92:44:21:81',
        label: 'Tủ Mát Salad & Sơ Chế',
        location: 'Khu ra món (Pass)',
        siteId: siteIds[0],
        organizationId: orgId,
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        tagId: '04:99:3D:11:8A:55:82',
        label: 'Bể Giữ Nóng Món Ăn',
        location: 'Quầy Buffet',
        siteId: siteIds[1],
        organizationId: orgId,
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
    console.log('✓ Seeded NFC Stations');

    // 7. Temperature Records
    await db.collection('temperaturerecords').insertMany([
      {
        value: -19.5,
        unit: 'C',
        equipmentName: 'Kho Đông Sâu #1',
        equipmentType: 'freezer',
        location: 'Bếp chính - Tầng B1',
        siteId: siteIds[0],
        organizationId: orgId,
        recordedBy: adminUserId,
        status: 'ok',
        minThreshold: -25,
        maxThreshold: -18,
        syncStatus: 'SYNCED',
        createdAt: new Date(Date.now() - 1000 * 60 * 30),
      },
      {
        value: 1.8,
        unit: 'C',
        equipmentName: 'Tủ Mát Thịt Tươi #2',
        equipmentType: 'chiller',
        location: 'Khu Sơ Chế',
        siteId: siteIds[0],
        organizationId: orgId,
        recordedBy: adminUserId,
        status: 'ok',
        minThreshold: 0,
        maxThreshold: 4,
        syncStatus: 'SYNCED',
        createdAt: new Date(Date.now() - 1000 * 60 * 60),
      },
      {
        value: 5.6,
        unit: 'C',
        equipmentName: 'Tủ Mát Salad & Sơ Chế',
        equipmentType: 'chiller',
        location: 'Quầy Pass Món',
        siteId: siteIds[0],
        organizationId: orgId,
        recordedBy: adminUserId,
        status: 'warning',
        minThreshold: 0,
        maxThreshold: 4,
        notes: 'Cửa mở thường xuyên trong giờ cao điểm',
        syncStatus: 'SYNCED',
        createdAt: new Date(Date.now() - 1000 * 60 * 90),
      },
      {
        value: 68.2,
        unit: 'C',
        equipmentName: 'Bể Giữ Nóng Món Ăn',
        equipmentType: 'hot_holding',
        location: 'Quầy Buffet',
        siteId: siteIds[1],
        organizationId: orgId,
        recordedBy: adminUserId,
        status: 'ok',
        minThreshold: 63,
        maxThreshold: 90,
        syncStatus: 'SYNCED',
        createdAt: new Date(Date.now() - 1000 * 60 * 120),
      },
    ]);
    console.log('✓ Seeded Temperature Records');

    // 8. Traceability Batches
    await db.collection('batches').insertMany([
      {
        batchCode: 'LOT-2026-0924-A1',
        productName: 'Thịt bò Úc Ribeye đông lạnh',
        supplier: 'Công ty TNHH Thực Phẩm Sạch Toàn Cầu',
        receivedDate: new Date('2026-09-24T08:15:00Z'),
        expiryDate: new Date('2026-10-24T00:00:00Z'),
        quantity: 50,
        unit: 'kg',
        siteId: siteIds[0],
        organizationId: orgId,
        status: 'active',
        storageLocation: 'Kho đông sâu #1 - Kệ B2',
        temperatureRequirement: -18,
        recordedBy: adminUserId,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        batchCode: 'LOT-2026-0922-C3',
        productName: 'Cá hồi tươi Na Uy Fillet',
        supplier: 'Hải Sản Biển Đông Logistics',
        receivedDate: new Date('2026-09-22T06:30:00Z'),
        expiryDate: new Date('2026-09-26T00:00:00Z'),
        quantity: 25,
        unit: 'kg',
        siteId: siteIds[0],
        organizationId: orgId,
        status: 'active',
        storageLocation: 'Tủ bảo quản hải sản #2',
        temperatureRequirement: 2,
        recordedBy: adminUserId,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
    console.log('✓ Seeded Traceability Batches');

    // 9. Corrective Actions (CAPA)
    await db.collection('correctiveactions').insertMany([
      {
        title: 'Tủ mát trưng bày salad vượt ngưỡng 7.2°C trong 45 phút',
        description: 'Nhiệt kế cảm biến ghi nhận 7.2°C. Quạt gió bị đóng tuyết.',
        category: 'Nhiệt độ CCP',
        severity: 'critical',
        siteId: siteIds[0],
        organizationId: orgId,
        reportedBy: adminUserId,
        status: 'in_progress',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
    console.log('✓ Seeded CAPA Incidents');

    // 10. Checklists
    await db.collection('checklists').insertMany([
      {
        title: 'Vệ sinh & An toàn Bếp ca sáng (Opening Routine)',
        siteId: siteIds[0],
        organizationId: orgId,
        assignedTo: adminUserId,
        items: [
          { label: 'Rửa tay sát khuẩn đúng 6 bước, thay đồng phục sạch', checked: true },
          { label: 'Kiểm tra nhiệt kế kho đông và tủ mát trước sơ chế', checked: true },
          { label: 'Khử trùng mặt bàn sơ chế inox bằng cồn 70 độ', checked: true },
          { label: 'Bố trí dao thớt tách biệt màu sắc sống/chín', checked: true },
        ],
        status: 'approved',
        progress: 100,
        approvedBy: adminUserId,
        approvedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
    console.log('✓ Seeded Checklists');

    console.log('\n🎉 ALL HYGILOG SEED DATA CREATED SUCCESSFULLY!');
  } catch (error) {
    console.error('Error during seeding:', error);
  } finally {
    await client.close();
  }
}

seed();
