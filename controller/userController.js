const User = require("../models/userModel.js");
const Plan = require("../models/planModel.js");
const { BadRequestError } = require("../utils/customErrors.js");
const Setting = require("../models/settingModel.js");
const {
  processFileUploads,
  deleteFile,
  deleteFiles,
} = require("../utils/fileUpload.js");
const path = require("path");
const fs = require("fs");
const { Op } = require("sequelize");
exports.forgotPassword = async (req, res, next) => {
  const { mobile, password, ccode } = req.body;
  try {
    if (!mobile || !password || !ccode) {
      throw new BadRequestError("Missing required fields");
    }
    const user = await User.findOne({ where: { mobile, ccode } });
    if (!user) {
      throw new BadRequestError("User not found");
    }
    user.password = password;
    await user.save();
    return res.success("Password changed successfully");
  } catch (error) {
    next(error);
  }
};

exports.infoUser = async (req, res, next) => {
  try {
    const { uid } = req.body;
    if (!uid) {
      throw new BadRequestError("Missing required fields");
    }
    const user = await User.findOne({ where: { id: uid } });
    if (!user) {
      throw new BadRequestError("User not found");
    }
    const { plan_id, is_subscribe } = user;
    if (plan_id == "0") {
      throw new NotFoundError("Plan not found");
    }
    console.log(plan_id);

    const plan = await Plan.findOne({ where: { id: plan_id } });
    if (!plan) {
      throw new NotFoundError("Plan not found");
    }
    const direct_chat = plan.direct_chat || "0";
    const Like_menu = plan.like_menu || "0";
    const audio_video = plan.audio_video || "0";
    const filter_include = plan.filter_include || "0";
    const plan_name = plan.title || "FREE";
    const plan_description = plan.description || "";
    return res.success("User info", {
      plan_name,
      plan_description,
      direct_chat,
      Like_menu,
      audio_video,
      filter_include,
      is_subscribe,
    });
  } catch (error) {
    next(error);
  }
};

exports.updateUser = async (req, res, next) => {
  try {
    const {
      name,
      email,
      mobile,
      password,
      ccode,
      birth_date,
      search_preference,
      radius_search,
      relation_goal,
      profile_bio,
      interest,
      height,
      language,
      gender,
      lats,
      longs,
      religion,
      uid,
      imlist,
      size,
    } = req.body;
    console.log(req.files)
   
    if (!name || !email || !mobile || !password || !ccode) {
      if (req.files) {
        deleteFiles(req.files);
      }
      throw new BadRequestError("Missing required fields");
    }
    const existUser = await User.findOne({ where: { id: uid } });
    if (!existUser) {
      if (req.files) {
        deleteFiles(req.files);
      }
      throw new BadRequestError("User not found");
    }
    const checkMob = await User.findOne({
      where: { mobile, id: { [Op.ne]: uid } },
    });
    const checkEmail = await User.findOne({
      where: { email, id: { [Op.ne]: uid } },
    });
    if (checkMob) {
      if (req.files) {
        deleteFiles(req.files);
      }
      throw new BadRequestError("Mobile number already exists");
    }
    if (checkEmail) {
      if (req.files) {
        deleteFiles(req.files);
      }
      throw new BadRequestError("Email already exists");
    }
    let uploadedFiles = [];

    if (req.files.length > 0) {
      uploadedFiles = processFileUploads(req.files);
    }

    await User.update(
      {
        name,
        password,
        email,
        mobile,
        ccode,
        gender,
        lats,
        longs,
        birth_date,
        search_preference,
        radius_search,
        relation_goal,
        interest,
        language,
        religion,
        other_pic: uploadedFiles.length > 0 ? uploadedFiles.join("$;") : existUser.other_pic,
        profile_bio,
        height,
      },
      {
        where: { id: uid },
      }
    );

    const updatedUser = await User.findOne({ uid });
    res.success("User updated successfully", { UserLogin: updatedUser });
  } catch (error) {
    next(error);
  }
};

exports.deleteAccount = async (req, res, next) => {
  try {
    const { uid } = req.body;
    if (!uid) {
      throw new BadRequestError("uid is required");
    }
    const user = await User.findOne({ where: { id: uid } });

    if (!user) {
      throw new BadRequestError("User not found");
    }
    await user.destroy();
    res.success("Account deleted successfully ");
  } catch (error) {
    next(error);
  }
};
exports.referUser = async (req, res, next) => {
  try {
    const { uid } = req.body;
    if (!uid) {
      throw new BadRequestError("uid is required");
    }
    const user = await User.findOne({ where: { id: uid } });
    if (!user) {
      throw new BadRequestError("User not found");
    }
    const setting = await Setting.findOne();
    res.success("Refer user get successfully", {
      code: user.code,
      signupcredit: setting.scredit,
      refercredit: setting.rcredit,
    });
    return res.success("Refer code", { refer_code, refer_count });
  } catch (error) {
    next(error);
  }
};

exports.uploadProfileImage = async (req, res, next) => {
  try {
    const { uid } = req.body;
    if (!uid) {
      throw new BadRequestError("Missing required fields");
    }

    const user = await User.findOne({ where: { id: uid } });
    deleteFile(user.profile_pic);
    if (req.file) {
      user.profile_pic = "\\"+req.file.path;
    }
    await user.save();

    const updatedUser = await User.findOne({ where: { id: uid } });
    res.success("Profile image uploaded successfully", {
      UserLogin: updatedUser,
    });
  } catch (error) {
    if (error.code === "LIMIT_FILE_SIZE") {
      error.statusCode = 413;
      error.message = "File size is too large";
    }
    next(error);
  }
};

exports.userLastAvailable = async (req, res, next) => {
  try {
    const { uid } = req.body;
    if (!uid) {
      throw new BadRequestError("Missing required fields");
    }
    const currentTime = new Date();

    await User.update({ last_available: currentTime }, { where: { id: uid } });
    res.success("User last available updated successfully");
  } catch (error) {
    next(error);
  }
};

exports.indentifyProfile = async (req, res, next) => {
  const { uid, img } = req.body;
  if (!uid || !img) {
    throw new BadRequestError("Missing required fields");
  }
  try {
    const decodedImg = img
      .replace(/^data:image\/png;base64,/, "")
      .replace(/ /g, "+");
    const data = Buffer.from(decodedImg, "base64");
    const filePath = `images/profile/${Date.now()}.png`;
    const fullPath = path.join(__dirname, "..", filePath);
    fs.writeFileSync(fullPath, data);

    await User.update(
      { identity_picture: filePath, is_verify: 1 },
      { where: { uid: uid } }
    );

    const updatedUser = await User.findOne({ where: { uid: uid } });
    res.success("Profile image uploaded successfully", {
      UserLogin: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};
