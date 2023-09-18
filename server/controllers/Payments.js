const { instance } = require("../config/razorpay");
const Course = require("../models/Course");
const User = require("../models/User");
const mailsender = require("../utils/mailSender");
const {paymentSuccessEmail}=require("../mail/template/paymentSuccessEmail")
const {
  courseEnrollmentEmail,
} = require("../mail/template/courseEnrollmentEmail");
const { default: mongoose } = require("mongoose");
const crypto = require("crypto")
const CourseProgress=require("../models/CourseProgress")


exports.capturePayment = async (req, res) => {
  const { courses } = req.body;
  const userId = req.user.id;

  if (courses.length === 0) {
    return res.json({ success: false, message: "Please Provide Course ID" });
  }
  let totalAmount = 0;
  for (const course_id of courses) {
    let course;
    try {
      course = await Course.findById(course_id);
      // If the course is not found, return an error
      if (!course) {
        return res
          .status(200)
          .json({ success: false, message: "Could not find the Course" });
      }

      // Check if the user is already enrolled in the course
      const uid = new mongoose.Types.ObjectId(userId);
      if (course.studentsEnrolled.includes(uid)) {
        return res
          .status(200)
          .json({ success: false, message: "Student is already Enrolled" });
      }

      // Add the price of the course to the total amount
      totalAmount += course.price;
    } catch (error) {
      console.log(error);
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  const options = {
    amount:totalAmount * 100,
    currency: "INR",
    receipt: Math.random(Date.now()).toString(),
  }

  try {
    // Initiate the payment using Razorpay
    const paymentResponse = await instance.orders.create(options)
    console.log(paymentResponse)
    res.json({
      success: true,
      data: paymentResponse,
    })
  } catch (error) {
    console.log(error)
    res
      .status(500)
      .json({ success: false, message: "Could not initiate order." })
  }
};

// verify the payment
exports.verifyPayment = async (req, res) => {
    const razorpay_order_id = req.body?.razorpay_order_id
    const razorpay_payment_id = req.body?.razorpay_payment_id
    const razorpay_signature = req.body?.razorpay_signature
    const courses = req.body?.courses
  
    const userId = req.user.id
  
    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature ||
      !courses ||
      !userId
    ) {
      return res.status(200).json({ success: false, message: "Payment Failed" })
    }
  
    let body = razorpay_order_id + "|" + razorpay_payment_id
  
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(body.toString())
      .digest("hex")
  
    if (expectedSignature === razorpay_signature) {
      await enrollStudents(courses, userId, res)
      return res.status(200).json({ success: true, message: "Payment Verified" })
    }
  
    return res.status(200).json({ success: false, message: "Payment Failed" })
  }

// enroll the student in the courses
// const enrollStudents = async (courses, userId, res) => {
//     if (!courses || !userId) {
//       return res
//         .status(400)
//         .json({ success: false, message: "Please Provide Course ID and User ID" })
//     }
  
//     for (const courseId of courses) {
//       try {
//         // Find the course and enroll the student in it
//         const enrolledCourse = await Course.findOneAndUpdate(
//           { _id: courseId },
//           { $push: { studentsEnrolled: userId } },
//           { new: true }
//         )
  
//         if (!enrolledCourse) {
//           return res
//             .status(500)
//             .json({ success: false, error: "Course not found" })
//         }
//         console.log("Updated course: ", enrolledCourse)
  
//         const courseProgress = await CourseProgress.findOneAndUpdate({
//           courseId: courseId,
//           userId: userId,
//           },{$push:{completedVideos: [],}})
//       //  const courseProgress= CourseProgress.create({
//       //     courseId: courseId,
//       //     userId: userId,
//       //     completedVideos: [],
//       //   })
//       //     .then((courseProgress) => {
//       //       // Handle successful creation
//       //       console.log('Course progress created:', courseProgress);
//       //     })
//       //     .catch((error) => {
//       //       // Handle errors
//       //       console.error('Error creating course progress:', error);
//       //     });

      
//     console.log("COURSE PROGRESSS///////",courseProgress)
//         // Find the student and add the course to their list of enrolled courses
//         const enrolledStudent = await User.findByIdAndUpdate(
//           userId,
//           {
//             $push: {
//               courses: courseId,
//               courseProgress: courseProgress._id,
//             },
//           },
//           { new: true }
//         )
  
//         console.log("Enrolled student: ", enrolledStudent)
//         // Send an email notification to the enrolled student
//         const emailResponse = await mailsender(
//           enrolledStudent.email,
//           `Successfully Enrolled into ${enrolledCourse.courseName}`,
//           courseEnrollmentEmail(
//             enrolledCourse.courseName,
//             `${enrolledStudent.firstName} ${enrolledStudent.lastName}`
//           )
//         )
  
//         console.log("Email sent successfully: ", emailResponse.response)
//       } catch (error) {
//         console.log(error)
//         return res.status(400).json({ success: false, error: error.message })
//       }
//     }
//   }
const enrollStudents = async (courses, userId, res) => {
  if (!courses || !userId) {
    return res
      .status(400)
      .json({ success: false, message: "Please Provide Course ID and User ID" })
  }

  for (const courseId of courses) {
    try {
      // Find the course and enroll the student in it
      const enrolledCourse = await Course.findOneAndUpdate(
        { _id: courseId },
        { $push: { studentsEnrolled: userId } },
        { new: true }
      )

      if (!enrolledCourse) {
        return res
          .status(500)
          .json({ success: false, error: "Course not found" })
      }
      console.log("Updated course: ", enrolledCourse)

      console.log("VERIFY PAYMENT  KA COURSE ID AND USERID BEFORE CREATING COURSEprogress",courseId,userId)
      const courseProgress = await CourseProgress.create({
        courseId: courseId,
        userId: userId,
        completedVideos: [],
      })
      console.log("AFTER CREATING COURSE PROGRESS 1data, 2.ID",courseProgress,courseProgress._id)
      // Find the student and add the course to their list of enrolled courses
      const enrolledStudent = await User.findByIdAndUpdate(
        userId,
        {
          $push: {
            courses: courseId,
            courseProgress: courseProgress._id,
          },
        },
        { new: true }
      )

      console.log("Enrolled student: ", enrolledStudent)
      // Send an email notification to the enrolled student
      const emailResponse = await mailsender(
        enrolledStudent.email,
        `Successfully Enrolled into ${enrolledCourse.courseName}`,
        courseEnrollmentEmail(
          enrolledCourse.courseName,
          `${enrolledStudent.firstName} ${enrolledStudent.lastName}`
        )
      )

      console.log("Email sent successfully: ", emailResponse.response)
    } catch (error) {
      console.log(error)
      return res.status(400).json({ success: false, error: error.message })
    }
  }
}

  // Send Payment Success Email
exports.sendPaymentSuccessEmail = async (req, res) => {
  const { orderId, paymentId, amount } = req.body

  const userId = req.user.id

  if (!orderId || !paymentId || !amount || !userId) {
    return res
      .status(400)
      .json({ success: false, message: "Please provide all the details" })
  }

  try {
    const enrolledStudent = await User.findById(userId)

    await mailsender(
      enrolledStudent.email,
      `Payment Received`,
      paymentSuccessEmail(
        `${enrolledStudent.firstName} ${enrolledStudent.lastName}`,
        amount / 100,
        orderId,
        paymentId
      )
    )
  } catch (error) {
    console.log("error in sending mail", error)
    return res
      .status(400)
      .json({ success: false, message: "Could not send email" })
  }
}

// capture the payment and initaiate the razorpay order
// exports.capturePayment= async(req,res)=>{
//     // get courseId and userId
//     const {course_id}=req.body;
//     const userId=req.user.id;
//     // validation
//     // valid courseId
//     if(!course_id){
//         return res.json({
//             success:false,
//             message:"please provide valid course Id",
//         })
//     };
//     // valid courseDetail
//     let course;
//     try{
//         course = await Course.findById(course_id);
//         if(!course) {
//             return res.json({
//                 success:false,
//                 message:'Could not find the course',
//             });
//         }

//         // convert user id into object id
//         const uid=new mongoose.Types.ObjectId(userId);

//           // user already pay for the same course
//         if(course.studentsEnrolled.includes(uid)){
//             return res.status(200).json({
//                 success:false,
//                 message:"Student is already enrolled"
//             })
//         }

//     }
//     catch(error){
//         console.error(error)
//         return res.status(500).json({
//          success:false,
//          message:error.message,
//         })
//      }

//     //  create order
//     const amount=course.price;
//     const currency="INR";
//     const options={
//         amount:amount*100,
//         currency,
//         receipt:Math.random(Date.now()).toString(),
//         notes:{
//             courseId:course_id,
//             userId
//         }
//     }

//     try{
//         // initiate the payment using razorpay
//         const paymentResponse=await instance.orders.create(options);
//         console.log(paymentResponse)
//         // return response
//         return res.status(200).json({
//             success:true,
//             courseName:course.courseName,
//             courseDescription:course.courseDescription,
//             thumnail:course.thumbnail,
//             orderId:paymentResponse.id,
//             currency:paymentResponse.currency,
//             amount:paymentResponse.amount
//         })
//     }
//     catch(error){
//         console.error(error)
//         return res.json({
//             success:false,
//             message:"Could not initiate order"
//         })
//     }

// }

// // verifySignature

// exports.verifySignature= async (req,res)=>{
//     const webhookSecret="123456789";

//     const signature= req.headers["x-razorpay-signature"];
//     const shaSum=crypto.createHmac("sha256",webhookSecret);
//     shaSum.update(JSON.stringify(req.body));
//     const digest=shaSum.digest("hex");

//     if(signature===digest){
//         console.log("Payment is Authorized");

//         const {userId,courseId}=req.body.payload.payment.entity.notes;

//         try{
//                 //    Fullfill action after payment is done

//                 // 1:find the course and enroll student in it
//                 const enrolledCourse=await Course.findOneAndUpdate(
//                     {_id:courseId},
//                     {studentsEnrolled:userId},
//                     {new:true}
//                     );

//                 if(!enrolledCourse){
//                     return res.status(500).json({
//                         success:false,
//                         message:"course not found"
//                     });
//                 }

//                 // 2:find student and add the course to their list enrolled course me
//                 const enrolledStudent=await User.findOneAndUpdate(
//                     {_id:courseId},
//                     {$push:{courses:courseId}},
//                     {new:true}
//                 );

//                 // send confirmation of successfully enrolled in the course
//                 const emailResponse=await mailsender(enrolledStudent.email,"Congratulations from StudyNotion",
//                   "congratulations ,you are onboarded into new coursen of StudyNotion ");
//                   console.log(emailResponse);

//                   return res.status(200).json({
//                     success:true,
//                     message:"signature is verified and course Added"
//                   });

//         }
//         catch(error){
//           console.error(error);
//           return res.status(400).json({
//             success:false,
//             message:error.message
//           })
//         }
//     }
//     else{
//         return res.status(400).json({
//             success:false,
//             message:"Invalid Request"
//         });
//     }

// }
