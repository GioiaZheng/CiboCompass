const fs = require('fs');
const path = require('path');
const babel = require('@babel/core');

const files = ['App.js', 'index.js', 'src/config/api-base-url.js'];

for (const file of files) {
  const fullPath = path.join(process.cwd(), file);
  const source = fs.readFileSync(fullPath, 'utf8');

  babel.parseSync(source, {
    filename: file,
    parserOpts: {
      sourceType: 'module',
      plugins: ['jsx', 'optionalChaining'],
    },
  });
}

console.log('JavaScript syntax check passed');
