const { Op, fn, col, literal } = require("sequelize");
const Action = require("../models/actionModel.js");
const User = require("../models/userModel.js");
const { DateTime } = require("luxon");

const {
  BadRequestError,
  UnauthorizedError,
} = require("../utils/customErrors.js");
const sequelize = require("../config/database.js");
const {
  calculateMatchRatio,
  calculateDistance,
} = require("../utils/calculations.js");
const Setting = require("../models/settingModel.js");
const { default: axios } = require("axios");
const Plan = require("../models/planModel.js");
const PlanPurchaseHistory = require("../models/planPurchaseHistoryModel.js");
const Relation = require("../models/relationModel.js");
const Religion = require("../models/religionModel.js");
const Interest = require("../models/interestModel.js");
const Language = require("../models/languageModel.js");

exports.getListLikeMe = async (req, res, next) => {
  const { uid, lats, longs } = req.body;
  console.log(req.body);
  try {
    if (!uid || !lats || !longs) {
      throw new BadRequestError("Invalid input");
    }
    const userData = await User.findOne({ where: { id: uid } });

    if (!userData) {
      throw new UnauthorizedError("Invalid user");
    }
    console.log(userData);
    const likedProfiles = await Action.findAll({
      where: {
        action: "LIKE",
        action: { [Op.ne]: "block" },
        profile_id: uid,
      },
      attributes: ["uid"],
    });
    if (!likedProfiles.length) {
      res.success("No liked profile!!!" );
    }

    const likedProfileIds = likedProfiles.map((p) => p.uid);
    const otherProfiles = await User.findAll({
      where: { id: likedProfileIds },
    });
    let users = [];

    for (let otherUser of otherProfiles) {
      const hasLike = await Action.count({
        where: {
          profile_id: otherUser.id,
          uid: uid,
          action: { [Op.or]: ["LIKE", "UNLIKE"] },
        },
      });

      if (hasLike) continue;

      const isBlocked = await Action.count({
        where: {
          action: "BLOCK",
          profile_id: otherUser.id,
        },
      });

      if (isBlocked) continue;

      const age = calculateAge(otherUser.birth_date);
      const matchRatio = calculateMatchRatio(userData, otherUser);
      const distance = calculateDistance(
        lats,
        longs,
        otherUser.lats,
        otherUser.longs
      );

      users.push({
        profile_id: otherUser.id.toString(),
        profile_name: otherUser.name,
        profile_bio: otherUser.profile_bio,
        is_verify: otherUser.is_verify,
        profile_age: age,
        profile_distance: `${distance} KM`,
        profile_images: otherUser.other_pic.split("$;"),
        match_ratio: matchRatio,
      });
    }

    res.success("Home Data Get Successfully!!!", {
      likemelist: users,
    });
  } catch (error) {
    next(error);
  }
};

