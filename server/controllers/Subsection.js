const Section = require("../models/Section");
const SubSection = require("../models/SubSection");
const { uploadImageToCloudinary } = require("../utils/imageUploader");
require("dotenv").config();

// exports.createSubSection = async (req, res) => {
//   try {
//     // data fetch
//     const { title, description, sectionId } = req.body;
//     // extract video file
//     const video = req.files.videoFile;
//     // validate data
//     if (!title || !description || !sectionId) {
//       return res.status(400).json({
//         success: false,
//         message: "all fields are required",
//       });
//     }
//     // upload video to cloudinary
//     const uploadDetails = await uploadImageToCloudinary(
//       video,
//       process.env.FOLDER_NAME
//     );
//     // create subsection
//     const newSubSection = await SubSection.create({
//       title: title,
//      description: description,
//      timeDuration: `${uploadDetails.duration}`,
//      videoUrl: uploadDetails.secure_url,
//     });
//     // update section
//     console.log("video url::",uploadDetails.secure_url)
//     const updatedSection = await Section.findByIdAndUpdate({_id:sectionId}
//                                                             ,
//                                                             {
//                                                               $push: {
//                                                                 subSection: newSubSection._id,
//                                                               },
//                                                             },
//                                                             { new: true }
//                                                            ).populate('subSection').exec();
//     //   HW:log updated section,after adding populate query
//     // done HW ::.populate('subSection')
//     // return response
//     return res.status(200).json({
//         success:true,
//         message:"subSection created Successfully",
//         data:updatedSection,
        
//       })

//   } catch (error) {
//     return res.status(500).json({
//         success:false,
//         message:"Unable to create subsection, please try again later",
//         error:error.message,
//      })
//   }
// };

exports.createSubSection = async (req, res) => {
  try {
    // Extract necessary information from the request body
    const { sectionId, title, description } = req.body
    const video = req.files.video

    // Check if all necessary fields are provided
    if (!sectionId || !title || !description || !video) {
      return res
        .status(404)
        .json({ success: false, message: "All Fields are Required" })
    }
    console.log(video)

    // Upload the video file to Cloudinary
    const uploadDetails = await uploadImageToCloudinary(
      video,
      process.env.FOLDER_NAME
    )
    console.log(uploadDetails)
    // Create a new sub-section with the necessary information
    const SubSectionDetails = await SubSection.create({
      title: title,
      timeDuration: `${uploadDetails.duration}`,
      description: description,
      videoUrl: uploadDetails.secure_url,
    })

    // Update the corresponding section with the newly created sub-section
    const updatedSection = await Section.findByIdAndUpdate(
      { _id: sectionId },
      { $push: { subSection: SubSectionDetails._id } },
      { new: true }
    ).populate("subSection")

    // Return the updated section in the response
    return res.status(200).json({ success: true, data: updatedSection })
  } catch (error) {
    // Handle any errors that may occur during the process
    console.error("Error creating new sub-section:", error)
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    })
  }
}




// HW::update Sub section=>done HW
  //   ##### update subSection #####

  exports.updateSubSection= async (req,res)=>{
    try{
      const { sectionId,subSectionId, title, description } = req.body
      const subSection = await SubSection.findById(subSectionId)
  
      if (!subSection) {
        return res.status(404).json({
          success: false,
          message: "SubSection not found",
        })
      }
  
      if (title !== undefined) {
        subSection.title = title
      }
  
      if (description !== undefined) {
        subSection.description = description
      }
      if (req.files && req.files.video !== undefined) {
        const video = req.files.video
        const uploadDetails = await uploadImageToCloudinary(
          video,
          process.env.FOLDER_NAME
        )
        subSection.videoUrl = uploadDetails.secure_url
        subSection.timeDuration = `${uploadDetails.duration}`
      }
  
      await subSection.save()

       // find updated section and return it
    const updatedSection = await Section.findById(sectionId).populate(
      "subSection"
    )

    console.log("updated section", updatedSection)
  
      return res.json({
        success: true,
        message: "Section updated successfully",
        data:updatedSection
      })
    }
    catch(err){
        return res.status(500).json({
            success:false,
            message:"Unable to update subsection, please try again later",
            error:err.message,
         })
        
    }
}
// Hw::Delete sub section=>done HW
// #####  delete SubSection ####

exports.deleteSubSection= async (req,res)=>{
  try{
      //   get id=> we are assuming that we are sending id in params
      const { subSectionId, sectionId } = req.body
      await Section.findByIdAndUpdate(
        { _id: sectionId },
        {
          $pull: {
            subSection: subSectionId,
          },
        }
      )
      const subSection = await SubSection.findByIdAndDelete({ _id: subSectionId })
  
      if (!subSection) {
        return res
          .status(404)
          .json({ success: false, message: "SubSection not found" })
      }
  // find updated section and return it
  const updatedSection = await Section.findById(sectionId).populate(
    "subSection"
  )
      return res.json({
        success: true,
        message: "SubSection deleted successfully",
        data:updatedSection
      })
  }
  catch(err){
      return res.status(500).json({
          success:false,
          message:"Unable to delete SubSection, please try again later",
          error:err.message,
       })
  }
}
