const fs = require('fs');
const path = require('path');

const bloggerRoot = path.join(__dirname, '..', 'blogger');
const manifestPath = path.join(bloggerRoot, 'manifest.json');

const slugify = (value) =>
  value
    .toLowerCase()
    .replace(/[^\w]+/g, '-')
    .replace(/^-+|-+$/g, '');

const collectNotes = (dir, relativeBase = '') => {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const notes = [];

  entries.forEach((entry) => {
    const absolutePath = path.join(dir, entry.name);
    const relativePath = path.join(relativeBase, entry.name);

    if (entry.isDirectory()) {
      notes.push(...collectNotes(absolutePath, relativePath));
    } else if (entry.isFile() && entry.name.toLowerCase().endsWith('.md')) {
      notes.push({
        title: path.parse(entry.name).name,
        path: relativePath.replace(/\\/g, '/'),
      });
    }
  });

  return notes;
};

const buildManifest = () => {
  if (!fs.existsSync(bloggerRoot)) {
    throw new Error(`Blogger directory not found at ${bloggerRoot}`);
  }

  const modules = fs
    .readdirSync(bloggerRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => {
      const notes = collectNotes(path.join(bloggerRoot, entry.name), entry.name);
      return {
        id: slugify(entry.name),
        title: entry.name,
        notes,
      };
    })
    .filter((module) => module.notes.length > 0);

  const manifest = {
    generatedAt: new Date().toISOString(),
    modules,
  };

  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf8');
  console.log(`Manifest written to ${manifestPath} with ${modules.length} modules`);
};

try {
  buildManifest();
} catch (err) {
  console.error('Failed to generate blogger manifest:', err);
  process.exit(1);
}
