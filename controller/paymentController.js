const PaymentList = require("../models/paymentModel.js");
const { BadRequestError } = require("../utils/customErrors.js");
const { deleteFile } = require("../utils/fileUpload.js");

exports.createPayment = async (req, res, next) => {
  try {
    const { title, img, attributes, subtitle, p_show, status } = req.body;
    if (!title || !attributes || !p_show || !status) {
      if (!title || !attributes || !p_show || !status) {
        deleteFile(req.file);
      }
      throw new BadRequestError("Missing required fields");
    }
    let image = "";
    if (!req.file) {
      throw new BadRequestError("Image is required");
    }
    if (req.file) {
      image = "\\" + req.file.path;
    }
    const payment = await PaymentList.create({
      title,
      img: image,
      attributes,
      subtitle,
      p_show,
      status,
    });
    res.success("Payment created successfully", { Payment: payment });
  } catch (error) {
    next(error);
  }
};

exports.getPayments = async (req, res, next) => {
  try {
    const payments = await PaymentList.findAll({ where: { status: "1" } });
    res.success("Payment list", { paymentdata: payments });
  } catch (error) {
    next(error);
  }
};

exports.updatePayment = async (req, res, next) => {
  try {
    const { id, title, img, attributes, subtitle, p_show, status } = req.body;
    if (!id) {
      throw new BadRequestError("id is required");
    }
    await PaymentList.update(
      {
        title,
        img,
        attributes,
        subtitle,
        p_show,
        status,
      },
      {
        where: { id },
      }
    );
    const updatedPayment = await PaymentList.findOne({ id });
    res.success("Payment updated successfully", { Payment: updatedPayment });
  } catch (error) {
    next(error);
  }
};

exports.deletePayment = async (req, res, next) => {
  try {
    const { id } = req.body;
    if (!id) {
      throw new BadRequestError("id is required");
    }
    const payment = await PaymentList.findOne({ where: { id } });

    if (!payment) {
      throw new BadRequestError("Payment not found");
    }
    await payment.destroy();
    res.success("Payment deleted successfully ");
  } catch (error) {
    next(error);
  }
};

exports.getPaymentById = async (req, res, next) => {
  try {
    const { id } = req.body;
    if (!id) {
      throw new BadRequestError("id is required");
    }
    const payment = await PaymentList.findOne({ where: { id } });
    if (!payment) {
      throw new BadRequestError("Payment not found");
    }
    res.success("Payment get successfully", { Payment: payment });
  } catch (error) {
    next(error);
  }
};

exports.getPaymentReturn = async (req, res, next) => {
  console.log(req.body);
  return res.success("Payment get successfully", { Payment: "payment" });
};
