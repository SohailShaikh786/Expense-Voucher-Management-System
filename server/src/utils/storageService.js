const fs = require('fs');
const path = require('path');
const config = require('../config/env');

/**
 * Storage Service Abstraction Layer.
 * Currently uses local disk storage (/uploads/signatures/) via Multer,
 * but allows seamless transition to AWS S3, Cloudflare R2, or Google Cloud Storage.
 */
class StorageService {
  constructor() {
    this.baseDir = path.resolve(__dirname, '../../', config.uploadDir);
    this.signaturesDir = path.join(this.baseDir, 'signatures');
    this.ensureDirectoryExists(this.signaturesDir);
  }

  ensureDirectoryExists(dirPath) {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
  }

  /**
   * Save a base64 encoded signature data URI or raw buffer
   * @param {string} dataUrl - e.g. "data:image/png;base64,..."
   * @param {string} prefix - e.g. "emp" or "dir"
   * @returns {string} public relative URL, e.g. "/uploads/signatures/..."
   */
  async saveBase64Signature(dataUrl, prefix = 'sig') {
    if (!dataUrl || !dataUrl.includes('base64,')) {
      throw new Error('Invalid base64 signature format');
    }

    const matches = dataUrl.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      throw new Error('Malformed base64 image data');
    }

    const ext = matches[1].split('/')[1] || 'png';
    const buffer = Buffer.from(matches[2], 'base64');
    const filename = `${prefix}-${Date.now()}-${Math.round(Math.random() * 1e6)}.${ext}`;
    const filePath = path.join(this.signaturesDir, filename);

    await fs.promises.writeFile(filePath, buffer);
    return `/uploads/signatures/${filename}`;
  }

  /**
   * Return public URL for a file stored on disk
   * @param {string} filename
   */
  getPublicUrl(filename) {
    return `/uploads/signatures/${filename}`;
  }

  /**
   * Remove a file if it exists
   * @param {string} relativeUrl
   */
  async deleteFile(relativeUrl) {
    try {
      if (!relativeUrl) return;
      const filename = path.basename(relativeUrl);
      const filePath = path.join(this.signaturesDir, filename);
      if (fs.existsSync(filePath)) {
        await fs.promises.unlink(filePath);
      }
    } catch (err) {
      console.warn(`[StorageService] Failed to delete file: ${relativeUrl}`, err.message);
    }
  }
}

module.exports = new StorageService();
