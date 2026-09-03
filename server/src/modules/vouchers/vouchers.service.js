const prisma = require('../../config/prisma');
const { generateVoucherNumber } = require('../../utils/voucherNumberGenerator');
const storageService = require('../../utils/storageService');

class VouchersService {
  /**
   * Create a new voucher (Defaults to DRAFT)
   */
  async createVoucher(userId, data) {
    let signatureUrl = data.employeeSignatureUrl || null;

    if (data.signatureBase64) {
      signatureUrl = await storageService.saveBase64Signature(data.signatureBase64, 'emp');
    }

    const voucher = await prisma.$transaction(async (tx) => {
      const voucherNumber = await generateVoucherNumber(tx);

      const newVoucher = await tx.voucher.create({
        data: {
          voucherNumber,
          departmentName: data.departmentName,
          expenseTitle: data.expenseTitle,
          expenseDate: new Date(data.expenseDate),
          expenseCategory: data.expenseCategory || 'OTHER',
          expenseDescription: data.expenseDescription || null,
          amount: data.amount,
          status: 'DRAFT',
          employeeId: userId,
          employeeSignatureUrl: signatureUrl
        },
        include: {
          employee: {
            select: { id: true, name: true, email: true, department: true }
          }
        }
      });

      await tx.auditLog.create({
        data: {
          voucherId: newVoucher.id,
          action: 'CREATED',
          performedById: userId,
          notes: signatureUrl ? 'Draft voucher created with signature' : 'Draft voucher created'
        }
      });

      return newVoucher;
    });

    return voucher;
  }

  /**
   * Update an existing voucher (Employee only, DRAFT only)
   */
  async updateVoucher(voucherId, userId, data) {
    const existing = await prisma.voucher.findUnique({
      where: { id: voucherId }
    });

    if (!existing) {
      const error = new Error('Voucher not found.');
      error.statusCode = 404;
      throw error;
    }

    if (existing.employeeId !== userId) {
      const error = new Error('Forbidden: You can only edit vouchers you created.');
      error.statusCode = 403;
      throw error;
    }

    if (existing.status !== 'DRAFT') {
      const error = new Error(`Cannot edit voucher with status '${existing.status}'. Only DRAFT vouchers can be modified.`);
      error.statusCode = 400;
      throw error;
    }

    let signatureUrl = data.employeeSignatureUrl !== undefined ? data.employeeSignatureUrl : existing.employeeSignatureUrl;
    if (data.signatureBase64) {
      signatureUrl = await storageService.saveBase64Signature(data.signatureBase64, 'emp');
    }

    const updated = await prisma.$transaction(async (tx) => {
      const v = await tx.voucher.update({
        where: { id: voucherId },
        data: {
          ...(data.departmentName && { departmentName: data.departmentName }),
          ...(data.expenseTitle && { expenseTitle: data.expenseTitle }),
          ...(data.expenseDate && { expenseDate: new Date(data.expenseDate) }),
          ...(data.expenseCategory && { expenseCategory: data.expenseCategory }),
          ...(data.expenseDescription !== undefined && { expenseDescription: data.expenseDescription }),
          ...(data.amount !== undefined && { amount: data.amount }),
          employeeSignatureUrl: signatureUrl
        },
        include: {
          employee: {
            select: { id: true, name: true, email: true, department: true }
          }
        }
      });

      await tx.auditLog.create({
        data: {
          voucherId: v.id,
          action: 'UPDATED',
          performedById: userId,
          notes: 'Voucher draft details updated'
        }
      });

      return v;
    });

    return updated;
  }

  /**
   * Delete a draft voucher (Employee only, DRAFT only)
   */
  async deleteVoucher(voucherId, userId) {
    const existing = await prisma.voucher.findUnique({
      where: { id: voucherId }
    });

    if (!existing) {
      const error = new Error('Voucher not found.');
      error.statusCode = 404;
      throw error;
    }

    if (existing.employeeId !== userId) {
      const error = new Error('Forbidden: You can only delete vouchers you created.');
      error.statusCode = 403;
      throw error;
    }

    if (existing.status !== 'DRAFT') {
      const error = new Error(`Cannot delete voucher with status '${existing.status}'. Only DRAFT vouchers can be deleted.`);
      error.statusCode = 400;
      throw error;
    }

    if (existing.employeeSignatureUrl) {
      await storageService.deleteFile(existing.employeeSignatureUrl);
    }

    await prisma.voucher.delete({
      where: { id: voucherId }
    });

    return { message: 'Draft voucher deleted successfully.' };
  }

