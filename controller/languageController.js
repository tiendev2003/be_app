// crud
// get all language
const Language = require("../models/languageModel.js");
const { deleteFile } = require("../utils/fileUpload.js");
exports.getAllLanguage = async (req, res, next) => {
  try {
    // select all language where status = 1
    const languages = await Language.findAll({ where: { status: 1 } });
    res.success("Success", { languagelist: languages });
  } catch (error) {
    next(error);
  }
};

// create language
exports.createLanguage = async (req, res, next) => {
  const { title } = req.body;
  try {
    const language = await Language.findOne({ where: { title } });
    if (language) {
      if (req.file) {
        deleteFile(req.file.path);
      }
      return res.error("Language already exist", 400);
    }
    //  language have img
    if (!req.file) {
      return res.error("Image is required", 400);
    }
    const newLanguage = await Language.create({
      title,
      img: req.file.path,
    });
    res.success("Success", { languagelist: newLanguage });
  } catch (error) {
    next(error);
  }
};

// update language
exports.updateLanguage = async (req, res, next) => {
  const { id } = req.params;
  const { title } = req.body;
  try {
    const language = await Language.findOne({ where: { id } });
    if (!language) {
      if (req.file) {
        deleteFile(req.file.path);
      }
      return res.error("Language not found", 404);
    }
    language.title = title;
    if (req.file) {
      language.img = req.file.path;
    }
    await language.save();
    res.success("Success", { languagelist: language });
  } catch (error) {
    next(error);
  }
};

// delete language
exports.deleteLanguage = async (req, res, next) => {
  const { id } = req.params;
  try {
    const language = await Language.findOne({ where: { id } });
    if (!language) {
      return res.error("Language not found", 404);
    }
    await language.destroy();
    deleteFile(language.img);
    res.success("Success", { languagelist: language });
  } catch (error) {
    next(error);
  }
};
