const vouchersService = require('./vouchers.service');
const storageService = require('../../utils/storageService');

class VouchersController {
  async create(req, res, next) {
    try {
      const voucher = await vouchersService.createVoucher(req.user.id, req.body);
      res.status(201).json({
        success: true,
        message: 'Expense voucher draft created successfully.',
        data: { voucher }
      });
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const voucher = await vouchersService.updateVoucher(req.params.id, req.user.id, req.body);
      res.status(200).json({
        success: true,
        message: 'Expense voucher updated successfully.',
        data: { voucher }
      });
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      const result = await vouchersService.deleteVoucher(req.params.id, req.user.id);
      res.status(200).json({
        success: true,
        message: result.message
      });
    } catch (error) {
      next(error);
    }
  }

  async uploadSignature(req, res, next) {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'No signature file uploaded.'
        });
      }

      const signatureUrl = storageService.getPublicUrl(req.file.filename);
      const voucher = await vouchersService.attachSignature(req.params.id, req.user, signatureUrl);

      res.status(200).json({
        success: true,
        message: 'Signature attached successfully.',
        data: {
          signatureUrl,
          voucher
        }
      });
    } catch (error) {
      next(error);
    }
  }

  async submit(req, res, next) {
    try {
      const voucher = await vouchersService.submitVoucher(req.params.id, req.user.id);
      res.status(200).json({
        success: true,
        message: 'Voucher submitted for Director approval.',
        data: { voucher }
      });
    } catch (error) {
      next(error);
    }
  }

  async list(req, res, next) {
    try {
      const result = await vouchersService.listVouchers(req.user, req.query);
      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const voucher = await vouchersService.getVoucherById(req.params.id, req.user);
      res.status(200).json({
        success: true,
        data: { voucher }
      });
    } catch (error) {
      next(error);
    }
  }

  async approve(req, res, next) {
    try {
      let directorSignatureUrl = req.body.directorSignatureUrl;
      if (req.file) {
        directorSignatureUrl = storageService.getPublicUrl(req.file.filename);
      }

      const voucher = await vouchersService.approveVoucher(req.params.id, req.user.id, {
        signatureBase64: req.body.signatureBase64,
        directorSignatureUrl
      });

      res.status(200).json({
        success: true,
        message: 'Voucher approved successfully with Director signature.',
        data: { voucher }
      });
    } catch (error) {
      next(error);
    }
  }

  async reject(req, res, next) {
    try {
      const voucher = await vouchersService.rejectVoucher(
        req.params.id,
        req.user.id,
        req.body.rejectionReason
      );

      res.status(200).json({
        success: true,
        message: 'Voucher rejected.',
        data: { voucher }
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new VouchersController();
