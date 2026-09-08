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

/**
 * Serializes and encrypts user keys & preferences into a stateless, tamper-proof virtual key.
 * Format: sk-merged-v2-<base64url(iv + tag + ciphertext)>
 * @param {Object} rawKeys - Map of provider to API key
 * @param {Array} preferredOrder - User provider ranking
 * @returns {string} Stateless virtual API key
 */
function encodeStatelessKey(rawKeys, preferredOrder = []) {
  const payload = {
    k: rawKeys,
    p: Array.isArray(preferredOrder) ? preferredOrder : [],
    t: Date.now()
  };
  const key = getEncryptionKey();
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  
  const text = JSON.stringify(payload);
  const ciphertext = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag(); // 16 bytes
  
  // Pack: iv (12 bytes) + tag (16 bytes) + ciphertext
  const packed = Buffer.concat([iv, tag, ciphertext]);
  return 'sk-merged-v2-' + packed.toString('base64url');
}

/**
 * Decodes and decrypts a stateless virtual key into { keys, preferredOrder }.
 * @param {string} token - Virtual API key string
 * @returns {Object|null} { keys, preferredOrder } or null if invalid
 */
function decodeStatelessKey(token) {
  if (!token || typeof token !== 'string') return null;
  
  // Strip 'Bearer ' if present
  let cleanToken = token.trim();
  if (cleanToken.startsWith('Bearer ')) cleanToken = cleanToken.slice(7).trim();

  // Primary v2 format
  if (cleanToken.startsWith('sk-merged-v2-')) {
    try {
      const raw = cleanToken.slice('sk-merged-v2-'.length);
      const buf = Buffer.from(raw, 'base64url');
      return decodeBuffer(buf);
    } catch (err) {
      console.error('[Security] Stateless token decode error:', err.message);
      return null;
    }
  }

  // Also check if sk-merged- carries a packed buffer
  if (cleanToken.startsWith('sk-merged-') && cleanToken.length > 50) {
    try {
      const raw = cleanToken.slice('sk-merged-'.length);
      const buf = Buffer.from(raw, 'base64url');
      if (buf.length > 28) {
        return decodeBuffer(buf);
      }
    } catch (e) {}
  }

  return null;
}

function decodeBuffer(buf) {
  if (!buf || buf.length <= 28) return null; // 12 bytes IV + 16 bytes tag = 28 bytes minimum
  try {
    const key = getEncryptionKey();
    const iv = buf.subarray(0, 12);
    const tag = buf.subarray(12, 28);
    const ciphertext = buf.subarray(28);

    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(tag);
    
    const decrypted = Buffer.concat([decipher.update(ciphertext), decipher.final()]);
    const data = JSON.parse(decrypted.toString('utf8'));
    return {
      keys: data.k || {},
      preferredOrder: data.p || []
    };
  } catch (err) {
    return null;
  }
}

module.exports = {
  encryptPayload,
  decryptPayload,
  encodeStatelessKey,
  decodeStatelessKey
};

