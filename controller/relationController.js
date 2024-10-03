// crud relation
// get all relation
const Relation = require("../models/relationModel.js");
exports.getAllRelation = async (req, res, next) => {
  try {
    // select all relation where status = 1
    const relations = await Relation.findAll({ where: { status: 1 } });
    res.success("Success", { goallist: relations });
  } catch (error) {
    next(error);
  }
};

// create relation
exports.createRelation = async (req, res, next) => {
  const { title, subtitle} = req.body;
  try {
    const newRelation = await Relation.create({ title, subtitle });
    res.success("Success", { goallist: newRelation });
  } catch (error) {
    next(error);
  }
};

// update relation
exports.updateRelation = async (req, res, next) => {
  const { id } = req.params;
  const { title, subtitle, status } = req.body;
  try {
    const relation = await Relation.findOne({ where: { id } });
    if (!relation) {
      return res.error("Relation not found", 404);
    }
    relation.title = title;
    relation.subtitle = subtitle;
    relation.status = status;
    await relation.save();
    res.success("Success", { goallist: relation });
  } catch (error) {
    next(error);
  }
};

// delete relation
exports.deleteRelation = async (req, res, next) => {
  const { id } = req.params;
  try {
    const relation = await Relation.findOne({ where: { id } });
    if (!relation) {
      return res.error("Relation not found", 404);
    }
    await relation.destroy();
    res.success("Success", { goallist: relation });
  } catch (error) {
    next(error);
  }
};