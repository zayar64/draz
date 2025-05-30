// findFlashList.js
const fs = require("fs");
const path = require("path");

function findWordInFiles(dir, word) {
    const results = [];

    function searchDirectory(directory) {
        const files = fs.readdirSync(directory);

        for (const file of files) {
            const fullPath = path.join(directory, file);
            const stat = fs.statSync(fullPath);

            if (stat.isDirectory()) {
                searchDirectory(fullPath);
            } else if (stat.isFile() && /\.(js|jsx|ts|tsx)$/.test(file)) {
                const content = fs.readFileSync(fullPath, "utf8");
                if (content.includes(word)) {
                    results.push(fullPath);
                }
            }
        }
    }

    searchDirectory(dir);
    return results;
}

// Get the directory from command-line argument
const targetDir = process.argv[2];
const word = process.argv[3] || "Media library permission granted."

if (!targetDir) {
    console.error("Usage: node test.js <directory> <word>");
    process.exit(1);
}

const fullPath = path.resolve(process.cwd(), targetDir);

if (!fs.existsSync(fullPath)) {
    console.error(`Error: Directory "${fullPath}" does not exist.`);
    process.exit(1);
}

const matches = findWordInFiles(fullPath, word);
console.log(`Files containing '${word}':\n`, matches.join("\n"));
