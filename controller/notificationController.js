const Notification = require("../models/notificationModel");

exports.getAllNotification = async (req, res, next) => {
  try {
    const { uid } = req.body;
    if (!uid) {
      throw new BadRequestError("uid is required");
    }
    const notifications = await Notification.findAll({ where: { uid } });
    res.success("List notification", { NotificationData: notifications });
  } catch (error) {
    next(error);
  }
};
