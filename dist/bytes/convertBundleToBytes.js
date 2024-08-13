// AI CODE

import * as fs from 'fs';

// Path to the file you want to convert
const filePath = '../bundle.js';

// Read the file as a byte array
const fileBuffer = fs.readFileSync(filePath);

// Convert the Buffer to a Uint8Array
const byteArray = new Uint8Array(fileBuffer);

// Path to the new file where you want to write the byte array
const outputFilePath = './bundleBytes.txt';

// Write the byte array to the new file
fs.writeFileSync(outputFilePath, String(byteArray));

console.log(`File has been written to ${outputFilePath}`);