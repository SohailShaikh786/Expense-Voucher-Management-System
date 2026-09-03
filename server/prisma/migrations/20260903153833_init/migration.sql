-- CreateEnum
CREATE TYPE "Role" AS ENUM ('EMPLOYEE', 'DIRECTOR', 'ACCOUNTS');

-- CreateEnum
CREATE TYPE "VoucherStatus" AS ENUM ('DRAFT', 'PENDING_APPROVAL', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "ExpenseCategory" AS ENUM ('TRAVEL', 'FOOD', 'ACCOMMODATION', 'OFFICE_SUPPLIES', 'EQUIPMENT', 'UTILITIES', 'TRAINING', 'OTHER');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'EMPLOYEE',
    "department" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vouchers" (
    "id" TEXT NOT NULL,
    "voucherNumber" TEXT NOT NULL,
    "voucherDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expenseDate" TIMESTAMP(3) NOT NULL,
    "departmentName" TEXT NOT NULL,
    "expenseTitle" TEXT NOT NULL,
    "expenseCategory" "ExpenseCategory" NOT NULL DEFAULT 'OTHER',
    "expenseDescription" TEXT,
    "amount" DECIMAL(12,2) NOT NULL,
    "status" "VoucherStatus" NOT NULL DEFAULT 'DRAFT',
    "employeeId" TEXT NOT NULL,
    "employeeSignatureUrl" TEXT,
    "directorId" TEXT,
    "directorSignatureUrl" TEXT,
    "submittedAt" TIMESTAMP(3),
    "approvalDate" TIMESTAMP(3),
    "rejectionReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "vouchers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" TEXT NOT NULL,
    "voucherId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "performedById" TEXT NOT NULL,
    "notes" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "vouchers_voucherNumber_key" ON "vouchers"("voucherNumber");

-- CreateIndex
CREATE INDEX "vouchers_status_idx" ON "vouchers"("status");

-- CreateIndex
CREATE INDEX "vouchers_employeeId_idx" ON "vouchers"("employeeId");

-- CreateIndex
CREATE INDEX "vouchers_voucherNumber_idx" ON "vouchers"("voucherNumber");

-- CreateIndex
CREATE INDEX "audit_logs_voucherId_idx" ON "audit_logs"("voucherId");

-- AddForeignKey
ALTER TABLE "vouchers" ADD CONSTRAINT "vouchers_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vouchers" ADD CONSTRAINT "vouchers_directorId_fkey" FOREIGN KEY ("directorId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_voucherId_fkey" FOREIGN KEY ("voucherId") REFERENCES "vouchers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_performedById_fkey" FOREIGN KEY ("performedById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
