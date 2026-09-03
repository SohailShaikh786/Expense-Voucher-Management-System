const express = require('express');
const router = express.Router();
const vouchersController = require('./vouchers.controller');
const authenticate = require('../../middleware/auth');
const { authorizeRoles } = require('../../middleware/roleGuard');
const validate = require('../../middleware/validate');
const upload = require('../../middleware/upload');
const {
  createVoucherSchema,
  updateVoucherSchema,
  rejectVoucherSchema,
  approveVoucherSchema,
  listVouchersQuerySchema
} = require('./vouchers.validation');

// All voucher endpoints require authentication
router.use(authenticate);

// 1. List vouchers (Role-aware: Employee sees own, Director/Accounts see all)
router.get('/', validate(listVouchersQuerySchema, 'query'), vouchersController.list);

// 2. Create voucher (Employee only)
router.post('/', authorizeRoles('EMPLOYEE'), validate(createVoucherSchema), vouchersController.create);

// 3. Get voucher details (Role-checked: Employee can only view own)
router.get('/:id', vouchersController.getById);

// 4. Update voucher (Employee only, Draft only)
router.put('/:id', authorizeRoles('EMPLOYEE'), validate(updateVoucherSchema), vouchersController.update);

// 5. Delete voucher (Employee only, Draft only)
router.delete('/:id', authorizeRoles('EMPLOYEE'), vouchersController.delete);

// 6. Upload employee signature file
router.post('/:id/signature', upload.single('signature'), vouchersController.uploadSignature);

// 7. Submit voucher for approval (Employee only, Draft -> Pending)
router.post('/:id/submit', authorizeRoles('EMPLOYEE'), vouchersController.submit);

// 8. Approve voucher (Director only)
router.post(
  '/:id/approve',
  authorizeRoles('DIRECTOR'),
  upload.single('signature'),
  validate(approveVoucherSchema),
  vouchersController.approve
);

// 9. Reject voucher (Director only)
router.post(
  '/:id/reject',
  authorizeRoles('DIRECTOR'),
  validate(rejectVoucherSchema),
  vouchersController.reject
);

module.exports = router;
