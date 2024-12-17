const crypto = require( 'crypto-browserify');

if (typeof global.crypto === 'undefined') {
  global.crypto = crypto;
}