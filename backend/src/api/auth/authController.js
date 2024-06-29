const userSchema = require("../../models/user");
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { message } = require("../../common/messages");
const { jsonResponse } = require("../../common/jsonResponse");

dotenv.config({ path: "./.env" });

exports.signUp = async (req, res) => {
  let status = false;

  try {
    console.log(req.body);
    const { email, password, firstName, lastName, role } = req.body;

    const CheckUserExist = await userSchema.findOne({ email });
    if (CheckUserExist) {
      return jsonResponse(res, 500, status, message.user.emailExist);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await userSchema.create({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      role,
    });

    status = true;

    return jsonResponse(res, 200, status, message.user.signUpSuccessfully);
  } catch (error) {
    console.log(error.message, "error occurred in signup");
    return jsonResponse(
      res,
      500,
      status,
      message.common.serverError,
      error.message
    );
  }
};

exports.login = async (req, res) => {
  let status = false;

  try {
    const { email, password } = req.body;

    const user = await userSchema.findOne({ email });
    if (!user) {
      return jsonResponse(res, 400, status, message.user.emailNotExist);
    }

    // Verify Password
    const verifyPassword = await bcrypt.compare(password, user.password);

    // console.log(verifyPassword)
    if (!verifyPassword) {
      return jsonResponse(res, 400, status, message.user.invalidCredentials);
    }

    // Generate jwt token
    const payload = {
      email: user.email,
      id: user._id,
      accountType: user.accountType,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET);

    user.token = token;
    user.password = undefined;

    status = true;

    return jsonResponse(res, 200, status, message.user.signInSuccessfully, {
      token,
    });
  } catch (error) {
    return jsonResponse(
      res,
      500,
      status,
      message.common.serverError,
      error.message
    );
  }
};
