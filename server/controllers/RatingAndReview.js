const RatingAndReview=require("../models/RatingAndReview");
const Course=require("../models/Course");
const { default: mongoose } = require("mongoose");

// create Rating and Review
exports.createRatingAndReview= async (req,res)=>{
    try{
        //  get userId
        const userId=req.user.id;

        // fetch data from req body
        const {courseId,review,rating}=req.body;

        // check if user is already enrolled or not in course
        const courseDetails=await Course.findOne(
            {_id:courseId,
            studentsEnrolled:{$elemMatch:{$eq:userId}},
            });
            
   

        if(!courseDetails){
            return res.status(404).json({
                success:false,
                message:"student is not enrolled in course"
            });
        }
       //check if already write review
       const alreadyReviewed = await RatingAndReview.findOne(
        {user: userId,
        course: courseId}
    ); 
    if(alreadyReviewed){
        return res.status(403).json({
            success:false,
            message:"U have Already reviewed",
        })
    }

        // create rating and review
        const ratingReview =await RatingAndReview.create(
            {  rating,
                review,
                course:courseId,
                user:userId});
        // update course with rating and review
        console.log("Created rating and review details",ratingReview)
        const updatedCourseDetails=await Course.findByIdAndUpdate({_id:courseId},
                                                                 {$push:{ratingAndReviews:ratingReview._id}},
                                                                 {new:true}
                                                                     );
           console.log("UPDATED COURSE DETAILS IN RAING AND REVIEW API",updatedCourseDetails);
          //  return response
          return res.status(200).json({
            success:true,
            message:"Rating and Review created Successfully",
            ratingReview
          })
    }
    catch(error){
       console.log(error);
       return res.status(500).json({
        success:false,
        message:error.message
       })
    }
}
// exports.createRatingAndReview = async (req, res) => {
//     console.log("enter in rating api")
//     try {
//       const userId = req.user.id
//       const { rating, review, courseId } = req.body
  
//       // Check if the user is enrolled in the course
//      console.log("FINDING COURSE DETAILS the user id an dcourse id is&&&&",userId,courseId)
//       const courseDetails = await Course.findOne({
//         _id: courseId,
//         studentsEnrolled: { $elemMatch: { $eq: userId } },
//       })
//       console.log("COURSE DETAILS IN RATING API",courseDetails)
//       if (!courseDetails) {
//         return res.status(404).json({
//           success: false,
//           message: "Student is not enrolled in this course",
//         })
//       }
  
//       // Check if the user has already reviewed the course
//       const alreadyReviewed = await RatingAndReview.findOne({
//         user: userId,
//         course: courseId,
//       })
  
//       if (alreadyReviewed) {
//         return res.status(403).json({
//           success: false,
//           message: "Course already reviewed by user",
//         })
//       }
  
//       // Create a new rating and review
//       const ratingReview = await RatingAndReview.create({
//         rating,
//         review,
//         course: courseId,
//         user: userId,
//       })
  
//       // Add the rating and review to the course
//       await Course.findByIdAndUpdate(courseId, {
//         $push: {
//           ratingAndReviews: ratingReview,
//         },

//       },  {new:true}
//       )
//       await courseDetails.save()
  
//       return res.status(201).json({
//         success: true,
//         message: "Rating and review created successfully",
//         ratingReview,
//       })
//     } catch (error) {
//       console.error(error)
//       return res.status(500).json({
//         success: false,
//         message: "Internal server error",
//         error: error.message,
//       })
//     }
//   }

// getAverageRating
exports.getAverageRating=async (req,res)=>{
    try{
        // get courseId
        const courseId=req.body.courseId;
        // calculation of avg Rating
        const result=await RatingAndReview.aggregate([
                                           {
                                            $match:{
                                                Course:new mongoose.Types.ObjectId(courseId)
                                            }
                                           },
                                           {
                                            $group:{
                                                _id:null,
                                                averageRating:{$avg:"$rating"}
                                            }
                                           }
        ])
        // return rating
        if(result.length>0){
            return res.status(200).json({
                success:true,
                averageRating:result[0].averageRating
            })
        }
        // if no rating and review exist
        return res.status(200).json({
            success:true,
            message:'Average Rating is 0, no ratings given till now',
            averageRating:0,
        })
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message,
        })

    }
}
// getAllRating
exports.getAllRating= async (req,res)=>{
    try{
        const allReviews=await RatingAndReview.find({}).sort({rating:"desc"}).populate({
            path:"user",
          select:"firstName lastName email image"
        })
        .populate({
            path:"course",
            select:"courseName"
        })
        .exec();
        // return response
        return res.status(200).json({
            success:true,
            message:"All reviews are fetched successfully",
            data:allReviews
        })

    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message,
        })
    }
}