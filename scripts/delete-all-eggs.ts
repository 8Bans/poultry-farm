import { config } from 'dotenv';
import { resolve } from 'path';

// Load environment variables
config({ path: resolve(process.cwd(), '.env.local') });

async function deleteAllEggs() {
  try {
    console.log('Starting egg data deletion...\n');

    // Dynamic import to avoid issues
    const { default: connectDB } = await import('../lib/db/mongodb');
    const { default: Egg } = await import('../lib/models/Egg');

    // Connect to database
    await connectDB();
    console.log('✓ Connected to database');

    // Count eggs before deletion
    const countBefore = await Egg.countDocuments();
    console.log(`✓ Found ${countBefore} egg records`);

    if (countBefore === 0) {
      console.log('\nNo egg records to delete.');
      process.exit(0);
    }

    // Confirm deletion
    console.log('\n⚠️  WARNING: This will delete ALL egg records!');
    console.log('Press Ctrl+C now to cancel...\n');

    // Wait 3 seconds before proceeding
    await new Promise((resolve) => setTimeout(resolve, 3000));

    // Delete all eggs
    const result = await Egg.deleteMany({});
    console.log(`✓ Deleted ${result.deletedCount} egg records`);

    // Verify deletion
    const countAfter = await Egg.countDocuments();
    console.log(`✓ Remaining egg records: ${countAfter}`);

    console.log('\n✅ Egg data deletion completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error deleting egg data:', error);
    process.exit(1);
  }
}

deleteAllEggs();
