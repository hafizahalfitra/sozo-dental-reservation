import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.appointment.deleteMany();
  await prisma.doctor.deleteMany();
  await prisma.service.deleteMany();
  await prisma.user.deleteMany();

  console.log("Database cleared.");

  // Create Admin User
  const adminPassword = await bcrypt.hash("admin123", 12);
  await prisma.user.create({
    data: {
      name: "Super Admin",
      email: "admin@sozo.com",
      password: adminPassword,
      role: "ADMIN",
    },
  });

  console.log("Admin user created (admin@sozo.com / admin123).");

  // Create Sample Doctors
  const doctors = await Promise.all([
    prisma.doctor.create({
      data: {
        name: "drg. Sarah Wijaya",
        specialization: "Orthodontist",
        experience: 12,
        image: "https://images.unsplash.com/photo-1559839734-2b71f1536783?q=80&w=1170&auto=format&fit=crop",
        available: true,
      },
    }),
    prisma.doctor.create({
      data: {
        name: "drg. Michael Tan",
        specialization: "General Dentist",
        experience: 8,
        image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=1170&auto=format&fit=crop",
        available: true,
      },
    }),
    prisma.doctor.create({
      data: {
        name: "drg. Amanda Lee",
        specialization: "Dental Surgeon",
        experience: 15,
        image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?q=80&w=1170&auto=format&fit=crop",
        available: true,
      },
    }),
  ]);

  console.log(`${doctors.length} doctors created.`);

  // Create Sample Services
  const services = await Promise.all([
    prisma.service.create({
      data: {
        title: "Teeth Whitening",
        description: "Professional whitening for a brighter smile.",
        duration: 45,
        price: 1500000,
      },
    }),
    prisma.service.create({
      data: {
        title: "Dental Implants",
        description: "Permanent replacement for missing teeth.",
        duration: 120,
        price: 15000000,
      },
    }),
    prisma.service.create({
      data: {
        title: "General Checkup",
        description: "Routine examination and cleaning.",
        duration: 30,
        price: 350000,
      },
    }),
    prisma.service.create({
      data: {
        title: "Braces Consultation",
        description: "Consultation for orthodontic treatment.",
        duration: 30,
        price: 500000,
      },
    }),
  ]);

  console.log(`${services.length} services created.`);

  console.log("Seeding completed successfully.");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });