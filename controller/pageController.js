// crud page
// // get all page
const Page = require("../models/pageModel.js");
exports.getAllPage = async (req, res, next) => {
  try {
    // select all page where status = 1
    const page = await Page.findAll({ where: { status: 1 } });
    res.success("Success", { PageData: page });
  } catch (error) {
    next(error);
  }
};

// create page
exports.createPage = async (req, res, next) => {
  const { title, description } = req.body;
  try {
    const newPage = await Page.create({
      title,
      description,
    });
    res.success("Success", { PageData: newPage });
  } catch (error) {
    next(error);
  }
};

// update page
exports.updatePage = async (req, res, next) => {
  const { id } = req.params;
  const { title, description,status } = req.body;
  try {
    const page = await Page.findOne({ where: { id } });
    if (!page) {
      return res.error("Page not found", 404);
    }
    page.title = title;
    page.description = description;
    page.status = status;
    await page.save();
    res.success("Success", { PageData: page });
  } catch (error) {
    next(error);
  }
};

// delete page
exports.deletePage = async (req, res, next) => {
  const { id } = req.params;
  try {
    const page = await Page.findOne({ where: { id } });
    if (!page) {
      return res.error("Page not found", 404);
    }
    page.status = 0;
    await page.save();
    res.success("Success", { PageData: page });
  }
  catch (error) {
    next(error);
  }
}