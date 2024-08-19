// AI generated

import fs from 'fs';
import path from 'path'

// Function to remove backticks from a file
function removeBackticks(filePath, newFilePath) {
    // Read the file content
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error(`Error reading file: ${err}`);
            return;
        }

        // Remove any backtick stuff
        const modifiedData = data.replace(/\$/g, 'δ')
                                 .replace(/\{/g, '⒓')
                                 .replace(/`/g, '⇎')

        // Write the modified content back to the file
        fs.writeFile(newFilePath, modifiedData, 'utf8', (err) => {
            if (err) {
                console.error(`Error writing file: ${err}`);
                return;
            }
            console.log('Backticks removed successfully.');
        });
    });
}

// Specify the file path
// const filePath = path.join(__dirname, 'removeBacktick.js');
// New file path
// const newFilePath = path.join(__dirname, 'removeBacktick.js');

const filePath = '../bundle.js'
const newFilePath = './bundleX.txt'

// Call the function to remove backticks
removeBackticks(filePath, newFilePath);