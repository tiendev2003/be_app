// login,reigster, forgotPassword, resetPassword, updatePassword

const { Sequelize } = require("sequelize");
const Setting = require("../models/settingModel.js");
const User = require("../models/userModel.js");
const { default: WalletReport } = require("../models/walletReportModel.js");
const { BadRequestError, NotFoundError } = require("../utils/customErrors.js");
const { deleteFiles, processFileUploads } = require("../utils/fileUpload.js");
const { generateRandomCode } = require("../utils/hashPassword.js");
exports.register = async (req, res, next) => {
  const {
    name,
    email,
    mobile,
    password,
    ccode,
    refercode,
    gender,
    birth_date,
    search_preference,
    radius_search,
    relation_goal,
    profile_bio,
    interest,
    language,
    lats,
    longs,
    religion,
  } = req.body;
  try {
    console.log(req.body);
    if (!name || !email || !password || !mobile || !ccode) {
      throw new BadRequestError("Missing required fields");
    }
    // existing email check
    const existingEmail = await User.findOne({ where: { email } });
    if (existingEmail) {
      if (req.files) {
        deleteFiles(req.files);
      }
      throw new BadRequestError("Email already exists");
    }
    // existing mobile check
    const existingMobile = await User.findOne({ where: { mobile } });
    if (existingMobile) {
      if (req.files) {
        deleteFiles(req.files);
      }
      throw new BadRequestError("Mobile already exists");
    }
    const setting = await Setting.findOne();
    if (!setting) {
      if (req.files) {
        deleteFiles(req.files);
      }
      throw new BadRequestError("Setting not found");
    }

    const hashedPassword = password;
    // kieerm tra xem co ton tai refercode khong
    if (refercode) {
      const existingRefercode = await User.findOne({
        where: { code: refercode },
      });
      if (!existingRefercode) {
        if (req.files) {
          deleteFiles(req.files);
        }
        throw new BadRequestError("Refercode not found");
      }
      const prentCode = generateRandomCode();
      //   select settin

      // tao moi user
      const fin = setting.scredit;
      let uploadedFiles = [];
      if (!req.files || req.files.length === 0) {
        throw new BadRequestError("No files uploaded");
      }
      if (req.files.length > 0) {
        uploadedFiles = processFileUploads(req.files);
      }
      let newUser = await User.create({
        name,
        email,
        mobile,
        password: hashedPassword,
        ccode,
        code: prentCode,
        refercode,
        gender,
        birth_date,
        search_preference,
        radius_search,
        relation_goal,
        profile_bio,
        interest,
        language,
        lats,
        longs,
        religion,
        wallet: fin,
        other_pic: uploadedFiles.join("$;"),
      });
      // luw vao wallet report
      const walletReport = await WalletReport.create({
        uid: newUser.id,
        message: "Registration",
        status: "Credit",
        amt: setting.scredit,
      });
      // thay dđoôiổi hash password sang plain password truoc khi tra ve client
      newUser.password = password;

      res.sucess("User created successfully", {
        UserLogin: newUser,
        currency: setting.currency,
      });
    } else {
      const prentCode = generateRandomCode();
      let uploadedFiles = [];

      if (!req.files || req.files.length === 0) {
        throw new BadRequestError("No files uploaded");
      }
      if (req.files.length > 0) {
        uploadedFiles = processFileUploads(req.files);
      }
      let newUser = await User.create({
        name,
        email,
        mobile,
        password: hashedPassword,
        ccode,
        code: prentCode,

        gender,
        birth_date,
        search_preference,
        radius_search,
        relation_goal,
        profile_bio,
        interest,
        language,
        lats,
        longs,
        religion,
        other_pic: uploadedFiles.join("$;"),
      });

      // thay dđoôiổi hash password sang plain password truoc khi tra ve client
      newUser.password = password;

      res.success("Success", {
        UserLogin: newUser,
        currency: setting.currency,
      });
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
};

exports.login = async (req, res, next) => {
  const { mobile, password, ccode } = req.body;
  try {
    console.log(req.body);
    if (!mobile || !password || !ccode) {
      throw new BadRequestError("Missing required fields");
    }
    //  login with mobile or email
    let user = await User.findOne({
      where: {
        [Sequelize.Op.or]: [{ email: mobile }, { mobile: mobile }],
        ccode,
      },
    });

    if (!user) {
      throw new NotFoundError("User not found");
    }
    if (password !== user.password) {
      throw new BadRequestError("Invalid password");
    }

    // thay dđoôiổi hash password sang plain password truoc khi tra ve client
    user.password = password;
    res.success("Login successful", {
      UserLogin: user,
    });
  } catch (error) {
    next(error);
  }
};
exports.loginSocial = async (req, res, next) => {
  const { email } = req.body;
  try {
    if (!email) {
      throw new BadRequestError("Missing required fields");
    }
    let user = await User.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundError("User not found");
    }
    if (user.status !== 1) {
      throw new BadRequestError("User is not active");
    }
    // chuyeêển hash password sang plain password truoc khi tra ve client sau khi layáy dđuôôc user
    user.password = "";

    res.success("Login successful", {
      UserLogin: user,
    });
  } catch (error) {
    next(error);
  }
};
exports.checkMobile = async (req, res, next) => {
  try {
    const { mobile, ccode } = req.body;
    if (!mobile || !ccode) {
      throw new BadRequestError("Mobile and ccode are required");
    }
    const user = await User.findOne({ where: { mobile, ccode } });
    if (user) {
      throw new BadRequestError("Mobile number already exists");
    }
    res.success("Mobile number is available");
  } catch (error) {
    next(error);
  }
};
