const Joi = require('joi');

const categories = [
  'TRAVEL',
  'FOOD',
  'ACCOMMODATION',
  'OFFICE_SUPPLIES',
  'EQUIPMENT',
  'UTILITIES',
  'TRAINING',
  'OTHER'
];

const statuses = ['DRAFT', 'PENDING_APPROVAL', 'APPROVED', 'REJECTED'];

const createVoucherSchema = Joi.object({
  departmentName: Joi.string().trim().min(2).max(100).required().messages({
    'string.empty': 'Department name is mandatory',
    'any.required': 'Department name is mandatory'
  }),
  expenseTitle: Joi.string().trim().min(3).max(200).required().messages({
    'string.empty': 'Expense title is mandatory',
    'string.min': 'Expense title must be at least 3 characters',
    'any.required': 'Expense title is mandatory'
  }),
  expenseDate: Joi.date().iso().required().messages({
    'date.base': 'Valid expense date is mandatory',
    'any.required': 'Expense date is mandatory'
  }),
  expenseCategory: Joi.string().valid(...categories).default('OTHER'),
  expenseDescription: Joi.string().trim().max(1000).allow('', null),
  amount: Joi.number().positive().precision(2).required().messages({
    'number.base': 'Amount must be a valid number',
    'number.positive': 'Amount must be greater than 0',
    'any.required': 'Amount is mandatory'
  }),
  employeeSignatureUrl: Joi.string().allow('', null),
  signatureBase64: Joi.string().allow('', null)
});

const updateVoucherSchema = Joi.object({
  departmentName: Joi.string().trim().min(2).max(100),
  expenseTitle: Joi.string().trim().min(3).max(200),
  expenseDate: Joi.date().iso(),
  expenseCategory: Joi.string().valid(...categories),
  expenseDescription: Joi.string().trim().max(1000).allow('', null),
  amount: Joi.number().positive().precision(2),
  employeeSignatureUrl: Joi.string().allow('', null),
  signatureBase64: Joi.string().allow('', null)
}).min(1);

const rejectVoucherSchema = Joi.object({
  rejectionReason: Joi.string().trim().min(5).max(1000).required().messages({
    'string.empty': 'Rejection reason is mandatory',
    'string.min': 'Rejection reason must be at least 5 characters long',
    'any.required': 'Rejection reason is mandatory'
  })
});

const approveVoucherSchema = Joi.object({
  signatureBase64: Joi.string().allow('', null),
  directorSignatureUrl: Joi.string().allow('', null)
});

const listVouchersQuerySchema = Joi.object({
  search: Joi.string().trim().allow(''),
  status: Joi.string().valid(...statuses, '').allow(''),
  department: Joi.string().trim().allow(''),
  category: Joi.string().valid(...categories, '').allow(''),
  dateFrom: Joi.date().iso().allow(''),
  dateTo: Joi.date().iso().allow(''),
  amountMin: Joi.number().min(0).allow(''),
  amountMax: Joi.number().min(0).allow(''),
  sortBy: Joi.string().valid('createdAt', 'voucherDate', 'expenseDate', 'amount', 'voucherNumber', 'status').default('createdAt'),
  sortOrder: Joi.string().valid('asc', 'desc').default('desc'),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10)
});

module.exports = {
  createVoucherSchema,
  updateVoucherSchema,
  rejectVoucherSchema,
  approveVoucherSchema,
  listVouchersQuerySchema,
  categories,
  statuses
};
