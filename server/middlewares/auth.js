
const jwt = require("jsonwebtoken");
require("dotenv").config();
const User=require("../models/User")

// auth
exports.auth = async (req, res, next) => {
  try {
    // extract token
    const token =
      req.cookies.token ||
      req.body.token ||
      req.header("Authorization").replace("Bearer ", "");

      // (req.headers.authorization && req.headers.authorization.replace("Bearer ", ""));
      console.log("token",token)

    //  validate token, if token is missing return response
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "token is missing",
      });
    }

    // verification of token
    try {
      const decode = jwt.verify(token, process.env.JWT_SECRET);
      console.log(decode);
      req.user = decode;
    } catch (error) {
      //   verification Issue
      return res.status(401).json({
        success: false,
        message: "token is Invalid",
      });
    }
    next();
  }
   catch (error) {
    console.error("Error while processing the token:", error.message);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while validating the token",
    });
  }
};

// isStudent

exports.isStudent= async (req,res,next)=>{

  try {
		const userDetails = await User.findOne({ email: req.user.email });

		if (userDetails.accountType !== "Student") {
			return res.status(401).json({
				success: false,
				message: "This is a Protected Route for Students",
			});
		}
		next();
	} catch (error) {
		return res
			.status(500)
			.json({ success: false, message: `User Role Can't be Verified` });
	}

  // OLD CODE
    // try{
    //    if(req.user.accountType!=="Student"){
    //       return res.status(401).json({
    //         success:false,
    //         message:"This is protected route fo Student only"
    //       }
    //       )
    //    }
    //    next();
    // }
    // catch(err)
    // { 
    //     return res.status(500).json({
    //         success:false,
    //         message:"User role cannot be verified, please try again"
    //     })

    // }
}

// isInstructor
exports.isInstructor= async (req,res,next)=>{
  try {
		const userDetails = await User.findOne({ email: req.user.email });
		console.log(userDetails);

		console.log(userDetails.accountType);

		if (userDetails.accountType !== "Instructor") {
			return res.status(401).json({
				success: false,
				message: "This is a Protected Route for Instructor",
			});
		}
		next();
	} catch (error) {
		return res
			.status(500)
			.json({ success: false, message: `User Role Can't be Verified` });
	}
}
// isAdmin
exports.isAdmin= async (req,res,next)=>{
    try{
      
      console.log("Printing AccountType ", req.user.accountType);
       if(req.user.accountType!=="Admin"){
          return res.status(401).json({
            success:false,
            message:"This is protected route fo Admin only"
          }
          )
       }
       next();
    }
    catch(err)
    { 
        return res.status(500).json({
            success:false,
            message:"User role cannot be verified, please try again"
        })

    }
}