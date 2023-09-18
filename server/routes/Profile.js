const express=require("express")
const router=express.Router();
const {auth,isInstructor}=require("../middlewares/auth")
// Importing Middlewares




    const {updateProfile,
        deleteAccount,
        getAllUserDetails,
        updateDisplayPicture,
        getEnrolledCourses,instructorDashboard} =require("../controllers/Profile");

// ********************************************************************************************************
//                                      Profile routes
// ********************************************************************************************************

        router.put("/updateProfile",auth,updateProfile);
        router.delete("/deleteAccount",auth,deleteAccount);
        router.put("/updateDisplayPicture",auth,updateDisplayPicture)
        router.get("/getAllUserDetails",auth,getAllUserDetails);
        router.get("/getEnrolledCourses",auth,getEnrolledCourses);
        router.get("/instructorDashboard", auth, isInstructor, instructorDashboard)

        module.exports = router