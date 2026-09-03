const { PrismaClient, Role, VoucherStatus, ExpenseCategory } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Clearing existing data...');
  await prisma.auditLog.deleteMany({});
  await prisma.voucher.deleteMany({});
  await prisma.user.deleteMany({});

  console.log('Seeding users...');
  const directorPassword = await bcrypt.hash('Director@123', 10);
  const accountsPassword = await bcrypt.hash('Accounts@123', 10);
  const employeePassword = await bcrypt.hash('Employee@123', 10);

  const director = await prisma.user.create({
    data: {
      name: 'Sarah Jenkins',
      email: 'director@abccompany.com',
      passwordHash: directorPassword,
      role: Role.DIRECTOR,
      department: 'Executive Management'
    }
  });

  const accounts = await prisma.user.create({
    data: {
      name: 'David Miller',
      email: 'accounts@abccompany.com',
      passwordHash: accountsPassword,
      role: Role.ACCOUNTS,
      department: 'Finance & Accounts'
    }
  });

  const empJohn = await prisma.user.create({
    data: {
      name: 'John Doe',
      email: 'john.doe@abccompany.com',
      passwordHash: employeePassword,
      role: Role.EMPLOYEE,
      department: 'Engineering'
    }
  });

  const empJane = await prisma.user.create({
    data: {
      name: 'Jane Smith',
      email: 'jane.smith@abccompany.com',
      passwordHash: employeePassword,
      role: Role.EMPLOYEE,
      department: 'Marketing'
    }
  });

  const empBob = await prisma.user.create({
    data: {
      name: 'Bob Wilson',
      email: 'bob.wilson@abccompany.com',
      passwordHash: employeePassword,
      role: Role.EMPLOYEE,
      department: 'Sales'
    }
  });

  console.log('Seeding sample vouchers...');
  const empSig = '/uploads/signatures/sample-emp-sig.png';
  const dirSig = '/uploads/signatures/sample-dir-sig.png';

  const vouchersData = [
    // 1. DRAFT - John (no signature yet)
    {
      voucherNumber: 'EV-2026-000101',
      voucherDate: new Date('2026-08-20'),
      expenseDate: new Date('2026-08-18'),
      departmentName: 'Engineering',
      expenseTitle: 'AWS Cloud Architecture Certification Exam',
      expenseCategory: ExpenseCategory.TRAINING,
      expenseDescription: 'AWS Certified Solutions Architect Professional exam registration fee and official study guide.',
      amount: 320.00,
      status: VoucherStatus.DRAFT,
      employeeId: empJohn.id,
      employeeSignatureUrl: null,
      submittedAt: null,
      approvalDate: null,
      rejectionReason: null,
      auditLogs: [
        { action: 'CREATED', performedById: empJohn.id, notes: 'Voucher saved as draft' }
      ]
    },
    // 2. DRAFT - Jane (with signature saved)
    {
      voucherNumber: 'EV-2026-000102',
      voucherDate: new Date('2026-08-22'),
      expenseDate: new Date('2026-08-21'),
      departmentName: 'Marketing',
      expenseTitle: 'Q3 Brand Campaign Printing Materials',
      expenseCategory: ExpenseCategory.OFFICE_SUPPLIES,
      expenseDescription: 'High-gloss brochures, retractable banners, and promotional flyers for trade expo.',
      amount: 475.50,
      status: VoucherStatus.DRAFT,
      employeeId: empJane.id,
      employeeSignatureUrl: empSig,
      submittedAt: null,
      approvalDate: null,
      rejectionReason: null,
      auditLogs: [
        { action: 'CREATED', performedById: empJane.id, notes: 'Voucher saved as draft' },
        { action: 'SIGNATURE_ATTACHED', performedById: empJane.id, notes: 'Employee signature attached' }
      ]
    },
    // 3. PENDING_APPROVAL - John
    {
      voucherNumber: 'EV-2026-000103',
      voucherDate: new Date('2026-08-25'),
      expenseDate: new Date('2026-08-24'),
      departmentName: 'Engineering',
      expenseTitle: 'Server Rack Cabling & Network Switch Accessories',
      expenseCategory: ExpenseCategory.EQUIPMENT,
      expenseDescription: 'Cat6 patch cables, cable organizers, and 10Gb SFP+ optical transceivers for rack 4.',
      amount: 685.20,
      status: VoucherStatus.PENDING_APPROVAL,
      employeeId: empJohn.id,
      employeeSignatureUrl: empSig,
      submittedAt: new Date('2026-08-25T10:30:00Z'),
      approvalDate: null,
      rejectionReason: null,
      auditLogs: [
        { action: 'CREATED', performedById: empJohn.id, notes: 'Voucher created' },
        { action: 'SUBMITTED', performedById: empJohn.id, notes: 'Submitted for Director approval' }
      ]
    },
    // 4. PENDING_APPROVAL - Jane
    {
      voucherNumber: 'EV-2026-000104',
      voucherDate: new Date('2026-08-27'),
      expenseDate: new Date('2026-08-26'),
      departmentName: 'Marketing',
      expenseTitle: 'Digital Marketing Conference Ticket & Travel',
      expenseCategory: ExpenseCategory.TRAVEL,
      expenseDescription: 'Round-trip train fare and registration pass for Growth Summit 2026.',
      amount: 540.00,
      status: VoucherStatus.PENDING_APPROVAL,
      employeeId: empJane.id,
      employeeSignatureUrl: empSig,
      submittedAt: new Date('2026-08-27T14:15:00Z'),
      approvalDate: null,
      rejectionReason: null,
      auditLogs: [
        { action: 'CREATED', performedById: empJane.id, notes: 'Voucher created' },
        { action: 'SUBMITTED', performedById: empJane.id, notes: 'Submitted for Director approval' }
      ]
    },
    // 5. PENDING_APPROVAL - Bob
    {
      voucherNumber: 'EV-2026-000105',
      voucherDate: new Date('2026-08-28'),
      expenseDate: new Date('2026-08-27'),
      departmentName: 'Sales',
      expenseTitle: 'Client Dinner & Product Demo Presentation',
      expenseCategory: ExpenseCategory.FOOD,
      expenseDescription: 'Business dinner meeting with prospective enterprise client (Apex Corp) VP of Tech.',
      amount: 295.40,
      status: VoucherStatus.PENDING_APPROVAL,
      employeeId: empBob.id,
      employeeSignatureUrl: empSig,
      submittedAt: new Date('2026-08-28T09:00:00Z'),
      approvalDate: null,
      rejectionReason: null,
      auditLogs: [
        { action: 'CREATED', performedById: empBob.id, notes: 'Voucher created' },
        { action: 'SUBMITTED', performedById: empBob.id, notes: 'Submitted for Director approval' }
      ]
    },
    // 6. APPROVED - John
    {
      voucherNumber: 'EV-2026-000106',
      voucherDate: new Date('2026-08-10'),
      expenseDate: new Date('2026-08-08'),
      departmentName: 'Engineering',
      expenseTitle: 'Ergonomic Standing Desk Converter & Monitor Arm',
      expenseCategory: ExpenseCategory.OFFICE_SUPPLIES,
      expenseDescription: 'Workstation ergonomics upgrade as approved in quarterly workplace wellbeing review.',
      amount: 380.00,
      status: VoucherStatus.APPROVED,
      employeeId: empJohn.id,
      employeeSignatureUrl: empSig,
      directorId: director.id,
      directorSignatureUrl: dirSig,
      submittedAt: new Date('2026-08-10T11:00:00Z'),
      approvalDate: new Date('2026-08-11T16:20:00Z'),
      rejectionReason: null,
      auditLogs: [
        { action: 'CREATED', performedById: empJohn.id, notes: 'Voucher created' },
        { action: 'SUBMITTED', performedById: empJohn.id, notes: 'Submitted for approval' },
        { action: 'APPROVED', performedById: director.id, notes: 'Approved with Director signature' }
      ]
    },
    // 7. APPROVED - Jane
    {
      voucherNumber: 'EV-2026-000107',
      voucherDate: new Date('2026-08-12'),
      expenseDate: new Date('2026-08-11'),
      departmentName: 'Marketing',
      expenseTitle: 'Social Media Management & Analytics Subscription',
      expenseCategory: ExpenseCategory.OTHER,
      expenseDescription: 'Quarterly subscription for campaign scheduling, competitor monitoring, and engagement tracking.',
      amount: 899.00,
      status: VoucherStatus.APPROVED,
      employeeId: empJane.id,
      employeeSignatureUrl: empSig,
      directorId: director.id,
      directorSignatureUrl: dirSig,
      submittedAt: new Date('2026-08-12T09:30:00Z'),
      approvalDate: new Date('2026-08-13T10:00:00Z'),
      rejectionReason: null,
      auditLogs: [
        { action: 'CREATED', performedById: empJane.id, notes: 'Voucher created' },
        { action: 'SUBMITTED', performedById: empJane.id, notes: 'Submitted for approval' },
        { action: 'APPROVED', performedById: director.id, notes: 'Approved with Director signature' }
      ]
    },
    // 8. APPROVED - Bob
    {
      voucherNumber: 'EV-2026-000108',
      voucherDate: new Date('2026-08-14'),
      expenseDate: new Date('2026-08-13'),
      departmentName: 'Sales',
      expenseTitle: 'Hotel Accommodation - North Region Client Roadshow',
      expenseCategory: ExpenseCategory.ACCOMMODATION,
      expenseDescription: '3 nights corporate hotel stay during the regional key customer visit and pipeline review.',
      amount: 720.00,
      status: VoucherStatus.APPROVED,
      employeeId: empBob.id,
      employeeSignatureUrl: empSig,
      directorId: director.id,
      directorSignatureUrl: dirSig,
      submittedAt: new Date('2026-08-14T15:00:00Z'),
      approvalDate: new Date('2026-08-15T11:45:00Z'),
      rejectionReason: null,
      auditLogs: [
        { action: 'CREATED', performedById: empBob.id, notes: 'Voucher created' },
        { action: 'SUBMITTED', performedById: empBob.id, notes: 'Submitted for approval' },
        { action: 'APPROVED', performedById: director.id, notes: 'Approved with Director signature' }
      ]
    },
    // 9. APPROVED - Bob
    {
      voucherNumber: 'EV-2026-000109',
      voucherDate: new Date('2026-08-18'),
      expenseDate: new Date('2026-08-17'),
      departmentName: 'Sales',
      expenseTitle: 'High-speed Fiber Internet Connection for Remote Office',
      expenseCategory: ExpenseCategory.UTILITIES,
      expenseDescription: 'Monthly corporate remote sales workspace telecom & broadband connectivity allowance.',
      amount: 110.00,
      status: VoucherStatus.APPROVED,
      employeeId: empBob.id,
      employeeSignatureUrl: empSig,
      directorId: director.id,
      directorSignatureUrl: dirSig,
      submittedAt: new Date('2026-08-18T08:45:00Z'),
      approvalDate: new Date('2026-08-19T14:10:00Z'),
      rejectionReason: null,
      auditLogs: [
        { action: 'CREATED', performedById: empBob.id, notes: 'Voucher created' },
        { action: 'SUBMITTED', performedById: empBob.id, notes: 'Submitted for approval' },
        { action: 'APPROVED', performedById: director.id, notes: 'Approved with Director signature' }
      ]
    },
    // 10. REJECTED - John
    {
      voucherNumber: 'EV-2026-000110',
      voucherDate: new Date('2026-08-05'),
      expenseDate: new Date('2026-08-04'),
      departmentName: 'Engineering',
      expenseTitle: 'High-end Mechanical Keyboard with Custom Switches',
      expenseCategory: ExpenseCategory.EQUIPMENT,
      expenseDescription: 'Custom ergonomic split mechanical keyboard with customized keycaps.',
      amount: 450.00,
      status: VoucherStatus.REJECTED,
      employeeId: empJohn.id,
      employeeSignatureUrl: empSig,
      directorId: director.id,
      directorSignatureUrl: null,
      submittedAt: new Date('2026-08-05T12:00:00Z'),
      approvalDate: null,
      rejectionReason: 'Standard IT policy caps peripheral accessories at $150 unless accompanied by prior ergonomic medical recommendation.',
      auditLogs: [
        { action: 'CREATED', performedById: empJohn.id, notes: 'Voucher created' },
        { action: 'SUBMITTED', performedById: empJohn.id, notes: 'Submitted for approval' },
        { action: 'REJECTED', performedById: director.id, notes: 'Standard IT policy caps peripheral accessories at $150 unless accompanied by prior ergonomic medical recommendation.' }
      ]
    },
    // 11. REJECTED - Bob
    {
      voucherNumber: 'EV-2026-000111',
      voucherDate: new Date('2026-08-07'),
      expenseDate: new Date('2026-08-06'),
      departmentName: 'Sales',
      expenseTitle: 'Weekend Golf Club Meeting with Prospective Partner',
      expenseCategory: ExpenseCategory.OTHER,
      expenseDescription: 'Green fees and clubhouse lunch with prospective distributor regional representative.',
      amount: 620.00,
      status: VoucherStatus.REJECTED,
      employeeId: empBob.id,
      employeeSignatureUrl: empSig,
      directorId: director.id,
      directorSignatureUrl: null,
      submittedAt: new Date('2026-08-07T16:30:00Z'),
      approvalDate: null,
      rejectionReason: 'Entertainment expenses of this nature must have prior written approval from the Department Head before expenditure.',
      auditLogs: [
        { action: 'CREATED', performedById: empBob.id, notes: 'Voucher created' },
        { action: 'SUBMITTED', performedById: empBob.id, notes: 'Submitted for approval' },
        { action: 'REJECTED', performedById: director.id, notes: 'Entertainment expenses of this nature must have prior written approval from the Department Head before expenditure.' }
      ]
    }
  ];

  for (const v of vouchersData) {
    const { auditLogs, ...voucherFields } = v;
    const createdVoucher = await prisma.voucher.create({
      data: voucherFields
    });

    if (auditLogs && auditLogs.length > 0) {
      for (const log of auditLogs) {
        await prisma.auditLog.create({
          data: {
            voucherId: createdVoucher.id,
            action: log.action,
            performedById: log.performedById,
            notes: log.notes
          }
        });
      }
    }
  }

  console.log('Seed completed successfully!');
  console.log('\n--- DEMO USER CREDENTIALS ---');
  console.log('Director:  director@abccompany.com  / Director@123');
  console.log('Accounts:  accounts@abccompany.com  / Accounts@123');
  console.log('Employee1: john.doe@abccompany.com  / Employee@123 (Engineering)');
  console.log('Employee2: jane.smith@abccompany.com / Employee@123 (Marketing)');
  console.log('Employee3: bob.wilson@abccompany.com / Employee@123 (Sales)');
  console.log('-----------------------------\n');
}

main()
  .catch((e) => {
    console.error('Error in seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
