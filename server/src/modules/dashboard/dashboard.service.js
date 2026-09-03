const prisma = require('../../config/prisma');

class DashboardService {
  /**
   * Employee Dashboard Metrics (Own vouchers only)
   */
  async getEmployeeDashboard(userId) {
    const [counts, amountAgg, recentVouchers] = await Promise.all([
      prisma.voucher.groupBy({
        by: ['status'],
        where: { employeeId: userId },
        _count: { id: true }
      }),
      prisma.voucher.aggregate({
        where: { employeeId: userId },
        _sum: { amount: true }
      }),
      prisma.voucher.findMany({
        where: { employeeId: userId },
        orderBy: { createdAt: 'desc' },
        take: 5
      })
    ]);

    const statusCounts = {
      TOTAL: 0,
      DRAFT: 0,
      PENDING_APPROVAL: 0,
      APPROVED: 0,
      REJECTED: 0
    };

    counts.forEach((item) => {
      statusCounts[item.status] = item._count.id;
      statusCounts.TOTAL += item._count.id;
    });

    return {
      counts: statusCounts,
      totalAmountClaimed: Number(amountAgg._sum.amount || 0),
      recentVouchers
    };
  }

  /**
   * Director Dashboard Metrics
   */
  async getDirectorDashboard() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [allCounts, pendingAgg, approvedTodayCount, rejectedTodayCount, recentActivities, pendingQueue] =
      await Promise.all([
        prisma.voucher.groupBy({
          by: ['status'],
          _count: { id: true }
        }),
        prisma.voucher.aggregate({
          where: { status: 'PENDING_APPROVAL' },
          _sum: { amount: true },
          _count: { id: true }
        }),
        prisma.voucher.count({
          where: {
            status: 'APPROVED',
            approvalDate: { gte: today }
          }
        }),
        prisma.voucher.count({
          where: {
            status: 'REJECTED',
            updatedAt: { gte: today }
          }
        }),
        prisma.auditLog.findMany({
          orderBy: { timestamp: 'desc' },
          take: 8,
          include: {
            performedBy: { select: { id: true, name: true, role: true } },
            voucher: { select: { id: true, voucherNumber: true, expenseTitle: true, amount: true } }
          }
        }),
        prisma.voucher.findMany({
          where: { status: 'PENDING_APPROVAL' },
          include: {
            employee: { select: { id: true, name: true, department: true } }
          },
          orderBy: { submittedAt: 'asc' },
          take: 5
        })
      ]);

    const statusCounts = {
      TOTAL: 0,
      DRAFT: 0,
      PENDING_APPROVAL: 0,
      APPROVED: 0,
      REJECTED: 0
    };

    allCounts.forEach((item) => {
      statusCounts[item.status] = item._count.id;
      statusCounts.TOTAL += item._count.id;
    });

    return {
      counts: statusCounts,
      pendingCount: pendingAgg._count.id || 0,
      pendingAmount: Number(pendingAgg._sum.amount || 0),
      approvedToday: approvedTodayCount,
      rejectedToday: rejectedTodayCount,
      recentActivities,
      pendingQueue
    };
  }

  /**
   * Accounts Team Dashboard Metrics (Organization-wide)
   */
  async getAccountsDashboard() {
    const [allCounts, approvedAgg, totalApprovedAmount, recentApprovedVouchers, categoryBreakdown] =
      await Promise.all([
        prisma.voucher.groupBy({
          by: ['status'],
          _count: { id: true }
        }),
        prisma.voucher.aggregate({
          where: { status: 'APPROVED' },
          _sum: { amount: true },
          _count: { id: true }
        }),
        prisma.voucher.aggregate({
          _sum: { amount: true }
        }),
        prisma.voucher.findMany({
          where: { status: 'APPROVED' },
          include: {
            employee: { select: { id: true, name: true, department: true } },
            director: { select: { id: true, name: true } }
          },
          orderBy: { approvalDate: 'desc' },
          take: 6
        }),
        prisma.voucher.groupBy({
          by: ['expenseCategory'],
          where: { status: 'APPROVED' },
          _sum: { amount: true },
          _count: { id: true }
        })
      ]);

    const statusCounts = {
      TOTAL: 0,
      DRAFT: 0,
      PENDING_APPROVAL: 0,
      APPROVED: 0,
      REJECTED: 0
    };

    allCounts.forEach((item) => {
      statusCounts[item.status] = item._count.id;
      statusCounts.TOTAL += item._count.id;
    });

    return {
      counts: statusCounts,
      totalApprovedAmount: Number(approvedAgg._sum.amount || 0),
      totalExpenseAmount: Number(totalApprovedAmount._sum.amount || 0),
      recentApprovedVouchers,
      categoryBreakdown: categoryBreakdown.map((c) => ({
        category: c.expenseCategory,
        count: c._count.id,
        totalAmount: Number(c._sum.amount || 0)
      }))
    };
  }
}

module.exports = new DashboardService();
