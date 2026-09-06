const crypto = require('crypto');

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 12;

function getEncryptionKey() {
  const secret = process.env.VENAR_SECRET_KEY || 'venar-master-salt-production-secure-2026-key';
  return crypto.createHash('sha256').update(secret).digest();
}

/**
 * Encrypts an object using AES-256-GCM.
 * @param {Object} dataObj - Key-value pair object of user API keys
 * @returns {Object} Encrypted envelope containing ciphertext, iv, and auth tag
 */
function encryptPayload(dataObj) {
  const key = getEncryptionKey();
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  
  const text = JSON.stringify(dataObj);
  let ciphertext = cipher.update(text, 'utf8', 'hex');
  ciphertext += cipher.final('hex');
  const tag = cipher.getAuthTag().toString('hex');
  
  return {
    ciphertext,
    iv: iv.toString('hex'),
    tag,
    encrypted: true
  };
}

/**
 * Decrypts an AES-256-GCM envelope back to original object.
 * Supports legacy unencrypted records gracefully.
 * @param {Object} record - The stored record from keys.json
 * @returns {Object} Plaintext key-value pair object
 */
function decryptPayload(record) {
  if (!record || typeof record !== 'object') return {};
  // Backward compatibility: If record was saved unencrypted
  if (!record.encrypted || !record.ciphertext) {
    return record;
  }
  
  try {
    const key = getEncryptionKey();
    const iv = Buffer.from(record.iv, 'hex');
    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(Buffer.from(record.tag, 'hex'));
    
    let decrypted = decipher.update(record.ciphertext, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return JSON.parse(decrypted);
  } catch (err) {
    console.error('[Security] Decryption error:', err.message);
    return null;
  }
}

module.exports = {
  encryptPayload,
  decryptPayload
};
