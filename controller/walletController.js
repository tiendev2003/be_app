const User = require("../models/userModel.js");
const WalletReport = require("../models/walletReportModel.js");
const { BadRequestError } = require("../utils/customErrors.js");

exports.walletReport = async (req, res, next) => {
  try {
    const { uid } = req.body;
    if (!uid) {
      throw new BadRequestError("uid is required");
    }
    const user = await User.findOne({ where: { id: uid } });
    if (!user) {
      throw new BadRequestError("User not found");
    }
    const walletReports = await WalletReport.findAll({
      where: { uid },
      order: [["id", "DESC"]],
      attributes: ["message", "status", "amt"],
    });

    let creditTotal = 0;
    let debitTotal = 0;
    const walletItems = walletReports.map((report) => {
      if (report.status === "Credit") {
        creditTotal += report.amt;
      } else {
        debitTotal += report.amt;
      }
      return {
        message: report.message,
        status: report.status,
        amt: report.amt,
      };
    });
    res.success("Wallet Report Get Successfully!", {
        Walletitem: walletItems,
        wallet: user.wallet,
    });
  } catch (error) {
    next(error);
  }
};
