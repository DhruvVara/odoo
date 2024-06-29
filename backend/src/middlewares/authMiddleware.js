const jwt = require("jsonwebtoken");
const userSchema = require("../models/user");
const { jsonResponse } = require("../common/jsonResponse");
const { message } = require("../common/messages");

exports.auth = async (req, res, next) => {
  try {
    const token = req.headers("token");

    if (!token) {
      return jsonResponse(res, 401, false, message.common.unauthorisedAccess);
    }

    // Verify token
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decode.userId;
    req.role = decode.role;

    next();
  } catch (error) {
    // console.log(error.message);
    return jsonResponse(
      res,
      500,
      false,
      message.common.serverError,
      error.message
    );
  }
};

exports.isAdministrator = async (req, res, next) => {
  try {
    if (req.role !== "Administrator") {
      return jsonResponse(res, 401, false, message.common.unauthorisedAccess);
    }
    next();
  } catch (error) {
    // console.log(error.message,)
    return jsonResponse(
      res,
      500,
      false,
      message.common.unauthorisedAccess,
      error.message
    );
  }
};

exports.isInvigilator = async (req, res, next) => {
  try {
    if (req.role !== "Invigilator") {
      return jsonResponse(res, 401, false, message.common.unauthorisedAccess);
    }
    next();
  } catch (error) {
    // console.log(error.message,)
    return jsonResponse(
      res,
      500,
      false,
      message.common.unauthorisedAccess,
      error.message
    );
  }
};
