const express=require("express")
const router=express.Router();


// Course Controllers Import
const {createCourse,getAllCourses,getCourseDetail,getFullCourseDetails,
    editCourse,
    getInstructorCourses,
    deleteCourse,}=require("../controllers/Course");

// Section controllers import
const {createSection,updateSection,deleteSection}=require("../controllers/Section");

// import subSection Controllers
const {createSubSection,updateSubSection,deleteSubSection}=require("../controllers/Subsection");

// import Category controllers
const {createCategory,showAllCategories,categoryPageDetails}=require("../controllers/Category");

// import RatingAndReview Controller
const {createRatingAndReview,getAverageRating,getAllRating}=require("../controllers/RatingAndReview");

const {
    updateCourseProgress
  } = require("../controllers/courseProgress");





// Importing Middlewares
const {auth,isStudent ,isAdmin,isInstructor}=require("../middlewares/auth");




// ********************************************************************************************************
//                                      Course routes
// ********************************************************************************************************
// create course by instructor
router.post("/createCourse",auth,isInstructor,createCourse);
// create section
router.post("/addSection",auth,isInstructor,createSection);
// Update a Section
router.post("/updateSection", auth, isInstructor, updateSection)
// Delete a Section
router.post("/deleteSection", auth, isInstructor, deleteSection)
// Edit Sub Section
router.post("/updateSubSection", auth, isInstructor, updateSubSection)
// Delete Sub Section
router.post("/deleteSubSection", auth, isInstructor, deleteSubSection)
// Add a Sub Section to a Section
router.post("/addSubSection", auth, isInstructor, createSubSection)
// Get all Registered Courses
router.get("/getAllCourses", getAllCourses)
// Get Details for a Specific Courses
router.post("/getCourseDetails", getCourseDetail)
// update course
router.post("/editCourse", auth, isInstructor, editCourse);
// Get Details for a Specific Courses
router.post("/getFullCourseDetails", auth, getFullCourseDetails)
// Get all Courses Under a Specific Instructor
router.get("/getInstructorCourses", auth, isInstructor, getInstructorCourses)
// Delete a Course
router.delete("/deleteCourse", deleteCourse)

router.post("/updateCourseProgress", auth, isStudent, updateCourseProgress);



// ********************************************************************************************************
//                                      Category routes (Only by Admin)
// ********************************************************************************************************
router.post("/createCategory", auth, isAdmin, createCategory)
router.get("/showAllCategories", showAllCategories)
router.post("/getCategoryPageDetails", categoryPageDetails)
 


// ********************************************************************************************************
//                                      Rating and Review
// ********************************************************************************************************
router.post("/createRating", auth, isStudent, createRatingAndReview)
router.get("/getAverageRating", getAverageRating)
router.get("/getReviews", getAllRating)

module.exports = router
