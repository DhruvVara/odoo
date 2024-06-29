const userSchema = require("../../models/user");
const dotenv = require("dotenv");
const { message } = require("../../common/messages");
const { jsonResponse } = require("../../common/jsonResponse");

dotenv.config({ path: "./.env" });


exports.getUserData = async (req, res) => {
    let status = false;
  
    try {
      const user = await userSchema.find();
  
      if (!user) {
        console.log("No users found");
        return jsonResponse(res, 404, status, "User not found.");
      }
  
      status = true;
      
      // Log the user data
    //   console.log("User data:", JSON.stringify(user, null, 2));
      
      return jsonResponse(res, 200, status, "User data fetched successfully.", user);
    } catch (error) {
      console.log("Error occurred while fetching user data:", error.message);
      return jsonResponse(
        res,
        500,
        status,
        message.common.serverError,
        error.message
      );
    }
  };