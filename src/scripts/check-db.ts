import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const doctors = await prisma.doctor.findMany();
  const services = await prisma.service.findMany();
  const users = await prisma.user.findMany();
  
  console.log("DOCTORS:", doctors.map(d => ({ id: d.id, name: d.name })));
  console.log("SERVICES:", services.map(s => ({ id: s.id, title: s.title })));
  console.log("USERS:", users.map(u => ({ id: u.id, email: u.email })));
}

main();
