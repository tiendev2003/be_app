// day la setting chi co 1 bang duy nhat nen khong can phai tao nhieu controller nhu relation va language . chung ta chi can lay 1 truong trong bang setting la duoc
// get one setting , update setting, delete setting
const Setting = require("../models/settingModel.js");
const { deleteFile } = require("../utils/fileUpload.js");
exports.getSetting = async (req, res, next) => {
  try {
    // select all setting where status = 1
    const setting = await Setting.findOne();
    res.success("Success", { setting: setting });
  } catch (error) {
    next(error);
  }
};

// update setting
exports.updateSetting = async (req, res, next) => {
  const { id } = req.params;
  const {
    webname,
    weblogo,
    timezone,
    currency,
    one_key,
    one_hash,
    scredit,
    rcredit,
  } = req.body;
  try {
    const setting = await Setting.findOne({ where: { id } });
    if (!setting) {
      if (req.file) {
        deleteFile(req.file.path);
      }
      return res.error("Setting not found", 404);
    }
    if (req.file) {
      deleteFile(setting.weblogo);
      setting.weblogo = req.file.path;
    }
    setting.webname = webname || setting.webname;
    setting.weblogo = weblogo || setting.weblogo;
    setting.timezone = timezone || setting.timezone;
    setting.currency = currency || setting.currency;
    setting.one_key = one_key || setting.one_key; 
    setting.one_hash = one_hash || setting.one_hash;
    setting.scredit = scredit || setting.scredit;
    setting.rcredit = rcredit || setting.rcredit;
    await setting.save();
    res.success("Success", { setting: setting });
  } catch (error) {
    next(error);
  }
};
