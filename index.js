const fs = require('fs');
const path = require('path');

function bReadSync(filepath) {
  if (filepath.endsWith('.txt')) {
    try {
      const data = fs.readFileSync(filepath, 'utf8');
      const varname = path.basename(filepath, '.txt');  // Use the file name as the variable name
      global[varname] = data;  // Assign to global variable
    } catch (err) {
      console.error('Error reading .txt file:', err);
    }
  }

  if (filepath.endsWith('.bread')) {
    try {
      const data = fs.readFileSync(filepath, 'utf8');

      const breadExports = {};  // To hold exports from .bread file
      const lines = data.split('\n').map(line => line.trim()).filter(line => line !== '');

      let currentImport = null;

      lines.forEach(line => {
        if (line.startsWith('>')) {
          const match = line.match(/^> (\w+)\s*{?$/);
          if (match) {
            currentImport = {
              type: match[1],  // Type like 'text' or 'json'
              path: '',
              variableName: ''
            };
          }
        } else if (line.startsWith('./') && currentImport) {
          currentImport.path = line;  // File path
        } else if (line.startsWith('type') && currentImport) {
          const match = line.match(/type \((\w+)\)/);
          if (match) {
            currentImport.type = match[1];  // Type (txt, json)
          }
        } else if (line.startsWith('variable') && currentImport) {
          const match = line.match(/variable (\w+)/);
          if (match) {
            currentImport.variableName = match[1];  // Variable name to store the data
          }
        }

        if (currentImport && currentImport.path && currentImport.variableName) {
          const { type, path: filePath, variableName } = currentImport;

          try {
            let fileData = fs.readFileSync(filePath, 'utf8');
            
            if (type === 'json') {
              fileData = JSON.parse(fileData);
            }

            breadExports[variableName] = fileData;
            global[variableName] = fileData;
          } catch (err) {
            console.error(`Error reading or parsing file ${filePath}:`, err);
          }

          currentImport = null;
        }
      });

      module.exports = breadExports;

    } catch (err) {
      console.error('Error reading .bread file:', err);
    }
  }
}

module.exports = bReadSync;

bReadSync('index.bread');
console.log(myVar);  // After calling bReadSync, 'myVar' should be defined.