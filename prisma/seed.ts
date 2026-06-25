// Seed script: creates a seeded admin + a non-admin viewer, and loads the 8
// Austin Leads prospects. Idempotent via upserts — safe to re-run.
//
// Credentials are read from env (see .env.example) with safe local defaults:
//   ADMIN_EMAIL / ADMIN_PASSWORD  (role: admin)
//   USER_EMAIL  / USER_PASSWORD   (role: user)

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { AUSTIN_LEADS } from "../src/lib/data/austin-leads";

const prisma = new PrismaClient();

async function upsertUser(email: string, password: string, role: "admin" | "user") {
  const passwordHash = await bcrypt.hash(password, 10);
  await prisma.user.upsert({
    where: { email },
    update: { role, passwordHash },
    create: { email, role, passwordHash },
  });
  console.log(`  user: ${email} (${role})`);
}

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL || "admin@localsite.ai";
  const adminPassword = process.env.ADMIN_PASSWORD || "admin1234";
  const userEmail = process.env.USER_EMAIL || "viewer@localsite.ai";
  const userPassword = process.env.USER_PASSWORD || "viewer1234";

  console.log("Seeding users...");
  await upsertUser(adminEmail, adminPassword, "admin");
  await upsertUser(userEmail, userPassword, "user");

  console.log("Seeding prospects...");
  for (const p of AUSTIN_LEADS) {
    await prisma.prospect.upsert({
      where: {
        businessName_address: {
          businessName: p.businessName,
          address: p.address,
        },
      },
      update: {
        phone: p.phone,
        category: p.category,
        rating: p.rating,
        reviewCount: p.reviewCount,
        hours: p.hours,
        topReviews: p.topReviews,
        mapsUrl: p.mapsUrl,
        hasWebsite: p.hasWebsite,
        websiteUrl: p.websiteUrl,
        builtSiteUrl: p.builtSiteUrl ?? null,
        status: p.status ?? "new",
        scrapeSource: "seed",
        scrapedAt: new Date(),
      },
      create: {
        businessName: p.businessName,
        phone: p.phone,
        category: p.category,
        rating: p.rating,
        reviewCount: p.reviewCount,
        address: p.address,
        hours: p.hours,
        topReviews: p.topReviews,
        mapsUrl: p.mapsUrl,
        hasWebsite: p.hasWebsite,
        websiteUrl: p.websiteUrl,
        builtSiteUrl: p.builtSiteUrl ?? null,
        status: p.status ?? "new",
        scrapeSource: "seed",
        scrapedAt: new Date(),
      },
    });
    console.log(`  prospect: ${p.businessName}`);
  }

  console.log("Seed complete.");
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

