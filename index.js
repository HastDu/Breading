const fs = require('fs');

function bRead(varname, filepath) {
  if (filepath.endsWith('.txt')) {
    try {
      const data = fs.readFileSync(filepath, 'utf8');
      global[varname] = data;
    } catch (err) {
      console.error('Error reading file:', err);
    }
  }
}

module.exports = bRead;