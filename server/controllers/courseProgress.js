const SubSection = require("../models/SubSection");
const CourseProgress = require("../models/CourseProgress");

exports.updateCourseProgress = async (req, res) => {
  const { courseId, subSectionId } = req.body;
  const userId = req.user.id;
  console.log("COURSE ID && SUBSECTION ID",courseId,subSectionId)

  try {
    //check if the subsection is valid
    const subSection = await SubSection.findById(subSectionId);
    console.log("Printing SubSection", subSection);
    if (!subSection) {
      return res.status(404).json({ error: "Invalid SUbSection" });
    }

    console.log("SubSection Validation Done");

    //check for old entry
    let courseProgress = await CourseProgress.findOne({
        courseId: courseId,
        userId: userId,
    });
    console.log("Course Progress Data",courseProgress)
    if (!courseProgress) {
      return res.status(404).json({
        success: false,
        message: "Course Progress does not exist",
      });
    } else {
      console.log("Course Progress Validation Done");
      //check for re-completing video/subsection
      if (courseProgress.completedVideos.includes(subSectionId)) {
        return res.status(400).json({
          error: "Subsection already completed",
        });
      }

      //poush into completed video
      courseProgress.completedVideos.push(subSectionId);
      console.log("Course Progress Push Done");
    }
    await courseProgress.save();
    console.log("Course Progress Save call Done");
    return res.status(200).json({
      success: true,
      message: "Course Progress Updated Successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ error: "Internal Server Error" });
  }
};
