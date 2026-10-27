const fs = require('fs');
const path = require('path');
const FILE = path.join(__dirname, '..', 'data', 'db.json');

function read() {
  if (!fs.existsSync(FILE)) {
    fs.mkdirSync(path.dirname(FILE), { recursive: true });
    fs.writeFileSync(FILE, JSON.stringify({ users: [], properties: [] }, null, 2));
  }
  return JSON.parse(fs.readFileSync(FILE, 'utf8'));
}

// write to a temp file then rename, so a crash never corrupts db.json
function write(data) {
  fs.writeFileSync(FILE + '.tmp', JSON.stringify(data, null, 2));
  fs.renameSync(FILE + '.tmp', FILE);
}

module.exports = { read, write };
