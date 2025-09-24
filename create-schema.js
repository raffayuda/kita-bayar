import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function createSchema() {
  try {
    console.log('🔄 Starting database schema creation...');

    // Step 1: Drop existing tables and types
    console.log('1. Dropping existing tables...');
    try {
      await prisma.$executeRaw`DROP TABLE IF EXISTS "payments" CASCADE`;
      await prisma.$executeRaw`DROP TABLE IF EXISTS "bills" CASCADE`;
      await prisma.$executeRaw`DROP TABLE IF EXISTS "bill_types" CASCADE`;
      await prisma.$executeRaw`DROP TABLE IF EXISTS "residents" CASCADE`;
      await prisma.$executeRaw`DROP TABLE IF EXISTS "users" CASCADE`;
      await prisma.$executeRaw`DROP TYPE IF EXISTS "UserRole" CASCADE`;
      await prisma.$executeRaw`DROP TYPE IF EXISTS "BillStatus" CASCADE`;
      await prisma.$executeRaw`DROP TYPE IF EXISTS "PaymentStatus" CASCADE`;
      await prisma.$executeRaw`DROP TYPE IF EXISTS "PaymentMethod" CASCADE`;
    } catch (e) {
      console.log('No existing tables to drop');
    }

    // Step 2: Create enums
    console.log('2. Creating enums...');
    await prisma.$executeRaw`CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'STAFF', 'RESIDENT')`;
    await prisma.$executeRaw`CREATE TYPE "BillStatus" AS ENUM ('PENDING', 'PAID', 'OVERDUE', 'CANCELLED')`;
    await prisma.$executeRaw`CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'COMPLETED', 'FAILED', 'REFUNDED')`;
    await prisma.$executeRaw`CREATE TYPE "PaymentMethod" AS ENUM ('CASH', 'TRANSFER', 'DIGITAL_WALLET', 'CREDIT_CARD')`;

    // Step 3: Create tables
    console.log('3. Creating users table...');
    await prisma.$executeRaw`CREATE TABLE "users" (
      "id" TEXT NOT NULL,
      "email" TEXT NOT NULL,
      "username" TEXT,
      "password" TEXT NOT NULL,
      "role" "UserRole" NOT NULL DEFAULT 'RESIDENT',
      "isActive" BOOLEAN NOT NULL DEFAULT true,
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT "users_pkey" PRIMARY KEY ("id")
    )`;

    console.log('4. Creating residents table...');
    await prisma.$executeRaw`CREATE TABLE "residents" (
      "id" TEXT NOT NULL,
      "userId" TEXT NOT NULL,
      "fullName" TEXT NOT NULL,
      "phoneNumber" TEXT,
      "address" TEXT NOT NULL,
      "houseNumber" TEXT NOT NULL,
      "rtRw" TEXT,
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT "residents_pkey" PRIMARY KEY ("id")
    )`;

    console.log('5. Creating bill_types table...');
    await prisma.$executeRaw`CREATE TABLE "bill_types" (
      "id" TEXT NOT NULL,
      "name" TEXT NOT NULL,
      "description" TEXT,
      "baseAmount" DECIMAL(10,2) NOT NULL,
      "isActive" BOOLEAN NOT NULL DEFAULT true,
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT "bill_types_pkey" PRIMARY KEY ("id")
    )`;

    console.log('6. Creating bills table...');
    await prisma.$executeRaw`CREATE TABLE "bills" (
      "id" TEXT NOT NULL,
      "residentId" TEXT NOT NULL,
      "billTypeId" TEXT NOT NULL,
      "amount" DECIMAL(10,2) NOT NULL,
      "dueDate" TIMESTAMP(3) NOT NULL,
      "status" "BillStatus" NOT NULL DEFAULT 'PENDING',
      "description" TEXT,
      "period" TEXT NOT NULL,
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT "bills_pkey" PRIMARY KEY ("id")
    )`;

    console.log('7. Creating payments table...');
    await prisma.$executeRaw`CREATE TABLE "payments" (
      "id" TEXT NOT NULL,
      "residentId" TEXT NOT NULL,
      "billId" TEXT NOT NULL,
      "amount" DECIMAL(10,2) NOT NULL,
      "paymentMethod" "PaymentMethod" NOT NULL,
      "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
      "paidAt" TIMESTAMP(3),
      "receiptNumber" TEXT,
      "notes" TEXT,
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
    )`;

    // Step 4: Create constraints and indexes
    console.log('8. Creating constraints and indexes...');
    await prisma.$executeRaw`CREATE UNIQUE INDEX "users_email_key" ON "users"("email")`;
    await prisma.$executeRaw`CREATE UNIQUE INDEX "users_username_key" ON "users"("username")`;
    await prisma.$executeRaw`CREATE UNIQUE INDEX "residents_userId_key" ON "residents"("userId")`;
    await prisma.$executeRaw`CREATE UNIQUE INDEX "bill_types_name_key" ON "bill_types"("name")`;
    await prisma.$executeRaw`CREATE UNIQUE INDEX "payments_receiptNumber_key" ON "payments"("receiptNumber")`;
    await prisma.$executeRaw`CREATE UNIQUE INDEX "bills_residentId_billTypeId_period_key" ON "bills"("residentId", "billTypeId", "period")`;

    // Step 5: Add foreign keys
    console.log('9. Adding foreign key constraints...');
    await prisma.$executeRaw`ALTER TABLE "residents" ADD CONSTRAINT "residents_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`;
    await prisma.$executeRaw`ALTER TABLE "bills" ADD CONSTRAINT "bills_residentId_fkey" FOREIGN KEY ("residentId") REFERENCES "residents"("id") ON DELETE CASCADE ON UPDATE CASCADE`;
    await prisma.$executeRaw`ALTER TABLE "bills" ADD CONSTRAINT "bills_billTypeId_fkey" FOREIGN KEY ("billTypeId") REFERENCES "bill_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE`;
    await prisma.$executeRaw`ALTER TABLE "payments" ADD CONSTRAINT "payments_residentId_fkey" FOREIGN KEY ("residentId") REFERENCES "residents"("id") ON DELETE CASCADE ON UPDATE CASCADE`;
    await prisma.$executeRaw`ALTER TABLE "payments" ADD CONSTRAINT "payments_billId_fkey" FOREIGN KEY ("billId") REFERENCES "bills"("id") ON DELETE CASCADE ON UPDATE CASCADE`;

    console.log('✅ Database schema created successfully!');

  } catch (error) {
    console.error('❌ Error creating schema:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createSchema();