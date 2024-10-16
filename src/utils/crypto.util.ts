import * as crypto from 'crypto';

const getHash = (plainString: string): string => {
  return crypto.createHash('sha256').update(plainString).digest('base64');
};

const getOtpHash = (plainString: string): string => {
  return crypto
    .createHmac('sha256', process.env.OTP_HASH_KEY)
    .update(plainString)
    .digest('hex');
};

export { getHash, getOtpHash };
