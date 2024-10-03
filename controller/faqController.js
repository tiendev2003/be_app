// crud
// get all faq
const Faq = require("../models/faqModel.js");

exports.getAllFaq = async (req, res, next) => {
  try {
    // select all faq where status = 1
    const faqs = await Faq.findAll({ where: { status: 1 } });
    
    res.success("Success", { FaqData: faqs });
  } catch (error) {
    next(error);
  }
};

// create faq
exports.createFaq = async (req, res, next) => {
  const { question, answer } = req.body;
  try {
    const newFaq = await Faq.create({ question, answer });
    res.success("Success", { FaqData: newFaq });
  } catch (error) {
    next(error);
  }
};

// update faq

exports.updateFaq = async (req, res, next) => {
  const { id } = req.params;
  const { question, answer,status } = req.body;
  try {
    const faq = await Faq.findOne({ where: { id } });
    if (!faq) {
      return res.error("Faq not found", 404);
    }
    faq.question = question;
    faq.answer = answer;
    faq.status = status;
    await faq.save();
    res.success("Success", { FaqData: faq });
  } catch (error) {
    next(error);
  }
};

// delete faq
exports.deleteFaq = async (req, res, next) => {
  const { id } = req.params;
  try {
    const faq = await Faq.findOne({ where: { id } });
    if (!faq) {
      return res.error("Faq not found", 404);
    }
    await faq.destroy();
    res.success("Success", { FaqData: faq });
  } catch (error) {
    next(error);
  }
};