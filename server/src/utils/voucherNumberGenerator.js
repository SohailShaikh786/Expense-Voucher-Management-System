const prisma = require('../config/prisma');

/**
 * Generates an auto-incrementing unique voucher number for the current year.
 * Format: EV-YYYY-XXXXXX (e.g., EV-2026-000101)
 */
async function generateVoucherNumber(tx = prisma) {
  const currentYear = new Date().getFullYear();
  const prefix = `EV-${currentYear}-`;

  // Find the highest voucher number with this year's prefix
  const latestVoucher = await tx.voucher.findFirst({
    where: {
      voucherNumber: {
        startsWith: prefix
      }
    },
    orderBy: {
      voucherNumber: 'desc'
    },
    select: {
      voucherNumber: true
    }
  });

  let nextSequence = 1;
  if (latestVoucher && latestVoucher.voucherNumber) {
    const parts = latestVoucher.voucherNumber.split('-');
    if (parts.length === 3) {
      const parsedSeq = parseInt(parts[2], 10);
      if (!isNaN(parsedSeq)) {
        nextSequence = parsedSeq + 1;
      }
    }
  }

  const paddedSequence = String(nextSequence).padStart(6, '0');
  return `${prefix}${paddedSequence}`;
}

module.exports = {
  generateVoucherNumber
};
