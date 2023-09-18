const mongoose=require("mongoose");
const mailSender = require("../utils/mailSender");
const emailTemplate=require("../mail/template/emailVerificationTemplate")

const otpSchema= new mongoose.Schema({
  email:{
    type:String,
    required:true
  },
  otp:{
    type:String,
    required:true,
  },
  createdAt:{
    type:Date,
    default:Date.now(),
    expires:5*60*60,

  }



});
//  function->For Send OTP mail

async function sendVerificationEmail(email,otp){
  try{
    const mailResponse= await mailSender(email,
      "verification Email ",
      emailTemplate(otp));
      if (mailResponse && mailResponse.response) {
        console.log("Email sent successfully", mailResponse.response);
      } else {
        console.log("Email response is missing or undefined.");
      }
  }
  catch(error){
    console.log("error occur while sending mails",error);
    throw error;
  }
}

// document save hone se pehle mail chla jaye and calling function
otpSchema.pre("save", async function(next){
  console.log("new document saved to database");

  // Only send an email when a new document is created
  if (this.isNew) {
		await sendVerificationEmail(this.email, this.otp);
	}
  // after sending mail goes to next middlewares
  next();
})
const OTP = mongoose.model("OTP", otpSchema);

module.exports = OTP;