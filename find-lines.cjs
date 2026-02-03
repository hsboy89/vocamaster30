const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, 'src', 'shared', 'data', 'vocabulary-db.json');
const content = fs.readFileSync(dbPath, 'utf8');
const lines = content.split('\n');

lines.forEach((line, index) => {
    if (line.includes('"high": [') || line.includes('"advanced": [')) {
        console.log(`Line ${index + 1}: ${line.trim()}`);
    }
});
