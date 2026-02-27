import { addDonation } from "./db-donations";
import { ensureInitialized } from "./db";

/**
 * Seed the database with initial donation data
 */
export async function seedDonations() {
  await ensureInitialized();

  // Add some initial donations
  await addDonation(10000, "manual", false, "Gemeinde", "system");
  await addDonation(5000, "manual", true, null, "system");
  await addDonation(2500, "manual", false, "Familie Müller", "system");
  await addDonation(1000, "stripe", false, "Online Spender", "system");

  console.log("✓ Database seeded with initial donations");
}

// Run seed if this file is executed directly
seedDonations().catch(console.error);
