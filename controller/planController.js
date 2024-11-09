//  crud
// get all plan
const Plan = require("../models/planModel.js");
exports.getAllPage = async (req, res, next) => {
  try {
    // select all page where status = 1
    const plan = await Plan.findAll({ where: { status: 1 } });
    res.success("Success", { PlanData: plan });
  } catch (error) {
    next(error);
  }
};

// create plan
exports.createPlan = async (req, res, next) => {
  
  try {
    const {
      title,
      amt,
      description,
      filter_include,
      day_limit,
      direct_chat,
      like_menu,
      audio_video,
      chat,
    } = req.body;
     const newPlan = await Plan.create({
      title,
      amt,
      description,
      filter_include,
      day_limit,
      direct_chat,
      like_menu,
      audio_video,
      chat,
    });
    res.success("Success", { PlanData: newPlan });
  } catch (error) {
    next(error);
  }
};

// update plan
exports.updatePlan = async (req, res, next) => {
  const { id } = req.params;
  const {
    title,
    amt,
    description,
    filter_include,
    day_limit,
    direct_chat,
    like_menu,
    audio_video,
    chat,
  } = req.body;
  try {
    const plan = await Plan.findOne({ where: { id } });
    if (!plan) {
      return res.error("Plan not found", 404);
    }
    plan.title = title;
    plan.amt = amt;
    plan.description = description;
    plan.filter_include = filter_include;
    plan.day_limit = day_limit;
    plan.direct_chat = direct_chat;
    plan.like_menu = like_menu;
    plan.audio_video = audio_video;
    plan.chat = chat;
    await plan.save();
    res.success("Success", { PlanData: plan });
  } catch (error) {
    next(error);
  }
};

// delete plan
exports.deletePlan = async (req, res, next) => {
  const { id } = req.params;
  try {
    const plan = await Plan.findOne({ where: { id } });
    if (!plan) {
      return res.error("Plan not found", 404);
    }
    await plan.destroy();
    res.success("Success", { PlanData: plan });
  } catch (error) {
    next(error);
  }
};
