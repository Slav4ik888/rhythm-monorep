const { existsSync, lstatSync, readdirSync, unlinkSync, rmdirSync } = require('fs');

function deleteFolderRecursive(path) {
  if (existsSync(path) && lstatSync(path).isDirectory()) {
    readdirSync(path).forEach(function(file, index){
      const curPath = path + "/" + file;

      if (lstatSync(curPath).isDirectory()) { // recurse
        deleteFolderRecursive(curPath);
      }
      else { // delete file
        unlinkSync(curPath);
      }
    });

    console.log(`Deleting directory "${path}"...`);
    rmdirSync(path);
  }
};

console.log("Cleaning working tree...");

deleteFolderRecursive("./server");

console.log("Successfully cleaned working tree!");
