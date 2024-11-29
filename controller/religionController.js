// crud religion
// get all religion
const Religion = require("../models/religionModel.js");
exports.getAllReligion = async (req, res, next) => {
  try {
    // select all religion where status = 1
    const religions = await Religion.findAll({ where: { status: 1 } });
    res.success("Success", { religionlist: religions });
  } catch (error) {
    next(error);
  }
};

exports.getAllByAdmin = async (req, res, next) => {
  try {
     const religions = await Religion.findAll();
    res.success("Success", { religionlist: religions });
  } catch (error) {
    next(error);
  }
}

// create religion
exports.createReligion = async (req, res, next) => {
  const { title, status } = req.body;
  try {
    const religion = await Religion.findOne({ where: { title } });
    if (religion) {
      return res.error("Religion already exist", 400);
    }
    const newReligion = await Religion.create({ title, status });
    res.success("Success", { religionlist: newReligion });
  } catch (error) {
    next(error);
  }
};

// update religion
exports.updateReligion = async (req, res, next) => {
  const { id } = req.params;
  const { title, status } = req.body;
  console.log(req.body);
  try {
    const religion = await Religion.findOne({ where: { id } });
    if (!religion) {
      return res.error("Religion not found", 404);
    }
    religion.title = title;
    religion.status = status;
    await religion.save();
    res.success("Success", { religionlist: religion });
  } catch (error) {
    next(error);
  }
};

// delete religion
exports.deleteReligion = async (req, res, next) => {
  const { id } = req.params;
  try {
    const religion = await Religion.findOne({ where: { id } });
    if (!religion) {
      return res.error("Religion not found", 404);
    }
    
    await religion.destroy();
    res.success("Success", { religionlist: religion });
  } catch (error) {
    console.log(error);
    next(error);
  }
};


exports.getReligionById = async (req, res, next) => {
  const { id } = req.params;
  try {
    const religion = await Religion.findOne({ where: { id } });
    if (!religion) {
      return res.error("Religion not found", 404);
    }
    res.success("Success", { religionlist: religion });
  } catch (error) {
    next(error);
  }
}