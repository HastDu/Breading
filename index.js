const fs = require('fs');

function bReadSync(varname, filepath) {
  if (filepath.endsWith('.txt')) {
    try {
      const data = fs.readFileSync(filepath, 'utf8');
      global[varname] = data;
    } catch (err) {
      console.error('Error reading file:', err);
    }
  }
/*if (filepath.endsWith('.bread')) {
  making this code when .bread releases
} */
}

module.exports = bReadSync;