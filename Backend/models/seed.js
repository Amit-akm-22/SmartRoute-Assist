// models/seed.js
import Zone from "./zone.js";

const zonesData = [
  { name: "Mahakaleshwar Mandir", location_info: "23.1740° N, 75.7901° E" },
  { name: "Ram Ghat", location_info: "23.1748° N, 75.7950° E" },
  { name: "Kshipra Bridge", location_info: "23.1765° N, 75.7970° E" },
  { name: "Harsiddhi Mandir", location_info: "23.1772° N, 75.7905° E" },
  { name: "Bada Ganesh Mandir", location_info: "23.1755° N, 75.7885° E" },
  { name: "Kal Bhairav Mandir", location_info: "23.1730° N, 75.7880° E" },
];
const seed = async () => {
  try {
    console.log("Starting database seeding...");

    // Seed zones efficiently
    for (const zone of zonesData) {
      await Zone.findOneAndUpdate({ name: zone.name }, zone, { upsert: true });
    }
    console.log("Zones seeded successfully");

    console.log("Seeding completed!");
  } catch (error) {
    console.error("Seeding error:", error);
  }
};
export default seed;
