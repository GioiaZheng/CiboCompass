const assert = require('assert');
const fs = require('fs');
const path = require('path');

const {
  DEFAULT_API_BASE_URL,
  resolveApiBaseUrl,
} = require('../src/config/api-base-url');

assert.strictEqual(resolveApiBaseUrl(), DEFAULT_API_BASE_URL);
assert.strictEqual(resolveApiBaseUrl('  '), DEFAULT_API_BASE_URL);
assert.strictEqual(
  resolveApiBaseUrl('http://10.0.2.2:4000/v1/'),
  'http://10.0.2.2:4000/v1',
);
assert.strictEqual(
  resolveApiBaseUrl(' https://api.example.com/v1/// '),
  'https://api.example.com/v1',
);

const appSource = fs.readFileSync(path.join(__dirname, '..', 'App.js'), 'utf8');
assert.match(appSource, /process\.env\.EXPO_PUBLIC_API_BASE_URL/);
assert.doesNotMatch(appSource, /http:\/\/192\.168\./);

console.log('API configuration check passed');
