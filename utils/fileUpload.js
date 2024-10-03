const fs = require("fs");
const path = require("path"); 
 
const processFileUploads = (files) => {
  return files.map((file) => {
    const ext = path.extname(file.originalname);
    const newName = `${Date.now()}${ext}`;
    const uploadsDir = path.resolve(__dirname, "../uploads");
    const targetPath = path.join(uploadsDir, newName);
    // Move file to the destination
    fs.renameSync(file.path, targetPath);

    return `/uploads/${newName}`;
  });
};

const deleteFiles = (files) => {
  if (files) {
    files.forEach((file) => {
      fs.unlinkSync(file.path);
    });
  }
};
const deleteFile = (file) => {
  if (file && fs.existsSync(file)) {
    fs.unlinkSync(file);
  }
};

module.exports = { processFileUploads, deleteFiles, deleteFile };