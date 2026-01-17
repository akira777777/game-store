#!/usr/bin/env node

/**
 * Generate a secure secret for NEXTAUTH_SECRET
 * This script generates a cryptographically secure random secret
 * that can be used for NextAuth.js authentication.
 *
 * Usage:
 *   node scripts/generate-secret.js
 *
 * The script will output a hex-encoded 32-byte random secret
 * that you can use as your NEXTAUTH_SECRET environment variable.
 */

const crypto = require('crypto');

// Generate a 32-byte (256-bit) random secret
const secret = crypto.randomBytes(32).toString('hex');

console.log('Generated NEXTAUTH_SECRET:');
console.log(secret);
console.log('\nTo use this secret:');
console.log('1. Copy the secret above');
console.log('2. Add it to your .env file: NEXTAUTH_SECRET="your-secret-here"');
console.log('3. For Netlify deployment, add it to Site settings → Build & deploy → Environment → New variable');
console.log('   - Key: NEXTAUTH_SECRET');
console.log('   - Value: (paste the secret above)');