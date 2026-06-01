const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const readmePath = path.join(root, 'README.md');

const mojibakeCodePoints = [0xc3, 0xc2, 0xe2, 0xf0, 0x178, 0xfffd];

const requiredSections = [
  '# Highlights',
  '# System Architecture',
  '# API Endpoints',
  '# Quickstart',
  '# License',
];

const markdownLinkPattern = /(?<!!)\[[^\]]+\]\(([^)]+)\)/g;

function isExternalLink(target) {
  return /^[a-z][a-z0-9+.-]*:/i.test(target);
}

function checkReadme(content = fs.readFileSync(readmePath, 'utf8')) {
  const errors = [];

  mojibakeCodePoints.forEach((codePoint) => {
    if (content.includes(String.fromCodePoint(codePoint))) {
      errors.push(`README.md contains suspicious encoding marker: U+${codePoint.toString(16)}`);
    }
  });

  requiredSections.forEach((section) => {
    if (!content.includes(section)) {
      errors.push(`README.md is missing required section: ${section}`);
    }
  });

  for (const match of content.matchAll(markdownLinkPattern)) {
    const target = match[1].trim();
    if (!target || target.startsWith('#') || isExternalLink(target)) {
      continue;
    }

    const localPath = target.split('#')[0];
    if (!localPath) {
      continue;
    }

    const resolved = path.resolve(path.dirname(readmePath), decodeURIComponent(localPath));
    if (!resolved.startsWith(root + path.sep) && resolved !== root) {
      errors.push(`README.md links outside the repository: ${target}`);
      continue;
    }

    if (!fs.existsSync(resolved)) {
      errors.push(`README.md has a broken local link: ${target}`);
    }
  }

  return errors;
}

if (require.main === module) {
  const errors = checkReadme();
  if (errors.length > 0) {
    console.error('README check failed:');
    errors.forEach((error) => console.error(`- ${error}`));
    process.exit(1);
  }

  console.log('README check passed.');
}

module.exports = { checkReadme };
