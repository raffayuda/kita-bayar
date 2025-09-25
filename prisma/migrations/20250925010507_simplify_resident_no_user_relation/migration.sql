/*
  Warnings:

  - The values [UNPAID,PARTIALLY_PAID] on the enum `BillStatus` will be removed. If these variants are still used in the database, this will fail.
  - The values [BANK_TRANSFER,CHECK] on the enum `PaymentMethod` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `amount` on the `bill_types` table. All the data in the column will be lost.
  - You are about to drop the column `amount` on the `bills` table. All the data in the column will be lost.
  - You are about to drop the column `period` on the `bills` table. All the data in the column will be lost.
  - You are about to drop the column `paymentDate` on the `payments` table. All the data in the column will be lost.
  - You are about to alter the column `amount` on the `payments` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(10,2)`.
  - You are about to drop the column `userId` on the `residents` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `users` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[categoryId,name]` on the table `bill_types` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[residentId,billTypeId,periodId]` on the table `bills` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[username]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `baseAmount` to the `bill_types` table without a default value. This is not possible if the table is not empty.
  - Added the required column `categoryId` to the `bill_types` table without a default value. This is not possible if the table is not empty.
  - Added the required column `periodId` to the `bills` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalAmount` to the `bills` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."PaymentStatus" AS ENUM ('PENDING', 'COMPLETED', 'FAILED', 'REFUNDED');

-- AlterEnum
BEGIN;
CREATE TYPE "public"."BillStatus_new" AS ENUM ('PENDING', 'PAID', 'OVERDUE', 'CANCELLED');
ALTER TABLE "public"."bills" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "public"."bills" ALTER COLUMN "status" TYPE "public"."BillStatus_new" USING ("status"::text::"public"."BillStatus_new");
ALTER TYPE "public"."BillStatus" RENAME TO "BillStatus_old";
ALTER TYPE "public"."BillStatus_new" RENAME TO "BillStatus";
DROP TYPE "public"."BillStatus_old";
ALTER TABLE "public"."bills" ALTER COLUMN "status" SET DEFAULT 'PENDING';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "public"."PaymentMethod_new" AS ENUM ('CASH', 'TRANSFER', 'DIGITAL_WALLET', 'CREDIT_CARD');
ALTER TABLE "public"."payments" ALTER COLUMN "paymentMethod" DROP DEFAULT;
ALTER TABLE "public"."payments" ALTER COLUMN "paymentMethod" TYPE "public"."PaymentMethod_new" USING ("paymentMethod"::text::"public"."PaymentMethod_new");
ALTER TYPE "public"."PaymentMethod" RENAME TO "PaymentMethod_old";
ALTER TYPE "public"."PaymentMethod_new" RENAME TO "PaymentMethod";
DROP TYPE "public"."PaymentMethod_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "public"."payments" DROP CONSTRAINT "payments_billId_fkey";

-- DropForeignKey
ALTER TABLE "public"."payments" DROP CONSTRAINT "payments_residentId_fkey";

-- DropForeignKey
ALTER TABLE "public"."residents" DROP CONSTRAINT "residents_userId_fkey";

-- DropIndex
DROP INDEX "public"."bill_types_name_key";

-- DropIndex
DROP INDEX "public"."bills_residentId_billTypeId_period_key";

-- DropIndex
DROP INDEX "public"."residents_identityCard_key";

-- DropIndex
DROP INDEX "public"."residents_userId_key";

-- AlterTable
ALTER TABLE "public"."bill_types" DROP COLUMN "amount",
ADD COLUMN     "baseAmount" DECIMAL(10,2) NOT NULL,
ADD COLUMN     "categoryId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."bills" DROP COLUMN "amount",
DROP COLUMN "period",
ADD COLUMN     "installments" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "paidAmount" DECIMAL(10,2) NOT NULL DEFAULT 0,
ADD COLUMN     "periodId" TEXT NOT NULL,
ADD COLUMN     "totalAmount" DECIMAL(10,2) NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "public"."payments" DROP COLUMN "paymentDate",
ADD COLUMN     "installmentNum" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "paidAt" TIMESTAMP(3),
ADD COLUMN     "status" "public"."PaymentStatus" NOT NULL DEFAULT 'PENDING',
ALTER COLUMN "amount" SET DATA TYPE DECIMAL(10,2),
ALTER COLUMN "paymentMethod" DROP DEFAULT;

-- AlterTable
ALTER TABLE "public"."residents" DROP COLUMN "userId",
ADD COLUMN     "email" TEXT,
ALTER COLUMN "address" DROP NOT NULL,
ALTER COLUMN "identityCard" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."users" DROP COLUMN "name",
ADD COLUMN     "username" TEXT,
ALTER COLUMN "role" SET DEFAULT 'ADMIN';

-- CreateTable
CREATE TABLE "public"."bill_categories" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "color" TEXT NOT NULL DEFAULT '#3B82F6',
    "icon" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "bill_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."bill_periods" (
    "id" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "bill_periods_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "bill_categories_name_key" ON "public"."bill_categories"("name");

-- CreateIndex
CREATE UNIQUE INDEX "bill_periods_categoryId_name_key" ON "public"."bill_periods"("categoryId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "bill_types_categoryId_name_key" ON "public"."bill_types"("categoryId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "bills_residentId_billTypeId_periodId_key" ON "public"."bills"("residentId", "billTypeId", "periodId");

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "public"."users"("username");

-- AddForeignKey
ALTER TABLE "public"."bill_types" ADD CONSTRAINT "bill_types_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "public"."bill_categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."bill_periods" ADD CONSTRAINT "bill_periods_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "public"."bill_categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."bills" ADD CONSTRAINT "bills_periodId_fkey" FOREIGN KEY ("periodId") REFERENCES "public"."bill_periods"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."payments" ADD CONSTRAINT "payments_residentId_fkey" FOREIGN KEY ("residentId") REFERENCES "public"."residents"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."payments" ADD CONSTRAINT "payments_billId_fkey" FOREIGN KEY ("billId") REFERENCES "public"."bills"("id") ON DELETE CASCADE ON UPDATE CASCADE;
