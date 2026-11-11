import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import connectDB from '../config/db.js';
import CmsMigrationService from '../services/CmsMigrationService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

/**
 * Executes the dedicated, safe CMS and Settings migration.
 * Backs up data before running, never overwrites existing content,
 * and safely appends missing sections.
 */
export const seedDefaultCmsPages = async () => {
  try {
    const migrationService = new CmsMigrationService();
    return await migrationService.runMigration();
  } catch (error) {
    console.error('❌ Error during CMS migration / seeding:', error.message);
    throw error;
  }
};

// Enable standalone CLI execution (e.g., node utils/seedCms.js)
if (process.argv[1] && process.argv[1].endsWith('seedCms.js')) {
  connectDB().then(async () => {
    try {
      await seedDefaultCmsPages();
      console.log('✅ Standalone CMS migration completed successfully.');
      process.exit(0);
    } catch (err) {
      console.error('❌ Standalone CMS migration failed:', err.message);
      process.exit(1);
    }
  });
}

export default seedDefaultCmsPages;
