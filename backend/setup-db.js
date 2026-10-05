import { initializeDatabase } from './db.js';

try {
  await initializeDatabase();
  console.log('\n✓ Database setup complete.');
  process.exit(0);
} catch (error) {
  console.error('\n✗ Database setup failed.');
  console.error(error?.stack || error?.message || error);
  console.error('Start MySQL in XAMPP and run `npm run setup-db` again.');
  process.exit(1);
}
