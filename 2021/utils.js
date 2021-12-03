const { createReadStream } = require('fs');
const { join } = require('path');
const { createInterface } = require('readline');

/**
 * 
 * @param {string} path Path from 2021 base path
 * @param {string[]} columns Array of column transformations
 * @param {string} delim Column delimiter
 * @returns 
 */
exports.readLines = (path, columns = null, delim = ' ') => new Promise(res => {
  const file = join(__dirname, path);
  const read = createReadStream(file, { encoding: 'utf-8' });
  const rl = createInterface(read);
  
  const rows = [];
  rl.on('line', (reading) => {
    if (!reading) return;
    if (!columns) rows.push(reading);
    else {
      let vals = reading.split(delim);
      vals = vals.map((v, i) => {
        if (i >= columns.length) return v;
        switch(columns[i]) {
          case 'num':
            const float = parseFloat(v);
            return isNaN(float) ? v : float;
          case 'str':
            return v;
          default:
            throw Error(`Unrecognized column type: ${columns[i]}`);
        }
      });
      rows.push(vals.length > 1 ? vals : vals[0]);
    }
  });
  
  rl.on('close', () => res(rows));
});