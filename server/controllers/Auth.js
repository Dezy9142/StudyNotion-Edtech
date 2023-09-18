const User = require("../models/User");
const OTP = require("../models/Otp");
const otpGenerator = require("otp-generator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mailSender = require("../utils/mailSender");
const { passwordUpdated } = require("../mail/template/passwordUpdate");
const Profile = require("../models/Profile");
require("dotenv").config();

// #### sendOTp  ####

// #### sendOTp  ####
exports.sendOTP = async (req, res) => {
  try {
    const { email } = req.body

    // Check if user is already present
    // Find user with provided email
    const checkUserPresent = await User.findOne({ email })
    // to be used in case of signup

    // If user found with provided email
    if (checkUserPresent) {
      // Return 401 Unauthorized status code with error message
      return res.status(401).json({
        success: false,
        message: `User is Already Registered`,
      })
    }

    var otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    })
    const result = await OTP.findOne({ otp: otp })
    console.log("Result is Generate OTP Func")
    console.log("OTP", otp)
    console.log("Result", result)
    while (result) {
      otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
      })
    }
    const otpPayload = { email, otp }
    const otpBody = await OTP.create(otpPayload)
    console.log("OTP Body", otpBody)
    res.status(200).json({
      success: true,
      message: `OTP Sent Successfully`,
      otp,
    })
  } catch (error) {
    console.log(error.message)
    return res.status(500).json({ success: false, error: error.message })
  }
};

// #####    signUp    ######
exports.signUP = async (req, res) => {
  try {
    // data fetch from req body
    const {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      accountType,
      contactNumber,
      otp,
    } = req.body;

    // validate data,agar enme se koi empty h toh return response and accountType you get one vlaue from toggle  ,contactNumber is not mandatory
    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !confirmPassword ||
      !otp
    ) {
      return res.status(403).json({
        success: false,
        message: "All field are required ",
      });
    }

    // check both password match or not
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message:
          "Password and ConfirmPassword value does'nt match   ,Please try again",
      });
    }

    // check user is alraedy exist or not
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already registered",
      });
    }

    //  find most recent OTP for the User && HW:: CHECK how it is work
    const recentOtp = await OTP.find({ email })
      .sort({ createdAt: -1 })
      .limit(1);
    console.log(recentOtp);

    // validate OTP
    if (recentOtp.length === 0) {
      // otp not found
      return res.status(400).json({
        success: false,
        message: "OTP not Found",
      });
    } else if (otp !== recentOtp[0].otp) {
      // invalid otp
      return res.status(400).json({
        status: false,
        message: "Invalid OTP",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user
    let approved = "";
    approved === "Instructor" ? (approved = false) : (approved = true);

    // for additional details we pass profiledetails and for id we must save/create entry inside db
    const profileDetails = await Profile.create({
      gender: null,
      dateOfBirth: null,
      about: null,
      contactNumber: null,
    });

    // create entry in db
    const user = await User.create({
      firstName,
      lastName,
      email,
      contactNumber,
      password: hashedPassword,
      accountType: accountType,
      approved: approved,
      additionalDetails: profileDetails._id,
      image: `https://avatars.dicebear.com/api/initials/${firstName} ${lastName}.svg`,
    });

    // return res

    return res.status(200).json({
      success: true,
      user,
      message: "User is successfully registered",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "user does'nt registered ,Please try again later",
    });
  }
};

// #####  Login controllers  ######

exports.login = async (req, res) => {
  try {
    //  get data from req body
    const { email, password } = req.body;

    //  validation of data
    if (!email || !password) {
      return res.status(403).json({
        success: false,
        message: "ALL fields are required, please try again",
      });
    }

    // check user email exist or not
    const user = await User.findOne({ email }).populate("additionalDetails");

    if (!user) {
      return res.status(401).json({
        status: false,
        message: "user is not registered, please signUp first",
      });
    }
    // generate jwt, after password is match
 
      // jwt.sign use  to create jwt token and it contain three things ,data(payload) that u want to insert
      // process.env.JWT_SECRET: This is the secret key used to sign the token
      if (await bcrypt.compare(password, user.password)) {
        const token = jwt.sign(
          { email: user.email, id: user._id, accountType: user.accountType },
          process.env.JWT_SECRET,
          {
            expiresIn: "24h",
          }
        );
  
      
      user.token = token;
      user.password = undefined;

      //  create cookie and send response
      const options = {
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        httpOnly: true,
      };
      res.cookie("token", token, options).status(200).json({
        success: true,
        token,
        user,
        message: `User Login Success`,
      });
    } else {
      res.status(401).json({
        success: false,
        message: "Password is Incorrect",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Login failure ,Please try again",
    });
  }
};

//HW:: changePassword=controller

exports.changePassword = async (req, res) => {
  try{
    //get data from req body
    const userDetails = await User.findById(req.user.id);

    //get oldPassword, newPassword, confirmNewPassowrd
    const {oldPassword, newPassword, confirmNewPassword} = req.body;

    //validation of oldPass
    const isPasswordMatch = await bcrypt.compare(
        oldPassword, 
        userDetails.password,
    )
    if (!isPasswordMatch) {
        // If old password does not match, return a 401 (Unauthorized) error
        return res
        .status(401)
        .json({
            success: false,
            message: "The password is incorrect" 
            });
    }

    //update pwd in DB
    const encryptedPassword = await bcrypt.hash(newPassword, 10);
    const updatedUserDetails = await User.findByIdAndUpdate(
        req.user.id,
        {password: encryptedPassword},
        {new : true},
    )

    //send mail - Password updated
    try{
        const emailResponse = await mailSender(
    updatedUserDetails.email,
            `Password updated successfully for ${updatedUserDetails.firstName} ${updatedUserDetails.lastName}`,
    passwordUpdated(
      updatedUserDetails.email,
      `${updatedUserDetails.firstName} ${updatedUserDetails.lastName}`
    )
  );
  console.log("Email sent successfully:", emailResponse.response);
    } catch(error){
        // If there's an error sending the email, log the error and return a 500 (Internal Server Error) error
  console.error("Error occurred while sending email:", error);
  return res.status(500).json({
    success: false,
    message: "Error occurred while sending email",
    error: error.message,
  });

    }

    //return final response
    return res
  .status(200)
  .json({ success: true,
             message: "Password updated successfully"
            });

} catch(error) {
    // If there's an error updating the password, log the error and return a 500 (Internal Server Error) error
console.error("Error occurred while updating password:", error);
return res.status(500).json({
  success: false,
  message: "Error occurred while updating password",
  error: error.message,
});
}
};
