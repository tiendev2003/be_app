const Plan = require("../models/planModel.js");
const { BadRequestError } = require("../utils/customErrors.js");
const Notification = require("../models/notificationModel.js");
const User = require("../models/userModel.js");
const Setting = require("../models/settingModel.js");
const { default: axios } = require("axios");
const PlanPurchaseHistory = require("../models/planPurchaseHistoryModel.js");

exports.getPlanPurchaseHistory = async (req, res, next) => {
  try {
    const { uid, plan_id, transaction_id, pname, p_method_id } = req.body;
    if (!uid || !plan_id || !transaction_id || !pname) {
      throw new BadRequestError("Please provide all required fields");
    }
    const plan = await Plan.findByPk(plan_id);
    const datetime = new Date();
    const current_date = new Date().toISOString().split("T")[0];
    const till_date = new Date(
      new Date().setDate(new Date().getDate() + plan.day_limit)
    )
      .toISOString()
      .split("T")[0];

    const notification = await Notification.create({
      uid,
      datetime,
      title: "Plan Purchase Successfully",
      description: `${plan.title} Plan Purchase From ${current_date} To ${till_date}. Payment Gateway Name: ${pname} Transaction Id: ${transaction_id}`,
    });
    const history = await PlanPurchaseHistory.create({
      uid,
      planId: plan_id,
      p_name: pname,
      t_date: datetime,
      amount: plan.amt,
      day: plan.day_limit,
      plan_title: plan.title,
      plan_description: plan.description,
      expiry_date: till_date,
      start_date: current_date,
      trans_id: transaction_id,
      p_method_id,
    });

    await User.update(
      {
        plan_start_date: current_date,
        plan_end_date: till_date,
        plan_id,
        is_subscribe: true,
        history_id: history.id,
      },
      {
        where: { id: uid },
      }
    );
    const user = await User.findOne({
      where: { id: uid },
    });
    const content = { en: `${user.name}, Plan Successfully Purchased.` };
    const heading = { en: "Plan Purchased!!" };
    const settings = await Setting.findOne({ where: { id: 1 } });
    const fields = {
      app_id: settings.one_key,
      included_segments: ["Active Users"],
      filters: [{ field: "tag", key: "user_id", relation: "=", value: uid }],
      contents: content,
      headings: heading,
    };

    const response = await axios.post(
      "https://onesignal.com/api/v1/notifications",
      fields,
      {
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          Authorization: `Basic ${settings.one_hash}`,
        },
      }
    );
    res.success("Plan Purchased Successfully");
  } catch (error) {
    next(error);
  }
};
