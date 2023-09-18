const Section=require("../models/Section");
const Course=require("../models/Course");
const SubSection=require("../models/SubSection")


//    ##### create section #####
// exports.createSection= async (req,res)=>{
//     try{
//         //  data fetch
//         const {sectionName,courseId}=req.body;
//         // data validation
//         console.log("sectionName::",sectionName);
//         console.log("courseId ::",courseId)
//         if(!sectionName || !courseId){
//             return res.status(400).json({
//                 success:false,
//                 message:"All fields are mandatory"
//             })
//         }
//         // create section
//         const newSection= await Section.create({sectionName});
//          console.log("new section::",newSection)
//         // update course models to insert the section objectID
//         const updatedCourseDetails= await Course.findByIdAndUpdate(
// 			courseId,
// 			{
// 				$push: {
// 					courseContent: newSection._id,
// 				},
// 			},
// 			{ new: true }
// 		)
// 			.populate({
// 				path: "courseContent",
// 				populate: {
// 					path: "subSection",
// 				},
// 			})
// 			.exec();
//         // HW:use populate to replace section/subsection in the updatedCourseDetails
//         // HW:solution+DOUBT=> if we populate courseContent then it related to section it will populate section&&
//         //  but how we will populate subsection because in course schema there is no entry for subsection ,,if i am correct
//         // when we go to course this will populate section and when we go to section it will populate subsection
//         // but one doubt if i want going to course then how it will populate both section and sub section
//       // return response
//       return res.status(200).json({
//         success:true,
//         message:"Section created Successfully",
//         updatedCourseDetails
//       })
//     }
//     catch(error){
//      return res.status(500).json({
//         success:false,
//         message:"Unable to create section, please try again later",
//         error:error.message,
//      })
//     }
// }

exports.createSection = async (req, res) => {
  try {
    // Extract the required properties from the request body
    const { sectionName, courseId } = req.body

    // Validate the input
    if (!sectionName || !courseId) {
      return res.status(400).json({
        success: false,
        message: "Missing required properties",
      })
    }

    // Create a new section with the given name
    const newSection = await Section.create({ sectionName })

    // Add the new section to the course's content array
    const updatedCourse = await Course.findByIdAndUpdate(
      courseId,
      {
        $push: {
          courseContent: newSection._id,
        },
      },
      { new: true }
    )
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
        },
      })
      .exec()

    // Return the updated course object in the response
    res.status(200).json({
      success: true,
      message: "Section created successfully",
      updatedCourse,
    })
  } catch (error) {
    // Handle errors
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    })
  }
}



    //   ##### update Section #####

exports.updateSection= async (req,res)=>{
    try{
        // data input
        const {sectionName,sectionId,courseId}=req.body;

        // data validation
        if(!sectionName || !sectionId ){
            return res.status(400).json({
                success:false,
                message:"Missing properties"
            })
        }
        // update data
        const section =await Section.findByIdAndUpdate(sectionId,{sectionName},{new:true});
        // return res
        const course = await Course.findById(courseId)
        .populate({
          path: "courseContent",
          populate: {
            path: "subSection",
          },
        })
        .exec()
        return res.status(200).json({
            success:true,
            message:section,
            data: course,
        })
    }
    catch(err){
        return res.status(500).json({
            success:false,
            message:"Unable to update section, please try again later",
            error:err.message,
         })
        
    }
}

// #####  delete section ####

exports.deleteSection= async (req,res)=>{
    try {
        const { sectionId, courseId } = req.body
        await Course.findByIdAndUpdate(courseId, {
          $pull: {
            courseContent: sectionId,
          },
        })
        const section = await Section.findById(sectionId)
        console.log(sectionId, courseId)
        if (!section) {
          return res.status(404).json({
            success: false,
            message: "Section not found",
          })
        }
        // Delete the associated subsections
        await SubSection.deleteMany({ _id: { $in: section.subSection } })
    
        await Section.findByIdAndDelete(sectionId)
    
        // find the updated course and return it
        const course = await Course.findById(courseId)
          .populate({
            path: "courseContent",
            populate: {
              path: "subSection",
            },
          })
          .exec()
    
        res.status(200).json({
          success: true,
          message: "Section deleted",
          data: course,
        })
      } catch (error) {
        console.error("Error deleting section:", error)
        res.status(500).json({
          success: false,
          message: "Internal server error",
          error: error.message,
        })
      }
}