  /**
   * Attach / update signature image via upload
   */
  async attachSignature(voucherId, user, signatureUrl) {
    const voucher = await prisma.voucher.findUnique({
      where: { id: voucherId }
    });

    if (!voucher) {
      const error = new Error('Voucher not found.');
      error.statusCode = 404;
      throw error;
    }

    if (user.role === 'EMPLOYEE') {
      if (voucher.employeeId !== user.id) {
        const error = new Error('Forbidden: You can only upload signatures for your own vouchers.');
        error.statusCode = 403;
        throw error;
      }
      if (voucher.status !== 'DRAFT') {
        const error = new Error('Signatures can only be added or replaced when voucher is in DRAFT status.');
        error.statusCode = 400;
        throw error;
      }

      const updated = await prisma.voucher.update({
        where: { id: voucherId },
        data: { employeeSignatureUrl: signatureUrl }
      });

      await prisma.auditLog.create({
        data: {
          voucherId,
          action: 'SIGNATURE_ATTACHED',
          performedById: user.id,
          notes: 'Employee signature attached'
        }
      });

      return updated;
    }

    if (user.role === 'DIRECTOR') {
      const updated = await prisma.voucher.update({
        where: { id: voucherId },
        data: { directorSignatureUrl: signatureUrl }
      });
      return updated;
    }

    const error = new Error('Forbidden: Role is not authorized to attach signatures.');
    error.statusCode = 403;
    throw error;
  }

  /**
   * Submit voucher for approval (Transitions DRAFT -> PENDING_APPROVAL)
   */
  async submitVoucher(voucherId, userId) {
    const voucher = await prisma.voucher.findUnique({
      where: { id: voucherId }
    });

    if (!voucher) {
      const error = new Error('Voucher not found.');
      error.statusCode = 404;
      throw error;
    }

    if (voucher.employeeId !== userId) {
      const error = new Error('Forbidden: You can only submit your own vouchers.');
      error.statusCode = 403;
      throw error;
    }

    if (voucher.status !== 'DRAFT') {
      const error = new Error(`Voucher is currently in '${voucher.status}' status and cannot be resubmitted.`);
      error.statusCode = 400;
      throw error;
    }

    if (!voucher.employeeSignatureUrl) {
      const error = new Error('Employee signature is mandatory before submitting a voucher for approval.');
      error.statusCode = 400;
      throw error;
    }

    const submitted = await prisma.$transaction(async (tx) => {
      const updated = await tx.voucher.update({
        where: { id: voucherId },
        data: {
          status: 'PENDING_APPROVAL',
          submittedAt: new Date()
        },
        include: {
          employee: {
            select: { id: true, name: true, email: true, department: true }
          }
        }
      });

      await tx.auditLog.create({
        data: {
          voucherId,
          action: 'SUBMITTED',
          performedById: userId,
          notes: 'Voucher submitted for Director approval'
        }
      });

      return updated;
    });

    return submitted;
  }

  /**
   * Approve voucher (Director only, status must be PENDING_APPROVAL)
   */
  async approveVoucher(voucherId, directorId, { signatureBase64, directorSignatureUrl }) {
    const voucher = await prisma.voucher.findUnique({
      where: { id: voucherId }
    });

    if (!voucher) {
      const error = new Error('Voucher not found.');
      error.statusCode = 404;
      throw error;
    }

    if (voucher.status !== 'PENDING_APPROVAL') {
      const error = new Error(`Cannot approve voucher with status '${voucher.status}'. Only PENDING_APPROVAL vouchers can be approved.`);
      error.statusCode = 400;
      throw error;
    }

    let finalSigUrl = directorSignatureUrl || voucher.directorSignatureUrl;
    if (signatureBase64) {
      finalSigUrl = await storageService.saveBase64Signature(signatureBase64, 'dir');
    }

    if (!finalSigUrl) {
      const error = new Error('Director signature is mandatory to approve this voucher.');
      error.statusCode = 400;
      throw error;
    }

    const approved = await prisma.$transaction(async (tx) => {
      const updated = await tx.voucher.update({
        where: { id: voucherId },
        data: {
          status: 'APPROVED',
          directorId,
          directorSignatureUrl: finalSigUrl,
          approvalDate: new Date(),
          rejectionReason: null
        },
        include: {
          employee: { select: { id: true, name: true, email: true, department: true } },
          director: { select: { id: true, name: true, email: true } }
        }
      });

      await tx.auditLog.create({
        data: {
          voucherId,
          action: 'APPROVED',
          performedById: directorId,
          notes: 'Voucher approved with Director signature'
        }
      });

      return updated;
    });

    return approved;
  }

