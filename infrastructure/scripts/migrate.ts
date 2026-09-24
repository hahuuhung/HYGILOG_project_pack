import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/hygilog';

interface Migration {
  name: string;
  up: (db: any) => Promise<void>;
  down: (db: any) => Promise<void>;
}

const migrations: Migration[] = [
  {
    name: '001-add-indexes',
    up: async (db) => {
      await db.collection('users').createIndex({ email: 1 }, { unique: true });
      await db.collection('users').createIndex({ organizationId: 1 });
      await db.collection('sites').createIndex({ organizationId: 1 });
      await db.collection('temperatures').createIndex({ siteId: 1, recordedAt: -1 });
    },
    down: async (db) => {
      await db.collection('users').dropIndex('email_1');
      await db.collection('users').dropIndex('organizationId_1');
      await db.collection('sites').dropIndex('organizationId_1');
      await db.collection('temperatures').dropIndex('siteId_1_recordedAt_-1');
    }
  }
];

async function runMigrations() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db();
    const migrationsCollection = db.collection('migrations');

    const applied = await migrationsCollection.find({}).toArray();
    const appliedNames = new Set(applied.map(m => m.name));

    for (const migration of migrations) {
      if (!appliedNames.has(migration.name)) {
        console.log(`Running migration: ${migration.name}`);
        await migration.up(db);
        await migrationsCollection.insertOne({ name: migration.name, appliedAt: new Date() });
        console.log(`Migration ${migration.name} completed.`);
      }
    }
    console.log('All migrations applied successfully.');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await client.close();
  }
}

runMigrations();
