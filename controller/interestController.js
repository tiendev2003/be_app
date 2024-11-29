// crud

// get all interest
const Interest = require("../models/interestModel.js");
const { deleteFile } = require("../utils/fileUpload.js");

exports.getAllInterest = async (req, res, next) => {
  try {
    // select all interest where status = 1
    const interests = await Interest.findAll({ where: { status: 1 } });
    res.success("Success", { interestlist: interests });
  } catch (error) {
    next(error);
  }
};
exports.getInterestByAdmin = async (req, res, next) => {
  console.log("getInterestByAdmin");
  try {
    const interests = await Interest.findAll();
    res.success("Success", { interestlist: interests });
  } catch (error) {
    next(error);
  }
}

exports.getInterestById = async (req, res, next) => {
  const { id } = req.params;
  try {
    const interest = await Interest.findOne({ where: { id } });
    if (!interest) {
      return res.error("Interest not found", 404);
    }
    res.success("Success", { interestlist: interest });
  } catch (error) {
    next(error);
  }
}

// create interest
exports.createInterest = async (req, res, next) => {
  const { title } = req.body;
  try {
    //  interest have title and file imageg
 // check if file is not uploaded
    if (!req.file) {
      return res.error("Image is required", 400);
    }
    // check title is unique
    const interest = await Interest.findOne({ where: { title } });
    if (interest) {
      return res.error("Title already exist", 400);
    }
    // create interest
    const newInterest = await Interest.create({
      title,
      img: req.file.path,
    });
    res.success("Success", { InterestData: newInterest });
  } catch (error) {
    next(error);
  }
};

// update interest
exports.updateInterest = async (req, res, next) => {
  const { id } = req.params;
  const { title } = req.body;
  try {
    const interest = await Interest.findOne({ where: { id } });
    if (!interest) {
        if (req.file){
            deleteFile(req.file.path);
        }
      return res.error("Interest not found", 404);
    }
    interest.title = title;
    // check if file is uploaded
    if (req.file) {
      interest.img = req.file.path;
    }
    await interest.save();
    
    res.success("Success", { interestlist: interest });
  } catch (error) {
    next(error);
  }
};

// delete interest
exports.deleteInterest = async (req, res, next) => {
  const { id } = req.params;
  try {
    const interest = await Interest.findOne({ where: { id } });
    if (!interest) {
      return res.error("Interest not found", 404);
    }
    await interest.destroy();
    deleteFile(interest.img);
    res.success("Success", { InterestData: interest });
  } catch (error) {
    next(error);
  }
};