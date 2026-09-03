const fs = require('fs');
const path = require('path');

// Simple 1x1 transparent PNG buffer
const dummyPng = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAMgAAAA8CAYAAAAW3w/sAAAACXBIWXMAAAsTAAALEwEAmpwYAAAA' +
  'B3RJTUUH5gMDBw0vR6z8RAAAAB1pVFh0Q29tbWVudAAAAAAAQ3JlYXRlZCB3aXRoIEdJTVBkLmUH' +
  'AAAAcElEQVR42u3PMQ0AAAgEMcrf9KxgASepgfZuSQoAAAAAAAAAAAAAAADA7+wDAAAAAAAAgN8B' +
  'AAAAAPAPAAAAAAAAgN8BAAAAAPAPAAAAAAAAgN8BAAAAAPAPAAAAAAAAgN8BAAAAAPAPAAAAAAAA' +
  'gN8BAAAAAPAPAHQcMggAAV0ZgXUAAAAASUVORK5CYII=',
  'base64'
);

const dir = path.join(__dirname, '../uploads/signatures');
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

fs.writeFileSync(path.join(dir, 'sample-emp-sig.png'), dummyPng);
fs.writeFileSync(path.join(dir, 'sample-dir-sig.png'), dummyPng);
console.log('Sample signature files created.');
