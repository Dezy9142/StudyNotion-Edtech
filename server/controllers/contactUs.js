const mailSender=require("../utils/mailSender")
const {contactUsEmail}=require("../mail/template/contactUsEmail")
const {getFeedback}=require("../mail/template/feedback")
const dotenv = require("dotenv");
dotenv.config();



exports.contactUsController = async (req, res) => {
    const { email, firstname, lastname, message, phoneNo, countrycode } = req.body
  console.log(req.body)
  try {
    console.log("calling mailsender in backend")
    const emailRes = await mailSender(
      email,
      "Your Data send successfully",
      contactUsEmail(email, firstname, lastname, message, phoneNo, countrycode)
    )

    const emailRes2 = await mailSender(
      process.env.MAIL_USER,
      "You Got Some Feddback Regarding STUDYNOTION !!",
      getFeedback(email, firstname, lastname, message, phoneNo, countrycode)
    )

    console.log("Email Res ", emailRes)
    console.log("feedback email  Res ", emailRes2);
    return res.json({
      success: true,
      message: "Email sended successfully !!",
    })
  } catch (error) {
    console.log("Error", error)
    console.log("Error message :", error.message)
    return res.json({
      success: false,
      message: "Something went wrong... while sending email",
    })
  }
}