exports.toggleLike = async (req, res, next) => {
  const { uid, profile_id, action } = req.body;
  try {
    if (!uid || !profile_id || !action) {
      throw new BadRequestError("Invalid input");
    }
    const existingAction = await Action.findOne({
      where: {
        uid: uid,
        profile_id: profile_id,
      },
    });
    if (existingAction) {
      await existingAction.update({
        action: action,
      });
      res.success("Action updated successfully!!!");
    } else {
      await Action.create({
        uid: uid,
        profile_id: profile_id,
        action: action,
      });
      const user = await User.findOne({ where: { id: uid } });
      const name = user.name;
      const settings = await Setting.findOne();
      const notificationData = {
        app_id: settings.one_key,
        included_segments: ["Active Users"],
        filters: [
          { field: "tag", key: "user_id", relation: "=", value: profile_id },
        ],
        contents: { en: `${name}, Someone Liked You.` },
        headings: { en: "Like Profile!!" },
      };
      await axios.post(
        "https://onesignal.com/api/v1/notifications",
        notificationData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Basic ${settings.one_hash}`,
          },
        }
      );

      res.success("Action created successfully!!!");
    }
  } catch (error) {
    next(error);
  }
};

exports.mapInfores = async (req, res, next) => {
  const { uid, lats, longs, radius_search } = req.body;
  try {
    if (!uid || !lats || !longs || !radius_search) {
      throw new BadRequestError("Invalid input");
    }
    const userData = await User.findOne({ where: { id: uid } });
    if (!userData) {
      throw new UnauthorizedError("Invalid user");
    }
    const actionData = await Action.findAll({
      where: { uid },
      attributes: [[fn("GROUP_CONCAT", col("profile_id")), "pro_id"]],
      raw: true,
    });
    const profileIds = actionData[0].pro_id
      ? `${uid},${actionData[0].pro_id}`
      : `${uid}`;
    const searchPreference = userData.search_preference;
    let whereClause = {
      id: { [Op.notIn]: profileIds.split(",") },
      [Op.and]: literal(
        `(((acos(sin((${lats}*pi()/180)) * sin((lats*pi()/180)) + cos((${lats}*pi()/180)) * cos((lats*pi()/180)) * cos(((${longs}-longs)*pi()/180))))*180/pi())*60*1.1515*1.609344) <= ${radius_search}`
      ),
    };
    if (searchPreference === "MALE" || searchPreference === "FEMALE") {
      whereClause.search_preference = searchPreference;
    }
    const otherProfiles = await User.findAll({ where: whereClause });

    const users = otherProfiles.map((row) => {
      const birthdateObj = DateTime.fromISO(row.birth_date);
      const currentDateObj = DateTime.now();
      const ageInterval = currentDateObj.diff(birthdateObj, "years").years;

      const matchRatio = calculateMatchRatio(userData, row);
      const distance = calculateDistance(lats, longs, row.lats, row.longs);

      return {
        profile_id: row.id.toString(),
        profile_name: row.name,
        profile_bio: row.profile_bio,
        is_verify: row.is_verify,
        profile_age: Math.floor(ageInterval),
        profile_lat: row.lats,
        profile_longs: row.longs,
        profile_distance: `${distance} KM`,
        profile_images: row.other_pic.split("$;"),
        match_ratio: matchRatio,
      };
    });
    res.success("Map Info Get Successfully!!!", {
      profilelist: users,
    });
  } catch (error) {
    next(error);
  }
};

exports.matchUser = async (req, res, next) => {
  const { uid, lats, longs } = req.body;
  try {
    if (!uid || !lats || !longs) {
      throw new BadRequestError("Invalid input");
    }
    const user = await User.findOne({ where: { id: uid } });
    const action = await Action.findAll({
      where: { uid },
      attributes: [
        [sequelize.fn("GROUP_CONCAT", sequelize.col("profile_id")), "pro_id"],
      ],
    });
    const profileIds = action[0].get("pro_id")
      ? `${uid},${action[0].get("pro_id")}`
      : uid;

    let queryOptions = {
      where: {
        id: { [Op.notIn]: profileIds.split(",") },
        search_preference: user.search_preference,
        [Op.and]: sequelize.literal(
          `(((acos(sin((${lats}*pi()/180)) * sin((lats*pi()/180)) + cos((${lats}*pi()/180)) * cos((lats*pi()/180)) * cos(((${longs}-longs)*pi()/180))))*180/pi())*60*1.1515*1.609344) <= ${user.radius_search}`
        ),
      },
      order: [["id", "DESC"]],
    };

    const otherProfiles = await User.findAll(queryOptions);
    const userProfiles = [];
    for (const profile of otherProfiles) {
      const birthDate = new Date(profile.birth_date);
      const age = new Date().getFullYear() - birthDate.getFullYear();
      const matchRatio = calculateMatchRatio(user, profile);
      const distance = calculateDistance(
        lats,
        longs,
        profile.lats,
        profile.longs
      );

      userProfiles.push({
        profile_id: profile.id.toString(),
        profile_name: profile.name,
        profile_bio: profile.profile_bio,
        is_verify: profile.is_verify,
        profile_age: age,
        profile_distance: `${distance} KM`,
        profile_images: profile.other_pic.split("$;"),
        match_ratio: matchRatio,
      });
    }
    res.success("Match User Get Successfully!!!", {
      profilelist: userProfiles,
    });
  } catch (error) {
    next(error);
  }
};

exports.getPassedUser = async (req, res, next) => {
  try {
    const { uid, lats, longs } = req.body;
    if (!uid || !lats || !longs) {
      throw new BadRequestError("Invalid input");
    }
    const user = await User.findOne({ where: { id: uid } });
    const action = await Action.findAll({
      where: { uid, action: "UNLIKE" },
      attributes: [
        [
          sequelize.fn("GROUP_CONCAT", sequelize.col("profile_id")),
          "liked_profile_id",
        ],
      ],
    });
    const likedProfileIds = action[0].get("liked_profile_id");
    if (likedProfileIds) {
      const otherProfiles = await User.findAll({
        where: {
          id: { [Op.in]: likedProfileIds.split(",") },
        },
      });
      const userProfiles = [];
      for (const profile of otherProfiles) {
        const blockActions = await Action.count({
          where: { profile_id: profile.id, action: "BLOCK" },
        });

        if (blockActions === 0) {
          const birthDate = new Date(profile.birth_date);
          const age = new Date().getFullYear() - birthDate.getFullYear();
          const matchRatio = calculateMatchRatio(user, profile);
          const distance = calculateDistance(
            lats,
            longs,
            profile.lats,
            profile.longs
          );

          userProfiles.push({
            profile_id: profile.id.toString(),
            profile_name: profile.name,
            profile_bio: profile.profile_bio,
            is_verify: profile.is_verify,
            profile_age: age,
            profile_distance: `${distance} KM`,
            profile_images: profile.other_pic.split("$;"),
            match_ratio: matchRatio,
          });
        }
      }
      res.success("Passed User Get Successfully!!!", {
        passedlist: userProfiles,
      });
    } else {
      res.success("No liked profile!!!" );
     
    }
  } catch (error) {
    next(error);
  }
};

exports.getListBlockMe = async (req, res, next) => {
  const { uid } = req.body;
  try {
    if (!uid) {
      throw new BadRequestError("Invalid input");
    }
    const blockedByMe = await Action.findAll({
      where: {
        uid: uid,
        action: "BLOCK",
      },
      attributes: ["profile_id"],
    });
    const blockedByOther = await Action.findAll({
      where: {
        profile_id: uid,
        action: "BLOCK",
      },
      attributes: ["uid"],
    });
    const blockByMeIds = blockedByMe.map((record) => record.profile_id);
    const blockByOtherIds = blockedByOther.map((record) => record.uid);

    res.success("Block Id List Get Successfully!!!", {
      block_by_me: blockByMeIds,
      block_by_other: blockByOtherIds,
    });
  } catch (error) {
    next(error);
  }
};
exports.getListFavorite = async (req, res, next) => {
  try {
    const { uid, lats, longs } = req.body;
    if (!uid || !lats || !longs) {
      throw new BadRequestError("Invalid input");
    }
    const user = await User.findOne({ where: { id: uid } });
    const likedProfiles = await Action.findAll({
      where: {
        uid: uid,
        action: "LIKE",
        action: { [Op.ne]: "BLOCK" },
      },
    });
    const userProfiles = [];
    for (const likedProfile of likedProfiles) {
      const mutualLike = await Action.count({
        where: {
          uid: likedProfile.profile_id,
          profile_id: uid,
          action: "LIKE",
        },
      });

      if (mutualLike > 0) {
        const profile = await User.findByPk(likedProfile.profile_id);
        const blockActions = await Action.count({
          where: {
            profile_id: likedProfile.profile_id,
            action: "BLOCK",
          },
        });

        if (blockActions === 0) {
          const birthDate = new Date(profile.birth_date);
          const age = new Date().getFullYear() - birthDate.getFullYear();
          const matchRatio = calculateMatchRatio(user, profile);
          const distance = calculateDistance(
            lats,
            longs,
            profile.lats,
            profile.longs
          );

          userProfiles.push({
            profile_id: profile.id.toString(),
            profile_name: profile.name,
            profile_bio: profile.profile_bio,
            is_verify: profile.is_verify,
            profile_age: age,
            profile_distance: `${distance} KM`,
            profile_images: profile.other_pic.split("$;"),
            match_ratio: matchRatio,
          });
        }
      }
    }
    res.success("Favorite User Get Successfully!!!", {
      favlist: userProfiles,
    });
  } catch (error) {
    next(error);
  }
};

exports.unblockUser = async (req, res, next) => {
  try {
    const { uid, profile_id } = req.body;
    if (!uid || !profile_id) {
      throw new BadRequestError("Invalid input");
    }
    await Action.destroy({
      where: {
        uid: uid,
        profile_id: profile_id,
        action: "BLOCK",
      },
    });
    res.success("User Unblocked Successfully!!!");
  } catch (error) {
    next(error);
  }
};

exports.unLikeUser = async (req, res, next) => {
  try {
    const { uid } = req.body;
    if (!uid) {
      throw new BadRequestError("Invalid input");
    }
    await Action.destroy({
      where: {
        uid: uid,
        action: "UNLIKE",
      },
    });
    res.success("User Unliked Successfully!!!");
  } catch (error) {
    next(error);
  }
};

exports.blockUser = async (req, res, next) => {
  try {
    const { uid, lats, longs } = req.body;
    if (!uid || !lats || !longs) {
      throw new BadRequestError("Invalid input");
    }
    const user = await User.findOne({ where: { id: uid } });
    const action = await Action.findAll({
      where: {
        uid: uid,
        action: "BLOCK",
      },
      attributes: [
        [
          sequelize.fn("GROUP_CONCAT", sequelize.col("profile_id")),
          "liked_profile_id",
        ],
      ],
    });
    const likedProfileIds = action[0].get("liked_profile_id");
    if (likedProfileIds) {
      const otherProfiles = await User.findAll({
        where: {
          id: { [Op.in]: likedProfileIds.split(",") },
        },
      });

      const userProfiles = [];

      for (const profile of otherProfiles) {
        const birthDate = new Date(profile.birth_date);
        const age = new Date().getFullYear() - birthDate.getFullYear();
        const matchRatio = calculateMatchRatio(user, profile);
        const distance = calculateDistance(
          lats,
          longs,
          profile.lats,
          profile.longs
        );

        userProfiles.push({
          profile_id: profile.id,
          profile_name: profile.name,
          profile_bio: profile.profile_bio,
          profile_age: age,
          profile_distance: `${distance} KM`,
          profile_images: profile.other_pic.split("$;"),
          match_ratio: matchRatio,
        });
      }

      res.success("Blocked profile Get Successfully!!!", {
        blocklist: userProfiles,
      });
    } else {
      res.success("No liked profile!!!" );
    }
  } catch (error) {
    next(error);
  }
};
exports.filterUser = async (req, res, next) => {
  try {
    const {
      uid,
      lats,
      longs,
      radius_search,
      search_preference,
      minage,
      maxage,
      interest,
      language,
      relation_goal,
      is_verify,
      religion,
    } = req.body;

    if (!uid || !lats || !longs) {
      throw new BadRequestError("Invalid input");
    }
    const user = await User.findOne({ where: { id: uid } });
    const action = await Action.findAll({
      where: {
        uid: uid,
      },
      attributes: [
        [sequelize.fn("GROUP_CONCAT", sequelize.col("profile_id")), "pro_id"],
      ],
    });
    const profileIds = action[0].get("pro_id")
      ? `${uid},${action[0].get("pro_id")}`
      : uid;

    const interestValues = interest.split(",");
    const languageValues = language.split(",");

    const interestConditions = interestValues.map((value) => ({
      [Op.and]: sequelize.literal(`FIND_IN_SET('${value}', interest) > 0`),
    }));

    const languageConditions = languageValues.map((value) => ({
      [Op.and]: sequelize.literal(`FIND_IN_SET('${value}', language) > 0`),
    }));
    let queryOptions = {
      where: {
        id: { [Op.notIn]: profileIds.split(",") },
        [Op.and]: [
          search_preference !== "0" ? { search_preference } : {},
          relation_goal !== "0" ? { relation_goal } : {},
          religion !== "0" ? { religion } : {},
          is_verify !== "0" ? { is_verify } : {},
          sequelize.literal(
            `birth_date BETWEEN DATE_SUB(CURDATE(), INTERVAL ${maxage} YEAR) AND DATE_SUB(CURDATE(), INTERVAL ${minage} YEAR)`
          ),
          sequelize.literal(
            `(((acos(sin((${lats}*pi()/180)) * sin((lats*pi()/180)) + cos((${lats}*pi()/180)) * cos((lats*pi()/180)) * cos(((${longs}-longs)*pi()/180))))*180/pi())*60*1.1515*1.609344) <= ${radius_search}`
          ),
        ],
        [Op.or]: interestConditions,
        [Op.or]: languageConditions,
      },
    };

    const otherProfiles = await User.findAll(queryOptions);

    const userProfiles = [];

    for (const profile of otherProfiles) {
      const birthDate = new Date(profile.birth_date);
      const age = new Date().getFullYear() - birthDate.getFullYear();
      const matchRatio = calculateMatchRatio(user, profile);
      const distance = calculateDistance(
        lats,
        longs,
        profile.lats,
        profile.longs
      );

      userProfiles.push({
        profile_id: profile.id,
        profile_name: profile.name,
        profile_bio: profile.profile_bio,
        is_verify: profile.is_verify,
        profile_age: age,
        profile_lat: profile.lats,
        profile_longs: profile.longs,
        profile_distance: `${distance} KM`,
        profile_images: profile.other_pic.split("$;"),
        match_ratio: matchRatio,
      });
    }
    res.success("Filter User Get Successfully!!!", {
      profilelist: userProfiles,
    });
  } catch (error) {
    next(error);
  }
};
exports.getHomePage = async (req, res, next) => {
  try {
    const { uid, lats, longs } = req.body;
    console.log(req.body);
    if (!uid || !lats || !longs) {
      throw new BadRequestError("Invalid input");
    }
    const user = await User.findOne({ where: { id: uid } });
    console.log("uid", user);
    if (!user) {
      throw new UnauthorizedError("Invalid user");
    }

    const action = await Action.findAll({
      where: {
        uid: uid,
      },
      attributes: [
        [sequelize.fn("GROUP_CONCAT", sequelize.col("profile_id")), "pro_id"],
      ],
    });
    const profileIds = action[0].get("pro_id")
      ? `${uid},${action[0].get("pro_id")}`
      : uid;
      console.log("profileIds", profileIds);

    let queryOptions = {
      where: {
        id: { [Op.notIn]: profileIds.split(",") },
        [Op.and]: sequelize.literal(
          `(((acos(sin((${lats}*pi()/180)) * sin((lats*pi()/180)) + cos((${lats}*pi()/180)) * cos((lats*pi()/180)) * cos(((${longs}-longs)*pi()/180))))*180/pi())*60*1.1515*1.609344) <= ${user.radius_search}`
        ),
      },
    };

    if (user.search_preference === "MALE") {
      queryOptions.where.search_preference = "MALE";
    } else if (user.search_preference === "FEMALE") {
      queryOptions.where.search_preference = "FEMALE";
    }
    console.log("queryOptions", queryOptions);

    const otherProfiles = await User.findAll(queryOptions);

    const userProfiles = [];
    console.log("otherProfiles", otherProfiles);
    for (const profile of otherProfiles) {
      const birthDate = new Date(profile.birth_date);
      const age = new Date().getFullYear() - birthDate.getFullYear();
      const matchRatio = calculateMatchRatio(user, profile);
      const distance = calculateDistance(
        lats,
        longs,
        profile.lats,
        profile.longs
      );
      console.log("otherProfiles", "123");

      userProfiles.push({
        profile_id: profile.id,
        profile_name: profile.name,
        is_subscribe: profile.is_subscribe,
        profile_bio: profile.profile_bio,
        is_verify: profile.is_verify,
        profile_age: age,
        profile_distance: `${distance} KM`,
        profile_images: profile.other_pic.split("$;"),
        match_ratio: matchRatio,
      });
    }

    const likedProfiles = await Action.findAll({
      where: {
        uid: uid,
        action: "LIKE",
      },
    });
    const mutualLikes = [];

    for (const likedProfile of likedProfiles) {
      const mutualLike = await Action.count({
        where: {
          uid: likedProfile.profile_id,
          profile_id: uid,
          action: "LIKE",
        },
      });

      if (mutualLike > 0) {
        const viewAction = await Action.count({
          where: {
            uid: uid,
            profile_id: likedProfile.profile_id,
            action: "VIEW",
          },
        });

        if (viewAction === 0) {
          const profile = await User.findByPk(likedProfile.profile_id);
          const birthDate = new Date(profile.birth_date);
          const age = new Date().getFullYear() - birthDate.getFullYear();
          const matchRatio = calculateMatchRatio(user, profile);
          const distance = calculateDistance(
            lats,
            longs,
            profile.lats,
            profile.longs
          );

          mutualLikes.push({
            profile_id: profile.id,
            profile_name: profile.name,
            is_subscribe: profile.is_subscribe,
            profile_bio: profile.profile_bio,
            is_verify: profile.is_verify,
            profile_age: age,
            profile_distance: `${distance} KM`,
            profile_images: profile.other_pic.split("$;"),
            match_ratio: matchRatio,
            last_available: profile.last_available,
          });
        }
      }
    }
    const plan = await Plan.findByPk(user.plan_id);
    const history = await PlanPurchaseHistory.findByPk(user.history_id);

    const planData =
      user.plan_id === 0 || !history
        ? {
            plan_title: "",
            plan_start_date: "",
            plan_end_date: "",
            trans_id: "",
            p_name: "",
            amount: "",
            plan_description: "",
          }
        : {
            plan_title: history.plan_title,
            plan_start_date: history.start_date,
            plan_end_date: history.expiry_date,
            trans_id: history.trans_id,
            p_name: history.p_name,
            amount: history.amount,
            plan_description: history.plan_description,
          };
    res.success("Home Data Get Successfully!!!", {
      profilelist: userProfiles,
      currency: "VND",
      totalliked: mutualLikes,
      direct_chat: plan ? plan.direct_chat : "0",
      Like_menu: plan ? plan.Like_menu : "0",
      audio_video: plan ? plan.audio_video : "0",
      filter_include: plan ? plan.filter_include : "0",
      plan_name: plan ? plan.title : "FREE",
      plan_id: user.plan_id.toString(),
      plan_description: plan ? plan.description : "",
      is_subscribe: user.is_subscribe.toString(),
      plandata: planData,
      chat: plan ? plan.chat.toString() : "0",
      is_verify: user.is_verify.toString(),
      last_available: user.last_available,
    });
  } catch (error) {
    next(error);
  }
};
exports.viewProfile = async (req, res, next) => {
  try {
    const { uid, profile_id } = req.body;
    if (!uid || !profile_id) {
      throw new BadRequestError("Invalid input");
    }
    const check = await Action.count({
      where: {
        uid: uid,
        profile_id: profile_id,
        action: "VIEW",
      },
    });
    if (check > 0) {
      throw new BadRequestError("Already Viewed");
    } else {
      await Action.create({
        uid: uid,
        profile_id: profile_id,
        action: "VIEW",
      });
      res.success("Profile Viewed Successfully!!!");
    }
  } catch (error) {
    next(error);
  }
};
exports.getProfileInfores = async (req, res, next) => {
  try {
    const { uid, profile_id, lats, longs } = req.body;
    if (!uid || !profile_id || !lats || !longs) {
      throw new BadRequestError("Invalid input");
    }
    const user = await User.findOne({ where: { id: uid } });
    const otherProfile = await User.findByPk(profile_id);

    const birthDate = new Date(otherProfile.birth_date);
    const age = new Date().getFullYear() - birthDate.getFullYear();
    const matchRatio = calculateMatchRatio(user, otherProfile);
    const distance = calculateDistance(
      lats,
      longs,
      otherProfile.lats,
      otherProfile.longs
    );

    const relationGoal = await Relation.findByPk(otherProfile.relation_goal);
    const religion = await Religion.findByPk(otherProfile.religion);

    const interests = await Interest.findAll({
      where: {
        id: { [Op.in]: otherProfile.interest.split(",") },
      },
      attributes: ["title", "img"],
    });

    const languages = await Language.findAll({
      where: {
        id: { [Op.in]: otherProfile.language.split(",") },
      },
      attributes: ["title", "img"],
    });

    const profileInfo = {
      profile_id: otherProfile.id.toString(),
      profile_name: otherProfile.name,
      profile_bio: otherProfile.profile_bio,
      profile_age: age,
      profile_distance: `${distance} KM`,
      profile_images: otherProfile.other_pic.split("$;"),
      match_ratio: matchRatio,
      is_verify: otherProfile.is_verify,
      height: otherProfile.height,
      relation_title: relationGoal.title,
      relation_subtitle: relationGoal.subtitle,
      religion_title: religion.title,
      interest_list: interests,
      language_list: languages,
    };
    res.success("Profile Info Get Successfully!!!", {
      profileinfo: profileInfo,
    });
  } catch (error) {
    next(error);
  }
};
exports.blockProfile = async (req, res, next) => {
  try {
    const { uid, profile_id } = req.body;
    if (!uid || !profile_id) {
      throw new BadRequestError("Invalid input");
    }
    const check = await Action.count({
      where: {
        uid: uid,
        profile_id: profile_id,
        action: "BLOCK",
      },
    });
    if (check > 0) {
      throw new BadRequestError("Already Blocked");
    } else {
      await Action.create({
        uid: uid,
        profile_id: profile_id,
        action: "BLOCK",
      });
      res.success("Profile Blocked Successfully!!!");
    }
  } catch (error) {
    next(error);
  }
};
