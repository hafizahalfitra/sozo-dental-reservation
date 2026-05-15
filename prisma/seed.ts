import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  await prisma.doctor.createMany({
    data: [
      {
        name: "drg. Sarah Wijaya",
        specialty: "Orthodontist",
      },
      {
        name: "drg. Michael Tan",
        specialty: "General Dentist",
      },
      {
        name: "drg. Amanda Lee",
        specialty: "Dental Surgeon",
      },
    ],
  })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })