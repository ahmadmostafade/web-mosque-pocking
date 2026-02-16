import { addDonation } from "./db-donations";

/**
 * Seed the database with initial donation data
 */
export function seedDonations() {
  // Add some initial donations
  addDonation(10000, "manual", false, "Gemeinde", "system");
  addDonation(5000, "manual", true, null, "system");
  addDonation(2500, "manual", false, "Familie Müller", "system");
  addDonation(1000, "stripe", false, "Online Spender", "system");

  console.log("✓ Database seeded with initial donations");
}

// Run seed if this file is executed directly
if (require.main === module) {
  seedDonations();
}
