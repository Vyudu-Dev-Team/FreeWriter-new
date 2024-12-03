import crypto from 'crypto-browserify';

if (typeof global.crypto === 'undefined') {
  global.crypto = crypto;
}