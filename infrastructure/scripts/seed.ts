import { MongoClient, ObjectId } from 'mongodb';
import * as bcrypt from 'bcryptjs';

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/hygilog';

async function seed() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    const db = client.db();

    // Clear existing data
    await db.collection('organizations').deleteMany({});
    await db.collection('sites').deleteMany({});
    await db.collection('users').deleteMany({});
    await db.collection('roles').deleteMany({});
    await db.collection('permissions').deleteMany({});
    await db.collection('nfc_tags').deleteMany({});
    await db.collection('temperatures').deleteMany({});
    await db.collection('checklists').deleteMany({});
    await db.collection('corrective_actions').deleteMany({});

    // 1. Organization
    const orgId = new ObjectId();
    await db.collection('organizations').insertOne({
      _id: orgId,
      name: 'HYGILOG Demo Corp',
      address: '123 Đường Lê Lợi, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh',
      contactEmail: 'contact@hygilogdemo.vn',
      contactPhone: '0901234567',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    console.log('Seeded Organization');

    // 2. Sites
    const siteIds = [new ObjectId(), new ObjectId(), new ObjectId()];
    await db.collection('sites').insertMany([
      {
        _id: siteIds[0],
        organizationId: orgId,
        name: 'Nhà hàng Phố Cổ',
        address: '45 Hàng Bạc, Hoàn Kiếm, Hà Nội',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        _id: siteIds[1],
        organizationId: orgId,
        name: 'Khách sạn Riverside',
        address: '10 Tôn Đức Thắng, Quận 1, TP.HCM',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        _id: siteIds[2],
        organizationId: orgId,
        name: 'Bếp trung tâm Quận 1',
        address: '88 Nguyễn Thái Học, Quận 1, TP.HCM',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
    console.log('Seeded Sites');

    // 3. Permissions & Roles
    const permissions = [
      'temperature.create', 'temperature.read', 'temperature.update', 'temperature.delete',
      'checklists.approve', 'checklists.read', 'checklists.create',
      'reports.export', 'reports.read',
      'users.manage', 'sites.manage'
    ];
    await db.collection('permissions').insertMany(
      permissions.map(p => ({
        name: p,
        description: `Quyền ${p}`,
        createdAt: new Date(),
        updatedAt: new Date()
      }))
    );

    const roles = [
      { name: 'super_admin', permissions, level: 1 },
      { name: 'org_admin', permissions, level: 2 },
      { name: 'site_manager', permissions: permissions.filter(p => p !== 'users.manage'), level: 3 },
      { name: 'supervisor', permissions: ['temperature.create', 'temperature.read', 'checklists.read', 'checklists.create', 'checklists.approve'], level: 4 },
      { name: 'employee', permissions: ['temperature.create', 'temperature.read', 'checklists.read', 'checklists.create'], level: 5 },
      { name: 'auditor', permissions: ['temperature.read', 'checklists.read', 'reports.read', 'reports.export'], level: 6 }
    ];
    await db.collection('roles').insertMany(roles.map(r => ({ ...r, createdAt: new Date(), updatedAt: new Date() })));
    console.log('Seeded Roles & Permissions');

    // 4. Users
    const passwordHash = await bcrypt.hash('Hygilog@2026', 10);
    const users = [
      { name: 'Nguyễn Văn An', email: 'an.nguyen@hygilogdemo.vn', role: 'super_admin' },
      { name: 'Trần Thị Mai', email: 'mai.tran@hygilogdemo.vn', role: 'org_admin' },
      { name: 'Lê Hoàng Nam', email: 'nam.le@hygilogdemo.vn', role: 'site_manager' },
      { name: 'Phạm Minh Đức', email: 'duc.pham@hygilogdemo.vn', role: 'supervisor' },
      { name: 'Võ Thị Hương', email: 'huong.vo@hygilogdemo.vn', role: 'employee' },
      { name: 'Đặng Quốc Bảo', email: 'bao.dang@hygilogdemo.vn', role: 'auditor' }
    ];

    await db.collection('users').insertMany(users.map((u, i) => ({
      ...u,
      password: passwordHash,
      organizationId: orgId,
      siteId: siteIds[i % 3],
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    })));
    console.log('Seeded Users');

    // 5. NFC Tags
    await db.collection('nfc_tags').insertMany(Array.from({ length: 5 }).map((_, i) => ({
      tagId: `NFC-${1000 + i}`,
      siteId: siteIds[i % 3],
      assignedEquipment: `Tủ lạnh ${i + 1}`,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    })));

    // 6. Temperature Records
    const statuses = ['ok', 'warning', 'critical'];
    await db.collection('temperatures').insertMany(Array.from({ length: 10 }).map((_, i) => ({
      siteId: siteIds[i % 3],
      equipmentId: `EQ-${100 + i}`,
      temperature: 2 + Math.random() * 8, // 2 to 10 degrees
      status: statuses[i % 3],
      recordedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    })));

    // 7. Checklists
    await db.collection('checklists').insertMany(Array.from({ length: 3 }).map((_, i) => ({
      siteId: siteIds[i],
      title: `Kiểm tra vệ sinh cuối ca ${i + 1}`,
      items: [
        { task: 'Lau dọn bàn bếp', isCompleted: true },
        { task: 'Kiểm tra nhiệt độ kho lạnh', isCompleted: false },
        { task: 'Đổ rác', isCompleted: true }
      ],
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    })));

    // 8. Corrective Actions
    await db.collection('corrective_actions').insertMany(Array.from({ length: 2 }).map((_, i) => ({
      siteId: siteIds[i],
      issueDescription: `Nhiệt độ tủ mát ${i + 1} vượt ngưỡng`,
      actionTaken: 'Đã báo kỹ thuật kiểm tra và sửa chữa',
      status: 'open',
      createdAt: new Date(),
      updatedAt: new Date()
    })));

    console.log('Seeding completed successfully!');
  } catch (error) {
    console.error('Error during seeding:', error);
  } finally {
    await client.close();
  }
}

seed();
