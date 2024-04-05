const fs = require("fs");
const path = require("path");

function compareFilesLineByLine(file1, file2) {
  const lines1 = fs.readFileSync(file1, "utf-8").split(/\r?\n/);
  const lines2 = fs.readFileSync(file2, "utf-8").split(/\r?\n/);

  const differences = [];

  for (let i = 0; i < lines1.length; i++) {
    if (lines1[i] !== lines2[i]) {
      differences.push(i + 1);
    }
  }

  return differences;
}
function compareFilesInDirectories(dir1, dir2) {
  const files1 = fs.readdirSync(dir1);
  const files2 = new Set(fs.readdirSync(dir2));

  const identicalFiles = [];
  const differentFiles = [];
  const noMatchFiles = [];

  for (const file of files1) {
    if (files2.has(file)) {
      const file1Path = path.join(dir1, file);
      const file2Path = path.join(dir2, file);

      const differences = compareFilesLineByLine(file1Path, file2Path);

      if (differences.length === 0) {
        identicalFiles.push(file);
      } else {
        differentFiles.push({ file, differences });
      }
    } else {
      noMatchFiles.push(file);
    }
  }

  const result = {
    identicalFiles: {
      count: identicalFiles.length,
      files: identicalFiles,
    },
    differentFiles: {
      count: differentFiles.length,
      files: differentFiles,
    },
    noMatchFiles: {
      count: noMatchFiles.length,
      files: noMatchFiles,
    },
  };

  fs.writeFileSync("result.json", JSON.stringify(result, null, 2));
}

const dirPath1 = "path to the first directory";
const dirPath2 = "path to the second directory";

compareFilesInDirectories(dirPath1, dirPath2);
