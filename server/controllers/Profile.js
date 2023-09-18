const Profile = require("../models/Profile");
const User = require("../models/User");
const { uploadImageToCloudinary } = require("../utils/imageUploader");
const { convertSecondsToDuration } = require("../utils/secToDuration");
const CourseProgress = require("../models/CourseProgress");
const { mongoose } = require("mongoose");
const Course = require("../models/Course");
//####### update profile handler ####

exports.updateProfile = async (req, res) => {
  try {
    const {
      firstName = "",
      lastName = "",
      dateOfBirth = "",
      about = "",
      contactNumber = "",
      gender = "",
    } = req.body;
    const id = req.user.id;

    // Find the profile by id
    const userDetails = await User.findById(id);
    const profile = await Profile.findById(userDetails.additionalDetails);

    const user = await User.findByIdAndUpdate(id, {
      firstName,
      lastName,
    });
    await user.save();

    // Update the profile fields
    profile.dateOfBirth = dateOfBirth;
    profile.about = about;
    profile.contactNumber = contactNumber;
    profile.gender = gender;

    // Save the updated profile
    await profile.save();

    // Find the updated user details
    const updatedUserDetails = await User.findById(id)
      .populate("additionalDetails")
      .exec();

    return res.json({
      success: true,
      message: "Profile updated successfully",
      updatedUserDetails,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// handler for delete account
exports.deleteAccount = async (req, res) => {
  try {
    // find userid
    const id = req.user.id;
    console.log("printing id::", req.user.id);
    const user = await User.findById({ _id: id });

    //   validation
    if (!user) {
      return res.status(404).json({
        sucess: false,
        message: "User not found",
      });
    }
    // delete associated profile with user
    // #####################################################################################
    //       didn't Understand this line  @@ user.userDetails=>becaue we delete the detais od user
    // ####################################################################################
    await Profile.findByIdAndDelete({ _id: user.additionalDetails });

    // Now Delete User
    await User.findByIdAndDelete({ _id: id });
    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "user cannot deleted",
    });
  }
};
// getAllUserDetails get all details of any single user

exports.getAllUserDetails = async (req, res) => {
  try {
    //    find user id
    const id = req.user.id;
    //  userdetails
    const userDetails = await User.findById({ _id: id })
      .populate("additionalDetails")
      .exec();
    console.log(userDetails);
    //   return response
    return res.status(200).json({
      success: true,
      message: "user data fetched successfully",
      data: userDetails,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Cannot get user details",
    });
  }
};

// update display picture or profile photo

exports.updateDisplayPicture = async (req, res) => {
  try {
    // fetch files of image
    const displayPicture = req.files.displayPicture;
    // fetch user id
    const userId = req.user.id;
    // upload to cloudinary
    const image = await uploadImageToCloudinary(
      displayPicture,
      process.env.FOLDER_NAME,
      1000,
      1000
    );
    console.log(image);
    // update image of user
    const updatedProfile = await User.findByIdAndUpdate(
      { _id: userId },
      { image: image.secure_url },
      { new: true }
    );
    res.send({
      success: true,
      message: "Image updated successfully",
      data: updatedProfile,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// getENRolled Courses

exports.getEnrolledCourses = async (req, res) => {
  try {
    const userId = req.user.id;
    let userDetails = await User.findOne({
      _id: userId,
    })
      .populate({
        path: "courses",
        populate: {
          path: "courseContent",
          populate: {
            path: "subSection",
          },
        },
      })
      .exec();
    userDetails = userDetails.toObject();
    var SubsectionLength = 0;
    for (var i = 0; i < userDetails.courses.length; i++) {
      let totalDurationInSeconds = 0;
      SubsectionLength = 0;
      for (var j = 0; j < userDetails.courses[i].courseContent.length; j++) {
        totalDurationInSeconds += userDetails.courses[i].courseContent[
          j
        ].subSection.reduce(
          (acc, curr) => acc + parseInt(curr.timeDuration),
          0
        );
        userDetails.courses[i].totalDuration = convertSecondsToDuration(
          totalDurationInSeconds
        );
        SubsectionLength +=
          userDetails.courses[i].courseContent[j].subSection.length;
      }
      console.log("COUSES ID///////////", userDetails.courses[i]._id);
      console.log("hiii///////", userId);

      let courseProgressCount = await CourseProgress.findOne({
        courseId: userDetails.courses[i]._id,
        userId: userId,
      });
      courseProgressCount = courseProgressCount?.completedVideos.length;
      if (SubsectionLength === 0) {
        userDetails.courses[i].progressPercentage = 100;
      } else {
        // To make it up to 2 decimal point
        const multiplier = Math.pow(10, 2);
        userDetails.courses[i].progressPercentage =
          Math.round(
            (courseProgressCount / SubsectionLength) * 100 * multiplier
          ) / multiplier;
      }
    }
    if (!userDetails) {
      return res.status(400).json({
        success: false,
        message: `Could not find user with id: ${userDetails}`,
      });
    }
    console.log("USER DETAILS", userDetails);
    return res.status(200).json({
      success: true,
      data: userDetails.courses,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.instructorDashboard = async (req, res) => {
  try {
    const courseDetails = await Course.find({ instructor: req.user.id });

    const courseData = courseDetails.map((course) => {
      const totalStudentsEnrolled = course.studentsEnrolled.length;
      const totalAmountGenerated = totalStudentsEnrolled * course.price;

      // Create a new object with the additional fields
      const courseDataWithStats = {
        _id: course._id,
        courseName: course.courseName,
        courseDescription: course.courseDescription,
        // Include other course properties as needed
        totalStudentsEnrolled,
        totalAmountGenerated,
      };

      return courseDataWithStats;
    });
    res.status(200).json({ courses: courseData });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server error",
    });
  }
};