  /**
   * Reject voucher (Director only, status must be PENDING_APPROVAL)
   */
  async rejectVoucher(voucherId, directorId, rejectionReason) {
    if (!rejectionReason || !rejectionReason.trim()) {
      const error = new Error('A rejection reason is mandatory when rejecting a voucher.');
      error.statusCode = 400;
      throw error;
    }

    const voucher = await prisma.voucher.findUnique({
      where: { id: voucherId }
    });

    if (!voucher) {
      const error = new Error('Voucher not found.');
      error.statusCode = 404;
      throw error;
    }

    if (voucher.status !== 'PENDING_APPROVAL') {
      const error = new Error(`Cannot reject voucher with status '${voucher.status}'. Only PENDING_APPROVAL vouchers can be rejected.`);
      error.statusCode = 400;
      throw error;
    }

    const rejected = await prisma.$transaction(async (tx) => {
      const updated = await tx.voucher.update({
        where: { id: voucherId },
        data: {
          status: 'REJECTED',
          directorId,
          rejectionReason: rejectionReason.trim(),
          approvalDate: null
        },
        include: {
          employee: { select: { id: true, name: true, email: true, department: true } },
          director: { select: { id: true, name: true, email: true } }
        }
      });

      await tx.auditLog.create({
        data: {
          voucherId,
          action: 'REJECTED',
          performedById: directorId,
          notes: rejectionReason.trim()
        }
      });

      return updated;
    });

    return rejected;
  }

  /**
   * Get voucher details with role-based ownership verification
   */
  async getVoucherById(voucherId, user) {
    const voucher = await prisma.voucher.findUnique({
      where: { id: voucherId },
      include: {
        employee: {
          select: { id: true, name: true, email: true, department: true }
        },
        director: {
          select: { id: true, name: true, email: true, department: true }
        },
        auditLogs: {
          include: {
            performedBy: {
              select: { id: true, name: true, role: true, email: true }
            }
          },
          orderBy: { timestamp: 'asc' }
        }
      }
    });

    if (!voucher) {
      const error = new Error('Voucher not found.');
      error.statusCode = 404;
      throw error;
    }

    // Role-based boundary: Employees can only view their own vouchers!
    if (user.role === 'EMPLOYEE' && voucher.employeeId !== user.id) {
      const error = new Error('Forbidden: You do not have permission to view this voucher.');
      error.statusCode = 403;
      throw error;
    }

    return voucher;
  }

  /**
   * List vouchers with search, filter, sort, pagination, and role awareness
   */
  async listVouchers(user, query) {
    const {
      search,
      status,
      department,
      category,
      dateFrom,
      dateTo,
      amountMin,
      amountMax,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      page = 1,
      limit = 10
    } = query;

    const pageNum = Math.max(1, parseInt(page, 10));
    const pageSize = Math.max(1, Math.min(100, parseInt(limit, 10)));
    const skip = (pageNum - 1) * pageSize;

    const where = {};

    // 1. Enforce Role Isolation
    if (user.role === 'EMPLOYEE') {
      where.employeeId = user.id;
    }

    // 2. Filters
    if (status) {
      where.status = status;
    }

    if (category) {
      where.expenseCategory = category;
    }

    if (department) {
      where.departmentName = {
        contains: department,
        mode: 'insensitive'
      };
    }

    if (dateFrom || dateTo) {
      where.expenseDate = {};
      if (dateFrom) {
        where.expenseDate.gte = new Date(dateFrom);
      }
      if (dateTo) {
        const to = new Date(dateTo);
        to.setHours(23, 59, 59, 999);
        where.expenseDate.lte = to;
      }
    }

    if (amountMin !== undefined || amountMax !== undefined) {
      where.amount = {};
      if (amountMin !== undefined && amountMin !== '') {
        where.amount.gte = parseFloat(amountMin);
      }
      if (amountMax !== undefined && amountMax !== '') {
        where.amount.lte = parseFloat(amountMax);
      }
    }

    // 3. Search query across title, number, department, desc, employee name
    if (search && search.trim()) {
      const term = search.trim();
      where.OR = [
        { voucherNumber: { contains: term, mode: 'insensitive' } },
        { expenseTitle: { contains: term, mode: 'insensitive' } },
        { expenseDescription: { contains: term, mode: 'insensitive' } },
        { departmentName: { contains: term, mode: 'insensitive' } },
        { employee: { name: { contains: term, mode: 'insensitive' } } }
      ];
    }

    // 4. Sorting
    const orderBy = {};
    const validSortFields = ['createdAt', 'voucherDate', 'expenseDate', 'amount', 'voucherNumber', 'status'];
    const sortField = validSortFields.includes(sortBy) ? sortBy : 'createdAt';
    orderBy[sortField] = sortOrder.toLowerCase() === 'asc' ? 'asc' : 'desc';

    const [totalCount, vouchers] = await Promise.all([
      prisma.voucher.count({ where }),
      prisma.voucher.findMany({
        where,
        include: {
          employee: {
            select: { id: true, name: true, email: true, department: true }
          },
          director: {
            select: { id: true, name: true, email: true }
          }
        },
        orderBy,
        skip,
        take: pageSize
      })
    ]);

    const totalPages = Math.ceil(totalCount / pageSize) || 1;

    return {
      vouchers,
      pagination: {
        page: pageNum,
        limit: pageSize,
        totalCount,
        totalPages,
        hasPrevPage: pageNum > 1,
        hasNextPage: pageNum < totalPages
      }
    };
  }
}

module.exports = new VouchersService();
